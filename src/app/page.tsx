import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { products } from "@/lib/schema";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, STORE, whatsappLink } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function featuredProducts() {
  try {
    const db = getDb();
    const featured = await db.select().from(products).where(eq(products.featured, true)).orderBy(desc(products.createdAt)).limit(8);
    if (featured.length) return featured;
    return await db.select().from(products).orderBy(desc(products.createdAt)).limit(8);
  } catch {
    return [];
  }
}

export default async function Home() {
  const items = await featuredProducts();
  return (
    <div>
      <section className="relative h-[86vh] min-h-[560px] overflow-hidden bg-[#1a1714]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2200&q=80" alt="" className="absolute inset-0 h-full w-full object-cover object-[center_20%]" />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative flex h-full flex-col justify-end px-5 pb-12 sm:px-10">
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/80">JA fashions · Nigeria</p>
          <h1 className="serif mt-3 max-w-lg text-[52px] leading-[0.92] text-white sm:text-[72px]">The new drop</h1>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="shop-btn">Shop now</Link>
            <a href={whatsappLink()} className="ghost-btn">WhatsApp</a>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1120px] px-5 py-16">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-5">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/shop?cat=${c.slug}`} className="group block">
              <div className="aspect-[3/4] overflow-hidden bg-[#ece7df]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.label} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
              </div>
              <p className="mt-3 text-[12px] uppercase tracking-[0.18em]">{c.label}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1120px] px-5 pb-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="serif text-4xl">Just in</h2>
          <Link href="/shop" className="text-[12px] uppercase tracking-[0.16em]">All pieces</Link>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-[#6b6560]">Pieces will show here once they are posted.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
      <section className="border-t border-[#e4ddd3] px-5 py-16 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#6b6560]">Order on WhatsApp</p>
        <h2 className="serif mx-auto mt-3 max-w-md text-4xl leading-tight">Seen something you like?</h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#6b6560]">{STORE.phoneDisplay}</p>
        <a href={whatsappLink()} className="ink-btn mt-7">Message the store</a>
      </section>
    </div>
  );
}
