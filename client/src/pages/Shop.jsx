import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';
import ProductCard from '../components/ProductCard.jsx';

const PRODUCTS_PER_BATCH = 12;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('new');
  const [availability, setAvailability] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, hasMore: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageMeta({ title: 'Shop', description: 'Browse clothes, shoes and handbags from JA fashions.' });
    api.get('/categories').then((res) => setCategories(res.data.categories)).catch(() => setCategories([]));
  }, []);

  const fetchProducts = async (targetPage = 1) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (availability !== 'all') params.set('availability', availability);
    if (sort !== 'new') params.set('sort', sort);
    params.set('page', String(targetPage));
    params.set('limit', String(PRODUCTS_PER_BATCH));
    setLoading(true);
    try {
      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination || { total: res.data.products.length, totalPages: 1, hasMore: false });
      setPage(targetPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setProducts([]);
      setPagination({ total: 0, totalPages: 1, hasMore: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(1); }, [category, search, sort, availability]);

  const pageNumbers = useMemo(() => {
    const totalPages = Math.max(1, pagination.totalPages || 1);
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [page, pagination.totalPages]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2.5rem] bg-stone-950 p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Shop</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">The Collection</h1>
        <p className="mt-4 max-w-2xl text-stone-300">Clothes, shoes and handbags. Real store photos only.</p>
      </div>
      <div className="mt-8 grid gap-4 rounded-[2rem] border border-amber-900/10 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px_180px]">
        <label className="flex items-center gap-3 rounded-full bg-stone-100 px-4">
          <Search size={18} className="text-stone-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clothes, shoes, bags..." className="w-full bg-transparent py-3 outline-none" />
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none">
          <option value="">All categories</option>
          {categories.map((cat) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none">
          <option value="new">Newest</option>
          <option value="low">Price: Low</option>
          <option value="high">Price: High</option>
        </select>
        <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none">
          <option value="all">All stock</option>
          <option value="available">Available only</option>
        </select>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
      {!products.length && !loading && <p className="py-20 text-center text-stone-500">No products found. Add pieces from admin.</p>}
    </main>
  );
}
