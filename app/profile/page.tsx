'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    ease: 'easeOut' as const,
  },
} as const;

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    image: user?.image || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.patch('/api/auth/profile', {
        name: formData.name,
        image: formData.image
      });

      setUser(response.data.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      image: user?.image || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center bg-gray-50">
          <div className="text-lg font-medium text-gray-600">Loading profile...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-gradient-to-b from-[#45CBFF]/10 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.h1
            className="text-3xl font-bold text-gray-900 mb-10 text-center"
            {...fadeInUp}
          >
            My Profile
          </motion.h1>

          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-100/70 overflow-hidden"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            {isEditing ? (
              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B0F4] focus:border-transparent"
                      required
                      minLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B0F4] focus:border-transparent"
                      placeholder="public\profile-icon.avif"
                    />
                  </div>

                  {formData.image && (
                    <div className="flex justify-center">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png';
                        }}
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-[#00B0F4] text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className="px-8 pt-10 pb-6 flex flex-col items-center bg-gradient-to-b from-gray-50/60 to-transparent">
                  <div className="relative mb-5">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#45CBFF]/70 shadow-md">
                      <img
                        src={user.image || '/placeholder.png'} 
                        alt={`${user.name}'s profile`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png';
                        }}
                      />
                    </div>
                    {user.status?.toLowerCase() === 'active' && (
                      <span className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white ring-1 ring-green-600/30" />
                    )}
                  </div>

                  <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                  <p className="mt-1 text-gray-500 text-sm">{user.email}</p>
                </div>

                <div className="px-8 pb-6 pt-2 bg-[#45CBFF]/10">
                  <div className="space-y-4 divide-y divide-gray-100">
                    <InfoRow label="Role" value={user.role} capitalize />
                    <InfoRow label="Status" value={user.status} capitalize />
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-6 bg-[#00B0F4] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#00A0E4] transition-colors"
                  >
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

type InfoRowProps = {
  label: string;
  value: string | number | undefined;
  capitalize?: boolean;
};

function InfoRow({ label, value, capitalize = false }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center py-3 first:pt-4 last:pb-0 borber-b border-gray-200">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span
        className={`text-sm font-medium text-gray-900 ${capitalize ? 'capitalize' : ''}`}
      >
        {value ?? '—'}
      </span>
    </div>
  );
}
