"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialAuthButtons from "@/app/components/SocialAuthButtons";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(
          result.error.message || "সাইন ইন করা যায়নি। তথ্যগুলো যাচাই করুন।"
        );
        return;
      }

      toast.success("আপনি সফলভাবে লগইন করেছেন!");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[65vh] flex-col items-center bg-gray-50 px-4 py-8 sm:py-10">
      <header className="mb-5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          সাইন ইন
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          বিস্তারিত দাম ও বাজার তুলনা দেখতে অ্যাকাউন্টে প্রবেশ করুন।
        </p>
      </header>

      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-800"
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
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-800"
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
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <SocialAuthButtons />

        <p className="mt-5 text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-green-700 hover:text-green-800 hover:underline"
          >
            অ্যাকাউন্ট তৈরি করুন
          </Link>
        </p>
      </section>

      <Link
        href="/"
        className="mt-5 inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-green-700"
      >
        <span aria-hidden="true">←</span>
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}