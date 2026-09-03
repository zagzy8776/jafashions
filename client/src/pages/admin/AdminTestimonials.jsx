import { useEffect, useState } from 'react';
import { Check, Edit3, Plus, Save, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api.js';

const empty = { name: '', quote: '', location: '', rating: 5 };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => { const res = await api.get('/admin/testimonials'); setItems(res.data.testimonials || []); };
  useEffect(() => { load().catch((e) => setError(e.response?.data?.message || 'Could not load testimonials')); }, []);

  const save = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) return;
    setSaving(true); setError('');
    try {
      const payload = { ...form, name: form.name.trim(), quote: form.quote.trim(), location: form.location.trim() || null, rating: Number(form.rating) };
      if (editing) await api.put(`/admin/testimonials/${editing}`, payload); else await api.post('/admin/testimonials', payload);
      setForm(empty); setEditing(null); await load();
    } catch (err) { setError(err.response?.data?.message || 'Could not save testimonial'); }
    finally { setSaving(false); }
  };

  const edit = (item) => { setEditing(item.id); setForm({ name: item.name || '', quote: item.quote || '', location: item.location || '', rating: item.rating || 5 }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const toggle = async (item) => { try { await api.put(`/admin/testimonials/${item.id}`, { isActive: !item.isActive }); await load(); } catch (err) { setError(err.response?.data?.message || 'Could not update testimonial'); } };
  const remove = async (id) => { if (!window.confirm('Delete this testimonial?')) return; try { await api.delete(`/admin/testimonials/${id}`); await load(); } catch (err) { setError(err.response?.data?.message || 'Could not delete testimonial'); } };

  return (
    <main className="p-5 sm:p-6 lg:p-10">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Social proof</p>
      <h1 className="font-display text-4xl font-semibold">Testimonials</h1>
      <p className="mt-2 text-stone-600">Add real customer feedback and control what is shown publicly.</p>
      {error && <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      <div className="mt-8 grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
        <form onSubmit={save} className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{editing ? 'Edit testimonial' : 'Add testimonial'}</h2>{editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="rounded-full bg-stone-100 p-2"><X size={16}/></button>}</div>
          <div className="mt-4 grid gap-3"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Customer name" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"/><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location (optional)" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"/><select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select><textarea required value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} placeholder="Customer feedback" className="min-h-36 rounded-2xl bg-stone-100 px-4 py-3 outline-none"/><button disabled={saving} className="inline-flex w-fit items-center gap-2 rounded-full bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-50">{editing ? <Save size={17}/> : <Plus size={17}/>} {editing ? 'Save changes' : 'Add testimonial'}</button></div>
        </form>
        <div className="grid gap-3">{items.map((item) => <article key={item.id} className="rounded-[2rem] bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold">{item.name}</p><p className="text-sm text-amber-700">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>{item.isActive ? 'Live' : 'Hidden'}</span></div><p className="mt-4 text-stone-700">“{item.quote}”</p>{item.location && <p className="mt-3 text-xs text-stone-500">{item.location}</p>}<div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => edit(item)} className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold"><Edit3 size={14}/> Edit</button><button type="button" onClick={() => toggle(item)} className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold">{item.isActive ? <X size={14}/> : <Check size={14}/>} {item.isActive ? 'Hide' : 'Show'}</button><button type="button" onClick={() => remove(item.id)} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"><Trash2 size={14}/> Delete</button></div></article>)}{!items.length && <div className="rounded-[2rem] bg-white p-10 text-center text-stone-500">No testimonials yet.</div>}</div>
      </div>
    </main>
  );
}
