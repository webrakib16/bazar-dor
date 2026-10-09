"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/types/index";
import Link from "next/link";

const CategoryNav = () => {
  const [navs, setNavs] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://api.abcz.workers.dev/api/bazardor/categories",
        );

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const categories = await res.json();

        const data: Category[] = Array.isArray(categories)
          ? categories
          : categories.data;

        if (!Array.isArray(data)) {
          throw new Error("Invalid category data");
        }

        setNavs(data);
      } catch (error) {
        console.error("Category fetch error:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="border-b border-gray-100 bg-white px-4 py-3 text-sm text-gray-500">
        ক্যাটাগরি লোড হচ্ছে...
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-b border-gray-100 bg-white px-4 py-3 text-sm text-red-600">
        ক্যাটাগরি লোড করা যায়নি। পেজটি Refresh করো।
      </div>
    );
  }

  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-green-700"
        >
          <span>🏠</span>
          <span>সব পণ্য</span>
        </Link>

        {navs.map((category: Category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-700"
          >
            <span>{category.icon}</span>
            <span className="whitespace-nowrap">{category.nameBn}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;
