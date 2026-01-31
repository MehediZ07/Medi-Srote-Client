'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { SellerMedicine } from '../../../types/seller';
import { Category } from '../../../types/api';
import { medicineSchema, MedicineFormData } from '../../../lib/medicine-validation';
import { FaPlus } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SellerMedicines() {
  const [medicines, setMedicines] = useState<SellerMedicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<SellerMedicine | null>(null);

  const router = useRouter();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<MedicineFormData>({
    resolver: zodResolver(medicineSchema),
  });

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await api.get('/api/seller/medicines');
      setMedicines(response.data.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const openForm = (medicine?: SellerMedicine) => {
    if (medicine) {
      setEditingMedicine(medicine);
      setValue('name', medicine.name);
      setValue('description', medicine.description);
      setValue('price', medicine.price);
      setValue('stock', medicine.stock);
      setValue('categoryId', medicine.category.id);
      setValue('image', medicine.image || '');
    } else {
      setEditingMedicine(null);
      reset();
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMedicine(null);
    reset();
  };

  const onSubmit = async (data: MedicineFormData) => {
    try {
      if (editingMedicine) {
        await api.put(`/api/seller/medicines/${editingMedicine.id}`, data);
        toast.success('Medicine updated successfully');
      } else {
        await api.post('/api/seller/medicines', data);
        toast.success('Medicine created successfully');
      }
      fetchMedicines();
      closeForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteMedicine = async (id: string, name: string) => {
    try {
      await api.delete(`/api/seller/medicines/${id}`);
      toast.success(`"${name}" deleted successfully`);
      fetchMedicines();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete medicine');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="SELLER">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B0F4]"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="SELLER">
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

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Medicines</h1>
          <button
            onClick={() => openForm()}
            className="flex items-center justify-center bg-[#00B0F4] text-white px-6 py-3 rounded-lg cursor-pointer"
          >
            <FaPlus className="mr-2" /> Add New Medicine
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Medicine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medicines.map(medicine => (
                <tr key={medicine.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded mr-4">
                        {medicine.image && (
                          <img
                            src={medicine.image}
                            alt={medicine.name}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm text-gray-600 line-clamp-1">{medicine.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{medicine.category.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${medicine.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{medicine.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        medicine.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {medicine.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => openForm(medicine)}
                      className="text-[#00B0F4] hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMedicine(medicine.id, medicine.name)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    {...register('name')}
                    className="w-full p-[6px] border border-gray-300 rounded-lg"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    {...register('description')}
                    rows={2}
                    className="w-full p-[6px] border border-gray-300 rounded-lg"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    {...register('categoryId')}
                    className="w-full p-[6px] border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      {...register('price', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className="w-full p-[6px] border border-gray-300 rounded-lg"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                    <input
                      {...register('stock', { valueAsNumber: true })}
                      type="number"
                      className="w-full p-[6px] border border-gray-300 rounded-lg"
                    />
                    {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    {...register('image')}
                    type="url"
                    className="w-full p-[6px] border border-gray-300 rounded-lg"
                  />
                  {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
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
                    className="flex-1 bg-[#00B0F4] text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingMedicine ? 'Update' : 'Create'}
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