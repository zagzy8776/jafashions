import { useEffect, useState } from 'react';
import { Check, Edit3, Plus, Save, Trash2, X } from 'lucide-react';
import { api, formatNaira } from '../../lib/api.js';

const emptyCoupon = { code: '', type: 'PERCENTAGE', value: '', expiresAt: '' };

export default function AdminCategoriesCoupons() {
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [coupon, setCoupon] = useState(emptyCoupon);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [categoriesRes, couponsRes] = await Promise.all([api.get('/admin/categories'), api.get('/admin/coupons')]);
    setCategories(categoriesRes.data.categories || []);
    setCoupons(couponsRes.data.coupons || []);
  };

  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || 'Could not load settings')); }, []);

  const addCategory = async (event) => {
    event.preventDefault();
    if (!categoryName.trim()) return;
    setSaving(true); setError('');
    try {
      await api.post('/admin/categories', { name: categoryName.trim(), description: categoryDescription.trim() || null });
      setCategoryName(''); setCategoryDescription(''); await load();
    } catch (err) { setError(err.response?.data?.message || 'Could not create category'); }
    finally { setSaving(false); }
  };

  const saveCoupon = async (event) => {
    event.preventDefault();
    if (!coupon.code.trim() || Number(coupon.value) < 0) return;
    setSaving(true); setError('');
    try {
      const payload = { ...coupon, value: Number(coupon.value), expiresAt: coupon.expiresAt || null };
      if (editingCoupon) await api.put(`/admin/coupons/${editingCoupon}`, payload);
      else await api.post('/admin/coupons', payload);
      setCoupon(emptyCoupon); setEditingCoupon(null); await load();
    } catch (err) { setError(err.response?.data?.message || 'Could not save coupon'); }
    finally { setSaving(false); }
  };

  const editCoupon = (item) => {
    setEditingCoupon(item.id);
    setCoupon({ code: item.code || '', type: item.type || 'PERCENTAGE', value: item.value ?? '', expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 10) : '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCoupon = async (item) => {
    setError('');
    try { await api.put(`/admin/coupons/${item.id}`, { isActive: !item.isActive }); await load(); }
    catch (err) { setError(err.response?.data?.message || 'Could not update coupon'); }
  };

  const remove = async (kind, id) => {
    if (!window.confirm('Delete this item?')) return;
    setError('');
    try { await api.delete(`/admin/${kind}/${id}`); await load(); }
    catch (err) { setError(err.response?.data?.message || 'Could not delete'); }
  };

  return (
    <main className="p-5 sm:p-6 lg:p-10">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Store settings</p>
      <h1 className="font-display text-4xl font-semibold">Categories & Coupons</h1>
      <p className="mt-2 text-stone-600">Organise products and manage discount codes without touching the website code.</p>
      {error && <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold">Categories</h2><p className="mt-1 text-sm text-stone-500">Used to organise storefront products.</p></div><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold">{categories.length}</span></div>
          <form onSubmit={addCategory} className="mt-5 grid gap-3">
            <input required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Category name" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
            <input value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder="Short description (optional)" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
            <button disabled={saving} className="inline-flex w-fit items-center gap-2 rounded-full bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-50"><Plus size={17}/> Add category</button>
          </form>
          <div className="mt-6 grid gap-2">
            {categories.map((cat) => <div key={cat.id} className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 p-4"><div><p className="font-semibold">{cat.name}</p><p className="text-xs text-stone-500">{cat._count?.products ?? 0} products</p></div><button type="button" onClick={() => remove('categories', cat.id)} className="rounded-full bg-red-50 p-2 text-red-600" title="Delete category"><Trash2 size={16}/></button></div>)}
            {!categories.length && <p className="py-8 text-center text-sm text-stone-500">No categories yet.</p>}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold">Coupons</h2><p className="mt-1 text-sm text-stone-500">Create, edit, hide or remove discounts.</p></div><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold">{coupons.length}</span></div>
          <form onSubmit={saveCoupon} className="mt-5 grid gap-3">
            <div className="flex items-center justify-between"><p className="text-sm font-semibold">{editingCoupon ? 'Edit coupon' : 'New coupon'}</p>{editingCoupon && <button type="button" onClick={() => { setEditingCoupon(null); setCoupon(emptyCoupon); }} className="rounded-full bg-stone-100 p-2" title="Cancel edit"><X size={16}/></button>}</div>
            <input required value={coupon.code} onChange={(e) => setCoupon({ ...coupon, code: e.target.value.toUpperCase() })} placeholder="Coupon code" className="rounded-2xl bg-stone-100 px-4 py-3 uppercase outline-none" />
            <div className="grid grid-cols-2 gap-3"><select value={coupon.type} onChange={(e) => setCoupon({ ...coupon, type: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed amount</option></select><input required type="number" min="0" step="0.01" value={coupon.value} onChange={(e) => setCoupon({ ...coupon, value: e.target.value })} placeholder="Value" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" /></div>
            <input type="date" value={coupon.expiresAt} onChange={(e) => setCoupon({ ...coupon, expiresAt: e.target.value })} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none" />
            <button disabled={saving} className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-500 px-5 py-3 font-semibold text-stone-950 disabled:opacity-50">{editingCoupon ? <Save size={17}/> : <Plus size={17}/>} {editingCoupon ? 'Save coupon' : 'Add coupon'}</button>
          </form>
          <div className="mt-6 grid gap-2">
            {coupons.map((item) => <div key={item.id} className="rounded-2xl bg-stone-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{item.code}</p><p className="mt-1 text-xs text-stone-500">{item.type === 'PERCENTAGE' ? `${item.value}% off` : `${formatNaira(item.value)} off`}{item.expiresAt ? ` · expires ${new Date(item.expiresAt).toLocaleDateString('en-NG')}` : ''}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-200 text-stone-500'}`}>{item.isActive ? 'Active' : 'Hidden'}</span></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => editCoupon(item)} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold"><Edit3 size={14}/> Edit</button><button type="button" onClick={() => toggleCoupon(item)} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold">{item.isActive ? <X size={14}/> : <Check size={14}/>} {item.isActive ? 'Hide' : 'Activate'}</button><button type="button" onClick={() => remove('coupons', item.id)} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"><Trash2 size={14}/> Delete</button></div></div>)}
            {!coupons.length && <p className="py-8 text-center text-sm text-stone-500">No coupons yet.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
