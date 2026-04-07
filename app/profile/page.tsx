'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import * as dc from '../../lib/darkClasses';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: 'easeOut' as const } } as const;

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', image: user?.image || '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.patch('/api/auth/profile', { name: formData.name, image: formData.image });
      setUser(response.data.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally { setLoading(false); }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || '', image: user?.image || '' });
    setIsEditing(false);
  };

  if (!user) return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="text-gray-600 dark:text-gray-400">Loading profile...</div>
      </div>
    </ProtectedRoute>
  );

  const inputClass = `w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700 focus:border-emerald-400 focus:outline-none text-sm`;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
        <div className="max-w-md mx-auto">
          <motion.h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center" {...fadeInUp}>
            My Profile
          </motion.h1>

          <motion.div className={`${dc.card} overflow-hidden shadow-sm`}
            initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-5">
                  <div>
                    <label className={dc.label}>Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className={inputClass} required minLength={2} />
                  </div>
                  <div>
                    <label className={dc.label}>Profile Image URL</label>
                    <input type="url" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                      className={inputClass} placeholder="https://example.com/photo.jpg" />
                  </div>
                  {formData.image && (
                    <div className="flex justify-center">
                      <img src={formData.image} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-slate-600"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/profile-icon.avif'; }} />
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button type="submit" disabled={loading}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-medium disabled:opacity-50 transition-colors text-sm">
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={handleCancel}
                      className="flex-1 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className="px-8 pt-10 pb-6 flex flex-col items-center bg-gradient-to-b from-gray-50/60 dark:from-slate-700/40 to-transparent">
                  <div className="relative mb-5">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-200 dark:border-emerald-700 shadow-md">
                      <img src={user.image || '/profile-icon.avif'} alt={`${user.name}'s profile`} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/profile-icon.avif'; }} />
                    </div>
                    {user.status?.toLowerCase() === 'active' && (
                      <span className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 ring-1 ring-green-600/30" />
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
                  <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                </div>

                <div className="px-8 pb-6 pt-2 bg-emerald-50/50 dark:bg-emerald-900/10">
                  <div className="space-y-1 divide-y divide-gray-100 dark:divide-slate-700">
                    <InfoRow label="Role" value={user.role} capitalize />
                    <InfoRow label="Status" value={user.status} capitalize />
                  </div>
                  <button onClick={() => setIsEditing(true)}
                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors text-sm">
                    Edit Profile
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function InfoRow({ label, value, capitalize = false }: { label: string; value?: string | number; capitalize?: boolean }) {
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}:</span>
      <span className={`text-sm font-medium text-gray-900 dark:text-white ${capitalize ? 'capitalize' : ''}`}>{value ?? '—'}</span>
    </div>
  );
}
