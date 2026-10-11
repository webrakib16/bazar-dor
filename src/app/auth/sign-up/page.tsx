"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialAuthButtons from "@/app/components/SocialAuthButtons";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedURL = searchParams.get("callbackURL");

  const callbackURL =
    requestedURL?.startsWith("/") && !requestedURL.startsWith("//")
      ? requestedURL
      : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    // Password validation
    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setError("দুটি পাসওয়ার্ড মিলছে না। আবার চেষ্টা করুন।");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        const originalMessage =
          result.error.message?.toLowerCase() || "";

        let message =
          "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।";

        if (
          originalMessage.includes("already exists") ||
          originalMessage.includes("already registered") ||
          originalMessage.includes("already in use") ||
          originalMessage.includes("user already")
        ) {
          message =
            "এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট তৈরি করা হয়েছে। অন্য ইমেইল ব্যবহার করুন।";
        } else if (
          originalMessage.includes("invalid email") ||
          originalMessage.includes("invalid_email")
        ) {
          message = "সঠিক ইমেইল ঠিকানা লিখুন।";
        } else if (originalMessage.includes("password")) {
          message =
            "পাসওয়ার্ডে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
        }

        setError(message);
        toast.error(message);
        return;
      }

      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");

      const signInURL = `/auth/sign-in?callbackURL=${encodeURIComponent(
        callbackURL
      )}`;

      router.push(signInURL);
    } catch {
      const message =
        "সার্ভারে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[65vh] flex-col items-center bg-gray-50 px-4 py-7 sm:py-9">
      <header className="mb-5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          অ্যাকাউন্ট তৈরি করুন
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </header>

      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-800"
            >
              নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="যেমন: রহিম উদ্দিন"
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

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
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-gray-800"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="আবার লিখুন"
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
            className="flex h-11 w-full items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
              : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <SocialAuthButtons />

        <p className="mt-5 text-center text-sm text-gray-600">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href={`/auth/sign-in?callbackURL=${encodeURIComponent(
              callbackURL
            )}`}
            className="font-semibold text-green-700 hover:text-green-800 hover:underline"
          >
            সাইন ইন করুন
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