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
          <p className="text-xs uppercase tracking-[0.2em] text-paper/50">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  size === s ? "border-gold text-gold" : "border-white/15"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {product.colors?.length ? (
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-paper/50">Color</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  color === c ? "border-gold text-gold" : "border-white/15"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          disabled={!product.inStock}
          onClick={onAdd}
          className="rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink disabled:opacity-40"
        >
          {product.inStock ? (added ? "Added" : "Add to bag") : "Sold out"}
        </button>
        <button
          onClick={() => {
            if (product.inStock) onAdd();
            router.push("/checkout");
          }}
          disabled={!product.inStock}
          className="rounded-full border border-white/20 px-6 py-3 text-sm"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
