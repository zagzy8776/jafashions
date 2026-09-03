import { useEffect, useState } from 'react';
import { ArrowRight, Bell, Images, Package, ShoppingBag, Users } from 'lucide-react';
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
  useEffect(() => { api.get('/admin/dashboard').then((res) => setData(res.data)).catch((err) => setError(err.response?.data?.message || 'Could not load dashboard')); }, []);
  const stats = data?.stats || {};
  return <main className="p-6 lg:p-10">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm uppercase tracking-[0.3em] text-amber-700">JA fashions</p><h1 className="font-display text-4xl font-semibold">Admin dashboard</h1><p className="mt-2 text-stone-600">Everything the store owner needs to manage the shop from one place.</p></div><Link to="/" target="_blank" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white">View storefront <ArrowRight size={16}/></Link></div>
    {error && <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{cards.map(([label,key,Icon,to])=><Link key={key} to={to} className="rounded-[2rem] bg-white p-5 shadow-sm transition hover:-translate-y-0.5"><div className="flex items-center justify-between"><span className="rounded-2xl bg-amber-50 p-3 text-amber-700"><Icon size={20}/></span><ArrowRight size={17} className="text-stone-400"/></div><p className="mt-5 text-sm text-stone-500">{label}</p><p className="mt-1 text-3xl font-semibold">{stats[key] ?? 0}</p></Link>)}</section>
    <section className="mt-6 rounded-[2rem] bg-stone-950 p-7 text-white"><p className="text-sm uppercase tracking-[0.25em] text-amber-300">Paid revenue</p><p className="mt-2 font-display text-5xl">{formatNaira(stats.revenue || 0)}</p><p className="mt-2 text-stone-400">Calculated from orders marked as paid.</p></section>
    <section className="mt-6 grid gap-4 md:grid-cols-2"><Link to="/admin/products" className="rounded-[2rem] bg-white p-6 shadow-sm"><p className="font-semibold">Add a new product</p><p className="mt-2 text-sm text-stone-500">Enter the details, upload multiple photos and publish it.</p></Link><Link to="/admin/gallery" className="rounded-[2rem] bg-white p-6 shadow-sm"><p className="font-semibold">Post lookbook photos</p><p className="mt-2 text-sm text-stone-500">Upload new gallery images directly to Cloudinary.</p></Link></section>
  </main>;
}
