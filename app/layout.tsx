import type { Metadata } from "next";
import { Bebas_Neue, Space_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "DJ FIDDEN — Underground · Club Culture",
  description:
    "DJ FIDDEN — Booking, Auftritte, Sounds. Underground Club Culture aus Mecklenburg-Vorpommern.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${bebasNeue.variable} ${spaceMono.variable}`}>
      <body>
        <Cursor />
        <Nav />
        {children}
      </body>
    </html>
  );
}
