'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import CTASection from '../components/home-sections/CTASection';
import FAQSection from '../components/home-sections/FAQSection';
import MediStoreCards from '../components/home-sections/MediStoreCards';
import { SupportSection } from '../components/home-sections/SupportSection';
import Testimonials from '../components/home-sections/Testimonials';
import Categories from '@/components/home-sections/CategorySection';
import HomeQuickProducts from '@/components/home-sections/HomeQuickProducts';
import NewsletterSection from '../components/home-sections/NewsletterSection';
import HowItWorksSection from '../components/home-sections/HowItWorksSection';
import { FaShieldHeart, FaTruck, FaStar, FaPills, FaHeartPulse, FaLeaf } from 'react-icons/fa6';
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

const SLIDES = [
  {
    badge: '🏥 Trusted by 50,000+ Customers',
    heading: 'Your Health,',
    highlight: 'Our Priority',
    sub: 'Get authentic medicines delivered to your doorstep. Fast, reliable, and trusted by thousands across the country.',
    icon: <FaPills className="text-emerald-300" size={28} />,
  },
  {
    badge: '💊 10,000+ Medicines In Stock',
    heading: 'Find the Right',
    highlight: 'Medicine Fast',
    sub: 'Browse Pain Relief, Antibiotics, Vitamins, Diabetes Care and more — all from verified sellers in one place.',
    icon: <FaHeartPulse className="text-emerald-300" size={28} />,
  },
  {
    badge: '🚚 Fast & Reliable Delivery',
    heading: 'Delivered Safe,',
    highlight: 'Delivered Fast',
    sub: 'Order before noon and get same-day delivery. Track your package in real-time from checkout to doorstep.',
    icon: <FaLeaf className="text-emerald-300" size={28} />,
  },
];

export default function Home() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative h-[65vh] min-h-[520px] flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/hero.png)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-teal-800/75 to-emerald-700/65" />

        {/* Floating orbs */}
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ repeat: Infinity, duration: 6 }}
          className="absolute top-16 left-10 w-48 h-48 bg-emerald-400 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ repeat: Infinity, duration: 8, delay: 2 }}
          className="absolute bottom-20 right-10 w-64 h-64 bg-teal-300 rounded-full blur-3xl pointer-events-none" />

        {/* Slide content */}
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                {SLIDES[slide].icon} {SLIDES[slide].badge}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                {SLIDES[slide].heading}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                  {SLIDES[slide].highlight}
                </span>
              </h1>
              <p className="text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
                {SLIDES[slide].sub}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTAs */}
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Link href="/shop" className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all duration-300">
              Shop Now →
            </Link>
            <Link href="/about" className="border-2 border-white/70 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-emerald-800 transition-all duration-300 backdrop-blur-sm">
              Learn More
            </Link>
          </motion.div>

          {/* Slide dots */}
          <div className="flex justify-center gap-2 mt-8">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === slide ? 'w-6 h-2.5 bg-emerald-400' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-9 border-2 border-white/40 rounded-full flex justify-center pt-1.5">
            <motion.div
              className="w-1.5 h-2 bg-white/70 rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
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
