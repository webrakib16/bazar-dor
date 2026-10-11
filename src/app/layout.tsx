import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Noto_Serif_Bengali } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import Navbar from "@/app/components/Navbar";
import CategoryNav from "@/app/components/CategoryNav";
import Marquee from "@/app/components/Marquee";
import Footer from "./components/Footer";

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["latin", "bengali"],
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
      className={`${notoSerifBengali.className} min-h-full antialiased`}
    >
      <body className="min-h-screen bg-[#FAFCFA]">
        <div className="sticky top-0 z-50 w-full bg-white shadow-sm">
          <Navbar />
          <CategoryNav />
          <Marquee />
        </div>

        <main className="mx-auto w-full max-w-7xl">
          {children}
        </main>

        <Footer />

        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#ffffff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}