import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";
import type { Product } from "@/types";

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

const formatNumber = (value: number) =>
  value.toLocaleString("bn-BD", {
    maximumFractionDigits: 1,
  });

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

    products = Array.isArray(data)
      ? data
      : Array.isArray(data.data)
        ? data.data
        : [];
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
      <div className="mx-auto flex max-w-7xl items-center">
        <div className="z-10 shrink-0 bg-green-600 px-4 py-2 text-sm font-semibold text-white">
          সর্বশেষ দাম
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <MarqueeText
            className="py-2"
            direction="right"
            duration={15}
          >
            {products.map((product, index) => {
              const unit =
                UNIT_BN[product.unit?.toLowerCase()] ??
                product.unit;

              return (
                <span
                  key={product.id}
                  className="inline-flex items-center whitespace-nowrap text-sm">
                  <span className="mr-2">{product.image}</span>
                  <span>{product.nameBn}</span>

                  <span className="mx-2 font-semibold">
                    ৳ {formatNumber(product.today)} / {unit}
                  </span>

                  <span
                    className={
                      product.change?.dir === "up"
                        ? "font-medium text-red-600"
                        : product.change?.dir === "down"
                          ? "font-medium text-green-600"
                          : "text-gray-500"
                    }
                  >
                    {product.change?.dir === "up"
                      ? "▲"
                      : product.change?.dir === "down"
                        ? "▼"
                        : "•"}{" "}
                    {formatNumber(product.change?.pct ?? 0)}%
                  </span>

                  {index < products.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="mx-6 inline-block text-2xl font-bold leading-none text-black"
                    >
                      •
                    </span>
                  )}
                </span>
              );
            })}
          </MarqueeText>
        </div>
      </div>
    </div>
  );
};

export default Marquee;