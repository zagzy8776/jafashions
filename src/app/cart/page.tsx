"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatNaira } from "@/lib/constants";

export default function CartPage() {
  const { items, total, setQty, remove, keyOf } = useCart();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="serif text-5xl">Your bag</h1>
      {items.length === 0 ? (
        <div className="mt-10">
          <p className="text-[#6f6a63]">Nothing in the bag yet.</p>
          <Link href="/shop" className="btn-dark mt-6">Continue shopping</Link>
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-[#ddd4c6]">
            {items.map((item) => (
              <li key={keyOf(item)} className="flex gap-4 py-5">
                <div className="h-24 w-20 overflow-hidden bg-[#eae3d8]">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <Link href={`/shop/${item.slug}`} className="text-sm">{item.name}</Link>
                  <p className="mt-1 text-xs text-[#6f6a63]">{[item.size, item.color].filter(Boolean).join(" · ")}</p>
                  <p className="mt-2 text-sm">{formatNaira(item.priceNaira)}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <input type="number" min={1} value={item.qty} onChange={(e) => setQty(keyOf(item), Number(e.target.value))} className="w-16 border border-[#161513] bg-transparent px-2 py-1 text-sm" />
                    <button onClick={() => remove(keyOf(item))} className="text-xs underline">Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center justify-between border-t border-[#ddd4c6] pt-6">
            <p className="text-sm text-[#6f6a63]">Total</p>
            <p className="text-xl">{formatNaira(total)}</p>
          </div>
          <Link href="/checkout" className="btn-dark mt-6">Checkout</Link>
        </>
      )}
    </div>
  );
}
