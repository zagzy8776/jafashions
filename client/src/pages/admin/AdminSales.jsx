import { useEffect, useMemo, useState } from 'react';
import { api, formatNaira } from '../../lib/api.js';

export default function AdminSales() {
  const [orders,setOrders]=useState([]); const [error,setError]=useState('');
  useEffect(()=>{api.get('/admin/orders').then(r=>setOrders(r.data.orders||[])).catch(e=>setError(e.response?.data?.message||'Could not load sales'));},[]);
  const paid=orders.filter(o=>o.paymentStatus==='PAID');
  const total=paid.reduce((sum,o)=>sum+Number(o.total||0),0);
  const avg=paid.length?total/paid.length:0;
  const byStatus=useMemo(()=>['PENDING','CONFIRMED','PROCESSING','DELIVERED','CANCELLED'].map(status=>({status,count:orders.filter(o=>o.status===status).length})),[orders]);
  return <main className="p-6 lg:p-10"><p className="text-sm uppercase tracking-[0.3em] text-amber-700">Revenue</p><h1 className="font-display text-4xl font-semibold">Sales</h1><p className="mt-2 text-stone-600">A simple sales view based on the store’s recorded orders.</p>{error&&<div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}<div className="mt-8 grid gap-4 md:grid-cols-3"><div className="rounded-[2rem] bg-stone-950 p-6 text-white"><p className="text-sm text-stone-400">Paid revenue</p><p className="mt-2 font-display text-4xl">{formatNaira(total)}</p></div><div className="rounded-[2rem] bg-white p-6 shadow-sm"><p className="text-sm text-stone-500">Paid orders</p><p className="mt-2 font-display text-4xl">{paid.length}</p></div><div className="rounded-[2rem] bg-white p-6 shadow-sm"><p className="text-sm text-stone-500">Average paid order</p><p className="mt-2 font-display text-4xl">{formatNaira(avg)}</p></div></div><section className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Order pipeline</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{byStatus.map(item=><div key={item.status} className="rounded-2xl bg-stone-50 p-4"><p className="text-xs text-stone-500">{item.status}</p><p className="mt-1 text-2xl font-semibold">{item.count}</p></div>)}</div></section></main>;
}
