import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { api, isVideoUrl, waMessages, whatsappHref } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';
import MediaCard from '../components/MediaCard.jsx';

const HOME_PRODUCTS_PER_BATCH = 12;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredWork, setFeaturedWork] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, hasMore: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageMeta({ title: 'JA fashions', description: 'Clothes, shoes and handbags from JA fashions. Shop online in Nigeria and order on WhatsApp.' });
    fetchProducts(1, false);
    api.get('/categories').then((res) => setCategories(res.data.categories)).catch(() => setCategories([]));
    api.get('/gallery/featured').then((res) => {
      const featured = res.data.images || [];
      if (featured.length) {
        setFeaturedWork(featured);
        return null;
      }
      return api.get('/gallery?limit=8');
    }).then((res) => {
      if (res?.data?.images) setFeaturedWork(res.data.images);
    }).catch(() => setFeaturedWork([]));
  }, []);

  const fetchProducts = async (targetPage = 1, shouldScroll = true) => {
    setLoading(true);
    try {
      const res = await api.get(`/products?page=${targetPage}&limit=${HOME_PRODUCTS_PER_BATCH}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination || { total: res.data.products.length, totalPages: 1, hasMore: false });
      setPage(targetPage);
      if (shouldScroll) document.getElementById('home-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      setProducts([]);
      setPagination({ total: 0, totalPages: 1, hasMore: false });
    } finally {
      setLoading(false);
    }
  };

  const pageNumbers = useMemo(() => {
    const totalPages = Math.max(1, pagination.totalPages || 1);
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [page, pagination.totalPages]);

  return (
    <main>
      <section className="luxury-gradient relative overflow-hidden text-white">
        <img src="/hero-crest.svg" alt="" aria-hidden="true" className="pointer-events-none absolute right-[-6%] top-[6%] h-[92%] w-auto max-w-none select-none object-contain opacity-60 mix-blend-screen sm:right-[-2%] sm:top-[2%] sm:h-[104%] sm:opacity-70 lg:right-[6%] lg:top-1/2 lg:h-[118%] lg:-translate-y-1/2 lg:opacity-90" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#160f0a] via-[#160f0a]/45 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="relative z-10 max-w-xl lg:max-w-2xl">
            <p className="liquid-glass-dark mb-4 inline-flex rounded-full px-3 py-1.5 text-xs text-amber-200 sm:px-4 sm:py-2 sm:text-sm">JA fashions · Nigeria</p>
            <h1 className="font-display text-[2rem] font-semibold leading-[1.15] sm:text-6xl">Clothes. Shoes. Handbags.</h1>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-stone-200 sm:text-lg">Selected looks you can order from your phone. Tap shop, add to bag, finish on WhatsApp.</p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 text-[16px] font-semibold text-stone-950 hover:bg-amber-300">Shop now <ArrowRight size={18} /></Link>
              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <Link to="/gallery" className="liquid-glass-dark rounded-full px-4 py-3.5 text-center text-[15px] font-semibold text-white sm:px-6">Lookbook</Link>
                <a href={whatsappHref(waMessages.heroWhatsApp)} target="_blank" rel="noreferrer" className="liquid-glass-dark rounded-full px-4 py-3.5 text-center text-[15px] font-semibold text-white sm:px-6">WhatsApp us</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:-mt-10 sm:px-6 lg:px-8">
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          <Link to="/shop?category=clothes" className="liquid-glass rounded-2xl p-5 sm:rounded-[2rem] sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-amber-700">01</p>
            <h2 className="mt-2 font-display text-[1.65rem] leading-tight sm:mt-3 sm:text-2xl">Clothes</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Dresses, jackets and everyday wear posted from the store phone.</p>
          </Link>
          <Link to="/shop?category=shoes" className="liquid-glass rounded-2xl p-5 sm:rounded-[2rem] sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-amber-700">02</p>
            <h2 className="mt-2 font-display text-[1.65rem] leading-tight sm:mt-3 sm:text-2xl">Shoes</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Sneakers, heels and sandals with real store photos.</p>
          </Link>
          <Link to="/shop?category=handbags" className="liquid-glass rounded-2xl p-5 sm:rounded-[2rem] sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-amber-700">03</p>
            <h2 className="mt-2 font-display text-[1.65rem] leading-tight sm:mt-3 sm:text-2xl">Handbags</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Mini bags, totes and the pieces in rotation this week.</p>
          </Link>
        </div>
      </section>

      {featuredWork.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Lookbook</p>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">See the pieces</h2>
            </div>
            <Link to="/gallery" className="font-semibold text-amber-800">Open gallery</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {featuredWork.map((item) => (
              <MediaCard key={item.id} item={item} className="w-44 shrink-0 sm:w-56" onClick={() => setSelected(item)} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        <div className="flex gap-3 overflow-x-auto pb-1">
          <Link to="/shop" className="shrink-0 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white">All Products</Link>
          {categories.slice(0, 10).map((category) => (
            <Link key={category.id} to={`/shop?category=${category.slug}`} className="liquid-glass shrink-0 rounded-full px-5 py-3 text-sm font-semibold text-stone-800">{category.name}</Link>
          ))}
        </div>
      </section>

      <section id="home-products" className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Shop</p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Available Products</h2>
          </div>
          <Link to="/shop" className="font-semibold text-amber-800">View all products</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        {loading && <p className="py-8 text-center text-stone-500">Loading products...</p>}
        {pagination.totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button disabled={loading || page <= 1} onClick={() => fetchProducts(page - 1)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-amber-900/10 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            {pageNumbers.map((pageNumber) => (
              <button key={pageNumber} disabled={loading} onClick={() => fetchProducts(pageNumber)} className={`h-11 w-11 rounded-full text-sm font-bold shadow-sm ${pageNumber === page ? 'bg-stone-950 text-white' : 'bg-white text-stone-800 ring-1 ring-amber-900/10'}`}>{pageNumber}</button>
            ))}
            <button disabled={loading || page >= pagination.totalPages} onClick={() => fetchProducts(page + 1)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-amber-900/10 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
            <p className="w-full text-center text-sm text-stone-500">Page {page} of {pagination.totalPages} · {pagination.total} products</p>
          </div>
        )}
        {!products.length && !loading && <p className="rounded-[2rem] bg-white p-10 text-center text-stone-500">Products will appear here once they are added from the admin panel. No mock pieces.</p>}
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/80 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <article className="w-full max-w-3xl overflow-hidden rounded-[1.5rem] bg-[#fffaf1]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-3">
              <button type="button" onClick={() => setSelected(null)} className="rounded-full bg-stone-950 p-2 text-white" aria-label="Close"><X size={18} /></button>
            </div>
            {isVideoUrl(selected.imageUrl) ? (
              <video src={selected.imageUrl} className="max-h-[68vh] w-full bg-black object-contain" controls autoPlay playsInline />
            ) : (
              <img src={selected.imageUrl} alt={selected.title || 'JA fashions look'} className="max-h-[68vh] w-full object-contain" />
            )}
            <div className="p-5">
              <h2 className="font-display text-2xl font-semibold">{selected.title || 'JA fashions'}</h2>
              {selected.caption && <p className="mt-2 text-stone-600">{selected.caption}</p>}
              <a href={whatsappHref(waMessages.gallery(selected.title))} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white">Ask about this on WhatsApp</a>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
