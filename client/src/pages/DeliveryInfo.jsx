import { useEffect } from 'react';
import { deliveryOptions, formatNaira, businessInfo } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';

export default function DeliveryInfo() {
  useEffect(() => {
    setPageMeta({ title: 'Delivery', description: 'Pickup and delivery options for JA fashions.' });
  }, []);
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Delivery</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">How your order arrives</h1>
      <p className="mt-4 text-stone-600">Confirm on WhatsApp. We pack from {businessInfo.location}.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {deliveryOptions.map((option) => (
          <article key={option.value} className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="font-display text-2xl">{option.label}</h2>
            <p className="mt-2 text-lg font-semibold">{formatNaira(option.fee)}</p>
            <p className="mt-3 text-sm leading-6 text-stone-600">{option.note}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
