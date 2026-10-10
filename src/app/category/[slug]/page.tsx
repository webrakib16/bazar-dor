"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product, Category } from "@/types";

type SortOption = "default" | "low-to-high" | "high-to-low";

type Props = {
  params: Promise<{ slug: string }>;
};

const UNIT_BN: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
};

const formatPct = (value: number) =>
  Math.abs(value).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

export default function CategoryPage({ params }: Props) {
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    params.then((value) => {
      if (active) setSlug(value.slug);
    });

    return () => {
      active = false;
    };
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    async function fetchCategoryProducts() {
      setLoading(true);
      setError(false);

      try {
        const [categoryRes, productRes] = await Promise.all([
          fetch(
            `https://api.abcz.workers.dev/api/bazardor/categories/${slug}`,
            { signal: controller.signal }
          ),
          fetch(
            `https://api.abcz.workers.dev/api/bazardor/products?category=${slug}`,
            { signal: controller.signal }
          ),
        ]);

        if (!categoryRes.ok || !productRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoryData: Category = await categoryRes.json();
        const productData: Product[] = await productRes.json();

        if (!Array.isArray(productData)) {
          throw new Error("Invalid product data");
        }

        setCategory(categoryData);
        setProducts(productData);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        console.error("Category fetch error:", err);
        setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
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

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 rounded-lg bg-gray-200" />
          <div className="h-16 rounded-2xl bg-gray-100" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-32 rounded-2xl bg-gray-100" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !category) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-gray-600">
          ক্যাটাগরির তথ্য লোড করা যায়নি। পেজটি Refresh করো।
        </p>
      </main>
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
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low-to-high">দাম: কম থেকে বেশি</option>
          <option value="high-to-low">দাম: বেশি থেকে কম</option>
        </select>
      </section>

      <p className="mb-4 mt-5 text-sm text-gray-500">
        মোট {products.length.toLocaleString("bn-BD")}টি পণ্য দেখানো হচ্ছে
      </p>

      {sortedProducts.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-500">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
        </div>
      ) : (
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
                    প্রতি {UNIT_BN[product.unit] ?? product.unit}
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
      )}
    </main>
  );
}