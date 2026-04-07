'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import CTASection from '../components/home-sections/CTASection';
import FAQSection from '../components/home-sections/FAQSection';
import MediStoreCards from '../components/home-sections/MediStoreCards';
import { SupportSection } from '../components/home-sections/SupportSection';
import Testimonials from '../components/home-sections/Testimonials';
import Categories from '@/components/home-sections/CategorySection';
import HomeQuickProducts from '@/components/home-sections/HomeQuickProducts';
import NewsletterSection from '../components/home-sections/NewsletterSection';
import HowItWorksSection from '../components/home-sections/HowItWorksSection';
import { FaShieldHeart, FaTruck, FaStar } from 'react-icons/fa6';
import { MdVerified } from 'react-icons/md';

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } }
};

const STATS = [
  { number: '50K+', label: 'Happy Customers', icon: <FaStar className="text-emerald-500 text-2xl" /> },
  { number: '10K+', label: 'Medicines Available', icon: <MdVerified className="text-emerald-500 text-2xl" /> },
  { number: '500+', label: 'Verified Pharmacies', icon: <FaShieldHeart className="text-emerald-500 text-2xl" /> },
  { number: '24/7', label: 'Customer Support', icon: <FaTruck className="text-emerald-500 text-2xl" /> },
];

export default function Home() {
  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative h-[68vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/hero.png)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-teal-800/70 to-emerald-700/60" />

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div {...fadeInUp}>
            <span className="inline-block bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              🏥 Trusted by 50,000+ Customers
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Your Health,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                Our Priority
              </span>
            </h1>
            <p className="text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
              Get authentic medicines delivered to your doorstep. Fast, reliable, and trusted by thousands across the country.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg shadow-emerald-500/30 transform hover:scale-105 transition-all duration-300">
                Shop Now →
              </Link>
              <Link href="/about" className="border-2 border-white/70 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-emerald-800 transition-all duration-300 backdrop-blur-sm">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {STATS.map((s) => (
              <motion.div key={s.label} variants={fadeInUp} className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-gray-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                {s.icon}
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{s.number}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <HowItWorksSection />

      {/* ── Why Choose Us ── */}
      <MediStoreCards />

      {/* ── Categories ── */}
      <Categories />

      {/* ── Quick Products ── */}
      <HomeQuickProducts />

      {/* ── Support ── */}
      <SupportSection />

      {/* ── Testimonials ── */}
      <Testimonials />

      {/* ── Newsletter ── */}
      <NewsletterSection />

      {/* ── FAQ ── */}
      <FAQSection />

      {/* ── CTA ── */}
      <CTASection />

    </div>
  );
}
