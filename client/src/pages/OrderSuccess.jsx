import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { api, bankDetails, formatNaira, whatsappNumber } from '../lib/api.js';
import ReviewCTA from '../components/ReviewCTA.jsx';

export default function OrderSuccess() {
  const { state } = useLocation();
  const [order, setOrder] = useState(state?.order);
  const [message, setMessage] = useState('');
  const reportPayment = async () => {
    if (!order?.id) return;
    const res = await api.put(`/orders/${order.id}/payment-reported`);
    setOrder(res.data.order);
    setMessage('Payment report received. Admin will confirm and mark your order as paid.');
  };
  const proofText = encodeURIComponent(`Hello JA fashions, I have paid for order ${order?.orderNumber}. Amount: ${formatNaira(order?.total)}. Please confirm payment.`);
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <CheckCircle2 className="mx-auto text-green-600" size={70} />
      <h1 className="mt-6 font-display text-5xl font-semibold">Order Sent</h1>
      <p className="mt-4 text-stone-600">Your order has been saved and a WhatsApp message is ready for JA fashions.</p>
      {order && <div className="mt-6 rounded-[2rem] bg-white p-6 text-left shadow-sm">
        <p>Order <strong>{order.orderNumber}</strong></p>
        <div className="mt-4 grid gap-2 text-sm text-stone-600">
          <div className="flex justify-between"><span>Subtotal</span><strong>{formatNaira(order.subtotal)}</strong></div>
          <div className="flex justify-between"><span>Discount</span><strong>{formatNaira((order.discount || 0) + (order.manualDiscount || 0))}</strong></div>
          <div className="flex justify-between"><span>Delivery</span><strong>{formatNaira(order.deliveryFee || 0)}</strong></div>
          <div className="flex justify-between text-lg text-stone-950"><span>Total</span><strong>{formatNaira(order.total)}</strong></div>
          <div className="flex justify-between"><span>Payment status</span><strong>{order.paymentStatus?.replaceAll('_', ' ') || 'UNPAID'}</strong></div>
        </div>
        {order.paymentMethod === 'BANK_TRANSFER' && <div className="mt-5 rounded-2xl bg-amber-50 p-4">
          <h2 className="font-display text-2xl font-semibold">Pay to JA fashions</h2>
          <p className="mt-2 text-sm">Bank: <strong>{order.bankName || bankDetails.bankName}</strong></p>
          <p className="text-sm">Account Number: <strong>{order.accountNumber || bankDetails.accountNumber}</strong></p>
          <p className="text-sm">Account Name: <strong>{order.accountName || bankDetails.accountName}</strong></p>
          <p className="mt-2 text-sm">Amount: <strong>{formatNaira(order.total)}</strong></p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={reportPayment} disabled={order.paymentStatus === 'PAID' || order.paymentStatus === 'PAYMENT_REPORTED'} className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">I have paid</button>
            <a href={`https://wa.me/${whatsappNumber}?text=${proofText}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white"><MessageCircle size={16} /> Send proof</a>
          </div>
          {message && <p className="mt-3 text-sm font-semibold text-green-700">{message}</p>}
        </div>}
      </div>}
      <Link to="/shop" className="mt-8 inline-block rounded-full bg-stone-950 px-7 py-4 font-semibold text-white">Continue Shopping</Link>
      <div className="mt-10 text-left"><ReviewCTA compact /></div>
    </main>
  );
}
