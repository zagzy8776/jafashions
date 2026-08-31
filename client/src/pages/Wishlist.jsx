import { Link } from 'react-router-dom';
import { MessageCircle, Trash2 } from 'lucide-react';
import { formatNaira, whatsappNumber } from '../lib/api.js';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function Wishlist() {
  const { items, toggleWishlist, clearWishlist } = useWishlist();
  const message = encodeURIComponent(`Hello JA fashions, these are the items on my wishlist:\n\n${items.map((item, index) => `${index + 1}. ${item.name} - ${formatNaira(item.price)}`).join('\n')}\n\nPlease help me confirm availability.`);
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2.5rem] bg-stone-950 p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Saved Picks</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">Your Wishlist</h1>
        <p className="mt-4 max-w-2xl text-stone-300">Save products, then send them to JA fashions on WhatsApp.</p>
      </div>
      {!items.length ? (
        <div className="mt-10 rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <p className="text-stone-600">Your wishlist is empty.</p>
          <Link to="/shop" className="mt-5 inline-block rounded-full bg-stone-950 px-7 py-3 font-semibold text-white">Explore products</Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="flex gap-4 rounded-[2rem] bg-white p-4 shadow-sm">
                <Link to={`/product/${item.slug}`}><img src={item.image} alt={item.name} className="h-28 w-24 rounded-2xl bg-amber-50 object-contain p-1" /></Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-700">{item.category || 'JA fashions'}</p>
                    <Link to={`/product/${item.slug}`} className="font-display text-xl font-semibold">{item.name}</Link>
                    <p className="text-stone-600">{formatNaira(item.price)}</p>
                  </div>
                  <button onClick={() => toggleWishlist(item)} className="inline-flex w-fit items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"><Trash2 size={15} /> Remove</button>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-4 font-semibold text-white"><MessageCircle size={18} /> Send Wishlist on WhatsApp</a>
            <button onClick={clearWishlist} className="rounded-full border border-amber-900/20 px-7 py-4 font-semibold text-stone-800">Clear wishlist</button>
          </div>
        </>
      )}
    </main>
  );
}
