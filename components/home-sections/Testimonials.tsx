"use client";

import Marquee from "react-fast-marquee";
import TestimonialCard from "./TestimonialCard";
import { testimonials } from "../../data/testimonials";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Testimonials() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const gradientColor = mounted && theme === "dark" ? "15,23,42" : "255,255,255";

  return (
    <section className="bg-white dark:bg-slate-900 py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-widest">What People Say</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">What Our Customers Say</h2>
        </div>
      </div>

      <Marquee speed={40} pauseOnHover gradient gradientColor={gradientColor} gradientWidth={120}>
        {testimonials.map((item, idx) => (
          <TestimonialCard key={idx} {...item} />
        ))}
      </Marquee>

      <div className="h-8" />

      <Marquee speed={40} direction="right" pauseOnHover gradient gradientColor={gradientColor} gradientWidth={120}>
        {testimonials.map((item, idx) => (
          <TestimonialCard key={`reverse-${idx}`} {...item} />
        ))}
      </Marquee>
    </section>
  );
}
