"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: number;
  name: string;
  priceNaira: number;
  qty: number;
  size?: string;
  color?: string;
  image?: string;
  slug: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  keyOf: (item: Pick<CartItem, "productId" | "size" | "color">) => string;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE = "ja-cart-v1";

export function keyOf(item: Pick<CartItem, "productId" | "size" | "color">) {
  return `${item.productId}::${item.size || ""}::${item.color || ""}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const add: CartContextValue["add"] = (item) => {
      setItems((prev) => {
        const k = keyOf(item);
        const found = prev.find((p) => keyOf(p) === k);
        if (found) {
          return prev.map((p) =>
            keyOf(p) === k ? { ...p, qty: p.qty + (item.qty || 1) } : p
          );
        }
        return [...prev, { ...item, qty: item.qty || 1 }];
      });
    };
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.priceNaira, 0),
      add,
      setQty: (k, qty) =>
        setItems((prev) =>
          prev.map((p) => (keyOf(p) === k ? { ...p, qty } : p)).filter((p) => p.qty > 0)
        ),
      remove: (k) => setItems((prev) => prev.filter((p) => keyOf(p) !== k)),
      clear: () => setItems([]),
      keyOf,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
