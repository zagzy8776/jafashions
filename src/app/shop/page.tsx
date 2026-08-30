import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { products } from "@/lib/schema";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const active = CATEGORIES.find((c) => c.slug === cat)?.slug;

  let items = [] as Awaited<ReturnType<typeof getRows>>;
  async function getRows() {
    const db = getDb();
    if (active) {
      return db.select().from(products).where(eq(products.category, active)).orderBy(desc(products.createdAt));
    }
    return db.select().from(products).orderBy(desc(products.createdAt));
  }
  try {
    items = await getRows();
  } catch {
    items = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Catalog</p>
      <h1 className="serif mt-2 text-4xl sm:text-5xl">Shop</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/shop" className={`rounded-full border px-4 py-1.5 text-sm ${!active ? "border-gold text-gold" : "border-white/15 text-paper/70"}`}>
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/shop?cat=${c.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              active === c.slug ? "border-gold text-gold" : "border-white/15 text-paper/70"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>
      {items.length === 0 ? (
        <p className="mt-16 text-sm text-paper/60">No pieces in this category yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
