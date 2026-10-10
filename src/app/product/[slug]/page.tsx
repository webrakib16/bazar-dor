"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product, Category } from "@/types";
import { authClient } from "@/lib/auth-client";

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

const CATEGORY_API_URL =
  "https://api.abcz.workers.dev/api/bazardor/categories";

const UNIT_BN: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
};

const formatPrice = (value: number) =>
  value.toLocaleString("bn-BD");

const formatPercent = (value: number) =>
  Math.abs(value).toLocaleString("bn-BD", {
    maximumFractionDigits: 1,
  });

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // লগইন না থাকলে Sign Up পেজে পাঠাবে
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/sign-up");
    }
  }, [session, isPending, router]);

  // লগইন করা থাকলেই পণ্যের তথ্য লোড হবে
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

        const productResult = await productResponse.json();
        const categoryResult = await categoryResponse.json();

        const products: Product[] = Array.isArray(productResult)
          ? productResult
          : Array.isArray(productResult.data)
            ? productResult.data
            : [];

        const categories: Category[] = Array.isArray(categoryResult)
          ? categoryResult
          : Array.isArray(categoryResult.data)
            ? categoryResult.data
            : [];

        const selectedProduct = products.find(
          (item) => item.slug === slug
        );

        if (!selectedProduct) {
          throw new Error("পণ্য পাওয়া যায়নি");
        }

        const selectedCategory = categories.find(
          (item) => item.slug === selectedProduct.category
        );

        setProduct(selectedProduct);
        setCategory(selectedCategory ?? null);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

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
  }, [slug, session, isPending]);

  if (isPending || !session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-sm text-gray-500">
          অ্যাকাউন্ট যাচাই করা হচ্ছে...
        </p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-5xl space-y-4 px-4 py-8">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
        <div className="h-32 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto min-h-screen max-w-5xl px-4 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-gray-700">
            পণ্যের তথ্য লোড করা যায়নি অথবা পণ্যটি পাওয়া যায়নি।
          </p>

          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-green-700 hover:underline"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const markets = product.markets ?? [];
  const unit = UNIT_BN[product.unit] ?? product.unit;

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
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6">
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

        <span className="font-medium text-gray-800">
          {product.nameBn}
        </span>
      </nav>

      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-gray-100 bg-white p-5 sm:flex-row sm:items-center sm:p-7">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{product.image}</span>

          <div>
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

        <div className="rounded-xl bg-gray-50 px-5 py-4 sm:min-w-36">
          <p className="text-sm text-gray-500">আজকের দাম</p>

          <p className="mt-1 text-3xl font-bold text-gray-900">
            {formatPrice(product.today)}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            টাকা / {unit}
          </p>

          {product.change?.dir === "up" ? (
            <p className="mt-2 text-sm font-medium text-red-600">
              ▲ {formatPercent(product.change.pct)}%
            </p>
          ) : product.change?.dir === "down" ? (
            <p className="mt-2 text-sm font-medium text-green-600">
              ▼ {formatPercent(product.change.pct)}%
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              দাম অপরিবর্তিত
            </p>
          )}
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900">
          দামের সারসংক্ষেপ
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
            <p className="mt-2 text-xl font-bold text-green-700">
              {minPrice === null ? "—" : formatPrice(minPrice)} টাকা
            </p>
            <p className="mt-1 text-xs text-gray-500">
              সবচেয়ে কম দামের বাজার
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
            <p className="mt-2 text-xl font-bold text-red-600">
              {maxPrice === null ? "—" : formatPrice(maxPrice)} টাকা
            </p>
            <p className="mt-1 text-xs text-gray-500">
              সবচেয়ে বেশি দামের বাজার
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">গড় দাম</p>
            <p className="mt-2 text-xl font-bold text-green-700">
              {averagePrice === null
                ? "—"
                : formatPrice(Math.round(averagePrice))} টাকা
            </p>
            <p className="mt-1 text-xs text-gray-500">
              প্রতি {unit}-এর হিসাবে
            </p>
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
            <div
              key={item.label}
              className="rounded-xl bg-gray-50 p-4"
            >
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
          <p className="py-6 text-center text-sm text-gray-500">
            বাজারের তথ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="px-3 py-3 font-medium">বাজার</th>
                  <th className="px-3 py-3 font-medium">বিভাগ</th>
                  <th className="px-3 py-3 text-right font-medium">
                    সর্বনিম্ন
                  </th>
                  <th className="px-3 py-3 text-right font-medium">
                    সর্বোচ্চ
                  </th>
                  <th className="px-3 py-3 text-right font-medium">
                    গড় দাম
                  </th>
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
                    <td className="px-3 py-3 text-gray-600">
                      {market.division}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {formatPrice(market.min)} টাকা
                    </td>
                    <td className="px-3 py-3 text-right">
                      {formatPrice(market.max)} টাকা
                    </td>
                    <td className="px-3 py-3 text-right font-medium text-green-700">
                      {formatPrice(
                        Math.round((market.min + market.max) / 2)
                      )} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="py-6">
        <Link
          href={`/category/${product.category}`}
          className="text-sm font-medium text-green-700 hover:underline"
        >
          ← {category?.nameBn ?? product.categoryName}-এ ফিরে যাও
        </Link>
      </div>
    </main>
  );
}