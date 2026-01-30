"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How do I know the medicines are authentic?",
    answer: "All our medicines are sourced from licensed pharmacies and verified suppliers.",
  },
  {
    question: "Do you offer cash on delivery?",
    answer: "Yes, we offer cash on delivery for your convenience and peace of mind.",
  },
  {
    question: "What are your delivery times?",
    answer: "We offer same-day delivery in major cities and 1-2 day delivery nationwide.",
  },
  {
    question: "Can I return medicines if needed?",
    answer: "Due to safety regulations, we offer refunds only for damaged or incorrect orders.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-white pt-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-semibold text-gray-600 mb-6">
            FAQ
          </h2>

          <p className="text-gray-600 leading-relaxed max-w-md">
            Have questions about ordering medicines online?
            <br />
            We're here to help you get the healthcare
            <br />
            you need with confidence and ease.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className={`${!isOpen ? "border-b border-gray-200 pb-4" : ""}`}
              >
                <button
                  onClick={() => toggle(index)}
                  className={`w-full flex justify-between gap-6 text-left ${
                    isOpen
                      ? "bg-gray-100 rounded-lg px-4 py-6"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  <div>
                    <h3
                      className={`text-lg font-medium ${
                        isOpen ? "text-gray-900 mb-3" : ""
                      }`}
                    >
                      {faq.question}
                    </h3>

                    {isOpen && (
                      <p className="text-gray-600 text-sm">
                        {faq.answer}
                      </p>
                    )}
                  </div>

                  <span className="text-2xl leading-none text-gray-800 my-auto h-full">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}