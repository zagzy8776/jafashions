import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Bell, Images, Package, RefreshCw, ShoppingBag, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, formatNaira } from '../../lib/api.js';

const cards = [
  ['Products', 'products', Package, '/admin/products'],
  ['Orders', 'orders', ShoppingBag, '/admin/orders'],
  ['Customers', 'customers', Users, '/admin/customers'],
  ['Gallery', 'gallery', Images, '/admin/gallery'],
  ['Stock alerts', 'stockAlerts', Bell, '/admin/stock-alerts'],
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const dashboard = await api.get('/admin/dashboard');
      setData(dashboard.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load the dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = data?.stats || {};

  return (
    <main className="p-5 sm:p-6 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-700">JA fashions</p>
          <h1 className="font-display text-4xl font-semibold">Admin dashboard</h1>
          <p className="mt-2 max-w-2xl text-stone-600">Products, orders, customers, content and store activity in one place.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold shadow-sm disabled:opacity-60">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <Link to="/" target="_blank" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white">View storefront <ArrowRight size={16}/></Link>
        </div>
      </div>

      {error && <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <section className="mt-6 rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">Store overview</p>
            <p className="mt-1 text-sm text-stone-500">Your JA fashions store at a glance.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Store active
          </span>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(([label, key, Icon, to]) => (
          <Link key={key} to={to} className="rounded-[2rem] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between"><span className="rounded-2xl bg-amber-50 p-3 text-amber-700"><Icon size={20}/></span><ArrowRight size={17} className="text-stone-400"/></div>
            <p className="mt-5 text-sm text-stone-500">{label}</p>
            <p className="mt-1 text-3xl font-semibold">{loading ? '—' : (stats[key] ?? 0)}</p>
          </Link>
        ))}
      </section>

      <section className="mt-6 rounded-[2rem] bg-stone-950 p-7 text-white">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Paid revenue</p>
        <p className="mt-2 font-display text-5xl">{formatNaira(stats.revenue || 0)}</p>
        <p className="mt-2 text-stone-400">Based only on orders marked as paid.</p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Link to="/admin/products" className="rounded-[2rem] bg-white p-6 shadow-sm transition hover:shadow-md"><p className="font-semibold">Add a product</p><p className="mt-2 text-sm text-stone-500">Enter pricing, stock, category and multiple product images.</p></Link>
        <Link to="/admin/orders" className="rounded-[2rem] bg-white p-6 shadow-sm transition hover:shadow-md"><p className="font-semibold">Process orders</p><p className="mt-2 text-sm text-stone-500">Open an order, contact the customer and update payment or fulfilment status.</p></Link>
        <Link to="/admin/gallery" className="rounded-[2rem] bg-white p-6 shadow-sm transition hover:shadow-md"><p className="font-semibold">Post lookbook photos</p><p className="mt-2 text-sm text-stone-500">Upload new store photography directly from the admin panel.</p></Link>
      </section>
    </main>
  );
}
