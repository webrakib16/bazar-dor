"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Logo from "@/assets/logo-icon.png"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const date = new Date().toLocaleDateString("bn-BD",{
    dateStyle: 'full'
  })

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-19 items-center justify-between gap-4">
          
          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-2xl">
              <Image src={Logo} alt="বাজার দর" className="h-8 w-8 object-contain" />
            </div>

            <div>
              <h1 className="text-lg font-bold leading-tight text-gray-900">
                বাজার দর
              </h1>

              <p className="mt-1 text-xs text-gray-500">
               {date}
              </p>
            </div>
          </Link>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/signin"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-green-600 hover:text-green-600"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
            >
              সাইন আপ
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-xl text-gray-700 sm:hidden"
            aria-label="Menu"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-100 py-4 sm:hidden">
            <div className="flex flex-col gap-2">
              <Link
                href="/signin"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg bg-green-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-green-700"
              >
                সাইন আপ
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}