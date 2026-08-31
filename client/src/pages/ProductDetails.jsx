import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, MessageCircle, ShoppingBag } from 'lucide-react';
import { api, formatNaira, whatsappNumber } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { setPageMeta } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [alertPhone, setAlertPhone] = useState('');
  const [alertName, setAlertName] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}`).then((res) => {
      setProduct(res.data.product);
      setActiveImage(res.data.product.images?.[0] || '');
      setPageMeta({ title: res.data.product.name, description: res.data.product.description, image: res.data.product.images?.[0] });
      return api.get(`/products?category=${res.data.product.category?.slug || ''}`);
    }).then((res) => setRelated(res.data.products.filter((item) => item.slug !== slug).slice(0, 5))).catch(() => setProduct(null)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-20 text-center">Loading product...</main>;
  if (!product) return <main className="mx-auto max-w-7xl px-4 py-20 text-center"><h1 className="font-display text-4xl">Product not found</h1><Link to="/shop" className="mt-5 inline-block rounded-full bg-stone-950 px-6 py-3 text-white">Back to shop</Link></main>;

  const price = product.salePrice || product.price;
  const message = encodeURIComponent(`Hello JA fashions, I want to order ${product.name}. Quantity: ${qty}. Price: ${formatNaira(price * qty)}.`);
  const outOfStock = product.stock <= 0;
  const wished = isWishlisted(product.id);
  const submitStockAlert = async (e) => {
    e.preventDefault();
    setAlertMessage('');
    try {
      await api.post('/stock-alerts', { productId: product.id, productName: product.name, productSlug: product.slug, customerName: alertName || null, phone: alertPhone });
      setAlertMessage('Saved. JA fashions will contact you when this product is available.');
      setAlertPhone('');
    } catch (err) { setAlertMessage(err.response?.data?.message || 'Could not save alert.'); }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-[3rem] bg-gradient-to-br from-amber-50 to-stone-100 p-4 shadow-sm">
            <img src={activeImage || product.images?.[0]} alt={product.name} className="h-[32rem] w-full object-contain" />
          </div>
          {product.images?.length > 1 && <div className="mt-4 flex gap-3 overflow-auto pb-2">{product.images.map((image) => <button key={image} onClick={() => setActiveImage(image)} className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-white p-1 ${activeImage === image ? 'border-amber-600' : 'border-transparent'}`}><img src={image} alt={product.name} className="h-full w-full object-contain" /></button>)}</div>}
        </div>
        <div className="py-6">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-700">{product.category?.name}</p>
          <h1 className="mt-3 font-display text-5xl font-semibold">{product.name}</h1>
          <div className="mt-5 flex items-center gap-3">
            {product.salePrice && <span className="text-xl text-stone-400 line-through">{formatNaira(product.price)}</span>}
            <strong className="text-3xl text-stone-950">{formatNaira(price)}</strong>
          </div>
          {product.description && <p className="mt-6 leading-8 text-stone-600">{product.description}</p>}
          <div className="mt-6 flex flex-wrap gap-2">
            {product.notes?.map((note) => <span key={note} className="rounded-full bg-amber-100 px-4 py-2 text-sm text-amber-900">{note}</span>)}
          </div>
          <p className="mt-5 text-sm text-stone-500">Size: {product.size || 'Available on request'}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <input type="number" min="1" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} className="w-24 rounded-full border border-amber-900/20 px-4 py-3" />
            <button disabled={outOfStock} onClick={() => addToCart(product, qty)} className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-7 py-4 font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-stone-300"><ShoppingBag size={18} /> Add to Cart</button>
            <button onClick={() => toggleWishlist(product)} className={`inline-flex items-center gap-2 rounded-full px-7 py-4 font-semibold ${wished ? 'bg-red-500 text-white' : 'bg-amber-100 text-amber-900'}`}><Heart size={18} fill={wished ? 'currentColor' : 'none'} /> Wishlist</button>
            <a href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-4 font-semibold text-white hover:bg-green-700"><MessageCircle size={18} /> WhatsApp</a>
          </div>
          <Link to="/shop" className="mt-8 inline-block font-semibold text-amber-800">Back to shop</Link>
          {outOfStock && <form onSubmit={submitStockAlert} className="mt-8 rounded-[2rem] bg-amber-50 p-5"><h2 className="font-display text-2xl font-semibold">Notify me when available</h2><p className="mt-2 text-sm text-stone-600">Drop your WhatsApp number and we will contact you.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><input placeholder="Name optional" value={alertName} onChange={(e) => setAlertName(e.target.value)} className="rounded-full bg-white px-4 py-3 outline-none" /><input required placeholder="WhatsApp number" value={alertPhone} onChange={(e) => setAlertPhone(e.target.value)} className="rounded-full bg-white px-4 py-3 outline-none" /></div><button className="mt-4 rounded-full bg-stone-950 px-6 py-3 font-semibold text-white">Notify me</button>{alertMessage && <p className="mt-3 text-sm font-semibold text-amber-900">{alertMessage}</p>}</form>}
        </div>
      </div>
      {related.length > 0 && <section className="mt-16"><h2 className="font-display text-4xl font-semibold">You may also like</h2><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
    </main>
  );
}
