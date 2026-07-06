import type { Metadata } from "next";
import { Geist, Geist_Mono, VT323 } from "next/font/google";
import "./globals.css";
import "../styles/retro.css";
import RetroNavbar from "@/components/RetroNavbar";
import RetroFooter from "@/components/RetroFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kampung Siber Retro Workspace",
  description: "Enterprise-grade modular retro workspace platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black font-sans">
        <RetroNavbar />
        <main className="flex-1">
          {children}
        </main>
        <RetroFooter />
      </body>
    </html>
  );
}
