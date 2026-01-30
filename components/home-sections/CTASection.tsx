"use client";

export default function CTASection() {
  return (
    <section className="bg-white pt-24 px-6 flex justify-center items-center max-w-[1200px] h-[555px] mx-auto mb-24">
      <div
        className="
          relative
          w-full
          max-w-6xl
          rounded-[36px]
          overflow-hidden
          border border-white/20
        "
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2E6F8A] via-[#1F2A36] to-[#2E6F8A]" />

        <div className="absolute inset-0 grid grid-cols-12 opacity-20">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="border-r border-white/10 last:border-none"
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 py-24">
          <h2 className="text-white text-3xl md:text-4xl font-semibold leading-snug max-w-3xl">
            Get Your Medicines Delivered Fast,
            <br />
            Safe & Reliable Healthcare at Your Doorstep
          </h2>

          <a href="/shop" className="mt-10 px-10 py-4 rounded-full bg-[#00B0F4] text-white text-base font-medium hover:opacity-90 transition">
            Shop Medicines Now
          </a>
        </div>
      </div>
    </section>
  );
}