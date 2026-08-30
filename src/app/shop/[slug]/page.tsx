import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { products } from "@/lib/schema";
import { formatNaira, whatsappLink } from "@/lib/constants";
import AddToBag from "@/components/AddToBag";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product;
  try {
    const rows = await getDb().select().from(products).where(eq(products.slug, slug)).limit(1);
    product = rows[0];
  } catch {
    product = undefined;
  }
  if (!product) notFound();
  const images = product.images?.length ? product.images : [];

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="aspect-[3/4] overflow-hidden bg-[#eae3d8]">
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0]} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[#6f6a63]">No photo</div>
          )}
        </div>
      </div>
      <div className="lg:pt-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a6a32]">{product.category}</p>
        <h1 className="serif mt-3 text-4xl sm:text-5xl">{product.name}</h1>
        <p className="mt-4 text-xl">{formatNaira(product.priceNaira)}</p>
        <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-[#6f6a63]">
          {product.description || "Message us on WhatsApp if you need help with size."}
        </p>
        <AddToBag product={product} />
        <a href={whatsappLink()} className="mt-6 inline-block text-sm underline underline-offset-4">Ask about this piece on WhatsApp</a>
      </div>
    </div>
  );
}
