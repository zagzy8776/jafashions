import { STORE, whatsappLink } from "@/lib/constants";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="serif text-5xl">Contact</h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-[#6f6a63]">Fastest way is WhatsApp. Tap the number and the chat opens.</p>
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <a href={whatsappLink()} className="border border-[#161513] p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#8a6a32]">WhatsApp</p>
          <p className="mt-3 text-lg">{STORE.phoneDisplay}</p>
        </a>
        <a href={`mailto:${STORE.email}`} className="border border-[#161513] p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#8a6a32]">Email</p>
          <p className="mt-3 text-lg break-all">{STORE.email}</p>
        </a>
        <a href={`tel:+${STORE.whatsapp}`} className="border border-[#161513] p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#8a6a32]">Call</p>
          <p className="mt-3 text-lg">{STORE.phoneDisplay}</p>
        </a>
        <div className="border border-[#161513] p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#8a6a32]">Location</p>
          <p className="mt-3 text-lg">{STORE.location}</p>
        </div>
      </div>
    </div>
  );
}
