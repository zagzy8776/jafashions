import { useEffect, useMemo, useState } from 'react';
import { Edit3, ImagePlus, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { api, formatNaira, uploadUnsignedMedia } from '../../lib/api.js';

const emptyForm = { name: '', price: '', salePrice: '', stock: 0, categoryId: '', description: '', size: '', gender: '', isFeatured: false, isActive: true, images: [] };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    const [productRes, categoryRes] = await Promise.all([api.get('/admin/products'), api.get('/admin/categories')]);
    setProducts(productRes.data.products || []);
    setCategories(categoryRes.data.categories || []);
  };
  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || 'Could not load products')); }, []);

  const filtered = useMemo(() => products.filter((p) => `${p.name} ${p.category?.name || ''}`.toLowerCase().includes(search.toLowerCase())), [products, search]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const startNew = () => { setEditing(null); setForm({ ...emptyForm, images: [] }); setError(''); };
  const edit = (product) => { setEditing(product.id); setForm({ ...emptyForm, ...product, price: product.price ?? '', salePrice: product.salePrice ?? '', stock: product.stock ?? 0, categoryId: product.categoryId || '', images: product.images || [] }); setError(''); };

  const upload = async (files) => {
    if (!files?.length) return;
    setUploading(true); setError('');
    try {
      const uploaded = await Promise.all(Array.from(files).map((file) => uploadUnsignedMedia(file, 'jafashions/products')));
      update('images', [...form.images, ...uploaded.map((item) => item.secure_url)]);
    } catch (err) { setError(err.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const save = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const payload = { ...form, price: Number(form.price), salePrice: form.salePrice === '' ? null : Number(form.salePrice), stock: Number(form.stock) };
      if (editing) await api.put(`/admin/products/${editing}`, payload); else await api.post('/admin/products', payload);
      await load(); startNew();
    } catch (err) { setError(err.response?.data?.message || err.message || 'Could not save product'); }
    finally { setBusy(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Remove this product from the storefront?')) return;
    try { await api.delete(`/admin/products/${id}`); await load(); if (editing === id) startNew(); }
    catch (err) { setError(err.response?.data?.message || 'Could not remove product'); }
  };

  return <main className="p-6 lg:p-10">
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div><p className="text-sm uppercase tracking-[0.3em] text-amber-700">Store management</p><h1 className="font-display text-4xl font-semibold">Products</h1><p className="mt-2 text-stone-600">Add clothing, shoes and bags with real Cloudinary photos.</p></div>
      <button onClick={startNew} className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-5 py-3 font-semibold text-white"><Plus size={18}/> New product</button>
    </div>
    {error && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}

    <form onSubmit={save} className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{editing ? 'Edit product' : 'Add product'}</h2>{editing && <button type="button" onClick={startNew} className="rounded-full bg-stone-100 p-2"><X size={18}/></button>}</div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <input required value={form.name} onChange={(e)=>update('name',e.target.value)} placeholder="Product name" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"/>
        <input required type="number" min="0" value={form.price} onChange={(e)=>update('price',e.target.value)} placeholder="Price (₦)" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"/>
        <input type="number" min="0" value={form.salePrice} onChange={(e)=>update('salePrice',e.target.value)} placeholder="Sale price (optional)" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"/>
        <input type="number" min="0" value={form.stock} onChange={(e)=>update('stock',e.target.value)} placeholder="Stock" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"/>
        <select value={form.categoryId} onChange={(e)=>update('categoryId',e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"><option value="">Choose category</option>{categories.map((cat)=><option value={cat.id} key={cat.id}>{cat.name}</option>)}</select>
        <input value={form.size || ''} onChange={(e)=>update('size',e.target.value)} placeholder="Size / range" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"/>
        <select value={form.gender || ''} onChange={(e)=>update('gender',e.target.value)} className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"><option value="">Gender / collection</option><option>Women</option><option>Men</option><option>Unisex</option></select>
        <textarea value={form.description || ''} onChange={(e)=>update('description',e.target.value)} placeholder="Description" className="min-h-28 rounded-2xl bg-stone-100 px-4 py-3 outline-none md:col-span-2"/>
      </div>
      <div className="mt-5 rounded-2xl border border-dashed border-amber-900/20 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Product photos</p><p className="text-sm text-stone-500">Upload from phone or computer. Photos go to Cloudinary.</p></div><label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-stone-950 px-5 py-3 font-semibold text-white"><ImagePlus size={18}/> {uploading ? 'Uploading…' : 'Choose photos'}<input type="file" accept="image/*,video/*" multiple hidden onChange={(e)=>upload(e.target.files)}/></label></div>
        {form.images.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{form.images.map((src,index)=><div key={`${src}-${index}`} className="relative overflow-hidden rounded-2xl bg-stone-100"><img src={src} alt="" className="h-36 w-full object-cover"/><button type="button" onClick={()=>update('images',form.images.filter((_,i)=>i!==index))} className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-red-600 shadow"><X size={15}/></button></div>)}</div>}
      </div>
      <div className="mt-5 flex flex-wrap gap-5 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e)=>update('isFeatured',e.target.checked)}/> Featured</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e)=>update('isActive',e.target.checked)}/> Visible in store</label></div>
      <button disabled={busy || uploading} className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-stone-950 disabled:opacity-50"><Save size={18}/>{busy ? 'Saving…' : editing ? 'Save changes' : 'Publish product'}</button>
    </form>

    <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><h2 className="text-xl font-semibold">Current products ({filtered.length})</h2><label className="flex items-center gap-2 rounded-full bg-stone-100 px-4"><Search size={17}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search products" className="bg-transparent py-2 outline-none"/></label></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-stone-200 text-stone-500"><th className="pb-3">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th className="text-right">Actions</th></tr></thead><tbody>{filtered.map((p)=><tr key={p.id} className="border-b border-stone-100"><td className="py-3"><div className="flex items-center gap-3"><div className="h-14 w-12 overflow-hidden rounded-xl bg-stone-100">{p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover"/>}</div><div><p className="font-semibold">{p.name}</p><p className="text-xs text-stone-500">{p.images?.length || 0} photo(s)</p></div></div></td><td>{p.category?.name || 'Uncategorised'}</td><td>{formatNaira(p.salePrice || p.price)}</td><td>{p.stock}</td><td><span className={`rounded-full px-3 py-1 text-xs ${p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>{p.isActive ? 'Live' : 'Hidden'}</span></td><td><div className="flex justify-end gap-2"><button onClick={()=>edit(p)} className="rounded-full bg-stone-100 p-2"><Edit3 size={16}/></button><button onClick={()=>remove(p.id)} className="rounded-full bg-red-50 p-2 text-red-600"><Trash2 size={16}/></button></div></td></tr>)}</tbody></table>{!filtered.length && <p className="py-10 text-center text-stone-500">No products yet.</p>}</div></div>
  </main>;
}
