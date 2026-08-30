import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { products } from "@/lib/schema";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const rows = await getDb().select().from(products).where(eq(products.id, Number(id))).limit(1);
  const product = rows[0];
  if (!product) notFound();
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="serif text-4xl">Edit product</h1>
      <div className="mt-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
