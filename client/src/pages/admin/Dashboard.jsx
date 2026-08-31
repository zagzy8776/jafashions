import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/analytics/summary').then((res) => setStats(res.data)).catch(() => setStats(null)); }, []);
  return (
    <main className="p-6 lg:p-10">
      <h1 className="font-display text-4xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-stone-600">JA fashions admin. Add real products here. No mock pictures.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[['Products', stats?.products ?? 0], ['Orders', stats?.orders ?? 0], ['Revenue', stats?.revenue ?? 0]].map(([label, value]) => (
          <article key={label} className="rounded-[2rem] bg-white p-6 shadow-sm"><p className="text-sm uppercase tracking-[0.2em] text-amber-700">{label}</p><p className="mt-3 font-display text-4xl">{value}</p></article>
        ))}
      </div>
    </main>
  );
}
