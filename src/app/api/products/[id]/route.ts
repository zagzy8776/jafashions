import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { products } from "@/lib/schema";
import { isAdmin } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const updated = await getDb().update(products).set({
    name: String(body.name || "").trim(),
    description: String(body.description || ""),
    priceNaira: Number(body.priceNaira),
    compareAtNaira: body.compareAtNaira ? Number(body.compareAtNaira) : null,
    category: String(body.category || "clothes"),
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
    colors: Array.isArray(body.colors) ? body.colors : [],
    images: Array.isArray(body.images) ? body.images : [],
    featured: Boolean(body.featured),
    inStock: body.inStock !== false,
    updatedAt: new Date(),
  }).where(eq(products.id, Number(id))).returning();
  return NextResponse.json(updated[0] || { ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await getDb().delete(products).where(eq(products.id, Number(id)));
  return NextResponse.json({ ok: true });
}
