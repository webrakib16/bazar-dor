import Link from "next/link";

export default function NotFound() {
return (
<main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
<section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
<p className="text-7xl font-extrabold text-green-600">404</p>

    <h1 className="mt-4 text-2xl font-bold text-gray-900">
      পেজটি খুঁজে পাওয়া যায়নি!
    </h1>

    <p className="mt-3 text-sm leading-6 text-gray-500">
      দুঃখিত! পেজটি পাওয়া যায়নি অথবা ঠিকানাটি সঠিক নয়।
      সঠিক ঠিকানা দিয়ে আবার চেষ্টা করো।
    </p>

    <Link
      href="/"
      className="mt-5 inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
    >
      ← হোম পেজে ফিরে যান
    </Link>
  </section>
</main>

);
}