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
        .map((i) => `\u2022 ${i.name} x${i.qty}${i.size ? ` (${i.size})` : ""} \u2014 ${formatNaira(i.priceNaira * i.qty)}`)
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
        <h1 className="serif text-5xl">Checkout</h1>
        <p className="mt-4 text-[#6f6a63]">Your bag is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div>
        <h1 className="serif text-5xl">Checkout</h1>
        <p className="mt-3 text-sm text-[#6f6a63]">We save the order, then open WhatsApp so you can confirm with {STORE.name}.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field name="customerName" label="Full name" required />
          <Field name="phone" label="WhatsApp number" required />
          <Field name="email" label="Email" type="email" />
          <Field name="address" label="Delivery address" />
          <div className="grid grid-cols-2 gap-3">
            <Field name="city" label="City" />
            <Field name="state" label="State" />
          </div>
          <label className="block text-sm">
            <span className="text-[#6f6a63]">Notes</span>
            <textarea name="notes" rows={3} className="mt-1 w-full border border-[#161513] bg-transparent px-3 py-2" />
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="btn-dark w-full disabled:opacity-50">
            {busy ? "Sending\u2026" : `Place order \u00b7 ${formatNaira(total)}`}
          </button>
        </form>
      </div>
      <aside className="h-fit border border-[#161513] bg-[#faf7f2] p-6">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-[#8a6a32]">Order</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((i) => (
            <li key={`${i.productId}-${i.size}-${i.color}`} className="flex justify-between gap-3">
              <span>{i.name} \u00d7 {i.qty}</span>
              <span>{formatNaira(i.priceNaira * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex justify-between border-t border-[#ddd4c6] pt-4">
          <span>Total</span>
          <span>{formatNaira(total)}</span>
        </div>
        <button type="button" className="mt-4 text-xs underline" onClick={() => router.push("/cart")}>Edit bag</button>
      </aside>
    </div>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block text-sm">
      <span className="text-[#6f6a63]">{label}</span>
      <input name={name} type={type} required={required} className="mt-1 w-full border border-[#161513] bg-transparent px-3 py-2" />
    </label>
  );
}
