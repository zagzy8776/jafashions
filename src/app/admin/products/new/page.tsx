import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import ProductForm from "@/components/ProductForm";

export default async function NewProductPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="serif text-4xl">New product</h1>
      <p className="mt-2 text-sm text-paper/60">Snap photos from your phone, add price, publish.</p>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
