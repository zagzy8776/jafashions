import { useMemo, useState } from 'react';
import { Copy, MessageCircle, RotateCcw } from 'lucide-react';
import { waMessages, whatsappHref } from '../../lib/api.js';

const defaults = [
  ['Customer enquiry', waMessages.floating],
  ['Order follow-up', 'Hello JA fashions, I am following up on my order. Please share an update.'],
  ['Availability', 'Hello JA fashions, please let me know if this item is currently available.'],
  ['Delivery question', waMessages.delivery],
];

export default function AdminWhatsAppTemplates() {
  const [templates,setTemplates]=useState(()=>{try{return JSON.parse(localStorage.getItem('jf_wa_templates'))||defaults;}catch{return defaults;}});
  const save=next=>{setTemplates(next);localStorage.setItem('jf_wa_templates',JSON.stringify(next));};
  const update=(index,value)=>save(templates.map((item,i)=>i===index?[item[0],value]:item));
  const reset=()=>save(defaults);
  const copy=async value=>{try{await navigator.clipboard.writeText(value);}catch{}};
  const links=useMemo(()=>templates.map(([,value])=>whatsappHref(value)),[templates]);
  return <main className="p-6 lg:p-10"><p className="text-sm uppercase tracking-[0.3em] text-amber-700">Customer messaging</p><h1 className="font-display text-4xl font-semibold">WhatsApp Templates</h1><p className="mt-2 text-stone-600">Edit ready-to-send replies the store owner can use quickly from admin.</p><div className="mt-8 grid gap-4">{templates.map(([name,value],index)=><article key={name} className="rounded-[2rem] bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><p className="font-semibold">{name}</p><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">WhatsApp</span></div><textarea value={value} onChange={e=>update(index,e.target.value)} className="mt-4 min-h-28 w-full rounded-2xl bg-stone-100 p-4 outline-none"/><div className="mt-4 flex flex-wrap gap-2"><a href={links[index]} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"><MessageCircle size={16}/> Open WhatsApp</a><button onClick={()=>copy(value)} className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold"><Copy size={16}/> Copy</button></div></article>)}</div><button onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 font-semibold text-white"><RotateCcw size={16}/> Restore defaults</button></main>;
}
