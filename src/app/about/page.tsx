import { STORE, whatsappLink } from "@/lib/constants";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="serif text-5xl">About JA fashions</h1>
      <div className="mt-8 space-y-5 text-sm leading-7 text-[#6f6a63]">
        <p>JA fashions sells clothes, shoes and handbags online. You browse on the site, then finish on WhatsApp.</p>
        <p>Photos on the store are the real pieces. If a size or colour is not listed, send a message — we will tell you what is available.</p>
        <p>We send orders across {STORE.location}.</p>
      </div>
      <a href={whatsappLink()} className="btn-dark mt-10">WhatsApp us</a>
    </div>
  );
}
