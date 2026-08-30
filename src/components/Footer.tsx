import Link from "next/link";
import { STORE, whatsappLink } from "@/lib/constants";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-bg-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <span className="serif text-xl tracking-[0.18em] uppercase">JA fashions</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-paper/65">
            An online store for clothes, shoes and handbags. Styled in Nigeria,
            shipped nationwide. Shop the drop, then finish checkout on WhatsApp.
          </p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-[0.22em] text-gold">Shop</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-paper/75">
            <Link href="/shop">All products</Link>
            <Link href="/shop?cat=clothes">Clothes</Link>
            <Link href="/shop?cat=shoes">Shoes</Link>
            <Link href="/shop?cat=handbags">Handbags</Link>
          </div>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-[0.22em] text-gold">Talk to us</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-paper/75">
            <a href={`mailto:${STORE.email}`}>{STORE.email}</a>
            <a href={`tel:${STORE.whatsapp}`}>{STORE.phoneDisplay}</a>
            <a href={whatsappLink("Hi JA fashions, I want to shop.")}>WhatsApp us</a>
            <p>{STORE.location}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs tracking-widest text-paper/40">
        © {new Date().getFullYear()} JA fashions · All rights reserved
      </div>
    </footer>
  );
}
