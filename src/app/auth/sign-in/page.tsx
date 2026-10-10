"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedURL = searchParams.get("callbackURL");
  const callbackURL =
    requestedURL?.startsWith("/") && !requestedURL.startsWith("//")
      ? requestedURL
      : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL,
      });

      if (result.error) {
        setError(
          result.error.message || "সাইন ইন করা যায়নি। তথ্যগুলো যাচাই করুন।"
        );
        return;
      }

      router.push(callbackURL);
      router.refresh();
    } catch {
      setError("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[65vh] flex-col items-center bg-gray-50 px-4 py-10 sm:py-12">
      {/* Page heading */}
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          সাইন ইন করুন
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
          আপনার অ্যাকাউন্টে প্রবেশ করে বাজারদর দেখুন।
        </p>
      </div>

      {/* Sign in card */}
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-800"
            >
              ইমেইল
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-800"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              className="h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন করুন"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-500">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <p className="text-center text-sm leading-6 text-gray-500">
          Google ও GitHub দিয়ে সাইন ইন করতে OAuth সেটআপ প্রয়োজন।
        </p>

        <p className="mt-6 text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href={`/auth/sign-up?callbackURL=${encodeURIComponent(callbackURL)}`}
            className="font-semibold text-green-700 transition hover:text-green-800 hover:underline"
          >
            অ্যাকাউন্ট তৈরি করুন
          </Link>
        </p>
      </section>

      {/* Outside the card */}
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center gap-1 text-sm text-gray-500 transition hover:text-green-700"
      >
        <span aria-hidden="true">←</span>
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}