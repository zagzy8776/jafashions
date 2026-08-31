import { Mail, MapPin, MessageCircle, Music2, Phone, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { businessInfo, waMessages, whatsappHref } from '../lib/api.js';
import { setPageMeta } from '../lib/seo.js';

export default function Contact() {
  useEffect(() => {
    setPageMeta({ title: 'Contact', description: 'Call or WhatsApp JA fashions.' });
  }, []);
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Contact</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">Talk to JA fashions</h1>
      <p className="mt-4 text-stone-600">Order on WhatsApp or call the store.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <a href={whatsappHref(waMessages.contact)} target="_blank" rel="noreferrer" className="rounded-[2rem] bg-white p-6 shadow-sm"><MessageCircle className="text-green-600" /><h2 className="mt-4 font-semibold">WhatsApp</h2><p className="text-stone-600">{businessInfo.phoneDisplay}</p></a>
        <a href={`tel:${businessInfo.callLine}`} className="rounded-[2rem] bg-white p-6 shadow-sm"><Phone className="text-amber-700" /><h2 className="mt-4 font-semibold">Call</h2><p className="text-stone-600">{businessInfo.callLine}</p></a>
        <a href={`mailto:${businessInfo.email}`} className="rounded-[2rem] bg-white p-6 shadow-sm"><Mail className="text-amber-700" /><h2 className="mt-4 font-semibold">Email</h2><p className="break-words text-stone-600">{businessInfo.email}</p></a>
        <a href={businessInfo.mapUrl} target="_blank" rel="noreferrer" className="rounded-[2rem] bg-white p-6 shadow-sm"><MapPin className="text-amber-700" /><h2 className="mt-4 font-semibold">Location</h2><p className="text-stone-600">{businessInfo.location}</p></a>
        <a href={businessInfo.instagramUrl} target="_blank" rel="noreferrer" className="rounded-[2rem] bg-white p-6 shadow-sm"><Sparkles className="text-pink-600" /><h2 className="mt-4 font-semibold">Instagram</h2><p className="text-stone-600">{businessInfo.instagram}</p></a>
        <a href={businessInfo.tiktokUrl} target="_blank" rel="noreferrer" className="rounded-[2rem] bg-white p-6 shadow-sm"><Music2 className="text-stone-900" /><h2 className="mt-4 font-semibold">TikTok</h2><p className="text-stone-600">{businessInfo.tiktok}</p></a>
      </div>
    </main>
  );
}
