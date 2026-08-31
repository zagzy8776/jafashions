import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatNaira } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const image = product.images?.[0] || '/logo.svg';
  const outOfStock = product.stock <= 0;
  const wished = isWishlisted(product.id);

  return (
    <article className="group overflow-hidden rounded-[1.2rem] border border-amber-900/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:rounded-[1.5rem]">
      <div className="relative">
        <Link to={`/product/${product.slug}`} className="block h-52 overflow-hidden bg-gradient-to-br from-amber-50 to-stone-100 p-0.5 sm:h-64 lg:h-72">
        <img src={image} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-contain transition duration-700 group-hover:scale-105" />
        </Link>
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {product.salePrice && <span className="rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold text-white">SALE</span>}
          {product.isFeatured && <span className="rounded-full bg-amber-500 px-2 py-1 text-[10px] font-bold text-stone-950">BEST</span>}
        </div>
        <button onClick={() => toggleWishlist(product)} className={`absolute right-2 top-2 rounded-full p-2 shadow-sm ${wished ? 'bg-red-500 text-white' : 'bg-white/90 text-stone-700'}`} aria-label="Toggle wishlist">
          <Heart size={15} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-3 sm:p-4">
        <p className="truncate text-[10px] uppercase tracking-[0.18em] text-amber-700 sm:text-xs">{product.category?.name || 'Product'}</p>
        <Link to={`/product/${product.slug}`} className="mt-1 line-clamp-2 font-display text-sm font-semibold leading-tight text-stone-950 sm:text-lg">{product.name}</Link>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            {product.salePrice && <span className="block truncate text-[11px] text-stone-400 line-through sm:text-xs">{formatNaira(product.price)}</span>}
            <strong className="block truncate text-xs text-stone-950 sm:text-base">{formatNaira(product.salePrice || product.price)}</strong>
          </div>
          <button disabled={outOfStock} onClick={() => addToCart(product)} className="shrink-0 rounded-full bg-stone-950 p-2 text-amber-200 transition hover:bg-amber-700 hover:text-white disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500 sm:p-3" aria-label="Add to cart">
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
