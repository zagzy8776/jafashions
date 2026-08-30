import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="serif text-5xl">Not found</h1>
      <p className="mt-4 text-sm text-paper/60">That piece is not on the rack.</p>
      <Link href="/shop" className="mt-8 inline-block text-gold">
        Back to shop
      </Link>
    </div>
  );
}
