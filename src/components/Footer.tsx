import Link from "next/link";
import { STORE, whatsappLink } from "@/lib/constants";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#ddd4c6] bg-[#faf7f2]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" light={false} />
            <span className="serif text-xl tracking-[0.14em] uppercase">JA fashions</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#6f6a63]">
            Clothes, shoes and handbags. Order from your phone. We pack and send across Nigeria.
          </p>
        </div>
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#8a6a32]">Shop</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/shop">All products</Link>
            <Link href="/shop?cat=clothes">Clothes</Link>
            <Link href="/shop?cat=shoes">Shoes</Link>
            <Link href="/shop?cat=handbags">Handbags</Link>
          </div>
        </div>
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#8a6a32]">Talk to us</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a href={`mailto:${STORE.email}`}>{STORE.email}</a>
            <a href={`tel:+${STORE.whatsapp}`}>{STORE.phoneDisplay}</a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp</a>
            <p>{STORE.location}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-[#ddd4c6] py-5 text-center text-[11px] tracking-[0.16em] uppercase text-[#6f6a63]">
        © {new Date().getFullYear()} JA fashions
      </div>
    </footer>
  );
}
