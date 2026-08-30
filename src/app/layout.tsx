import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppDock from "@/components/WhatsAppDock";
import { CartProvider } from "@/components/CartProvider";

const dm = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "JA fashions",
    template: "%s · JA fashions",
  },
  description:
    "Clothes, shoes and handbags from JA fashions. Shop online in Nigeria and order on WhatsApp.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dm.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-bg text-ink antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppDock />
        </CartProvider>
      </body>
    </html>
  );
}
