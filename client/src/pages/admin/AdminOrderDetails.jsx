import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { api, formatNaira, whatsappHref } from '../../lib/api.js';

const statuses = ['PENDING','CONFIRMED','PROCESSING','DELIVERED','CANCELLED'];
const payments = ['UNPAID','PAYMENT_REPORTED','PAID'];

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const load = () => api.get(`/admin/orders/${id}`).then((res) => setOrder(res.data.order));
  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || 'Could not load order')); }, [id]);
  const update = async (patch) => { setSaving(true); setError(''); try { const res = await api.put(`/admin/orders/${id}`, patch); setOrder(res.data.order); } catch (err) { setError(err.response?.data?.message || 'Could not update order'); } finally { setSaving(false); } };
  if (!order) return <main className="p-6 lg:p-10"><p>{error || 'Loading order…'}</p></main>;
  return <main className="p-6 lg:p-10">
    <Link to="/admin/orders" className="inline-flex items-center gap-2 text-sm text-stone-600"><ArrowLeft size={16}/> Back to orders</Link>
    <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm uppercase tracking-[0.3em] text-amber-700">Order details</p><h1 className="font-display text-4xl font-semibold">{order.orderNumber}</h1><p className="mt-2 text-stone-500">Placed {new Date(order.createdAt).toLocaleString('en-NG')}</p></div><a href={whatsappHref(`Hello JA fashions, I am contacting you about order ${order.orderNumber}.`)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white">Contact on WhatsApp <ExternalLink size={16}/></a></div>
    {error && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Customer</h2><div className="mt-4 grid gap-3 text-sm"><div><span className="text-stone-500">Name</span><p className="font-semibold">{order.customerName}</p></div><div><span className="text-stone-500">Phone</span><p className="font-semibold">{order.customerPhone}</p></div>{order.customerEmail && <div><span className="text-stone-500">Email</span><p className="font-semibold">{order.customerEmail}</p></div>}<div><span className="text-stone-500">Delivery</span><p className="font-semibold">{order.deliveryMethod}</p><p>{order.deliveryAddress}{order.deliveryCity ? `, ${order.deliveryCity}` : ''}</p></div>{order.deliveryNote && <div><span className="text-stone-500">Note</span><p>{order.deliveryNote}</p></div>}</div></section>
      <section className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Order control</h2><div className="mt-4 grid gap-4"><label className="grid gap-2 text-sm"><span className="text-stone-500">Order status</span><select disabled={saving} value={order.status} onChange={(e)=>update({status:e.target.value})} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none">{statuses.map((s)=><option key={s}>{s}</option>)}</select></label><label className="grid gap-2 text-sm"><span className="text-stone-500">Payment status</span><select disabled={saving} value={order.paymentStatus} onChange={(e)=>update({paymentStatus:e.target.value})} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none">{payments.map((p)=><option key={p}>{p}</option>)}</select></label><div className="rounded-2xl bg-stone-950 p-5 text-white"><p className="text-sm text-stone-400">Total</p><p className="mt-1 font-display text-4xl">{formatNaira(order.total)}</p>{order.discount > 0 && <p className="mt-2 text-sm text-emerald-300">Discount: {formatNaira(order.discount)}</p>}</div></div></section>
    </div>
    <section className="mt-5 rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Items</h2><div className="mt-4 grid gap-3">{(order.items || []).map((item)=><div key={item.id} className="flex gap-4 rounded-2xl bg-stone-50 p-3"><div className="h-16 w-14 overflow-hidden rounded-xl bg-stone-200">{item.productImage && <img src={item.productImage} alt="" className="h-full w-full object-cover"/>}</div><div className="flex-1"><p className="font-semibold">{item.productName}</p><p className="text-sm text-stone-500">Qty {item.quantity} · {formatNaira(item.productPrice)}</p></div><p className="font-semibold">{formatNaira(item.total)}</p></div>)}</div><div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4 font-semibold"><span>Order total</span><span>{formatNaira(order.total)}</span></div></section>
    {order.status === 'DELIVERED' && <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-700"><CheckCircle2 size={18}/> This order is marked delivered.</div>}
  </main>;
}
