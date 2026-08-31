import { ExternalLink, Star } from 'lucide-react';

const GOOGLE_REVIEW_URL = 'https://www.google.com/search?q=JA+fashions+Nigeria';

export default function ReviewCTA({ compact = false }) {
  return (
    <section className={`rounded-[2rem] bg-white shadow-sm ${compact ? 'p-5' : 'p-7 md:p-8'}`}>
      <div className="flex items-start gap-4">
        <span className="rounded-2xl bg-amber-100 p-3 text-amber-700"><Star fill="currentColor" /></span>
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-amber-700">Google Reviews</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Loved your order? Leave us a Google review.</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">Your review helps more clients in Nigeria discover JA fashions.</p>
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-amber-700"><ExternalLink size={16} /> Leave a review</a>
        </div>
      </div>
    </section>
  );
}
