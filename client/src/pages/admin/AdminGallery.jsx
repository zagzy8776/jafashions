import { useEffect, useState } from 'react';
import { Check, Edit3, ImagePlus, Save, Trash2, X } from 'lucide-react';
import { api, uploadUnsignedMedia } from '../../lib/api.js';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = async () => { const res = await api.get('/admin/gallery'); setImages(res.data.images || []); };
  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || 'Could not load gallery')); }, []);

  const addFiles = async (files) => {
    if (!files?.length) return;
    setBusy(true); setError('');
    try {
      const uploads = await Promise.all(Array.from(files).map((file) => uploadUnsignedMedia(file, 'jafashions/gallery')));
      await Promise.all(uploads.map((asset) => api.post('/admin/gallery', { title: title.trim() || asset.original_filename || 'JA fashions lookbook', caption: caption.trim() || null, imageUrl: asset.secure_url, publicId: asset.public_id, isFeatured: false })));
      setTitle(''); setCaption(''); await load();
    } catch (err) { setError(err.response?.data?.message || err.message || 'Could not upload gallery photos'); }
    finally { setBusy(false); }
  };

  const edit = (item) => { setEditing(item.id); setTitle(item.title || ''); setCaption(item.caption || ''); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const saveEdit = async (event) => {
    event.preventDefault();
    if (!editing) return;
    setBusy(true); setError('');
    try { await api.put(`/admin/gallery/${editing}`, { title: title.trim() || null, caption: caption.trim() || null }); setEditing(null); setTitle(''); setCaption(''); await load(); }
    catch (err) { setError(err.response?.data?.message || 'Could not save gallery item'); }
    finally { setBusy(false); }
  };
  const toggle = async (item, field) => { setError(''); try { await api.put(`/admin/gallery/${item.id}`, { [field]: !item[field] }); await load(); } catch (err) { setError(err.response?.data?.message || 'Could not update gallery item'); } };
  const remove = async (id) => { if (!window.confirm('Remove this gallery image from the storefront?')) return; setError(''); try { await api.delete(`/admin/gallery/${id}`); await load(); } catch (err) { setError(err.response?.data?.message || 'Could not remove image'); } };

  return (
    <main className="p-5 sm:p-6 lg:p-10">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Lookbook</p>
      <h1 className="font-display text-4xl font-semibold">Gallery</h1>
      <p className="mt-2 text-stone-600">Upload, feature, hide and edit the photography customers see on the storefront.</p>
      {error && <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
        {editing && <div className="mb-4 flex items-center justify-between rounded-2xl bg-amber-50 p-4"><div><p className="font-semibold">Editing gallery item</p><p className="text-xs text-stone-500">Update its title or caption, then save.</p></div><button type="button" onClick={() => { setEditing(null); setTitle(''); setCaption(''); }} className="rounded-full bg-white p-2"><X size={16}/></button></div>}
        {editing ? <form onSubmit={saveEdit} className="grid gap-3 md:grid-cols-2"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Gallery title" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"/><input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"/><button disabled={busy} className="inline-flex w-fit items-center gap-2 rounded-full bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-50"><Save size={17}/> Save changes</button></form> : <><div className="grid gap-4 md:grid-cols-2"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title for uploaded photos (optional)" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"/><input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption for uploaded photos (optional)" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"/></div><label className="mt-5 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-amber-900/20 bg-stone-50 p-6 text-center"><ImagePlus size={28} className="text-amber-700"/><p className="mt-3 font-semibold">{busy ? 'Uploading…' : 'Choose gallery photos'}</p><p className="mt-1 text-sm text-stone-500">Multiple images upload to Cloudinary.</p><input type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)}/></label></>}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((item) => <article key={item.id} className="overflow-hidden rounded-3xl bg-white shadow-sm"><div className="relative"><img src={item.imageUrl} alt={item.title || ''} className="aspect-[4/5] w-full object-cover"/><div className="absolute left-3 top-3 flex gap-1"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${item.isActive ? 'bg-emerald-500 text-white' : 'bg-stone-800/80 text-white'}`}>{item.isActive ? 'Live' : 'Hidden'}</span>{item.isFeatured && <span className="rounded-full bg-amber-500 px-2 py-1 text-[10px] font-semibold text-stone-950">Featured</span>}</div></div><div className="p-4"><p className="font-semibold">{item.title || 'Untitled'}</p><p className="mt-1 line-clamp-2 text-sm text-stone-500">{item.caption || 'No caption'}</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => edit(item)} className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold"><Edit3 size={14}/> Edit</button><button type="button" onClick={() => toggle(item, 'isFeatured')} className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold">{item.isFeatured ? <X size={14}/> : <Check size={14}/>} {item.isFeatured ? 'Unfeature' : 'Feature'}</button><button type="button" onClick={() => toggle(item, 'isActive')} className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold">{item.isActive ? 'Hide' : 'Show'}</button><button type="button" onClick={() => remove(item.id)} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"><Trash2 size={14}/> Delete</button></div></div></article>)}
      </div>
      {!images.length && <p className="mt-8 rounded-[2rem] bg-white p-10 text-center text-stone-500">No gallery photos yet.</p>}
    </main>
  );
}
