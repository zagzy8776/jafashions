import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { products } from "@/lib/schema";
import { formatNaira } from "@/lib/constants";
import AddToBag from "@/components/AddToBag";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="aspect-[3/4] overflow-hidden bg-bg-soft">
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0]} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-paper/30">No photo</div>
          )}
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1).map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" className="aspect-square object-cover bg-bg-soft" />
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">{product.category}</p>
        <h1 className="serif mt-3 text-4xl">{product.name}</h1>
        <p className="mt-4 text-xl">{formatNaira(product.priceNaira)}</p>
        {product.compareAtNaira ? (
          <p className="text-sm text-paper/40 line-through">{formatNaira(product.compareAtNaira)}</p>
        ) : null}
        <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-paper/70">
          {product.description || "A JA fashions piece. Message us if you need help with size."}
        </p>
        <AddToBag product={product} />
      </div>
    </div>
  );
}
