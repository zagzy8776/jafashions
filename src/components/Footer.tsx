import Link from "next/link";
import { STORE, whatsappLink } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-[#e4ddd3] px-5 py-12">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-10 sm:flex-row sm:justify-between">
        <div>
          <p className="serif text-xl tracking-[0.16em] uppercase">JA fashions</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-[#6b6560]">Clothes, shoes and handbags. Nigeria.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a href={whatsappLink()}>WhatsApp {STORE.phoneDisplay}</a>
          <a href={`mailto:${STORE.email}`}>{STORE.email}</a>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-[1120px] text-[11px] tracking-[0.14em] uppercase text-[#6b6560]">© {new Date().getFullYear()} JA fashions</p>
    </footer>
  );
}
