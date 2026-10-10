import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "./components/ToastProvider";

import Navbar from "@/app/components/Navbar";
import CategoryNav from "@/app/components/CategoryNav";
import Marquee from "@/app/components/Marquee";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="bn"
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
    >
      <body className="min-h-screen">
        <div className="sticky top-0 z-50 w-full bg-white shadow-sm">
          <Navbar />
          <CategoryNav />
          <Marquee />
        </div>

        <main className="mx-auto w-full max-w-7xl">{children}</main>
        <ToastProvider />
      </body>
    </html>
  );
}