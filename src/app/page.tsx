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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(198,161,91,0.16),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_35%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Nigeria · Online store</p>
            <h1 className="serif mt-5 text-5xl leading-[1.05] sm:text-7xl">
              JA
              <span className="block italic text-gold-soft">fashions</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-paper/70">
              Clothes, shoes and handbags — selected looks you can order from
              your phone. Tap shop, add to bag, finish on WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink hover:bg-gold-soft">
                Shop the store
              </Link>
              <a
                href={whatsappLink("Hi JA fashions, I want to see available pieces.")}
                className="rounded-full border border-white/20 px-6 py-3 text-sm hover:border-gold hover:text-gold"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="relative mx-auto flex h-[420px] w-full max-w-md items-center justify-center border border-white/10 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="JA fashions" className="h-[88%] w-auto" />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10">
        <div className="mx-auto grid max-w-7xl sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?cat=${c.slug}`}
              className="border-white/10 px-6 py-10 transition hover:bg-white/5 sm:border-r last:border-r-0"
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Category</p>
              <h2 className="serif mt-3 text-3xl">{c.label}</h2>
              <p className="mt-3 text-sm text-paper/60">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Featured</p>
            <h2 className="serif mt-2 text-4xl">New in the bag</h2>
          </div>
          <Link href="/shop" className="text-sm text-paper/70 hover:text-gold">View all</Link>
        </div>
        {items.length === 0 ? (
          <p className="mt-10 max-w-xl text-sm leading-7 text-paper/60">
            The catalog is ready. Open the admin on your phone, snap product photos, and they will appear here instantly.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-bg-soft">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center">
          <div>
            <h2 className="serif text-3xl">Need a size or a custom order?</h2>
            <p className="mt-3 text-sm text-paper/65">
              Message {STORE.name} on WhatsApp · {STORE.phoneDisplay} · {STORE.location}
            </p>
          </div>
          <a
            href={whatsappLink("Hi JA fashions, I have a question about an item.")}
            className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink"
          >
            Message us
          </a>
        </div>
      </section>
    </div>
  );
}
