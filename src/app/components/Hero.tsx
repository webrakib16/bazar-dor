import Link from "next/link";
import Image from "next/image";
import bazarHero from "@/assets/bazar-hero.png";


const Hero = () => {
     const date = new Date().toLocaleDateString("bn-BD",{
    dateStyle: 'full'
  })


  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-green-50 via-white to-emerald-50 px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left Content */}
          <div className="relative z-10">
            
            <p className="mb-4 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
              {date}
            </p>

            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              আজকের বাজারের দাম
              <span className="mt-2 block text-green-600">
                এক নজরে
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
                 চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
                 বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং
                 দামের পরিবর্তন এক জায়গায়।
            </p>

            <Link
              href="/#products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
               সব পণ্য দেখুন
              <span aria-hidden="true">→</span>
            </Link>

          </div>

          {/* Right Image */}
          <div className="relative flex min-h-56 items-center justify-center sm:min-h-72">
            <Image
              src={bazarHero}
              alt="বাজারের নিত্যপ্রয়োজনীয় পণ্য"
              priority
              className="h-auto w-full max-w-md object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;