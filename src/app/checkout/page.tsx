"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { STORE, formatNaira, whatsappLink } from "@/lib/constants";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!items.length) return;
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      address: String(form.get("address") || ""),
      city: String(form.get("city") || ""),
      state: String(form.get("state") || ""),
      notes: String(form.get("notes") || ""),
      items,
      totalNaira: total,
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Could not place order");
      const lines = items
        .map((i) => `• ${i.name} x${i.qty}${i.size ? ` (${i.size})` : ""} — ${formatNaira(i.priceNaira * i.qty)}`)
        .join("\n");
      const msg = `New JA fashions order\n\n${payload.customerName}\n${payload.phone}\n${payload.city} ${payload.state}\n${payload.address}\n\n${lines}\n\nTotal: ${formatNaira(total)}\n${payload.notes}`;
      clear();
      window.location.href = whatsappLink(msg);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="serif text-4xl">Checkout</h1>
        <p className="mt-4 text-paper/60">Your bag is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div>
        <h1 className="serif text-4xl">Checkout</h1>
        <p className="mt-3 text-sm text-paper/60">We save the order, then open WhatsApp so you can confirm with {STORE.name}.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm"><span className="text-paper/60">Full name</span><input name="customerName" required className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" /></label>
          <label className="block text-sm"><span className="text-paper/60">WhatsApp number</span><input name="phone" required className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" /></label>
          <label className="block text-sm"><span className="text-paper/60">Email</span><input name="email" type="email" className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" /></label>
          <label className="block text-sm"><span className="text-paper/60">Delivery address</span><input name="address" className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm"><span className="text-paper/60">City</span><input name="city" className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" /></label>
            <label className="block text-sm"><span className="text-paper/60">State</span><input name="state" className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" /></label>
          </div>
          <label className="block text-sm"><span className="text-paper/60">Notes</span><textarea name="notes" rows={3} className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" /></label>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button disabled={busy} className="w-full rounded-full bg-paper py-3 text-sm font-medium text-ink disabled:opacity-50">
            {busy ? "Sending…" : `Place order · ${formatNaira(total)}`}
          </button>
        </form>
      </div>
      <aside className="border border-white/10 bg-bg-soft p-6 h-fit">
        <h2 className="text-xs uppercase tracking-[0.22em] text-gold">Order</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((i) => (
            <li key={`${i.productId}-${i.size}-${i.color}`} className="flex justify-between gap-3">
              <span>{i.name} × {i.qty}</span>
              <span>{formatNaira(i.priceNaira * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex justify-between border-t border-white/10 pt-4">
          <span>Total</span>
          <span>{formatNaira(total)}</span>
        </div>
        <button type="button" className="mt-4 text-xs text-paper/50" onClick={() => router.push("/cart")}>Edit bag</button>
      </aside>
    </div>
  );
}
