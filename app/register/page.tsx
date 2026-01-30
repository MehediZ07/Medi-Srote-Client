'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { registerSchema, RegisterFormData } from '../../lib/validations';
import { useAuthStore } from '../../store/authStore';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const slideInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8 }
};

export default function Register() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [animationData, setAnimationData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CUSTOMER',
    },
  });

  useEffect(() => {
    fetch('/animation/form registration.json')
      .then(res => res.json())
      .then(setAnimationData)
      .catch(console.error);
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post('/api/auth/register', data);
      toast.success('Account created! Logging you in...');

      const loginResponse = await api.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { token, user } = loginResponse.data.data;

      setToken(token);
      setUser(user);

      if (user.role === 'CUSTOMER') router.push('/shop');
      else if (user.role === 'SELLER') router.push('/seller/dashboard');
      else if (user.role === 'ADMIN') router.push('/admin');

    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center p-8"
          {...slideInLeft}
        >
          <div className="w-96 h-96">
            {animationData ? (
              <Lottie animationData={animationData} loop />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin h-16 w-16 border-b-2 border-[#00B0F4] rounded-full" />
              </div>
            )}
          </div>
        </motion.div>

        <motion.div className="flex items-center justify-center" {...fadeInUp}>
          <div className="w-full max-w-md">
            <div className="glass-card rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Account
                </h1>
                <p className="text-gray-600">Join MediStore today</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200"
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    {...register('role')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="SELLER">Seller</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    {...register('password')}
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200"
                    placeholder="Create password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full bg-[#00B0F4] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
              </form>

              <p className="text-center text-sm mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-[#00B0F4] font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
