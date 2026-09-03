import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatNaira } from '../../lib/api.js';

const statuses = ['ALL','PENDING','CONFIRMED','PROCESSING','DELIVERED','CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('ALL');
  const [payment, setPayment] = useState('ALL');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const load = () => api.get('/admin/orders').then((res) => setOrders(res.data.orders || []));
  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || 'Could not load orders')); }, []);
  const filtered = useMemo(() => orders.filter((order) => {
    const text = `${order.orderNumber} ${order.customerName} ${order.customerPhone}`.toLowerCase();
    return (status === 'ALL' || order.status === status) && (payment === 'ALL' || order.paymentStatus === payment) && text.includes(search.toLowerCase());
  }), [orders,status,payment,search]);
  return <main className="p-6 lg:p-10">
    <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Store operations</p><h1 className="font-display text-4xl font-semibold">Orders</h1><p className="mt-2 text-stone-600">Review customer orders, payment state and fulfilment status.</p>
    {error && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="mt-8 grid gap-3 rounded-[2rem] bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px]"><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search order, customer or phone" className="rounded-full bg-stone-100 px-4 py-3 outline-none"/><select value={status} onChange={(e)=>setStatus(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none">{statuses.map((s)=><option key={s}>{s}</option>)}</select><select value={payment} onChange={(e)=>setPayment(e.target.value)} className="rounded-full bg-stone-100 px-4 py-3 outline-none"><option>ALL</option><option>UNPAID</option><option>PAYMENT_REPORTED</option><option>PAID</option></select></div>
    <div className="mt-6 overflow-x-auto rounded-[2rem] bg-white p-5 shadow-sm"><table className="w-full min-w-[850px] text-left text-sm"><thead><tr className="border-b border-stone-200 text-stone-500"><th className="pb-3">Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead><tbody>{filtered.map((o)=><tr key={o.id} className="border-b border-stone-100"><td className="py-4"><Link className="font-semibold underline decoration-amber-400 underline-offset-4" to={`/admin/orders/${o.id}`}>{o.orderNumber}</Link></td><td><p className="font-medium">{o.customerName}</p><p className="text-xs text-stone-500">{o.customerPhone}</p></td><td>{formatNaira(o.total)}</td><td><span className="rounded-full bg-stone-100 px-3 py-1 text-xs">{o.paymentStatus}</span></td><td><span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-800">{o.status}</span></td><td>{new Date(o.createdAt).toLocaleDateString('en-NG')}</td></tr>)}</tbody></table>{!filtered.length && <p className="py-10 text-center text-stone-500">No matching orders.</p>}</div>
  </main>;
}
