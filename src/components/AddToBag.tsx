"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/schema";

export default function AddToBag({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [size, setSize] = useState(product.sizes?.[0] || "");
  const [color, setColor] = useState(product.colors?.[0] || "");
  const [added, setAdded] = useState(false);

  function onAdd() {
    add({
      productId: product.id,
      name: product.name,
      priceNaira: product.priceNaira,
      size,
      color,
      image: product.images?.[0],
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="mt-8 space-y-5">
      {product.sizes?.length ? (
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#6f6a63]">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={`border px-3 py-1.5 text-sm ${size === s ? "border-[#161513] bg-[#161513] text-[#faf7f2]" : "border-[#161513]"}`}>{s}</button>
            ))}
          </div>
        </div>
      ) : null}
      {product.colors?.length ? (
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#6f6a63]">Color</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button key={c} onClick={() => setColor(c)} className={`border px-3 py-1.5 text-sm ${color === c ? "border-[#161513] bg-[#161513] text-[#faf7f2]" : "border-[#161513]"}`}>{c}</button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3 pt-2">
        <button disabled={!product.inStock} onClick={onAdd} className="btn-dark disabled:opacity-40">
          {product.inStock ? (added ? "Added" : "Add to bag") : "Sold out"}
        </button>
        <button onClick={() => { if (product.inStock) onAdd(); router.push("/checkout"); }} disabled={!product.inStock} className="btn-line disabled:opacity-40">Buy now</button>
      </div>
    </div>
  );
}
