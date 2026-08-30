"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/schema";
import { CATEGORIES } from "@/lib/constants";

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setImages((prev) => [...prev, data.url]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      description: String(form.get("description") || ""),
      priceNaira: Number(form.get("priceNaira") || 0),
      compareAtNaira: form.get("compareAtNaira") ? Number(form.get("compareAtNaira")) : null,
      category: String(form.get("category") || "clothes"),
      sizes: String(form.get("sizes") || "").split(",").map((s) => s.trim()).filter(Boolean),
      colors: String(form.get("colors") || "").split(",").map((s) => s.trim()).filter(Boolean),
      images,
      featured: form.get("featured") === "on",
      inStock: form.get("inStock") === "on",
    };
    const url = product ? `/api/products/${product.id}` : "/api/products";
    const res = await fetch(url, {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save");
      setBusy(false);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  async function onDelete() {
    if (!product) return;
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block text-sm">Name
        <input name="name" defaultValue={product?.name} required className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" />
      </label>
      <label className="block text-sm">Description
        <textarea name="description" defaultValue={product?.description || ""} rows={4} className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">Price (₦)
          <input name="priceNaira" type="number" min={0} defaultValue={product?.priceNaira || ""} required className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" />
        </label>
        <label className="block text-sm">Compare at (₦)
          <input name="compareAtNaira" type="number" min={0} defaultValue={product?.compareAtNaira || ""} className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" />
        </label>
      </div>
      <label className="block text-sm">Category
        <select name="category" defaultValue={product?.category || "clothes"} className="mt-1 w-full rounded-lg border border-white/15 bg-bg px-3 py-2">
          {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
      </label>
      <label className="block text-sm">Sizes (comma separated)
        <input name="sizes" defaultValue={product?.sizes?.join(", ") || ""} placeholder="S, M, L, XL" className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" />
      </label>
      <label className="block text-sm">Colors (comma separated)
        <input name="colors" defaultValue={product?.colors?.join(", ") || ""} placeholder="Black, Cream" className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" />
      </label>
      <div>
        <p className="text-sm">Photos</p>
        <p className="mt-1 text-xs text-paper/50">Take a picture or pick from your gallery. Works on phone.</p>
        <input type="file" accept="image/*" capture="environment" multiple onChange={(e) => onFiles(e.target.files)} className="mt-3 w-full text-sm" />
        <input
          type="url"
          placeholder="Or paste an image URL and press Enter"
          className="mt-3 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const value = e.currentTarget.value.trim();
              if (value) {
                setImages((prev) => [...prev, value]);
                e.currentTarget.value = "";
              }
            }
          }}
        />
        {uploading && <p className="mt-2 text-xs text-gold">Uploading…</p>}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {images.map((src) => (
            <div key={src} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="aspect-square w-full object-cover" />
              <button type="button" onClick={() => setImages((prev) => prev.filter((i) => i !== src))} className="absolute right-1 top-1 bg-black/70 px-2 text-xs">×</button>
            </div>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={product?.featured} /> Featured on homepage
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} /> In stock
      </label>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="flex gap-3">
        <button disabled={busy} className="rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink">{busy ? "Saving…" : "Save product"}</button>
        {product && <button type="button" onClick={onDelete} className="rounded-full border border-white/20 px-6 py-3 text-sm">Delete</button>}
      </div>
    </form>
  );
}
