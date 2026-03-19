import type { Metadata } from "next";
import { Libre_Bodoni, Public_Sans } from "next/font/google";
import "./globals.css";

import { getSiteOrigin } from "@/lib/sanity/data";

const bodoni = Libre_Bodoni({
  subsets: ["latin"],
  variable: "--font-libre-bodoni",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  description: "A curated personal photography gallery with collection-led storytelling.",
  metadataBase: new URL(getSiteOrigin()),
  title: "Sung Gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
