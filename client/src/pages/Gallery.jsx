import { useEffect, useState } from 'react';
import { api, isVideoUrl, waMessages, whatsappHref } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';
import MediaCard from '../components/MediaCard.jsx';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    setPageMeta({ title: 'Gallery', description: 'Lookbook from JA fashions. Real store photos only.' });
    api.get('/gallery?limit=60').then((res) => setImages(res.data.images || [])).catch(() => setImages([]));
  }, []);
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Lookbook</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">Gallery</h1>
      <p className="mt-4 max-w-2xl text-stone-600">Photos and clips posted from admin. No stock pictures.</p>
      {!images.length && <p className="mt-10 rounded-[2rem] bg-white p-10 text-center text-stone-500">Gallery is empty until real photos are uploaded in admin.</p>}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((item) => <MediaCard key={item.id} item={item} onClick={() => setSelected(item)} />)}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/80 p-4" onClick={() => setSelected(null)}>
          <article className="w-full max-w-3xl overflow-hidden rounded-[1.5rem] bg-[#fffaf1]" onClick={(e) => e.stopPropagation()}>
            {isVideoUrl(selected.imageUrl) ? <video src={selected.imageUrl} className="max-h-[68vh] w-full bg-black object-contain" controls autoPlay playsInline /> : <img src={selected.imageUrl} alt={selected.title || 'JA fashions'} className="max-h-[68vh] w-full object-contain" />}
            <div className="p-5">
              <h2 className="font-display text-2xl">{selected.title || 'JA fashions'}</h2>
              <a href={whatsappHref(waMessages.gallery(selected.title))} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white">Ask on WhatsApp</a>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
