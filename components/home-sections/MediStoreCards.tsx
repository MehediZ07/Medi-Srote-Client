'use client';

import { motion } from 'framer-motion';
import { FaTruck, FaHeadset, FaShieldHeart, FaGlobe } from 'react-icons/fa6';
import { MdVerified } from 'react-icons/md';

const cards = [
  { icon: <FaTruck size={22} className="text-emerald-600 dark:text-emerald-400" />, title: 'Fast & Reliable Delivery', desc: 'Get your medicines delivered quickly to your doorstep with real-time tracking.' },
  { icon: <FaHeadset size={22} className="text-emerald-600 dark:text-emerald-400" />, title: '24/7 Customer Support', desc: 'Round-the-clock assistance from licensed pharmacists for all your healthcare needs.' },
  { icon: <MdVerified size={22} className="text-emerald-600 dark:text-emerald-400" />, title: 'Verified & Authentic', desc: '100% genuine medicines sourced directly from licensed manufacturers and distributors.' },
  { icon: <FaGlobe size={22} className="text-emerald-600 dark:text-emerald-400" />, title: 'Easy Online Ordering', desc: 'Simple, hassle-free checkout with multiple payment options and prescription upload.' },
];

const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };

export default function MediStoreCards() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-widest">Our Advantages</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Why Choose MediStore?</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">We make healthcare accessible, affordable, and convenient for everyone.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div key={card.title} initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: i * 0.1, duration: 0.5 }} whileHover={{ y: -4 }}
              className="bg-gray-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 rounded-2xl p-6 transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60 rounded-xl flex items-center justify-center mb-4 transition-colors">
                {card.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <FaShieldHeart size={24} className="text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Affordable Prices & Insurance Coverage</h3>
            <p className="text-white/85 text-lg leading-relaxed">Best prices on authentic medicines with insurance support. Save more with our exclusive deals and verified seller network.</p>
          </div>
          <div className="flex-shrink-0">
            <img src="/Mask group.png" alt="Insurance" className="w-64 h-auto object-contain drop-shadow-xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
