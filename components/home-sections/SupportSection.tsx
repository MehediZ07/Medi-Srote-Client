'use client';

import { motion } from 'framer-motion';
import { FaUserDoctor, FaWhatsapp, FaBookOpen, FaArrowRight } from 'react-icons/fa6';
import Link from 'next/link';

const features = [
  { icon: <FaUserDoctor size={18} className="text-emerald-600 dark:text-emerald-400" />, text: 'Licensed Pharmacists Available' },
  { icon: <FaWhatsapp size={18} className="text-emerald-600 dark:text-emerald-400" />, text: 'WhatsApp / Email Support' },
  { icon: <FaBookOpen size={18} className="text-emerald-600 dark:text-emerald-400" />, text: 'Step-by-step Ordering Guide' },
];

export const SupportSection = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 px-8 md:px-16 py-12 md:py-16 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-widest">We're Here For You</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-6 leading-tight">
              Expert Support &<br />Guidance
            </h2>
            <ul className="space-y-4 mb-8">
              {features.map((f) => (
                <li key={f.text} className="flex items-center justify-center lg:justify-start gap-3 text-gray-600 dark:text-gray-300">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    {f.icon}
                  </div>
                  <span className="font-medium">{f.text}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-sm">
              Get Help Now <FaArrowRight size={14} />
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="relative w-full max-w-sm lg:w-96 h-72 md:h-80">
            <img src="/Frame 2147236984.png" alt="Support illustration" className="w-full h-full object-cover rounded-2xl shadow-lg" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
