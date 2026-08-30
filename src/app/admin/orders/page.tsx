import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/schema";
import { formatNaira } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  if (!(await isAdmin())) redirect("/admin/login");
  let rows: typeof orders.$inferSelect[] = [];
  try {
    rows = await getDb().select().from(orders).orderBy(desc(orders.createdAt));
  } catch {
    rows = [];
  }
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="serif text-4xl">Orders</h1>
      <div className="mt-8 space-y-4">
        {rows.length === 0 && <p className="text-sm text-paper/50">No orders yet.</p>}
        {rows.map((o) => (
          <article key={o.id} className="border border-white/10 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{o.customerName}</p>
                <p className="text-sm text-paper/60">{o.phone}</p>
                <p className="text-sm text-paper/60">{[o.address, o.city, o.state].filter(Boolean).join(", ")}</p>
              </div>
              <div className="text-right">
                <p>{formatNaira(o.totalNaira)}</p>
                <p className="text-xs uppercase tracking-widest text-gold">{o.status}</p>
              </div>
            </div>
            <ul className="mt-3 text-sm text-paper/70">
              {o.items.map((i, idx) => (
                <li key={idx}>{i.name} × {i.qty} {i.size ? `(${i.size})` : ""}</li>
              ))}
            </ul>
            {o.notes && <p className="mt-2 text-sm text-paper/50">{o.notes}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
