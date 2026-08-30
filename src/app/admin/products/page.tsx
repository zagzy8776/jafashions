import Link from "next/link";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { products } from "@/lib/schema";
import { formatNaira } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  if (!(await isAdmin())) redirect("/admin/login");
  let rows: typeof products.$inferSelect[] = [];
  try {
    rows = await getDb().select().from(products).orderBy(desc(products.createdAt));
  } catch {
    rows = [];
  }
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="serif text-4xl">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-paper px-4 py-2 text-sm text-ink">Add</Link>
      </div>
      <ul className="mt-8 divide-y divide-white/10">
        {rows.length === 0 && <li className="py-8 text-sm text-paper/50">No products yet.</li>}
        {rows.map((p) => (
          <li key={p.id} className="flex items-center gap-4 py-4">
            <div className="h-16 w-14 overflow-hidden bg-bg-soft">
              {p.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1">
              <p>{p.name}</p>
              <p className="text-xs text-paper/50">{p.category} · {formatNaira(p.priceNaira)}</p>
            </div>
            <Link href={`/admin/products/${p.id}`} className="text-sm text-gold">Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
