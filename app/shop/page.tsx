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

const fadeInUp = { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

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
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12
  });

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchMedicines(); }, [filters]);

  const fetchCategories = async () => {
    try { const r = await api.get('/api/categories'); setCategories(r.data.data); }
    catch (e) { console.error(e); }
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
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());
      const r = await api.get<MedicinesResponse>(`/api/medicines?${params}`);
      setMedicines(r.data.data);
      setTotal(r.data.pagination.total);
      setTotalPages(r.data.pagination.totalPages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
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
    if (updated.sortBy !== 'createdAt') params.append('sortBy', updated.sortBy);
    if (updated.sortOrder !== 'desc') params.append('sortOrder', updated.sortOrder);
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
      router.push('/login'); return;
    }
    if (medicine.stock <= 0) { toast.error('This medicine is out of stock'); return; }
    addItem({ medicineId: medicine.id, name: medicine.name, price: medicine.price, quantity: 1, stock: medicine.stock, image: medicine.image });
    toast.success(`${medicine.name} added to cart!`);
  };

  const inputClass = "w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8" {...fadeInUp}>Shop Medicines</motion.h1>

        <motion.div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-100 dark:border-slate-700" {...fadeInUp}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={filters.search} onChange={e => updateFilters({ search: e.target.value })}
                className={`${inputClass} pl-10`} placeholder="Search medicines..." />
            </div>
            <select value={filters.categories} onChange={e => updateFilters({ categories: e.target.value })} className={inputClass}>
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <div className="flex space-x-2">
              <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => updateFilters({ minPrice: e.target.value })} className={inputClass} />
              <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilters({ maxPrice: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.inStock} onChange={e => updateFilters({ inStock: e.target.checked })} className="rounded" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">In Stock Only</span>
            </label>
            <div className="flex items-center gap-3">
              <select value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={e => { const [sortBy, sortOrder] = e.target.value.split('-'); updateFilters({ sortBy, sortOrder }); }}
                className="text-sm border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100">
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
              <span className="text-sm text-gray-500 dark:text-gray-400">{medicines.length} of {total}</span>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-slate-700" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded-lg flex-1" />
                    <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded-lg flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8" variants={staggerContainer} initial="initial" animate="animate">
              {medicines.map(medicine => (
                <motion.div key={medicine.id} variants={fadeInUp} whileHover={{ y: -2 }}
                  className="group bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                  <div className="h-48 bg-white dark:bg-slate-700 rounded-t-xl overflow-hidden">
                    {medicine.image && <img src={medicine.image} alt={medicine.name} className="w-full h-full object-contain" />}
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{medicine.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{medicine.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Listed by <span className="font-medium text-gray-700 dark:text-gray-300">{medicine.seller.name}</span>
                    </p>
                    <div className="mt-auto border-t border-gray-100 dark:border-slate-700 pt-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${medicine.price}</span>
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${medicine.stock > 0 ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                          {medicine.stock > 0 ? `Stock: ${medicine.stock}` : 'Out of stock'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {(!user || user?.role === 'CUSTOMER') && (
                          <>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                              onClick={() => handleAddToCart(medicine)} disabled={medicine.stock <= 0}
                              className="flex-1 flex gap-1 items-center justify-center border border-emerald-500 text-emerald-600 dark:text-emerald-400 dark:border-emerald-500 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                              <FaCartPlus size={16} /><span>Add</span>
                            </motion.button>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex-1">
                              <Link href={`/shop/${medicine.id}`} className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-semibold transition-all">
                                View Details
                              </Link>
                            </motion.div>
                          </>
                        )}
                        {(user?.role === 'ADMIN' || user?.role === 'SELLER') && (
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full">
                            <Link href={`/shop/${medicine.id}`} className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-semibold transition-all">
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
                  <motion.button key={page} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => changePage(page)}
                    className={`px-4 py-2 rounded-lg transition-all ${page === filters.page ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600'}`}>
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
    <Suspense fallback={<div className="flex justify-center py-16"><div className="rounded-full h-12 w-12 border-b-2 border-emerald-600 animate-spin"></div></div>}>
      <ShopContent />
    </Suspense>
  );
}
