import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => { api.get('/products?limit=100').then((res) => setProducts(res.data.products || [])).catch(() => setProducts([])); }, []);
  return (
    <main className="p-6 lg:p-10">
      <h1 className="font-display text-4xl font-semibold">Products</h1>
      <p className="mt-2 text-stone-600">Upload real photos from the store. Empty until you add pieces.</p>
      <div className="mt-8 grid gap-3">
        {products.map((product) => <article key={product.id} className="rounded-2xl bg-white p-4 shadow-sm"><strong>{product.name}</strong><p className="text-sm text-stone-500">{product.category?.name}</p></article>)}
        {!products.length && <p className="rounded-[2rem] bg-white p-8 text-stone-500">No products yet.</p>}
      </div>
    </main>
  );
}
