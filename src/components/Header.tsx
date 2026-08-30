"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import { useCart } from "./CartProvider";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?cat=clothes", label: "Clothes" },
  { href: "/shop?cat=shoes", label: "Shoes" },
  { href: "/shop?cat=handbags", label: "Handbags" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo className="h-9 w-9" />
          <span className="serif text-lg tracking-[0.18em] uppercase">JA fashions</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm tracking-wide text-paper/80 lg:flex">
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href} className="hover:text-gold">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative rounded-full border border-white/15 px-3 py-1.5 text-sm hover:border-gold hover:text-gold"
          >
            Bag {count > 0 ? `(${count})` : ""}
          </Link>
          <button
            className="lg:hidden rounded-full border border-white/15 px-3 py-1.5 text-sm"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-bg px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-base">
            {links.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-2"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
