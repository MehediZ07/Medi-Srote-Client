'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Pagination from '../../../components/dashboard/Pagination';
import api from '../../../lib/api';
import { SellerMedicine } from '../../../types/seller';
import { Category } from '../../../types/api';
import { medicineSchema, MedicineFormData } from '../../../lib/medicine-validation';
import { FaPlus, FaPen, FaTrash, FaMagnifyingGlass } from 'react-icons/fa6';
import { MdDashboard } from 'react-icons/md';
import { FaBox, FaPills, FaUser } from 'react-icons/fa6';

const NAV_ITEMS = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: <MdDashboard size={18} /> },
  { href: '/seller/medicines', label: 'Medicines', icon: <FaPills size={16} /> },
  { href: '/seller/orders', label: 'Orders', icon: <FaBox size={16} /> },
  { href: '/profile', label: 'Profile', icon: <FaUser size={16} /> },
];

const PER_PAGE = 8;

export default function SellerMedicines() {
  const [medicines, setMedicines] = useState<SellerMedicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SellerMedicine | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<MedicineFormData>({ resolver: zodResolver(medicineSchema) });

  useEffect(() => { fetchMedicines(); fetchCategories(); }, []);

  const fetchMedicines = async () => {
    try { const r = await api.get('/api/seller/medicines'); setMedicines(r.data.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const fetchCategories = async () => {
    try { const r = await api.get('/api/categories'); setCategories(r.data.data); }
    catch (e) { console.error(e); }
  };

  const openForm = (med?: SellerMedicine) => {
    if (med) {
      setEditing(med);
      setValue('name', med.name); setValue('description', med.description);
      setValue('price', med.price); setValue('stock', med.stock);
      setValue('categoryId', med.category.id); setValue('image', med.image || '');
    } else { setEditing(null); reset(); }
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

  const onSubmit = async (data: MedicineFormData) => {
    try {
      if (editing) { await api.put(`/api/seller/medicines/${editing.id}`, data); toast.success('Medicine updated'); }
      else { await api.post('/api/seller/medicines', data); toast.success('Medicine added'); }
      fetchMedicines(); closeForm();
    } catch (e: any) { toast.error(e.response?.data?.message || 'Operation failed'); }
  };

  const deleteMedicine = async (id: string, name: string) => {
    try { await api.delete(`/api/seller/medicines/${id}`); toast.success(`"${name}" deleted`); fetchMedicines(); }
    catch (e: any) { toast.error(e.response?.data?.message || 'Failed to delete'); }
  };

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const handleSearch = (val: string) => { setSearch(val); setPage(1); };

  if (loading) return (
    <ProtectedRoute requiredRole="SELLER">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute requiredRole="SELLER">
      <DashboardLayout title="My Medicines" navItems={NAV_ITEMS} role="SELLER" roleLabel="Seller">
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative">
              <FaMagnifyingGlass size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search medicines..." value={search} onChange={e => handleSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 w-56" />
            </div>
            <button onClick={() => openForm()}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <FaPlus size={12} /> Add Medicine
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-100 dark:border-slate-600">
                  <tr>
                    {['Medicine', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                  {paginated.map(med => (
                    <tr key={med.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-600 overflow-hidden flex-shrink-0">
                            {med.image && <img src={med.image} alt={med.name} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{med.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{med.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{med.category.name}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">${med.price}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{med.stock}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${med.isActive ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'}`}>
                          {med.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openForm(med)} className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"><FaPen size={12} /></button>
                          <button onClick={() => deleteMedicine(med.id, med.name)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"><FaTrash size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">No medicines found</div>}
            <div className="px-4 pb-4">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} itemsPerPage={PER_PAGE} />
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">{editing ? 'Edit Medicine' : 'Add New Medicine'}</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {[
                    { label: 'Name', name: 'name', type: 'text', placeholder: 'Medicine name' },
                    { label: 'Image URL', name: 'image', type: 'url', placeholder: 'https://...' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{f.label}</label>
                      <input {...register(f.name as any)} type={f.type} placeholder={f.placeholder}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
                      {(errors as any)[f.name] && <p className="text-red-500 text-xs mt-1">{(errors as any)[f.name]?.message}</p>}
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                    <textarea {...register('description')} rows={2} placeholder="Medicine description"
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none" />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                    <select {...register('categoryId')} className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price</label>
                      <input {...register('price', { valueAsNumber: true })} type="number" step="0.01" placeholder="0.00"
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Stock</label>
                      <input {...register('stock', { valueAsNumber: true })} type="number" placeholder="0"
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
                      {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={closeForm} className="flex-1 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                      {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Add'}
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
