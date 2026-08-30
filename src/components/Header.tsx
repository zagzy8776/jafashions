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
    <header className="sticky top-0 z-50 border-b border-[#ddd4c6] bg-[#faf7f2]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo className="h-8 w-8" light={false} />
          <span className="serif text-[22px] leading-none tracking-[0.14em] uppercase">JA fashions</span>
        </Link>
        <nav className="hidden items-center gap-6 text-[13px] tracking-[0.08em] text-[#161513]/80 lg:flex">
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href} className="hover:text-[#8a6a32]">{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={whatsappLink()} className="hidden border border-[#161513] px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] sm:inline-block">WhatsApp</a>
          <Link href="/cart" className="border border-[#161513] px-3 py-1.5 text-[11px] uppercase tracking-[0.14em]">Bag{count > 0 ? ` ${count}` : ""}</Link>
          <button className="lg:hidden border border-[#161513] px-3 py-1.5 text-[11px] uppercase tracking-[0.14em]" onClick={() => setOpen((v) => !v)} aria-label="Menu">{open ? "Close" : "Menu"}</button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[#ddd4c6] bg-[#faf7f2] px-4 py-3 lg:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <Link key={l.href + l.label} href={l.href} onClick={() => setOpen(false)} className="border-b border-[#eee8de] py-3 text-sm">{l.label}</Link>
            ))}
            <a href={whatsappLink()} className="py-3 text-sm">WhatsApp</a>
          </div>
        </div>
      )}
    </header>
  );
}
