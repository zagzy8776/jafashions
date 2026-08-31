import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { setPageMeta } from '../lib/seo.js';

const sections = [
  ['Clothes', 'clothes'],
  ['Under \u20a620k', 'under20'],
  ['Premium picks', 'luxury'],
];

export default function Gifts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setPageMeta({ title: 'Gifts', description: 'Gift looks from JA fashions.' });
    api.get('/products').then((res) => setProducts(res.data.products)).catch(() => setProducts([]));
  }, []);
  const grouped = useMemo(() => Object.fromEntries(sections.map(([title, key]) => [title, products.filter((product) => {
    const text = `${product.name} ${product.description} ${product.category?.name}`.toLowerCase();
    if (key === 'under20') return Number(product.salePrice || product.price) <= 20000;
    if (key === 'luxury') return Number(product.salePrice || product.price) >= 20000;
    return text.includes('cloth') || text.includes('dress') || text.includes('gift');
  }).slice(0, 6)])), [products]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="luxury-gradient rounded-[2.5rem] p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Gift Guide</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Looks for every moment.</h1>
        <p className="mt-4 max-w-2xl text-stone-300">Clothes, shoes and handbags ready to send as a gift.</p>
      </section>
      {Object.entries(grouped).map(([title, items]) => (
        <section key={title} className="mt-12">
          <h2 className="font-display text-4xl font-semibold">{title}</h2>
          {items.length ? <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p className="mt-4 rounded-2xl bg-white p-6 text-stone-500">No matching products yet.</p>}
        </section>
      ))}
    </main>
  );
}
