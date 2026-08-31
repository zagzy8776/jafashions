import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatNaira } from '../../lib/api.js';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/orders').then((res) => setOrders(res.data.orders || [])).catch(() => setOrders([])); }, []);
  return (
    <main className="p-6 lg:p-10">
      <h1 className="font-display text-4xl font-semibold">Orders</h1>
      <div className="mt-8 grid gap-3">
        {orders.map((order) => <Link key={order.id} to={`/admin/orders/${order.id}`} className="rounded-2xl bg-white p-4 shadow-sm"><strong>{order.orderNumber}</strong> · {order.customerName} · {formatNaira(order.total)}</Link>)}
        {!orders.length && <p className="rounded-[2rem] bg-white p-8 text-stone-500">No orders yet.</p>}
      </div>
    </main>
  );
}
