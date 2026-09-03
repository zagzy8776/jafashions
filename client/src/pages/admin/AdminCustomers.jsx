import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api, formatNaira } from '../../lib/api.js';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { api.get('/admin/customers').then((res) => setCustomers(res.data.customers || [])).catch((err) => setError(err.response?.data?.message || 'Could not load customers')); }, []);
  const filtered = useMemo(() => customers.filter((c) => `${c.customerName} ${c.customerPhone} ${c.customerEmail || ''}`.toLowerCase().includes(search.toLowerCase())), [customers, search]);
  return <main className="p-6 lg:p-10"><p className="text-sm uppercase tracking-[0.3em] text-amber-700">Customer book</p><h1 className="font-display text-4xl font-semibold">Customers</h1><p className="mt-2 text-stone-600">Customers are grouped by phone number so repeat buyers are easy to identify.</p>{error && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}<div className="mt-8 rounded-[2rem] bg-white p-5 shadow-sm"><label className="flex max-w-md items-center gap-2 rounded-full bg-stone-100 px-4"><Search size={17}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search customers" className="w-full bg-transparent py-3 outline-none"/></label><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead><tr className="border-b border-stone-200 text-stone-500"><th className="pb-3">Customer</th><th>Phone</th><th>Email</th><th>Orders</th><th>Total spent</th><th>Last order</th></tr></thead><tbody>{filtered.map((c,i)=><tr key={`${c.customerPhone}-${i}`} className="border-b border-stone-100"><td className="py-4 font-semibold">{c.customerName}</td><td>{c.customerPhone}</td><td>{c.customerEmail || '—'}</td><td>{c.orders}</td><td>{formatNaira(c.spent)}</td><td>{new Date(c.createdAt).toLocaleDateString('en-NG')}</td></tr>)}</tbody></table>{!filtered.length && <p className="py-10 text-center text-stone-500">No customers yet.</p>}</div></div></main>;
}
