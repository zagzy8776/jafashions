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
    const featured = await db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .orderBy(desc(products.createdAt))
      .limit(8);
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
      <section className="relative min-h-[78vh] overflow-hidden bg-[#161513] text-[#faf7f2]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#e8d7b0]">{STORE.location}</p>
          <h1 className="serif mt-3 max-w-xl text-5xl leading-[0.95] sm:text-7xl">
            Clothes, shoes<br />and bags.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
            Browse the pieces. Add what you want. Chat us on WhatsApp to close the order.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-dark bg-[#faf7f2] !text-[#161513]">Shop now</Link>
            <a href={whatsappLink()} className="btn-line !border-white !text-white">Chat on WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="serif text-4xl">Shop by type</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/shop?cat=${c.slug}`} className="group relative block overflow-hidden">
              <div className="aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.label} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <h3 className="serif text-3xl">{c.label}</h3>
                <p className="mt-1 text-xs text-white/75">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="serif text-4xl">In store now</h2>
          <Link href="/shop" className="text-sm underline underline-offset-4">See all</Link>
        </div>
        {items.length === 0 ? (
          <p className="mt-10 text-sm text-[#6f6a63]">New pieces land here first.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-[#ddd4c6] bg-[#faf7f2]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center">
          <div>
            <h2 className="serif text-3xl">Need a size or something you don&apos;t see?</h2>
            <p className="mt-2 text-sm text-[#6f6a63]">WhatsApp {STORE.phoneDisplay}</p>
          </div>
          <a href={whatsappLink()} className="btn-dark">Open WhatsApp</a>
        </div>
      </section>
    </div>
  );
}
