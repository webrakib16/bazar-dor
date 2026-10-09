import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";
import type { Product } from "@/types";

const Marquee = async () => {
  let products: Product[] = [];

  try {
    const res = await fetch(
      "https://api.abcz.workers.dev/api/bazardor/products",
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();
    products = Array.isArray(data) ? data : data.data ?? [];
  } catch (error) {
    console.error("Marquee fetch error:", error);

    return (
      <div className="border-y border-green-100 bg-green-50 px-4 py-3 text-sm text-gray-600">
        বাজারের দাম লোড করা যাচ্ছে না।
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden border-y border-green-100 bg-green-100 text-gray-800">
      <div className="flex items-center mx-auto max-w-7xl">
        <div className="shrink-0 bg-green-600 px-4 py-2 text-sm font-semibold text-white">
          সর্বশেষ দাম
        </div>

        <MarqueeText className="py-2" direction="right" duration={15}>
          {products.map((product) => (
            <span
              key={product.id}
              className="mx-5 inline-flex items-center gap-2 whitespace-nowrap text-sm"
            >
              <span>{product.nameBn}</span>

              <span className="font-semibold">
                ৳ {product.today} / {product.unit}
              </span>

              <span
                className={
                  product.change.dir === "up"
                    ? "font-medium text-red-600"
                    : product.change.dir === "down"
                    ? "font-medium text-green-600"
                    : "text-gray-500"
                }
              >
                {product.change.dir === "up"
                  ? "▲"
                  : product.change.dir === "down"
                  ? "▼"
                  : "•"}{" "}
                {product.change.pct}%
              </span>
            </span>
          ))}
        </MarqueeText>
      </div>
    </div>
  );
};

export default Marquee;