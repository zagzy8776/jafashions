import Link from "next/link";
import { formatNaira } from "@/lib/constants";
import type { Product } from "@/lib/schema";

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#eae3d8]">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#6f6a63]">Photo coming</div>
        )}
        {!product.inStock && (
          <span className="absolute left-3 top-3 bg-[#161513] px-2 py-1 text-[10px] uppercase tracking-widest text-white">Sold out</span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-sm">{product.name}</h3>
        <p className="mt-1 text-sm text-[#6f6a63]">{formatNaira(product.priceNaira)}</p>
      </div>
    </Link>
  );
}
