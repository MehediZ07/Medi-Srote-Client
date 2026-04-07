'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaHospital, FaTruck, FaPills } from 'react-icons/fa6';

const fadeInUp = { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div className="text-center mb-16" {...fadeInUp}>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About MediStore</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Your trusted online pharmacy connecting customers with verified sellers for safe, convenient healthcare solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div {...fadeInUp}>
            <Image src="/Medi-Store.png" alt="MediStore" width={400} height={300} className="rounded-2xl shadow-lg" />
          </motion.div>
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              MediStore is dedicated to making healthcare accessible and convenient for everyone. We connect customers with trusted pharmaceutical sellers, ensuring quality medications are just a click away.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Our platform provides a secure marketplace where verified sellers can offer their products while customers enjoy competitive prices and reliable service.
            </p>
          </motion.div>
        </div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" {...fadeInUp}>
          {[
            { icon: <FaHospital className="text-2xl text-emerald-600" />, title: 'Trusted Sellers', desc: 'All our sellers are verified and licensed pharmaceutical providers.' },
            { icon: <FaTruck className="text-2xl text-emerald-600" />, title: 'Fast Delivery', desc: 'Quick and secure delivery of your medications to your doorstep.' },
            { icon: <FaPills className="text-2xl text-emerald-600" />, title: 'Quality Assured', desc: 'All medications are sourced from licensed manufacturers and distributors.' },
          ].map(item => (
            <div key={item.title} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 text-center">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700" {...fadeInUp}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Why Choose MediStore?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'For Customers', items: ['Wide selection of medications', 'Competitive prices from multiple sellers', 'Secure payment and delivery', 'Easy prescription management', '24/7 customer support'] },
              { title: 'For Sellers', items: ['Reach more customers online', 'Easy inventory management', 'Secure payment processing', 'Analytics and reporting tools', 'Dedicated seller support'] },
            ].map(col => (
              <div key={col.title}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{col.title}</h3>
                <ul className="space-y-2">
                  {col.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-emerald-500">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
