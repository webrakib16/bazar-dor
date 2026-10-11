"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import type { Product, Category } from "@/types";
import { authClient } from "@/lib/auth-client";

const API_URL = "https://api.abcz.workers.dev/api/bazardor/products";
const CATEGORY_API_URL =
  "https://api.abcz.workers.dev/api/bazardor/categories";

const UNIT_BN: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  gram: "গ্রাম",
  g: "গ্রাম",
  piece: "টি",
  pcs: "টি",
  dozen: "ডজন",
};

const formatPrice = (value: number) => value.toLocaleString("bn-BD");

const formatPercent = (value: number) =>
  Math.abs(value).toLocaleString("bn-BD", {
    maximumFractionDigits: 1,
  });

function HomeButton() {
  return (
    <Link
      href="/"
      className="mt-5 inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
    >
      ← হোম পেজে ফিরে যান
    </Link>
  );
}

function ProductLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="পণ্যের তথ্য লোড হচ্ছে"
      className="mx-auto min-h-screen max-w-5xl space-y-5 px-4 py-8"
    >
      <div className="h-4 w-52 animate-pulse rounded bg-gray-200" />

      <section className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gray-200" />
            <div className="space-y-3">
              <div className="h-6 w-40 max-w-full rounded bg-gray-200" />
              <div className="h-4 w-32 rounded bg-gray-100" />
              <div className="h-3 w-48 max-w-full rounded bg-gray-100" />
            </div>
          </div>
          <div className="h-32 rounded-xl bg-gray-100 sm:w-44" />
        </div>
      </section>

      <section className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5">
        <div className="h-6 w-40 rounded bg-gray-200" />
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 rounded-xl bg-gray-100" />
          ))}
        </div>
        <div className="mt-7 h-6 w-44 rounded bg-gray-200" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-20 rounded-xl bg-gray-100" />
          ))}
        </div>
      </section>

      <section className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="mt-5 space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-12 rounded-lg bg-gray-100" />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductError({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-5xl items-center justify-center px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-3xl">
          ⚠️
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          তথ্য লোড করা যায়নি!
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          পণ্যের তথ্য আনতে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করো।
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center justify-center rounded-xl border border-green-600 px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          আবার চেষ্টা করুন
        </button>

        <div>
          <HomeButton />
        </div>
      </section>
    </main>
  );
}

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/sign-up");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (isPending || !session || !slug) return;

    const controller = new AbortController();

    async function getProduct() {
      setLoading(true);
      setError(false);
      setProduct(null);
      setCategory(null);

      try {
        const [productResponse, categoryResponse] = await Promise.all([
          fetch(API_URL, {
            signal: controller.signal,
            cache: "no-store",
          }),
          fetch(CATEGORY_API_URL, {
            signal: controller.signal,
            cache: "no-store",
          }),
        ]);

        if (!productResponse.ok || !categoryResponse.ok) {
          throw new Error("তথ্য লোড করা যায়নি");
        }

        const [productResult, categoryResult] = await Promise.all([
          productResponse.json(),
          categoryResponse.json(),
        ]);

        const products: Product[] = Array.isArray(productResult)
          ? productResult
          : Array.isArray(productResult?.data)
            ? productResult.data
            : [];

        const categories: Category[] = Array.isArray(categoryResult)
          ? categoryResult
          : Array.isArray(categoryResult?.data)
            ? categoryResult.data
            : [];

        if (controller.signal.aborted) return;

        const selectedProduct = products.find(
          (item) => item.slug === slug
        );

        // Unknown/invalid product route → real Next.js 404 page.
        if (!selectedProduct) {
          notFound();
        }

        const selectedCategory = categories.find(
          (item) => item.slug === selectedProduct.category
        );

        setProduct(selectedProduct);
        setCategory(selectedCategory ?? null);
      } catch (err) {
        if (err instanceof Error && err.message === "NEXT_HTTP_ERROR_FALLBACK;404") {
          throw err;
        }

        if (err instanceof Error && err.name === "AbortError") return;

        console.error("Product details error:", err);
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getProduct();

    return () => controller.abort();
  }, [slug, session, isPending, retryCount]);

  if (isPending || !session) {
    return (
      <main className="flex min-h-[55vh] items-center justify-center px-4">
        <div className="animate-pulse text-sm text-gray-500">
          অ্যাকাউন্ট যাচাই করা হচ্ছে...
        </div>
      </main>
    );
  }

  if (loading) {
    return <ProductLoading />;
  }

  if (error || !product) {
    return <ProductError onRetry={() => setRetryCount((count) => count + 1)} />;
  }

  const markets = product.markets ?? [];
  const unit = UNIT_BN[product.unit?.toLowerCase()] ?? product.unit;

  const minPrice = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : null;

  const maxPrice = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : null;

  const averagePrice = markets.length
    ? markets.reduce(
        (sum, market) => sum + (market.min + market.max) / 2,
        0
      ) / markets.length
    : null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6 sm:py-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-500"
      >
        <Link href="/" className="transition hover:text-green-700">
          হোম
        </Link>
        <span aria-hidden="true">›</span>
        <Link
          href={`/category/${product.category}`}
          className="transition hover:text-green-700"
        >
          {category?.nameBn ?? product.categoryName}
        </Link>
        <span aria-hidden="true">›</span>
        <span className="font-medium text-gray-800">{product.nameBn}</span>
      </nav>

      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-gray-100 bg-white p-5 sm:flex-row sm:items-center sm:p-7">
        <div className="flex min-w-0 items-center gap-4">
          <span className="shrink-0 text-5xl">{product.image}</span>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {product.nameBn}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              প্রতি {unit} · {category?.nameBn ?? product.categoryName}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              বাজারভিত্তিক আজকের দামের তথ্য
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 px-5 py-4 sm:min-w-44">
          <p className="text-sm text-gray-500">আজকের দাম</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {formatPrice(product.today)}
          </p>
          <p className="mt-1 text-sm text-gray-500">টাকা / {unit}</p>

          {product.change?.dir === "up" ? (
            <p className="mt-2 text-sm font-medium text-red-600">
              ▲ {formatPercent(product.change.pct)}%
            </p>
          ) : product.change?.dir === "down" ? (
            <p className="mt-2 text-sm font-medium text-green-600">
              ▼ {formatPercent(product.change.pct)}%
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-500">দাম অপরিবর্তিত</p>
          )}
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900">দামের সারসংক্ষেপ</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
            <p className="mt-2 text-xl font-bold text-green-700">
              {minPrice === null ? "—" : formatPrice(minPrice)} টাকা
            </p>
            <p className="mt-1 text-xs text-gray-500">সবচেয়ে কম দামের বাজার</p>
          </div>

          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
            <p className="mt-2 text-xl font-bold text-red-600">
              {maxPrice === null ? "—" : formatPrice(maxPrice)} টাকা
            </p>
            <p className="mt-1 text-xs text-gray-500">সবচেয়ে বেশি দামের বাজার</p>
          </div>

          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">গড় দাম</p>
            <p className="mt-2 text-xl font-bold text-green-700">
              {averagePrice === null
                ? "—"
                : formatPrice(Math.round(averagePrice))} টাকা
            </p>
            <p className="mt-1 text-xs text-gray-500">প্রতি {unit}-এর হিসাবে</p>
          </div>
        </div>

        <h2 className="mb-3 mt-6 text-lg font-bold text-gray-900">
          আগের দামের তুলনা
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "আজকের দাম", value: product.today },
            { label: "গতকালের দাম", value: product.yesterday },
            { label: "গত সপ্তাহের দাম", value: product.lastWeek },
            { label: "গত মাসের দাম", value: product.lastMonth },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="mt-2 font-bold text-gray-900">
                {formatPrice(item.value)} টাকা
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <div className="rounded-xl bg-gray-50 px-4 py-8 text-center">
            <p className="text-2xl">🏪</p>
            <p className="mt-2 text-sm text-gray-600">
              এই পণ্যের বাজারভিত্তিক তথ্য এখনো পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="px-3 py-3 font-medium">বাজার</th>
                  <th className="px-3 py-3 font-medium">বিভাগ</th>
                  <th className="px-3 py-3 text-right font-medium">সর্বনিম্ন</th>
                  <th className="px-3 py-3 text-right font-medium">সর্বোচ্চ</th>
                  <th className="px-3 py-3 text-right font-medium">গড় দাম</th>
                </tr>
              </thead>
              <tbody>
                {markets.map((market, index) => (
                  <tr
                    key={`${market.market}-${market.division}-${index}`}
                    className="border-b border-gray-100 last:border-0 hover:bg-green-50/50"
                  >
                    <td className="px-3 py-3 font-medium text-gray-800">
                      {market.market}
                    </td>
                    <td className="px-3 py-3 text-gray-600">{market.division}</td>
                    <td className="px-3 py-3 text-right">
                      {formatPrice(market.min)} টাকা
                    </td>
                    <td className="px-3 py-3 text-right">
                      {formatPrice(market.max)} টাকা
                    </td>
                    <td className="px-3 py-3 text-right font-medium text-green-700">
                      {formatPrice(Math.round((market.min + market.max) / 2))} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <Link
          href={`/category/${product.category}`}
          className="text-sm font-medium text-green-700 hover:underline"
        >
          ← {category?.nameBn ?? product.categoryName}-এ ফিরে যাও
        </Link>
        <HomeButton />
      </div>
    </main>
  );
}