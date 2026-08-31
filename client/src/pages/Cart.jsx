import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { formatNaira } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-semibold">Your Cart</h1>
      {!items.length ? (
        <div className="mt-10 rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <p className="text-stone-600">Your cart is empty.</p>
          <Link to="/shop" className="mt-5 inline-block rounded-full bg-stone-950 px-7 py-3 font-semibold text-white">Start shopping</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-[2rem] bg-white p-4 shadow-sm">
                <img src={item.image} alt={item.name} className="h-28 w-24 rounded-2xl bg-amber-50 object-contain p-1" />
                <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-semibold">{item.name}</h2>
                    <p className="text-stone-600">{formatNaira(item.price)}</p>
                  </div>
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} className="w-20 rounded-full border px-4 py-2" />
                  <strong>{formatNaira(item.price * item.quantity)}</strong>
                  <button onClick={() => removeFromCart(item.id)} className="rounded-full bg-red-50 p-3 text-red-600"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-[2rem] bg-stone-950 p-6 text-white">
            <h2 className="font-display text-2xl">Order Summary</h2>
            <div className="mt-6 flex justify-between border-b border-white/10 pb-4"><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div>
            <Link to="/checkout" className="mt-6 block rounded-full bg-amber-500 px-6 py-4 text-center font-semibold text-stone-950">Proceed to Checkout</Link>
            <Link to="/shop" className="mt-3 block rounded-full border border-white/15 px-6 py-4 text-center font-semibold">Continue Shopping</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
