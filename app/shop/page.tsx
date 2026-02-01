'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { Medicine, Category, MedicinesResponse } from '../../types/api';
import Link from 'next/link';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { FaCartPlus } from 'react-icons/fa6';

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

function ShopContent() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categories: searchParams.get('categories') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: searchParams.get('inStock') === 'true',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.categories) params.append('categories', filters.categories);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.inStock) params.append('status', 'ACTIVE');
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());
      
      const response = await api.get<MedicinesResponse>(`/api/medicines?${params}`);
      setMedicines(response.data.data);
      setTotal(response.data.pagination.total);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
    
    const params = new URLSearchParams();
    if (updated.search) params.append('search', updated.search);
    if (updated.categories) params.append('categories', updated.categories);
    if (updated.minPrice) params.append('minPrice', updated.minPrice);
    if (updated.maxPrice) params.append('maxPrice', updated.maxPrice);
    if (updated.inStock) params.append('inStock', 'true');
    if (updated.page > 1) params.append('page', updated.page.toString());
    
    router.push(`/shop?${params}`);
  };

  const changePage = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/shop?${params}`);
  };

  const handleAddToCart = (medicine: Medicine) => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
      router.push('/login');
      return;
    }
    
    if (medicine.stock <= 0) {
      toast.error('This medicine is out of stock');
      return;
    }
    
    addItem({
      medicineId: medicine.id,
      name: medicine.name,
      price: medicine.price,
      quantity: 1,
      stock: medicine.stock,
      image: medicine.image
    });
    
    toast.success(`${medicine.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.h1 className="text-3xl font-bold text-gray-900 mb-8" {...fadeInUp}>Shop Medicines</motion.h1>
        
        <motion.div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100" {...fadeInUp}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-[#45CBFF] focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Search medicines..."
                />
              </div>
            </div>
            
            <div>
              <select
                value={filters.categories}
                onChange={(e) => updateFilters({ categories: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#45CBFF] focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => updateFilters({ minPrice: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#45CBFF] focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#45CBFF] focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => updateFilters({ inStock: e.target.checked })}
                className="mr-2 text-[#00B0F4] rounded focus:ring-[#45CBFF]"
              />
              <span className="text-sm font-medium text-gray-700">In Stock Only</span>
            </label>
            
            <div className="text-sm text-gray-600">
              Showing {medicines.length} of {total} medicines
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-b-2 border-[#00B0F4]"
            ></motion.div>
          </div>
        ) : (
          <>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8" variants={staggerContainer} initial="initial" animate="animate">
              {medicines.map(medicine => (
              <motion.div
                key={medicine.id}
                variants={fadeInUp}
                whileHover={{ y: -2 }}
                className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="h-48 bg-white rounded-t-lg overflow-hidden">
                  {medicine.image && (
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {medicine.name}
                  </h3>
                
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {medicine.description}
                  </p>
                
                  <p className="text-xs text-gray-500 mb-4">
                    Listed by <span className="font-medium text-gray-700">{medicine.seller.name}</span>
                  </p>
                
                  <div className="mt-auto border-t border-gray-200 pt-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-[#00B0F4]">
                        ${medicine.price}
                      </span>
                
                      <span
                        className={`text-xs px-2 py-1 rounded-md font-medium ${
                          medicine.stock > 0
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {medicine.stock > 0 ? `Stock: ${medicine.stock}` : "Out of stock"}
                      </span>
                    </div>
                      
                    <div className="flex space-x-2">
                      {(!user || user?.role === 'CUSTOMER') && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleAddToCart(medicine)}
                            disabled={medicine.stock <= 0}
                            className="flex-1 flex gap-1 items-center justify-center space-x-1 border border-[#00B0F4] text-[#00B0F4] py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaCartPlus size={16} />
                            <span>Add</span>
                          </motion.button>
                          
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex-1">
                            <Link
                              href={`/shop/${medicine.id}`}
                              className="block w-full text-center bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] text-white py-2.5 rounded-lg font-semibold transition-all shadow-sm"
                            >
                              View Details
                            </Link>
                          </motion.div>
                        </>
                      )}
                      
                      {(user?.role === 'ADMIN' || user?.role === 'SELLER') && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full">
                          <Link
                            href={`/shop/${medicine.id}`}
                            className="block w-full text-center bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] text-white py-2.5 rounded-lg font-semibold transition-all shadow-sm"
                          >
                            View Details
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              ))}
            </motion.div>

            {totalPages > 1 && (
              <motion.div className="flex justify-center space-x-2" {...fadeInUp}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => changePage(page)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      page === filters.page
                        ? 'bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><div className="rounded-full h-12 w-12 border-b-2 border-[#00B0F4] animate-spin"></div></div>}>
      <ShopContent />
    </Suspense>
  );
}