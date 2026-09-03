import { useEffect, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { api, uploadUnsignedMedia } from '../../lib/api.js';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const load = () => api.get('/admin/gallery').then((res) => setImages(res.data.images || []));
  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || 'Could not load gallery')); }, []);

  const addFiles = async (files) => {
    if (!files?.length) return;
    setBusy(true); setError('');
    try {
      const uploads = await Promise.all(Array.from(files).map((file) => uploadUnsignedMedia(file, 'jafashions/gallery')));
      for (const asset of uploads) await api.post('/admin/gallery', { title: title || asset.original_filename || 'JA fashions lookbook', caption, imageUrl: asset.secure_url, publicId: asset.public_id });
      setTitle(''); setCaption(''); await load();
    } catch (err) { setError(err.response?.data?.message || err.message || 'Could not upload gallery photos'); }
    finally { setBusy(false); }
  };
  const remove = async (id) => { if (!window.confirm('Remove this gallery image?')) return; try { await api.delete(`/admin/gallery/${id}`); await load(); } catch (err) { setError(err.response?.data?.message || 'Could not remove image'); } };

  return <main className="p-6 lg:p-10">
    <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Lookbook</p><h1 className="font-display text-4xl font-semibold">Gallery</h1><p className="mt-2 text-stone-600">Upload the photos the client wants customers to see on the storefront.</p>
    {error && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm"><div className="grid gap-4 md:grid-cols-2"><input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Gallery title (optional)" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"/><input value={caption} onChange={(e)=>setCaption(e.target.value)} placeholder="Caption (optional)" className="rounded-2xl bg-stone-100 px-4 py-3 outline-none"/></div><label className="mt-5 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-amber-900/20 bg-stone-50 p-6 text-center"><ImagePlus size={28} className="text-amber-700"/><p className="mt-3 font-semibold">{busy ? 'Uploading…' : 'Choose gallery photos'}</p><p className="mt-1 text-sm text-stone-500">Multiple images are supported.</p><input type="file" accept="image/*" multiple hidden onChange={(e)=>addFiles(e.target.files)}/></label></div>
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{images.map((item)=><article key={item.id} className="group overflow-hidden rounded-3xl bg-white shadow-sm"><div className="relative"><img src={item.imageUrl} alt={item.title || ''} className="aspect-[4/5] w-full object-cover"/><button onClick={()=>remove(item.id)} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-red-600 opacity-0 shadow transition group-hover:opacity-100"><Trash2 size={16}/></button></div><div className="p-4"><p className="font-semibold">{item.title || 'Untitled'}</p><p className="mt-1 text-sm text-stone-500">{item.caption || 'No caption'}</p></div></article>)}</div>
    {!images.length && <p className="mt-8 rounded-[2rem] bg-white p-10 text-center text-stone-500">No gallery photos yet.</p>}
  </main>;
}
