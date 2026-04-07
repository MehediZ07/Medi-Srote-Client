'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Medicine, MedicinesResponse } from '../../types/api';
import api from '../../lib/api';
import Link from 'next/link';

const fadeInUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

const HomeQuickProducts: React.FC = () => {
  const [products, setProducts] = useState<Medicine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api.get<MedicinesResponse>('/api/medicines?limit=20')
      .then(r => setProducts(r.data.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => setCurrentIndex(prev => (prev + 1) % products.length), 2000);
    return () => clearInterval(interval);
  }, [products]);

  const getCardsToShow = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 920) return 2;
    if (window.innerWidth < 1024) return 3;
    return 4;
  };

  const cardsToShow = getCardsToShow();

  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div className="text-center mb-8" variants={fadeInUp} initial="initial" animate="animate">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quick Look</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Featured products for you</p>
        </motion.div>

        <div className="overflow-hidden relative">
          <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${(100 / cardsToShow) * currentIndex}%)` }}>
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-full sm:w-[calc(50%)] md:w-[calc(33.33%)] lg:w-[calc(25%)] px-2">
                <Link href={`/shop/${product.id}`} passHref>
                  <div className="relative aspect-[5/3] rounded-xl overflow-hidden cursor-pointer transition-transform">
                    <img src={product.image || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                      <p className="font-bold text-md">${product.price}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeQuickProducts;
