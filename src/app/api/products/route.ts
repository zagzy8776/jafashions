import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { products } from "@/lib/schema";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await getDb().select().from(products).orderBy(desc(products.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name || !body.priceNaira) {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }
  const slugBase = slugify(name) || `piece-${Date.now()}`;
  const slug = `${slugBase}-${Math.random().toString(36).slice(2, 6)}`;
  const inserted = await getDb().insert(products).values({
    name,
    slug,
    description: String(body.description || ""),
    priceNaira: Number(body.priceNaira),
    compareAtNaira: body.compareAtNaira ? Number(body.compareAtNaira) : null,
    category: String(body.category || "clothes"),
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
    colors: Array.isArray(body.colors) ? body.colors : [],
    images: Array.isArray(body.images) ? body.images : [],
    featured: Boolean(body.featured),
    inStock: body.inStock !== false,
  }).returning();
  return NextResponse.json(inserted[0]);
}
