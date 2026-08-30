import Link from "next/link";
import { formatNaira } from "@/lib/constants";
import type { Product } from "@/lib/schema";

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-bg-soft">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-paper/30">No photo yet</div>
        )}
        {!product.inStock && (
          <span className="absolute left-3 top-3 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-widest">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold">{product.category}</p>
        <h3 className="mt-1 text-sm text-paper">{product.name}</h3>
        <p className="mt-1 text-sm text-paper/70">{formatNaira(product.priceNaira)}</p>
      </div>
    </Link>
  );
}
