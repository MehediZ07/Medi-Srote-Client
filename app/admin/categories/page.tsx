'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import api from '../../../lib/api';
import { Category } from '../../../types/api';
import { categorySchema, CategoryFormData } from '../../../lib/category-validation';
import { FaPlus, FaPen, FaTrash, FaTag } from 'react-icons/fa6';
import { MdOutlineCategory, MdDashboard } from 'react-icons/md';
import { FaBox, FaUserTie, FaUsers } from 'react-icons/fa6';
import * as dc from '../../../lib/darkClasses';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: <MdDashboard size={18} /> },
  { href: '/admin/users', label: 'Users', icon: <FaUsers size={16} /> },
  { href: '/admin/orders', label: 'Orders', icon: <FaBox size={16} /> },
  { href: '/admin/categories', label: 'Categories', icon: <MdOutlineCategory size={18} /> },
  { href: '/profile', label: 'Profile', icon: <FaUserTie size={16} /> },
];

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<CategoryFormData>({ resolver: zodResolver(categorySchema) });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try { const r = await api.get('/api/categories'); setCategories(r.data.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const openForm = (cat?: Category) => {
    if (cat) { setEditing(cat); setValue('name', cat.name); setValue('description', cat.description || ''); }
    else { setEditing(null); reset(); }
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editing) { await api.put(`/api/categories/${editing.id}`, data); toast.success('Category updated'); }
      else { await api.post('/api/categories', data); toast.success('Category created'); }
      fetchCategories(); closeForm();
    } catch (e: any) { toast.error(e.response?.data?.message || 'Operation failed'); }
  };

  const deleteCategory = async (id: string, name: string) => {
    try { await api.delete(`/api/categories/${id}`); toast.success(`"${name}" deleted`); fetchCategories(); }
    catch (e: any) { toast.error(e.response?.data?.message || 'Failed to delete'); }
  };

  if (loading) return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <DashboardLayout title="Category Management" navItems={NAV_ITEMS} role="ADMIN" roleLabel="Admin">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">{categories.length} categories</p>
            <button onClick={() => openForm()} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <FaPlus size={12} /> Add Category
            </button>
          </div>

          {categories.length === 0 ? (
            <div className={`text-center py-16 ${dc.card}`}>
              <FaTag size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No categories yet</p>
              <button onClick={() => openForm()} className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
                Create First Category
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat, i) => (
                <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`${dc.card} p-5 hover:shadow-sm transition-shadow`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaTag size={14} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{cat.name}</h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{new Date(cat.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openForm(cat)} className="p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        <FaPen size={12} />
                      </button>
                      <button onClick={() => deleteCategory(cat.id, cat.name)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                  {cat.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2">{cat.description}</p>}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className={`${dc.modalBg} p-6 w-full max-w-md`}>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">{editing ? 'Edit Category' : 'Add New Category'}</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className={dc.label}>Name</label>
                    <input {...register('name')} placeholder="Category name" className={`${dc.formInput} focus:ring-purple-200 dark:focus:ring-purple-800 focus:border-purple-400`} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className={dc.label}>Description</label>
                    <textarea {...register('description')} rows={3} placeholder="Optional description" className={`${dc.formInput} focus:ring-purple-200 dark:focus:ring-purple-800 focus:border-purple-400 resize-none`} />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={closeForm} className="flex-1 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                      {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
