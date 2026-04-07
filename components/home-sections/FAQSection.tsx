'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa6';

const faqs = [
  { question: 'How do I know the medicines are authentic?', answer: 'All our medicines are sourced from licensed pharmacies and verified suppliers. Every product goes through a strict quality check before being listed on our platform.' },
  { question: 'Do you offer cash on delivery?', answer: 'Yes, we offer cash on delivery for your convenience and peace of mind. We also support all major credit/debit cards and mobile banking.' },
  { question: 'What are your delivery times?', answer: 'We offer same-day delivery in major cities and 1-2 day delivery nationwide. Express delivery options are also available for urgent orders.' },
  { question: 'Can I return medicines if needed?', answer: 'Due to safety regulations, we offer refunds only for damaged or incorrect orders. Please contact our support team within 24 hours of receiving your order.' },
  { question: 'Do I need a prescription to order?', answer: 'Prescription medicines require a valid prescription uploaded during checkout. Our pharmacists verify all prescriptions before processing your order.' },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-widest">Got Questions?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
              Have questions about ordering medicines online? We're here to help you get the healthcare you need with confidence and ease.
            </p>
            <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
              <p className="text-emerald-800 dark:text-emerald-300 font-medium text-sm">Still have questions?</p>
              <p className="text-emerald-700 dark:text-emerald-400 text-sm mt-1">Contact our support team at <span className="font-semibold">info@medistore.com</span></p>
            </div>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.4 }}
                  className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-emerald-200 dark:border-emerald-700 shadow-sm' : 'border-gray-100 dark:border-slate-700'}`}>
                  <button onClick={() => setActiveIndex(isOpen ? null : index)}
                    className={`w-full flex justify-between items-center gap-4 text-left px-5 py-4 transition-colors ${isOpen ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                    <span className={`font-semibold text-sm ${isOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>{faq.question}</span>
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-gray-400'}`}>
                      {isOpen ? <FaMinus size={10} /> : <FaPlus size={10} />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <p className="px-5 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
