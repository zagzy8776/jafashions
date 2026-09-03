const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

function serialise(value) {
  return JSON.parse(JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v));
}

function slugify(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json({ categories: serialise(categories) });
  } catch (error) { next(error); }
});

router.get('/products', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(60, Math.max(1, Number(req.query.limit) || 12));
    const search = String(req.query.search || '').trim();
    const category = String(req.query.category || '').trim();
    const availability = String(req.query.availability || '').trim();
    const sort = String(req.query.sort || 'new').trim();

    const where = { isActive: true };
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
    if (category) where.category = { slug: category };
    if (availability === 'available') where.stock = { gt: 0 };

    let orderBy = { createdAt: 'desc' };
    if (sort === 'low') orderBy = { price: 'asc' };
    if (sort === 'high') orderBy = { price: 'desc' };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({ where, include: { category: true }, orderBy, skip: (page - 1) * limit, take: limit }),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    res.json({ products: serialise(products), pagination: { total, page, limit, totalPages, hasMore: page < totalPages } });
  } catch (error) { next(error); }
});

router.get('/products/:slug', async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({ where: { slug: req.params.slug, isActive: true }, include: { category: true } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product: serialise(product) });
  } catch (error) { next(error); }
});

router.get('/gallery', async (req, res, next) => {
  try {
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 60));
    const images = await prisma.galleryImage.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: limit });
    res.json({ images: serialise(images) });
  } catch (error) { next(error); }
});

router.get('/gallery/featured', async (req, res, next) => {
  try {
    const images = await prisma.galleryImage.findMany({ where: { isActive: true, isFeatured: true }, orderBy: { createdAt: 'desc' }, take: 12 });
    res.json({ images: serialise(images) });
  } catch (error) { next(error); }
});

router.post('/stock-alerts', async (req, res, next) => {
  try {
    const { productId, productName, productSlug, customerName, phone, message } = req.body || {};
    if (!productName || !phone) return res.status(400).json({ message: 'Product and WhatsApp number are required' });
    const alert = await prisma.stockAlert.create({ data: { productId: productId || null, productName: String(productName), productSlug: productSlug || null, customerName: customerName || null, phone: String(phone).trim(), message: message || null } });
    res.status(201).json({ alert: serialise(alert) });
  } catch (error) { next(error); }
});

router.post('/coupons/validate', async (req, res, next) => {
  try {
    const code = String(req.body?.code || '').trim().toUpperCase();
    const subtotal = Math.max(0, Number(req.body?.subtotal) || 0);
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) return res.status(400).json({ message: 'Coupon is invalid or expired.' });
    const discount = coupon.type === 'PERCENTAGE' ? Math.min(subtotal, subtotal * Number(coupon.value) / 100) : Math.min(subtotal, Number(coupon.value));
    res.json({ discount });
  } catch (error) { next(error); }
});

router.post('/orders', async (req, res, next) => {
  try {
    const body = req.body || {};
    const items = Array.isArray(body.items) ? body.items : [];
    if (!body.customerName || !body.customerPhone || !body.deliveryAddress || !items.length) return res.status(400).json({ message: 'Customer details, delivery address and at least one product are required' });
    if (!['PICKUP','CITY_DELIVERY','WAYBILL_PARK','OTHER_STATES_DISPATCH'].includes(body.deliveryMethod)) return res.status(400).json({ message: 'Invalid delivery method' });
    if (!['BANK_TRANSFER','PAY_ON_DELIVERY','WHATSAPP_CONFIRMATION'].includes(body.paymentMethod)) return res.status(400).json({ message: 'Invalid payment method' });

    const ids = [...new Set(items.map((item) => String(item.productId || '')).filter(Boolean))];
    if (!ids.length) return res.status(400).json({ message: 'No valid products were supplied' });

    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({ where: { id: { in: ids }, isActive: true } });
      const byId = new Map(products.map((product) => [product.id, product]));
      const orderItems = [];
      let subtotal = 0;

      for (const rawItem of items) {
        const product = byId.get(String(rawItem.productId || ''));
        const quantity = Math.max(1, Math.floor(Number(rawItem.quantity) || 1));
        if (!product) throw Object.assign(new Error('One of the selected products is no longer available.'), { status: 400 });
        if (product.stock < quantity) throw Object.assign(new Error(`${product.name} does not have enough stock.`), { status: 400 });
        const unitPrice = Number(product.salePrice ?? product.price);
        const lineTotal = unitPrice * quantity;
        subtotal += lineTotal;
        orderItems.push({ product, quantity, unitPrice, lineTotal });
      }

      let discount = 0;
      let couponCode = null;
      if (body.couponCode) {
        const code = String(body.couponCode).trim().toUpperCase();
        const coupon = await tx.coupon.findUnique({ where: { code } });
        if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt >= new Date())) {
          discount = coupon.type === 'PERCENTAGE' ? Math.min(subtotal, subtotal * Number(coupon.value) / 100) : Math.min(subtotal, Number(coupon.value));
          couponCode = coupon.code;
        }
      }

      const deliveryFees = { PICKUP: 0, CITY_DELIVERY: 3000, WAYBILL_PARK: 1000, OTHER_STATES_DISPATCH: 0 };
      const deliveryFee = deliveryFees[body.deliveryMethod] ?? 0;
      const total = Math.max(0, subtotal - discount + deliveryFee);
      const orderNumber = `JAF-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

      const created = await tx.order.create({
        data: {
          orderNumber,
          customerName: String(body.customerName).trim(),
          customerPhone: String(body.customerPhone).trim(),
          customerEmail: body.customerEmail ? String(body.customerEmail).trim() : null,
          deliveryAddress: String(body.deliveryAddress).trim(),
          deliveryCity: body.deliveryCity ? String(body.deliveryCity).trim() : null,
          deliveryNote: body.deliveryNote ? String(body.deliveryNote).trim() : null,
          deliveryMethod: body.deliveryMethod,
          deliveryFee,
          paymentMethod: body.paymentMethod,
          couponCode,
          subtotal,
          discount,
          total,
          source: body.source || null,
          medium: body.medium || null,
          campaign: body.campaign || null,
          items: { create: orderItems.map(({ product, quantity, unitPrice, lineTotal }) => ({ productId: product.id, productName: product.name, productSlug: product.slug, productImage: product.images?.[0] || null, productPrice: unitPrice, quantity, total: lineTotal })) },
        },
        include: { items: true },
      });

      for (const { product, quantity } of orderItems) {
        await tx.product.update({ where: { id: product.id }, data: { stock: { decrement: quantity } } });
      }
      return created;
    });

    res.status(201).json({ order: serialise(order) });
  } catch (error) { next(error); }
});

router.post('/analytics/track', async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.path) return res.status(400).json({ message: 'Path is required' });
    await prisma.visitorEvent.create({ data: { sessionId: body.sessionId || null, path: String(body.path), title: body.title || null, referrer: body.referrer || null, source: body.source || null, device: body.device || null, browser: body.browser || null, productSlug: body.productSlug || null } });
    res.status(204).end();
  } catch (error) { next(error); }
});

module.exports = router;
