'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../lib/api';
import { Medicine, Category, MedicinesResponse } from '../../types/api';
import Link from 'next/link';

export default function Shop() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop Medicines</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="Search medicines..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.categories}
                onChange={(e) => updateFilters({ categories: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilters({ minPrice: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => updateFilters({ inStock: e.target.checked })}
                  className="mr-2"
                />
                In Stock Only
              </label>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                Showing {medicines.length} of {total} medicines
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {medicines.map(medicine => (
                  <div key={medicine.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="h-48 bg-gray-200 rounded mb-4">
                      {medicine.image && (
                        <img src={medicine.image} alt={medicine.name} className="w-full h-full object-cover rounded" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{medicine.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{medicine.description}</p>
                    <p className="text-sm text-gray-500 mb-2">by {medicine.seller.name}</p>
                    <p className="text-lg font-bold text-blue-600 mb-2">${medicine.price}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Stock: {medicine.stock > 0 ? medicine.stock : 'Out of stock'}
                    </p>
                    <Link
                      href={`/shop/${medicine.id}`}
                      className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => changePage(page)}
                      className={`px-4 py-2 rounded ${
                        page === filters.page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}