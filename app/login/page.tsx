'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { loginSchema, LoginFormData } from '../../lib/validations';
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

export default function Login() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [animationData, setAnimationData] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    fetch('/animation/Login.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error));
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post('/api/auth/login', data);
      const { token, user } = response.data.data;
      
      setToken(token);
      setUser(user);
      
      toast.success('Welcome back! Login successful.');

      const role = user.role;
      if (role === 'CUSTOMER') router.push('/shop');
      else if (role === 'SELLER') router.push('/seller/dashboard');
      else if (role === 'ADMIN') router.push('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50 min-h-screen flex items-center justify-center p-4">
      <motion.div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <motion.div className="hidden lg:flex flex-col items-center justify-center p-8" {...slideInLeft}>
          <div className="w-96 h-96 mb-8">
            {animationData ? (
              <Lottie 
                animationData={animationData}
                loop={true}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50 rounded-2xl">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00B0F4]"></div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div className="flex items-center justify-center" {...fadeInUp}>
          <div className="w-full max-w-md">
            <div className="glass-card rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your MediStore account</p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:border-[#45CBFF] focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm font-medium backdrop-blur-sm"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs font-medium mt-1">{errors.email.message}</p>
                  )}
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:border-[#45CBFF] focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm font-medium backdrop-blur-sm"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs font-medium mt-1">{errors.password.message}</p>
                  )}
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] hover:from-blue-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none min-h-[48px] flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </form>
              
              <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <p className="text-sm text-gray-600">
                  New to MediStore?{' '}
                  <Link 
                    href="/register" 
                    className="font-semibold text-[#00B0F4] hover:text-[#00B0F4] hover:underline transition-colors"
                  >
                    Create Account
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}