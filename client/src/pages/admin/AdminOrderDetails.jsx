import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, formatNaira } from '../../lib/api.js';

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { api.get(`/orders/${id}`).then((res) => setOrder(res.data.order)).catch(() => setOrder(null)); }, [id]);
  if (!order) return <main className="p-10">Loading order...</main>;
  return (
    <main className="p-6 lg:p-10">
      <h1 className="font-display text-4xl">{order.orderNumber}</h1>
      <p className="mt-3">{order.customerName} · {order.customerPhone}</p>
      <p className="mt-2 font-semibold">{formatNaira(order.total)}</p>
    </main>
  );
}
