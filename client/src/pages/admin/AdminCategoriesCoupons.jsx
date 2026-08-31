import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

export default function AdminCategoriesCoupons() {
  const [categories, setCategories] = useState([]);
  useEffect(() => { api.get('/categories').then((res) => setCategories(res.data.categories || [])).catch(() => setCategories([])); }, []);
  return (
    <main className="p-6 lg:p-10">
      <h1 className="font-display text-4xl font-semibold">Categories & Coupons</h1>
      <div className="mt-8 grid gap-3">
        {categories.map((cat) => <article key={cat.id} className="rounded-2xl bg-white p-4 shadow-sm">{cat.name}</article>)}
      </div>
    </main>
  );
}
