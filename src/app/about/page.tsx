export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">The house</p>
      <h1 className="serif mt-3 text-5xl">About JA fashions</h1>
      <div className="mt-8 space-y-5 text-sm leading-7 text-paper/75">
        <p>
          JA fashions is an online store for clothes, shoes and handbags —
          built for customers across Nigeria who want to browse on their phone
          and close the order on WhatsApp.
        </p>
        <p>
          Every piece on the site is posted by the store admin, with real
          photos you can shoot from a phone. What you see is what is in stock.
        </p>
        <p>
          Questions on size, color or delivery? Send a message. We answer
          quickly and pack with care.
        </p>
      </div>
    </div>
  );
}
