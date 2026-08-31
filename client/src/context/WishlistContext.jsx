import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jf_wishlist')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('jf_wishlist', JSON.stringify(items));
  }, [items]);

  const toggleWishlist = (product) => {
    setItems((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) return current.filter((item) => item.id !== product.id);
      return [...current, {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0],
        price: Number(product.salePrice || product.price),
        category: product.category?.name,
      }];
    });
  };

  const isWishlisted = (id) => items.some((item) => item.id === id);
  const clearWishlist = () => setItems([]);
  const count = useMemo(() => items.length, [items]);

  return <WishlistContext.Provider value={{ items, count, toggleWishlist, isWishlisted, clearWishlist }}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
