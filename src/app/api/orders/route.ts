import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/schema";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await getDb().select().from(orders).orderBy(desc(orders.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const customerName = String(body.customerName || "").trim();
  const phone = String(body.phone || "").trim();
  const items = Array.isArray(body.items) ? body.items : [];
  if (!customerName || !phone || !items.length) {
    return NextResponse.json({ error: "Name, phone and bag items are required" }, { status: 400 });
  }
  const totalNaira =
    Number(body.totalNaira) ||
    items.reduce((n: number, i: { priceNaira?: number; qty?: number }) => n + Number(i.priceNaira || 0) * Number(i.qty || 1), 0);
  const inserted = await getDb().insert(orders).values({
    customerName,
    phone,
    email: String(body.email || ""),
    address: String(body.address || ""),
    city: String(body.city || ""),
    state: String(body.state || ""),
    notes: String(body.notes || ""),
    items,
    totalNaira,
    status: "pending",
  }).returning();
  return NextResponse.json(inserted[0]);
}
