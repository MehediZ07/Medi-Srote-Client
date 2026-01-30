'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { Category } from '../../../types/api';
import { categorySchema, CategoryFormData } from '../../../lib/category-validation';

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

export default function AdminCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const openForm = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setValue('name', category.name);
      setValue('description', category.description || '');
    } else {
      setEditingCategory(null);
      reset();
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await api.put(`/api/categories/${editingCategory.id}`, data);
      } else {
        await api.post('/api/categories', data);
      }
      fetchCategories();
      closeForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await api.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B0F4]"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            onClick={() => router.back()}
            className="mb-6 flex items-center text-[#00B0F4] hover:text-[#00B0F4] font-medium transition-colors"
            {...fadeInUp}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </motion.button>
          
          <motion.div className="flex justify-between items-center mb-8" {...fadeInUp}>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
              <p className="text-gray-600 mt-2">Manage medicine categories</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openForm()}
              className="bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] hover:from-blue-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg font-semibold"
            >
              Add New Category
            </motion.button>
          </motion.div>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer} initial="initial" animate="animate">
            {categories.map(category => (
              <motion.div key={category.id} variants={fadeInUp} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    </div>
                    <p className="text-gray-600">{category.description || 'No description'}</p>
                    <p className="text-sm text-gray-500 mt-2">Created: {new Date(category.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openForm(category)}
                      className="text-[#00B0F4] hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {categories.length === 0 && (
            <motion.div className="text-center py-16" {...fadeInUp}>
              <div className="text-6xl mb-4">🏷️</div>
              <p className="text-gray-600 mb-4 text-lg">No categories found</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={() => openForm()}
                className="bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] hover:from-blue-700 hover:to-blue-700 text-white px-8 py-3 rounded-full transition-all duration-200 shadow-lg font-semibold"
              >
                Create First Category
              </motion.button>
            </motion.div>
          )}
          
          {showForm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      {...register('name')}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#45CBFF] focus:border-[#45CBFF] transition-all"
                      placeholder="Category name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#45CBFF] focus:border-[#45CBFF] transition-all"
                      placeholder="Category description (optional)"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                  </div>
                  
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      type="button"
                      onClick={closeForm}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] hover:from-blue-700 hover:to-blue-700 text-white py-2 rounded-lg transition-all duration-200 disabled:opacity-50 font-medium"
                    >
                      {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}