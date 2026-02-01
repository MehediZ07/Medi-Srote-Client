'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaHospital, FaTruck, FaPills } from 'react-icons/fa6';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div className="text-center mb-16" {...fadeInUp}>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About MediStore</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted online pharmacy connecting customers with verified sellers for safe, convenient healthcare solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div {...fadeInUp}>
            <Image
              src="/Medi-Store.png"
              alt="MediStore"
              width={400}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </motion.div>
          
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              MediStore is dedicated to making healthcare accessible and convenient for everyone. We connect customers with trusted pharmaceutical sellers, ensuring quality medications are just a click away.
            </p>
            <p className="text-gray-600">
              Our platform provides a secure marketplace where verified sellers can offer their products while customers enjoy competitive prices and reliable service.
            </p>
          </motion.div>
        </div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" {...fadeInUp}>
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHospital className="text-2xl text-[#00B0F4]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Sellers</h3>
            <p className="text-gray-600">All our sellers are verified and licensed pharmaceutical providers.</p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTruck className="text-2xl text-[#00B0F4]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick and secure delivery of your medications to your doorstep.</p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPills className="text-2xl text-[#00B0F4]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assured</h3>
            <p className="text-gray-600">All medications are sourced from licensed manufacturers and distributors.</p>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-xl p-8 shadow-lg" {...fadeInUp}>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Why Choose MediStore?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For Customers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Wide selection of medications</li>
                <li>• Competitive prices from multiple sellers</li>
                <li>• Secure payment and delivery</li>
                <li>• Easy prescription management</li>
                <li>• 24/7 customer support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For Sellers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Reach more customers online</li>
                <li>• Easy inventory management</li>
                <li>• Secure payment processing</li>
                <li>• Analytics and reporting tools</li>
                <li>• Dedicated seller support</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}