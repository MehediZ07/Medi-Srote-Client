'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { Category } from '../../../types/api';
import { categorySchema, CategoryFormData } from '../../../lib/category-validation';

export default function AdminCategories() {
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
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await api.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <button 
            onClick={() => openForm()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add New Category
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-gray-600">{category.description || 'No description'}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openForm(category)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteCategory(category.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {categories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">No categories found</p>
          </div>
        )}
        
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    {...register('name')}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Category name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Category description (optional)"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}