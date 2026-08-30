import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="serif text-5xl">Not found</h1>
      <p className="mt-4 text-sm text-[#6f6a63]">That page is not on the site.</p>
      <Link href="/shop" className="btn-dark mt-8">Back to shop</Link>
    </div>
  );
}
