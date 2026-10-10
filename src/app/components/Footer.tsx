export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-5 text-xs leading-5 text-gray-500 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        {/* Left Side */}
        <p className="text-left">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        {/* Right Side */}
        <p className="text-left sm:text-right">
          সকল দাম সপ্তাহব্যাপী, বাজারের অবস্থার উপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}