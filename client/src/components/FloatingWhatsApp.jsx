import { MessageCircle } from 'lucide-react';
import { businessInfo, waMessages, whatsappHref } from '../lib/api.js';

export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappHref(waMessages.floating)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-2xl shadow-green-900/30 transition hover:-translate-y-1 hover:bg-green-700"
      aria-label={`Chat with ${businessInfo.brand} on WhatsApp`}
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
