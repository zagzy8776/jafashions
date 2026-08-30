function cleanEmail(value: string) {
  return value.replace(/^mailto:/i, "").trim();
}

function cleanPhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export const STORE = {
  name: "JA fashions",
  tagline: "Clothes. Shoes. Handbags.",
  email: cleanEmail(process.env.NEXT_PUBLIC_EMAIL || "ahmedshitu737@gmail.com"),
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE || "+234 811 000 6486",
  whatsapp: cleanPhone(process.env.NEXT_PUBLIC_WHATSAPP || "2348110006486").replace(/^\+/, ""),
  location: process.env.NEXT_PUBLIC_LOCATION || "Nigeria",
};

export const CATEGORIES = [
  {
    slug: "clothes",
    label: "Clothes",
    blurb: "Dresses, jackets and everyday wear",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "shoes",
    label: "Shoes",
    blurb: "Sneakers, heels and sandals",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "handbags",
    label: "Handbags",
    blurb: "Mini bags and totes",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${STORE.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
