import type { Metadata } from "next";
import { Instrument_Serif, Public_Sans } from "next/font/google";
import "./globals.css";

import { getSiteOrigin } from "@/lib/sanity/data";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  description: "VLUU is a photographic still journal cut from light, transit, weather, and quiet city sequences.",
  metadataBase: new URL(getSiteOrigin()),
  title: "VLUU",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-ink)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.02)]">
        {children}
      </body>
    </html>
  );
}
