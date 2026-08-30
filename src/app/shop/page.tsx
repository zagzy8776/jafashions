import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { products, type Product } from "@/lib/schema";
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
  const title = CATEGORIES.find((c) => c.slug === active)?.label || "Shop";

  let items: Product[] = [];
  try {
    const db = getDb();
    items = active
      ? await db.select().from(products).where(eq(products.category, active)).orderBy(desc(products.createdAt))
      : await db.select().from(products).orderBy(desc(products.createdAt));
  } catch {
    items = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="serif text-5xl">{title}</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/shop" className={`border px-4 py-1.5 text-sm ${!active ? "border-[#161513] bg-[#161513] text-[#faf7f2]" : "border-[#161513]"}`}>All</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/shop?cat=${c.slug}`} className={`border px-4 py-1.5 text-sm ${active === c.slug ? "border-[#161513] bg-[#161513] text-[#faf7f2]" : "border-[#161513]"}`}>{c.label}</Link>
        ))}
      </div>
      {items.length === 0 ? (
        <p className="mt-16 text-sm text-[#6f6a63]">Nothing in this section yet.</p>
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
