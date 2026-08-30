import Link from "next/link";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { orders, products } from "@/lib/schema";
import { formatNaira } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/login");
  let productCount = 0;
  let recentOrders: typeof orders.$inferSelect[] = [];
  try {
    const db = getDb();
    productCount = (await db.select().from(products)).length;
    recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(8);
  } catch {}

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Back office</p>
          <h1 className="serif mt-2 text-4xl">Dashboard</h1>
        </div>
        <form action="/api/admin/logout" method="post">
          <button className="text-sm text-paper/50">Log out</button>
        </form>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="border border-white/10 p-5">
          <p className="text-xs text-paper/50">Products</p>
          <p className="mt-2 serif text-3xl">{productCount}</p>
        </div>
        <div className="border border-white/10 p-5">
          <p className="text-xs text-paper/50">Recent orders</p>
          <p className="mt-2 serif text-3xl">{recentOrders.length}</p>
        </div>
        <Link href="/admin/products/new" className="border border-gold/40 bg-gold/10 p-5">
          <p className="text-xs text-gold">Quick action</p>
          <p className="mt-2 text-lg">Post a new piece from your phone</p>
        </Link>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/products" className="rounded-full border border-white/15 px-4 py-2 text-sm">All products</Link>
        <Link href="/admin/products/new" className="rounded-full bg-paper px-4 py-2 text-sm text-ink">Add product</Link>
        <Link href="/admin/orders" className="rounded-full border border-white/15 px-4 py-2 text-sm">Orders</Link>
      </div>
      <h2 className="mt-12 text-xs uppercase tracking-[0.22em] text-gold">Latest orders</h2>
      <ul className="mt-4 divide-y divide-white/10">
        {recentOrders.length === 0 && <li className="py-6 text-sm text-paper/50">No orders yet.</li>}
        {recentOrders.map((o) => (
          <li key={o.id} className="flex items-center justify-between py-4 text-sm">
            <div>
              <p>{o.customerName}</p>
              <p className="text-paper/50">{o.phone}</p>
            </div>
            <p>{formatNaira(o.totalNaira)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
