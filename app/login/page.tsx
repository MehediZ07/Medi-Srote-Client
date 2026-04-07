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
import { FcGoogle } from 'react-icons/fc';

const fadeInUp = { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
const slideInLeft = { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.8 } };

const DEMO_CREDENTIALS = [
  { label: 'Customer', email: 'john.customer@email.com', password: 'customer123', name: 'John Smith', role: 'CUSTOMER', color: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50', sub: 'john.customer@email.com' },
  { label: 'Seller', email: 'pharma.one@email.com', password: 'seller123', name: 'Pharma One', role: 'SELLER', color: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50', sub: 'pharma.one@email.com' },
  { label: 'Admin', email: 'admin@medistore.com', password: 'admin123', name: 'MediStore Admin', role: 'ADMIN', color: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50', sub: 'admin@medistore.com' },
];

const inputClass = "w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all duration-200 text-sm font-medium";

export default function Login() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [animationData, setAnimationData] = useState(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    fetch('/animation/Login.json').then(r => r.json()).then(setAnimationData).catch(console.error);
  }, []);

  const createDemoAccount = async (email: string, password: string, name: string, role: string) => {
    try { await api.post('/api/auth/register', { email, password, name, role }); } catch { }
  };

  const handleDemoLogin = async (email: string, password: string, name: string, role: string) => {
    await createDemoAccount(email, password, name, role);
    setValue('email', email);
    setValue('password', password);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post('/api/auth/login', data);
      const { token, user } = response.data.data;
      setToken(token);
      setUser(user);
      toast.success('Welcome back! Login successful.');
      setTimeout(() => {
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) { localStorage.removeItem('redirectAfterLogin'); router.push(redirectUrl); return; }
        if (user.role === 'CUSTOMER') router.push('/shop');
        else if (user.role === 'SELLER') router.push('/seller/dashboard');
        else if (user.role === 'ADMIN') router.push('/admin');
      }, 100);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <motion.div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

        {/* Left animation */}
        <motion.div className="hidden lg:flex flex-col items-center justify-center p-8" {...slideInLeft}>
          <div className="w-96 h-96">
            {animationData
              ? <Lottie animationData={animationData} loop className="w-full h-full" />
              : <div className="w-full h-full flex items-center justify-center"><div className="animate-spin h-16 w-16 border-b-2 border-emerald-500 rounded-full" /></div>
            }
          </div>
        </motion.div>

        {/* Right form */}
        <motion.div className="flex items-center justify-center" {...fadeInUp}>
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-slate-700">

              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome Back</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Sign in to your MediStore account</p>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-slate-600 rounded-xl py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors mb-5"
              >
                <FcGoogle size={20} />
                Continue with Google
              </button>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-600" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-slate-800 px-3 text-gray-400 dark:text-gray-500">or use demo account</span></div>
              </div>

              {/* Demo Buttons */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Quick Demo Login</p>
                <div className="grid grid-cols-3 gap-2">
                  {DEMO_CREDENTIALS.map(demo => (
                    <button key={demo.label} type="button" onClick={() => handleDemoLogin(demo.email, demo.password, demo.name, demo.role)}
                      className={`border rounded-xl py-2.5 px-3 text-left transition-all ${demo.color}`}>
                      <p className="text-xs font-bold">{demo.label}</p>
                      <p className="text-xs opacity-70 truncate mt-0.5">{demo.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-600" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-slate-800 px-3 text-gray-400 dark:text-gray-500">or sign in manually</span></div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <input {...register('email')} type="email" placeholder="Enter your email" className={inputClass} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <input {...register('password')} type="password" placeholder="Enter your password" className={inputClass} />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px] flex items-center justify-center">
                  {isSubmitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Signing In...</> : 'Sign In'}
                </motion.button>
              </form>

              <p className="text-center text-sm mt-5 text-gray-600 dark:text-gray-400">
                New to MediStore?{' '}
                <Link href="/register" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">Create Account</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
