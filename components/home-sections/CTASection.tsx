'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaShieldHeart } from 'react-icons/fa6';

export default function CTASection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-800" />
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white/20 h-full inline-block" style={{ width: '8.33%' }} />
            ))}
          </div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />
          <div className="relative z-10 flex flex-col items-center text-center px-8 py-20">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mb-6">
              <FaShieldHeart size={30} className="text-white" />
            </div>
            <h2 className="text-white text-3xl md:text-5xl font-bold leading-tight max-w-3xl mb-4">Get Your Medicines Delivered Fast</h2>
            <p className="text-white/80 text-lg max-w-xl mb-10">Safe & reliable healthcare at your doorstep. Join 50,000+ customers who trust MediStore.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-10 py-4 rounded-full hover:bg-emerald-50 transition-all duration-200 shadow-lg">
                Shop Medicines Now <FaArrowRight size={14} />
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-10 py-4 rounded-full hover:bg-white/10 transition-all duration-200">
                Create Free Account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
