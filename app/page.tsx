'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import CTASection from '../components/home-sections/CTASection';
import FAQSection from '../components/home-sections/FAQSection';
import MediStoreCards from '../components/home-sections/MediStoreCards';
import { SupportSection } from '../components/home-sections/SupportSection';
import Testimonials from '../components/home-sections/Testimonials';
import Categories from '@/components/home-sections/CategorySection';
import HomeQuickProducts from '@/components/home-sections/HomeQuickProducts';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero.png)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#00B0F4]/70 to-blue-[#45CBFF]/70"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div {...fadeInUp}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Your Health,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"> Our Priority</span>
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-lg">
              Get authentic medicines delivered to your doorstep. Fast, reliable, and trusted by thousands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="bg-white text-[#00B0F4] px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Shop Now 
              </Link>
              <Link href="/about" className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <MediStoreCards />

      <Categories />

      <HomeQuickProducts />

      <section className="py-20 bg-[#45CBFF]/20 backdrop-blur-md texst-gray-600">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Stat number="50K+" label="Happy Customers" />
            <Stat number="10K+" label="Medicines Available" />
            <Stat number="500+" label="Verified Pharmacies" />
            <Stat number="24/7" label="Customer Support" />
          </motion.div>
        </div>
      </section>

      <SupportSection />

      <Testimonials />

      <FAQSection />

      <CTASection />
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <motion.div variants={fadeInUp} className="text-center">
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-lg opacity-90">{label}</div>
    </motion.div>
  );
}

function Testimonial({ name, text, rating }: { name: string; text: string; rating: number }) {
  return (
    <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex mb-4">
        {[...Array(rating)].map((_, index) => (
          <span key={index} className="text-yellow-400 text-xl">⭐</span>
        ))}
      </div>
      <p className="text-gray-600 mb-4 italic">"{text}"</p>
      <p className="font-semibold text-gray-900">- {name}</p>
    </motion.div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </motion.div>
  );
}