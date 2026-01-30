'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#45CBFF]/10 to-white flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div {...fadeInUp}>
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#00B0F4] mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-[#00B0F4] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#00A0E4] transition-colors"
            >
              Go Home
            </Link>
            <Link 
              href="/shop"
              className="border border-[#00B0F4] text-[#00B0F4] px-6 py-3 rounded-lg font-medium hover:bg-[#00B0F4] hover:text-white transition-colors"
            >
              Browse Medicines
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}