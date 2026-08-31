import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jf_cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('jf_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    if (product.stock <= 0) return;
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      const unitPrice = Number(product.salePrice || product.price);
      const nextQuantity = Math.min(Number(product.stock || 1), Number(quantity || 1));
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: Math.min(item.stock || product.stock || 99, item.quantity + nextQuantity) } : item);
      }
      return [...current, {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0],
        price: unitPrice,
        quantity: nextQuantity,
        stock: Number(product.stock || 0),
      }];
    });
  };

  const removeFromCart = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id);
    setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.min(item.stock || 99, quantity) } : item));
  };

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, subtotal, count, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
