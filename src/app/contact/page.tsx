import { STORE, whatsappLink } from "@/lib/constants";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Reach us</p>
      <h1 className="serif mt-3 text-5xl">Contact</h1>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a href={whatsappLink("Hi JA fashions, I want to shop.")} className="border border-white/10 p-6 hover:border-gold">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">WhatsApp</p>
          <p className="mt-3 text-lg">{STORE.phoneDisplay}</p>
        </a>
        <a href={`mailto:${STORE.email}`} className="border border-white/10 p-6 hover:border-gold">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Email</p>
          <p className="mt-3 text-lg break-all">{STORE.email}</p>
        </a>
        <div className="border border-white/10 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Location</p>
          <p className="mt-3 text-lg">{STORE.location}</p>
        </div>
        <div className="border border-white/10 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Hours</p>
          <p className="mt-3 text-lg">Everyday · reply on WhatsApp</p>
        </div>
      </div>
    </div>
  );
}
