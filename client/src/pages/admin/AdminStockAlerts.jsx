import { useEffect, useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { api, whatsappHref } from '../../lib/api.js';

export default function AdminStockAlerts() {
  const [items,setItems]=useState([]); const [error,setError]=useState('');
  const load=()=>api.get('/admin/stock-alerts').then(r=>setItems(r.data.alerts||[]));
  useEffect(()=>{load().catch(e=>setError(e.response?.data?.message||'Could not load stock alerts'));},[]);
  const mark=async id=>{try{await api.put(`/admin/stock-alerts/${id}`,{isContacted:true});await load();}catch(e){setError(e.response?.data?.message||'Could not update alert');}};
  return <main className="p-6 lg:p-10"><p className="text-sm uppercase tracking-[0.3em] text-amber-700">Inventory follow-up</p><h1 className="font-display text-4xl font-semibold">Stock Alerts</h1><p className="mt-2 text-stone-600">People who asked to hear when a product comes back can be followed up from here.</p>{error&&<div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}<div className="mt-8 grid gap-3">{items.map(item=><article key={item.id} className="rounded-[2rem] bg-white p-6 shadow-sm"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold">{item.productName}</p><p className="mt-1 text-sm text-stone-500">{item.customerName || 'Customer'} · {item.phone}</p>{item.message&&<p className="mt-2 text-sm text-stone-600">{item.message}</p>}</div><div className="flex gap-2"><a href={whatsappHref(`Hello ${item.customerName || 'there'}, JA fashions here. ${item.productName} is available again.`)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">WhatsApp <ExternalLink size={15}/></a>{!item.isContacted&&<button onClick={()=>mark(item.id)} className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold"><Check size={15}/> Mark contacted</button>}</div></div></article>)}{!items.length&&<div className="rounded-[2rem] bg-white p-10 text-center text-stone-500">No stock alerts yet.</div>}</div></main>;
}
