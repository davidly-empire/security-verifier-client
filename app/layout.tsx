// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NavbarClient from "@/app/components/navbar/NavbarClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Security-Verifier",
  description: "Admin panel for Security-Verifier system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          min-h-screen
          bg-slate-50
          text-slate-900
          antialiased
        `}
      >
        {/* Navbar */}
        <NavbarClient />

        {/* Page Content */}
        <main className="pt-28 min-h-[calc(100vh-7rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}
