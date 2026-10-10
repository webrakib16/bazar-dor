"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Product, Category } from "@/types";

type SortOption = "default" | "low-to-high" | "high-to-low";

type CategoryStatus = "loading" | "success" | "not-found" | "error";

const API_URL = "https://api.abcz.workers.dev/api/bazardor";

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

const formatPct = (value: number) =>
Math.abs(value).toLocaleString("bn-BD", {
minimumFractionDigits: 1,
maximumFractionDigits: 1,
});

function HomeButton() {
return (
<Link
href="/"
className="mt-6 inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
>
← হোম পেজে ফিরে যান
</Link>
);
}

function EmptyState({
title,
description,
code,
}: {
title: string;
description: string;
code?: string;
}) {
return (
<main className="mx-auto flex min-h-[55vh] max-w-7xl items-center justify-center px-4 py-12">
<section className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
{code && (
<p className="text-7xl font-extrabold tracking-tight text-green-600">
{code}
</p>
)}

    <div className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-3xl">
      🛒
    </div>

    <h1 className="mt-4 text-2xl font-bold text-gray-900">{title}</h1>

    <p className="mt-3 text-sm leading-6 text-gray-500">{description}</p>

    <HomeButton />
  </section>
</main>

);
}

function CategoryLoading() {
return (
<main
aria-label="ক্যাটাগরির পণ্য লোড হচ্ছে"
aria-busy="true"
className="mx-auto max-w-7xl px-4 py-8"
>
<div className="animate-pulse">
<div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
<div className="flex items-center gap-3">
<div className="h-12 w-12 rounded-full bg-gray-200" />
<div className="flex-1 space-y-2">
<div className="h-6 w-36 rounded bg-gray-200" />
<div className="h-4 w-56 max-w-full rounded bg-gray-100" />
</div>
</div>
</div>

    <div className="mt-4 flex justify-end">
      <div className="h-10 w-48 rounded-lg bg-gray-100" />
    </div>

    <div className="mb-4 mt-5 h-4 w-40 rounded bg-gray-100" />

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-gray-100 bg-white p-5"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 max-w-full rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-100" />
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-gray-100" />
              <div className="h-5 w-24 rounded bg-gray-200" />
            </div>
            <div className="h-4 w-12 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  </div>
</main>

);
}

export default function CategoryPage() {
const params = useParams<{ slug: string }>();
const slug = params.slug;

const [category, setCategory] = useState<Category | null>(null);
const [products, setProducts] = useState<Product[]>([]);
const [sortBy, setSortBy] = useState<SortOption>("default");
const [status, setStatus] = useState<CategoryStatus>("loading");

useEffect(() => {
if (!slug) return;

const controller = new AbortController();

async function fetchCategoryProducts() {
  setStatus("loading");
  setCategory(null);
  setProducts([]);

  try {
    const categoryRes = await fetch(
      `${API_URL}/categories/${encodeURIComponent(slug)}`,
      { signal: controller.signal }
    );

    if (categoryRes.status === 404) {
      setStatus("not-found");
      return;
    }

    if (!categoryRes.ok) {
      throw new Error("Category request failed");
    }

    const categoryResult = await categoryRes.json();
    const categoryData: Category =
      categoryResult?.data ?? categoryResult;

    if (
      !categoryData ||
      typeof categoryData !== "object" ||
      !categoryData.nameBn
    ) {
      setStatus("not-found");
      return;
    }

    const productRes = await fetch(
      `${API_URL}/products?category=${encodeURIComponent(slug)}`,
      { signal: controller.signal }
    );

    if (!productRes.ok) {
      throw new Error("Product request failed");
    }

    const productResult = await productRes.json();

    const productData: Product[] = Array.isArray(productResult)
      ? productResult
      : Array.isArray(productResult?.data)
        ? productResult.data
        : [];

    setCategory(categoryData);
    setProducts(productData);
    setStatus("success");
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return;

    console.error("Category fetch error:", error);
    setStatus("error");
  }
}

fetchCategoryProducts();

return () => controller.abort();

}, [slug]);

const sortedProducts = [...products].sort((a, b) => {
if (sortBy === "low-to-high") return a.today - b.today;
if (sortBy === "high-to-low") return b.today - a.today;
return 0;
});

if (status === "loading") {
return <CategoryLoading />;
}

if (status === "not-found") {
return (
<EmptyState
code="404"
title="ক্যাটাগরি খুঁজে পাওয়া যায়নি!"
description="এই ক্যাটাগরিটি পাওয়া যায়নি। সঠিক ক্যাটাগরি নির্বাচন করো অথবা হোম পেজে ফিরে যাও।"
/>
);
}

if (status === "error") {
return (
<EmptyState
title="ক্যাটাগরির তথ্য লোড করা যায়নি!"
description="সার্ভার বা ইন্টারনেট সংযোগে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করো।"
/>
);
}

if (!category) {
return (
<EmptyState
code="404"
title="ক্যাটাগরি খুঁজে পাওয়া যায়নি!"
description="এই ক্যাটাগরিটি পাওয়া যায়নি।"
/>
);
}

if (products.length === 0) {
return (
<EmptyState
title="এই ক্যাটাগরিতে কোনো পণ্য নেই!"
description="এই ক্যাটাগরিতে বর্তমানে কোনো পণ্যের তথ্য পাওয়া যায়নি। অন্য পণ্য দেখতে হোম পেজে ফিরে যাও।"
/>
);
}

return (
<main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
<section className="rounded-2xl border border-gray-100 bg-white px-5 py-5 sm:px-6">
<div className="flex items-center gap-3">
<span className="text-3xl">{category.icon}</span>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {category.nameBn}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {products.length.toLocaleString("bn-BD")}টি পণ্যের আজকের দাম ও
          পরিবর্তন
        </p>
      </div>
    </div>
  </section>

  <section className="mt-4 flex items-center justify-end rounded-2xl border border-gray-100 bg-white px-4 py-3 sm:px-5">
    <label htmlFor="product-sort" className="mr-3 text-sm text-gray-500">
      সাজান
    </label>

    <select
      id="product-sort"
      value={sortBy}
      onChange={(event) => setSortBy(event.target.value as SortOption)}
      className="max-w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
    >
      <option value="default">ডিফল্ট</option>
      <option value="low-to-high">দাম: কম থেকে বেশি</option>
      <option value="high-to-low">দাম: বেশি থেকে কম</option>
    </select>
  </section>

  <p className="mb-4 mt-5 text-sm text-gray-500">
    মোট {products.length.toLocaleString("bn-BD")}টি পণ্য দেখানো হচ্ছে
  </p>

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {sortedProducts.map((product) => (
      <Link
        key={product.id}
        href={`/product/${product.slug}`}
        aria-label={`${product.nameBn} এর বিস্তারিত দেখুন`}
        className="group block w-full rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-green-300 hover:bg-green-50/70 hover:shadow-lg hover:shadow-green-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{product.image}</span>

          <div>
            <h2 className="font-semibold text-gray-900">
              {product.nameBn}
            </h2>

            <p className="text-sm text-gray-500">
              প্রতি {UNIT_BN[product.unit?.toLowerCase()] ?? product.unit}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">আজকের দাম</p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {product.today.toLocaleString("bn-BD")} টাকা
            </p>
          </div>

          {product.change?.dir === "up" ? (
            <span className="text-sm font-medium text-red-600">
              ▲ {formatPct(product.change.pct)}%
            </span>
          ) : product.change?.dir === "down" ? (
            <span className="text-sm font-medium text-green-600">
              ▼ {formatPct(product.change.pct)}%
            </span>
          ) : (
            <span className="text-sm text-gray-500">— ০.০%</span>
          )}
        </div>
      </Link>
    ))}
  </div>
</main>

);
}