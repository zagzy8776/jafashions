const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const prisma = require('../lib/prisma');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

function secret() { return process.env.ADMIN_SESSION_SECRET || 'dev-only-change-me'; }

function verifyAdminToken(req, res, next) {
  const auth = req.get('authorization') || '';
  const headerToken = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const cookieToken = (req.headers.cookie || '').match(/(?:^|;\s*)jf_admin_token=([^;]+)/)?.[1] || '';
  const token = headerToken || cookieToken;
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'admin') return res.status(401).json({ message: 'Invalid session' });
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
  if (parts[2] !== expected || Number(parts[1]) < Date.now()) return res.status(401).json({ message: 'Session expired' });
  next();
}

function slugify(value) { return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function serialise(value) { return JSON.parse(JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v)); }

async function uniqueProductSlug(name, id) {
  const base = slugify(name) || `item-${Date.now()}`;
  let slug = base; let n = 2;
  while (true) {
    const found = await prisma.product.findUnique({ where: { slug } });
    if (!found || found.id === id) return slug;
    slug = `${base}-${n++}`;
  }
}

function cloudinaryUpload(buffer, mimetype, folder) {
  return new Promise((resolve, reject) => {
    try {
      cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
      const resourceType = mimetype?.startsWith('video/') ? 'video' : 'image';
      const stream = cloudinary.uploader.upload_stream({ resource_type: resourceType, folder }, (error, result) => error ? reject(error) : resolve(result));
      stream.end(buffer);
    } catch (error) { reject(error); }
  });
}

router.use(verifyAdminToken);

router.get('/me', async (req, res, next) => {
  try { const email = (process.env.ADMIN_EMAIL || 'admin@jafashions.com').toLowerCase(); const admin = await prisma.admin.findUnique({ where: { email }, select: { id: true, name: true, email: true, role: true } }); res.json({ admin }); }
  catch (error) { next(error); }
});

router.get('/dashboard', async (req, res, next) => {
  try {
    const [products, orders, customers, gallery, stockAlerts, revenue] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.findMany({ distinct: ['customerPhone'], select: { customerPhone: true } }).then((rows) => rows.length),
      prisma.galleryImage.count({ where: { isActive: true } }),
      prisma.stockAlert.count({ where: { isContacted: false } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID' } }),
    ]);
    res.json({ stats: { products, orders, customers, gallery, stockAlerts, revenue: revenue._sum.total || 0 } });
  } catch (error) { next(error); }
});

router.get('/products', async (req, res, next) => { try { res.json({ products: serialise(await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } })) }); } catch (error) { next(error); } });
router.post('/products', async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.name || body.price === undefined || Number.isNaN(Number(body.price))) return res.status(400).json({ message: 'Product name and a valid price are required' });
    const product = await prisma.product.create({ data: {
      name: String(body.name).trim(), slug: await uniqueProductSlug(body.name), description: body.description || null,
      price: Number(body.price), costPrice: body.costPrice === '' || body.costPrice == null ? null : Number(body.costPrice), salePrice: body.salePrice === '' || body.salePrice == null ? null : Number(body.salePrice),
      size: body.size || null, gender: body.gender || null, scentFamily: body.scentFamily || null, occasion: body.occasion || null, brandType: body.brandType || null,
      notes: Array.isArray(body.notes) ? body.notes.map(String) : String(body.notes || '').split(',').map((x) => x.trim()).filter(Boolean), images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
      stock: Math.max(0, Number(body.stock || 0)), isFeatured: Boolean(body.isFeatured), isActive: body.isActive !== false, categoryId: body.categoryId || null,
    }, include: { category: true } });
    res.status(201).json({ product: serialise(product) });
  } catch (error) { next(error); }
});
router.put('/products/:id', async (req, res, next) => {
  try {
    const body = req.body || {}; const data = {};
    for (const key of ['description','size','gender','scentFamily','occasion','brandType','categoryId']) if (body[key] !== undefined) data[key] = body[key] || null;
    if (body.name !== undefined) { data.name = String(body.name).trim(); data.slug = await uniqueProductSlug(data.name, req.params.id); }
    for (const key of ['price','costPrice','salePrice']) if (body[key] !== undefined) data[key] = body[key] === '' || body[key] == null ? null : Number(body[key]);
    if (body.stock !== undefined) data.stock = Math.max(0, Number(body.stock));
    if (body.images !== undefined) data.images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];
    if (body.notes !== undefined) data.notes = Array.isArray(body.notes) ? body.notes.map(String) : String(body.notes || '').split(',').map((x) => x.trim()).filter(Boolean);
    for (const key of ['isFeatured','isActive']) if (body[key] !== undefined) data[key] = Boolean(body[key]);
    res.json({ product: serialise(await prisma.product.update({ where: { id: req.params.id }, data, include: { category: true } })) });
  } catch (error) { next(error); }
});
router.delete('/products/:id', async (req, res, next) => { try { await prisma.product.update({ where: { id: req.params.id }, data: { isActive: false } }); res.status(204).end(); } catch (error) { next(error); } });

router.get('/gallery', async (req, res, next) => { try { res.json({ images: serialise(await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } })) }); } catch (error) { next(error); } });
router.post('/gallery', async (req, res, next) => { try { const { title, caption, imageUrl, publicId, isFeatured } = req.body || {}; if (!imageUrl) return res.status(400).json({ message: 'Image URL is required' }); const image = await prisma.galleryImage.create({ data: { title: title || null, caption: caption || null, imageUrl, publicId: publicId || null, isFeatured: Boolean(isFeatured) } }); res.status(201).json({ image: serialise(image) }); } catch (error) { next(error); } });
router.put('/gallery/:id', async (req, res, next) => { try { const data = {}; for (const key of ['title','caption','imageUrl','publicId']) if (req.body?.[key] !== undefined) data[key] = req.body[key] || null; for (const key of ['isFeatured','isActive']) if (req.body?.[key] !== undefined) data[key] = Boolean(req.body[key]); res.json({ image: serialise(await prisma.galleryImage.update({ where: { id: req.params.id }, data })) }); } catch (error) { next(error); } });
router.delete('/gallery/:id', async (req, res, next) => { try { await prisma.galleryImage.update({ where: { id: req.params.id }, data: { isActive: false } }); res.status(204).end(); } catch (error) { next(error); } });

router.post('/media/upload', upload.array('files', 10), async (req, res, next) => {
  try {
    if (!req.files?.length) return res.status(400).json({ message: 'Select at least one image or video' });
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) return res.status(500).json({ message: 'Cloudinary server credentials are not configured' });
    const folder = String(req.body?.folder || 'jafashions/products').replace(/[^a-zA-Z0-9/_-]/g, '') || 'jafashions/products';
    const assets = [];
    for (const file of req.files) { const result = await cloudinaryUpload(file.buffer, file.mimetype, folder); assets.push({ secure_url: result.secure_url, public_id: result.public_id, resource_type: result.resource_type, width: result.width, height: result.height, bytes: result.bytes, original_filename: result.original_filename }); }
    res.status(201).json({ assets });
  } catch (error) { next(error); }
});

router.get('/categories', async (req, res, next) => { try { res.json({ categories: serialise(await prisma.category.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { products: true } } } })) }); } catch (error) { next(error); } });
router.post('/categories', async (req, res, next) => { try { const { name, description } = req.body || {}; if (!name) return res.status(400).json({ message: 'Category name is required' }); const category = await prisma.category.create({ data: { name: String(name).trim(), slug: slugify(name), description: description || null } }); res.status(201).json({ category: serialise(category) }); } catch (error) { next(error); } });
router.delete('/categories/:id', async (req, res, next) => { try { await prisma.category.delete({ where: { id: req.params.id } }); res.status(204).end(); } catch (error) { next(error); } });

router.get('/coupons', async (req, res, next) => { try { res.json({ coupons: serialise(await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })) }); } catch (error) { next(error); } });
router.post('/coupons', async (req, res, next) => { try { const { code, type, value, expiresAt } = req.body || {}; if (!code || value === undefined || !['PERCENTAGE','FIXED'].includes(type)) return res.status(400).json({ message: 'Code, type and value are required' }); const coupon = await prisma.coupon.create({ data: { code: String(code).trim().toUpperCase(), type, value: Number(value), expiresAt: expiresAt ? new Date(expiresAt) : null } }); res.status(201).json({ coupon: serialise(coupon) }); } catch (error) { next(error); } });
router.put('/coupons/:id', async (req, res, next) => { try { const data = {}; if (req.body?.code !== undefined) data.code = String(req.body.code).trim().toUpperCase(); if (req.body?.type !== undefined) data.type = req.body.type; if (req.body?.value !== undefined) data.value = Number(req.body.value); if (req.body?.expiresAt !== undefined) data.expiresAt = req.body.expiresAt ? new Date(req.body.expiresAt) : null; if (req.body?.isActive !== undefined) data.isActive = Boolean(req.body.isActive); res.json({ coupon: serialise(await prisma.coupon.update({ where: { id: req.params.id }, data })) }); } catch (error) { next(error); } });
router.delete('/coupons/:id', async (req, res, next) => { try { await prisma.coupon.delete({ where: { id: req.params.id } }); res.status(204).end(); } catch (error) { next(error); } });

router.get('/orders', async (req, res, next) => { try { res.json({ orders: serialise(await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' }, take: 200 })) }); } catch (error) { next(error); } });
router.get('/orders/:id', async (req, res, next) => { try { const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true } }); if (!order) return res.status(404).json({ message: 'Order not found' }); res.json({ order: serialise(order) }); } catch (error) { next(error); } });
router.put('/orders/:id', async (req, res, next) => { try { const data = {}; if (req.body?.status) data.status = req.body.status; if (req.body?.paymentStatus) { data.paymentStatus = req.body.paymentStatus; data.paidAt = req.body.paymentStatus === 'PAID' ? new Date() : null; } const order = await prisma.order.update({ where: { id: req.params.id }, data, include: { items: true } }); res.json({ order: serialise(order) }); } catch (error) { next(error); } });

router.get('/customers', async (req, res, next) => {
  try { const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, select: { customerName: true, customerPhone: true, customerEmail: true, total: true, status: true, createdAt: true } }); const map = new Map(); for (const order of orders) { const key = order.customerPhone || order.customerEmail || order.customerName; const current = map.get(key) || { ...order, orders: 0, spent: 0 }; current.orders += 1; current.spent += Number(order.total || 0); map.set(key, current); } res.json({ customers: Array.from(map.values()).map(serialise) }); }
  catch (error) { next(error); }
});

router.get('/testimonials', async (req, res, next) => { try { res.json({ testimonials: serialise(await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })) }); } catch (error) { next(error); } });
router.post('/testimonials', async (req, res, next) => { try { const { name, quote, location, rating } = req.body || {}; if (!name || !quote) return res.status(400).json({ message: 'Name and quote are required' }); const testimonial = await prisma.testimonial.create({ data: { name: String(name).trim(), quote: String(quote).trim(), location: location || null, rating: Math.min(5, Math.max(1, Number(rating || 5))) } }); res.status(201).json({ testimonial: serialise(testimonial) }); } catch (error) { next(error); } });
router.put('/testimonials/:id', async (req, res, next) => { try { const data = {}; for (const key of ['name','quote','location']) if (req.body?.[key] !== undefined) data[key] = req.body[key]; if (req.body?.rating !== undefined) data.rating = Math.min(5, Math.max(1, Number(req.body.rating))); if (req.body?.isActive !== undefined) data.isActive = Boolean(req.body.isActive); res.json({ testimonial: serialise(await prisma.testimonial.update({ where: { id: req.params.id }, data })) }); } catch (error) { next(error); } });
router.delete('/testimonials/:id', async (req, res, next) => { try { await prisma.testimonial.delete({ where: { id: req.params.id } }); res.status(204).end(); } catch (error) { next(error); } });

router.get('/promos', async (req, res, next) => { try { res.json({ promos: serialise(await prisma.promoBanner.findMany({ orderBy: { createdAt: 'desc' } })) }); } catch (error) { next(error); } });
router.post('/promos', async (req, res, next) => { try { const { title, message, linkLabel, linkUrl, startsAt, endsAt } = req.body || {}; if (!title || !message) return res.status(400).json({ message: 'Title and message are required' }); const promo = await prisma.promoBanner.create({ data: { title, message, linkLabel: linkLabel || null, linkUrl: linkUrl || null, startsAt: startsAt ? new Date(startsAt) : null, endsAt: endsAt ? new Date(endsAt) : null } }); res.status(201).json({ promo: serialise(promo) }); } catch (error) { next(error); } });
router.put('/promos/:id', async (req, res, next) => { try { const data = {}; for (const key of ['title','message','linkLabel','linkUrl']) if (req.body?.[key] !== undefined) data[key] = req.body[key] || null; for (const key of ['startsAt','endsAt']) if (req.body?.[key] !== undefined) data[key] = req.body[key] ? new Date(req.body[key]) : null; if (req.body?.isActive !== undefined) data.isActive = Boolean(req.body.isActive); res.json({ promo: serialise(await prisma.promoBanner.update({ where: { id: req.params.id }, data })) }); } catch (error) { next(error); } });
router.delete('/promos/:id', async (req, res, next) => { try { await prisma.promoBanner.delete({ where: { id: req.params.id } }); res.status(204).end(); } catch (error) { next(error); } });

router.get('/stock-alerts', async (req, res, next) => { try { res.json({ alerts: serialise(await prisma.stockAlert.findMany({ orderBy: { createdAt: 'desc' } })) }); } catch (error) { next(error); } });
router.put('/stock-alerts/:id', async (req, res, next) => { try { const alert = await prisma.stockAlert.update({ where: { id: req.params.id }, data: { isContacted: Boolean(req.body?.isContacted) } }); res.json({ alert: serialise(alert) }); } catch (error) { next(error); } });
router.get('/whatsapp', async (req, res) => res.json({ templates: [] }));

router.get('/analytics', async (req, res, next) => {
  try {
    const [pageViews, productViews, sessions, sources] = await Promise.all([
      prisma.visitorEvent.count(),
      prisma.visitorEvent.count({ where: { productSlug: { not: null } } }),
      prisma.visitorEvent.findMany({ distinct: ['sessionId'], where: { sessionId: { not: null } }, select: { sessionId: true } }).then((rows) => rows.length),
      prisma.visitorEvent.groupBy({ by: ['source'], _count: { _all: true }, orderBy: { _count: { source: 'desc' } }, take: 10 }),
    ]);
    res.json({ pageViews, productViews, sessions, sources: sources.map((row) => ({ source: row.source || 'Unknown', count: row._count._all })) });
  } catch (error) { next(error); }
});

module.exports = { router, verifyAdminToken };
