import { useEffect } from 'react';
import { businessInfo } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';

export default function About() {
  useEffect(() => {
    setPageMeta({ title: 'About', description: 'JA fashions is a Nigeria online store for clothes, shoes and handbags.' });
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">About</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">A store built around the client.</h1>
      <p className="mt-6 text-lg leading-8 text-stone-600">{businessInfo.brand} sells clothes, shoes and handbags. You browse real pieces on the site, then finish on WhatsApp.</p>
      <p className="mt-4 text-lg leading-8 text-stone-600">Photos on the store are the real pieces posted from admin. If a size or colour is not listed, send a message.</p>
      <p className="mt-4 text-lg leading-8 text-stone-600">We send orders across {businessInfo.location}.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {['Clothes, shoes and handbags', 'WhatsApp checkout', 'Real photos only'].map((item) => (
          <div key={item} className="rounded-[2rem] bg-white p-6 font-semibold shadow-sm">{item}</div>
        ))}
      </div>
    </main>
  );
}
