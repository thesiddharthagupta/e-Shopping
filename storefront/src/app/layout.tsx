import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  title: "Luxe | Modern Clothing E-Commerce",
  description: "Discover the latest trends in fashion. Shop modern, high-quality clothing for every occasion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full light`} style={{ colorScheme: "light" }}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>
          <Navbar />
          <main className="flex-grow content-bg pt-[var(--navbar-height)]">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
