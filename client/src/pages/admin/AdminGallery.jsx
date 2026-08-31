import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  useEffect(() => { api.get('/gallery?limit=100').then((res) => setImages(res.data.images || [])).catch(() => setImages([])); }, []);
  return (
    <main className="p-6 lg:p-10">
      <h1 className="font-display text-4xl font-semibold">Gallery</h1>
      <p className="mt-2 text-stone-600">Upload real lookbook photos here.</p>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((item) => <img key={item.id} src={item.imageUrl} alt={item.title || ''} className="h-40 w-full rounded-2xl object-cover" />)}
      </div>
    </main>
  );
}
