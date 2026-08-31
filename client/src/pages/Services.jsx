import { MessageCircle } from 'lucide-react';
import { waMessages, whatsappHref } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';
import { useEffect } from 'react';

const services = [
  { name: 'Size & fit help', note: 'Not sure about a size? Send your usual fit and we will tell you what we have.' },
  { name: 'Custom orders', note: 'Need a colour, size or piece that is not listed? Message the store.' },
  { name: 'Personal shop', note: 'Tell us the look. We will pull clothes, shoes or bags that match.' },
  { name: 'Gift styling', note: 'A bag, a pair of shoes, or a full look packed as a gift.' },
  { name: 'Bulk / group orders', note: 'Friends or a small shop buying more than one piece.' },
  { name: 'WhatsApp checkout', note: 'Add to bag on the site, then finish payment and delivery on WhatsApp.' },
];

export default function Services() {
  useEffect(() => {
    setPageMeta({ title: 'Custom orders', description: 'Size help, custom orders and personal shopping from JA fashions.' });
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="luxury-gradient rounded-[1.5rem] p-5 text-white sm:rounded-[2.5rem] sm:p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300 sm:text-sm sm:tracking-[0.3em]">Store help</p>
        <h1 className="mt-3 font-display text-[1.85rem] font-semibold leading-tight sm:text-5xl">Need a size or a custom order?</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-stone-300 sm:mt-4 sm:text-base">Message JA fashions on WhatsApp. Send a photo or describe the piece. We reply with availability, price and how to pay.</p>
        <a href={whatsappHref(waMessages.servicesHero)} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 text-[16px] font-semibold text-stone-950 sm:mt-7">Message us <MessageCircle size={18} /></a>
      </section>
      <section className="mt-5 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2">
        {services.map((service, index) => (
          <article key={service.name} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-amber-900/10 sm:rounded-[2rem] sm:p-6">
            <span className="text-[11px] uppercase tracking-[0.28em] text-amber-700">0{index + 1}</span>
            <h2 className="mt-2 font-display text-[1.65rem] leading-tight sm:mt-3 sm:text-2xl">{service.name}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{service.note}</p>
            <a href={whatsappHref(waMessages.service(service.name))} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-amber-800">Enquire on WhatsApp →</a>
          </article>
        ))}
      </section>
    </main>
  );
}
