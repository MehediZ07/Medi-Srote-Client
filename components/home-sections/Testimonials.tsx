"use client";

import Marquee from "react-fast-marquee";
import TestimonialCard from "./TestimonialCard";
import { testimonials } from "../../data/testimonials";
export default function Testimonials() {
  return (
    <section className="bg-white max-w-[1200px] mx-auto py-8 overflow-hidden section-fade-x">
      <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-800 mb-16">
        What Our Customers Say About Us
      </h2>

      <Marquee
        speed={40}
        pauseOnHover
        gradient
        gradientColor="255,255,255"
        gradientWidth={120}
      >
        {testimonials.map((item, idx) => (
          <TestimonialCard key={idx} {...item} />
        ))}
      </Marquee>

      <div className="h-8" />

      <Marquee
        speed={40}
        direction="right"
        pauseOnHover
        gradient
        gradientColor="255,255,255"
        gradientWidth={120}
      >
        {testimonials.map((item, idx) => (
          <TestimonialCard key={`reverse-${idx}`} {...item} />
        ))}
      </Marquee>

      <style jsx>{`
        .section-fade-x {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            white 20%,
            white 80%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            white 20%,
            white 80%,
            transparent 100%
          );
        }
      `}</style>
    </section>
  );
}
