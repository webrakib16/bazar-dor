import type { Product } from "@/types";

const RisingProducts = async () => {
  let risingProducts: Product[] = [];
  let fetchError = false;

  try {
    const res = await fetch(
      "https://api.abcz.workers.dev/api/bazardor/products"
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await res.json();

    const products: Product[] = Array.isArray(result)
      ? result
      : Array.isArray(result.data)
        ? result.data
        : [];

    risingProducts = products
      .filter((item) => item.change?.dir === "up")
      .slice(0, 6);
  } catch {
    fetchError = true;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-5 text-2xl font-bold text-gray-900">
        <span className="mr-2 text-red-500">▲</span>
        আজ দাম বেড়েছে
      </h2>

      {fetchError ? (
        <p className="text-gray-500">
          পণ্যের তথ্য লোড করা যায়নি। পরে আবার চেষ্টা করো।
        </p>
      ) : risingProducts.length === 0 ? (
        <p className="text-gray-500">
          দাম বেড়েছে এমন পণ্যের তথ্য পাওয়া যায়নি।
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {risingProducts.map((product) => (
            <div
              key={product.id}
             className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-green-300 hover:bg-green-50/70 hover:shadow-lg hover:shadow-green-100/70"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{product.image}</span>
                {/* <span className="text-3xl">{product.image}</span> */}

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {product.nameBn}
                  </h3>
                  <p className="text-sm text-gray-500">
                    প্রতি কেজি
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-sm text-gray-500">আজকের দাম</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {product.today.toLocaleString("bn-BD")} টাকা
                  </p>
                </div>

                <span className="text-sm font-medium text-red-600">
                  ▲ {product.change?.pct ?? 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RisingProducts;