export const STORE = {
  name: "JA fashions",
  tagline: "Clothes. Shoes. Handbags.",
  email: process.env.NEXT_PUBLIC_EMAIL || "ahmedshitu737@gmail.com",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE || "+234 811 000 6486",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "2348110006486",
  location: process.env.NEXT_PUBLIC_LOCATION || "Nigeria",
};

export const CATEGORIES = [
  { slug: "clothes", label: "Clothes", blurb: "Ready-to-wear looks for every moment" },
  { slug: "shoes", label: "Shoes", blurb: "Sneakers, heels and everyday pairs" },
  { slug: "handbags", label: "Handbags", blurb: "Bags that finish the outfit" },
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
