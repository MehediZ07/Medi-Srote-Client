'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      const response = await api.put('/api/profile', data);
      setUser(response.data.data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await api.put('/api/profile/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPassword();
      toast.success('Password changed successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.h1 className="text-3xl font-bold text-gray-900 mb-8" {...fadeInUp}>My Profile</motion.h1>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#45CBFF] to-[#45CBFF] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">👤</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    {...registerProfile('name')}
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#45CBFF] focus:border-[#45CBFF] transition-all"
                  />
                  {profileErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    {...registerProfile('email')}
                    type="email"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#45CBFF] focus:border-[#45CBFF] transition-all"
                  />
                  {profileErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    {...registerProfile('phone')}
                    type="tel"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#45CBFF] focus:border-[#45CBFF] transition-all"
                  />
                  {profileErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.phone.message}</p>
                  )}
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isProfileSubmitting}
                  className="w-full bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] hover:from-blue-700 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-200 disabled:opacity-50 font-semibold shadow-lg"
                >
                  {isProfileSubmitting ? 'Updating...' : 'Update Profile'}
                </motion.button>
              </form>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#45CBFF] to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              </div>
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    {...registerPassword('currentPassword')}
                    type="password"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#45CBFF] focus:border-[#45CBFF] transition-all"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    {...registerPassword('newPassword')}
                    type="password"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#45CBFF] focus:border-[#45CBFF] transition-all"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    {...registerPassword('confirmPassword')}
                    type="password"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#45CBFF] focus:border-[#45CBFF] transition-all"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isPasswordSubmitting}
                  className="w-full bg-gradient-to-r from-[#00B0F4] to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white py-3 rounded-lg transition-all duration-200 disabled:opacity-50 font-semibold shadow-lg"
                >
                  {isPasswordSubmitting ? 'Changing...' : 'Change Password'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}