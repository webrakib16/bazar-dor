"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/assets/logo-icon.png";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      await authClient.signOut();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      router.replace("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-19 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600">
              <Image
                src={Logo}
                alt="বাজার দর"
                className="h-8 w-8 object-contain"
              />
            </div>

            <div>
              <h1 className="text-lg font-bold leading-tight text-gray-900">
                বাজার দর
              </h1>
              <p className="mt-1 text-xs text-gray-500">{date}</p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            {isPending ? (
              <span className="text-sm text-gray-500">লোড হচ্ছে...</span>
            ) : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((open) => !open)}
                  aria-expanded={isProfileOpen}
                  className="flex items-center gap-2 rounded-full px-2 py-1.5 transition hover:bg-gray-50"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt="প্রোফাইল"
                      width={36}
                      height={36}
                      unoptimized
                      className="h-9 w-9 rounded-full border border-gray-200 object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                      {(user.name || user.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}

                  <span className="max-w-32 truncate text-sm font-medium text-gray-800">
                    {user.name || user.email}
                  </span>
                  <span className="text-xs text-gray-500">⌄</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
                    <div className="border-b border-gray-100 px-2 pb-3">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {user.name || "ব্যবহারকারী"}
                      </p>
                      <p className="mt-1 break-all text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="mt-2 block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                    >
                      👤 আমার প্রোফাইল
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      {signingOut ? "সাইন আউট হচ্ছে..." : "↩ সাইন আউট"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-green-600 hover:text-green-600"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/auth/sign-up"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-xl text-gray-700 sm:hidden"
            aria-label="মেনু"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-gray-100 py-4 sm:hidden">
            {isPending ? (
              <p className="px-4 py-3 text-sm text-gray-500">লোড হচ্ছে...</p>
            ) : user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt="প্রোফাইল"
                      width={40}
                      height={40}
                      unoptimized
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                      {(user.name || user.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name || "ব্যবহারকারী"}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-green-50"
                >
                  👤 আমার প্রোফাইল
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full rounded-lg px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/sign-in"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/auth/sign-up"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg bg-green-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-green-700"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}