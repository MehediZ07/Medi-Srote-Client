'use client';

import { motion } from 'framer-motion';
import { FaMagnifyingGlass, FaCartShopping, FaCreditCard, FaTruck } from 'react-icons/fa6';

const steps = [
  { step: '01', title: 'Browse Medicines', desc: 'Search and filter from thousands of authentic medicines across multiple categories.', icon: <FaMagnifyingGlass size={28} className="text-emerald-600 dark:text-emerald-400" /> },
  { step: '02', title: 'Add to Cart', desc: 'Select your medicines, choose quantity, and add them to your shopping cart easily.', icon: <FaCartShopping size={28} className="text-emerald-600 dark:text-emerald-400" /> },
  { step: '03', title: 'Checkout Securely', desc: 'Enter your delivery address and complete payment through our secure gateway.', icon: <FaCreditCard size={28} className="text-emerald-600 dark:text-emerald-400" /> },
  { step: '04', title: 'Fast Delivery', desc: 'Your medicines are packed and delivered to your doorstep quickly and safely.', icon: <FaTruck size={28} className="text-emerald-600 dark:text-emerald-400" /> },
];

const fadeInUp = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } };

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-widest">Simple Process</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">How It Works</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">Order your medicines in 4 simple steps</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <motion.div key={item.step} initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: index * 0.12, duration: 0.5 }} className="relative text-center group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[62%] w-[76%] h-px bg-gradient-to-r from-emerald-300 dark:from-emerald-700 to-transparent z-0" />
              )}
              <div className="relative z-10">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-200 dark:border-emerald-700 group-hover:border-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 shadow-sm">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400 tracking-widest uppercase">{item.step}</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
