import { useEffect, useState } from 'react';
import { waMessages, whatsappHref } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';

const options = {
  category: ['Clothes', 'Shoes', 'Handbags'],
  size: ['XS', 'S', 'M', 'L', 'XL', 'Not sure'],
  budget: ['Under ₦20,000', '₦20,000 – ₦40,000', '₦40,000 – ₦80,000', '₦80,000+'],
};

export default function StyleFinder() {
  const [form, setForm] = useState({ category: 'Clothes', size: 'M', budget: '₦20,000 – ₦40,000' });
  useEffect(() => {
    setPageMeta({ title: 'Find a piece', description: 'Tell JA fashions what you want and send the brief on WhatsApp.' });
  }, []);
  const message = `Hello JA fashions, I am looking for ${form.category}. Size: ${form.size}. Budget: ${form.budget}.`;
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Personal shop</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">Tell us what you want.</h1>
      <p className="mt-4 text-stone-600">No stock photos. We reply with real pieces from the store.</p>
      <div className="mt-10 grid gap-5">
        {Object.entries(options).map(([key, values]) => (
          <label key={key} className="grid gap-2 text-sm font-semibold">
            {key}
            <select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="rounded-2xl bg-white px-4 py-3 font-normal shadow-sm ring-1 ring-amber-900/10">
              {values.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
        ))}
      </div>
      <a href={whatsappHref(message)} target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-green-600 px-6 py-3 font-semibold text-white">Send on WhatsApp</a>
    </main>
  );
}
