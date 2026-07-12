// Start: Root Layout mounting Global Retro Navigation + Footer (Next.js 15 App Router)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/retro.css";
import RetroNavbar from "@/components/RetroNavbar";
import RetroFooter from "@/components/RetroFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kampung Siber Retro",
  description: "Platform komuniti retro dengan Cloudflare R2 storage integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Start: Application Shell with Mounted Navbar + Footer */}
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <RetroNavbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <RetroFooter />
      </body>
      {/* End: Application Shell with Mounted Navbar + Footer */}
    </html>
  );
}
// End: Root Layout mounting Global Retro Navigation + Footer