"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type Provider = "google" | "github";

export default function SocialAuthButtons() {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState("");

  const handleSocialSignIn = async (provider: Provider) => {
    setLoading(provider);
    setError("");

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
        errorCallbackURL: "/auth/sign-in",
      });

      if (result.error) {
        setError(result.error.message || "লগইন করা যায়নি। আবার চেষ্টা করুন।");
        setLoading(null);
      }
    } catch {
      setError("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setLoading(null);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Google */}
        <button
          type="button"
          onClick={() => handleSocialSignIn("google")}
          disabled={loading !== null}
          className="flex h-11 min-w-0 flex-nowrap items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-800 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className="h-4.5 w-4.5 shrink-0"
          >
            <path
              fill="#4285F4"
              d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.9 6.1-15Z"
            />
            <path
              fill="#34A853"
              d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"
            />
            <path
              fill="#FBBC05"
              d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z"
            />
            <path
              fill="#EA4335"
              d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z"
            />
          </svg>

          <span className="whitespace-nowrap">
            {loading === "google"
              ? "অপেক্ষা করুন..."
              : "Google দিয়ে চালিয়ে যান"}
          </span>
        </button>

        {/* GitHub */}
        <button
          type="button"
          onClick={() => handleSocialSignIn("github")}
          disabled={loading !== null}
          className="flex h-11 min-w-0 flex-nowrap items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-800 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4.5 w-4.5 shrink-0 text-gray-900"
          >
            <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.29-2.61 5.24-5.1 5.51.4.35.76 1.03.76 2.08V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" />
          </svg>

          <span className="whitespace-nowrap">
            {loading === "github"
              ? "অপেক্ষা করুন..."
              : "GitHub দিয়ে চালিয়ে যান"}
          </span>
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}