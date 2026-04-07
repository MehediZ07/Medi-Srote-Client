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
import { FcGoogle } from 'react-icons/fc';

const fadeInUp = { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
const slideInLeft = { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.8 } };

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-500 focus:outline-none transition-all text-sm";

export default function Register() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [animationData, setAnimationData] = useState<any>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CUSTOMER' },
  });

  useEffect(() => {
    fetch('/animation/form registration.json').then(r => r.json()).then(setAnimationData).catch(console.error);
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post('/api/auth/register', data);
      toast.success('Account created! Logging you in...');
      const loginResponse = await api.post('/api/auth/login', { email: data.email, password: data.password });
      const { token, user } = loginResponse.data.data;
      setToken(token);
      setUser(user);
      if (user.role === 'CUSTOMER') router.push('/shop');
      else if (user.role === 'SELLER') router.push('/seller/dashboard');
      else if (user.role === 'ADMIN') router.push('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <motion.div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

        {/* Left animation */}
        <motion.div className="hidden lg:flex flex-col items-center justify-center p-8" {...slideInLeft}>
          <div className="w-96 h-96">
            {animationData
              ? <Lottie animationData={animationData} loop />
              : <div className="flex items-center justify-center h-full"><div className="animate-spin h-16 w-16 border-b-2 border-emerald-500 rounded-full" /></div>
            }
          </div>
        </motion.div>

        {/* Right form */}
        <motion.div className="flex items-center justify-center" {...fadeInUp}>
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-slate-700">

              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create Account</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Join MediStore today</p>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-slate-600 rounded-xl py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors mb-5 "
              >
                <FcGoogle size={20} />
                Continue with Google
              </button>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-600" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-slate-800 px-3 text-gray-400 dark:text-gray-500">or register with email</span></div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <input {...register('name')} className={inputClass} placeholder="Enter your name" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <input {...register('email')} type="email" className={inputClass} placeholder="Enter your email" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Account Type</label>
                  <select {...register('role')} className={inputClass}>
                    <option value="CUSTOMER">Customer</option>
                    <option value="SELLER">Seller</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <input {...register('password')} type="password" className={inputClass} placeholder="Create password (min 6 chars)" />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center transition-all disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]">
                  {isSubmitting
                    ? <><span className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
                    : 'Create Account'
                  }
                </motion.button>
              </form>

              <p className="text-center text-sm mt-5 text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
