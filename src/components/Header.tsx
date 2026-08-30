"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import { useCart } from "./CartProvider";
import { whatsappLink } from "@/lib/constants";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?cat=clothes", label: "Clothes" },
  { href: "/shop?cat=shoes", label: "Shoes" },
  { href: "/shop?cat=handbags", label: "Bags" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-[#f7f4ef]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Logo className="h-7 w-7" light={false} />
          <span className="serif text-[19px] tracking-[0.18em] uppercase">JA fashions</span>
        </Link>
        <nav className="hidden gap-7 text-[12px] tracking-[0.14em] uppercase text-[#111]/80 lg:flex">
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href} className="hover:opacity-60">{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-5 text-[12px] tracking-[0.14em] uppercase">
          <Link href="/cart">Bag{count ? ` ${count}` : ""}</Link>
          <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">{open ? "Close" : "Menu"}</button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[#e4ddd3] px-5 pb-6 pt-2 lg:hidden">
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-[15px]">{l.label}</Link>
          ))}
          <a href={whatsappLink()} className="block py-3 text-[15px]">WhatsApp</a>
        </div>
      )}
    </header>
  );
}
