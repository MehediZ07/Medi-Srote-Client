'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../lib/api';
import { AdminDashboardStats } from '../../types/admin';
import { MdManageHistory, MdOutlineCategory, MdOutlineCurrencyExchange } from 'react-icons/md';
import { FaBox, FaUserTie } from 'react-icons/fa6';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/api/admin/dashboard');
      setStats(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="min-h-screen flex justify-center items-center bg-blue-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-12 w-12 rounded-full border-b-2 border-[#00B0F4]"
          />
        </div>
      </ProtectedRoute>
    );
  }

  if (!stats) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
          <p className="text-gray-600">Failed to load dashboard data</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">

          <motion.h1 className="text-3xl font-bold mb-8" {...fadeInUp}>
            Admin Dashboard
          </motion.h1>

          <motion.div className="mb-8" {...fadeInUp}>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Link
                href="/admin/users"
                className="flex items-center justify-center gap-2 bg-[#2FBFFF] text-white px-6 py-3 rounded-lg shadow-lg font-semibold"
              >
                <MdManageHistory size={20} />
                Manage Users
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center justify-center gap-2 border border-[#2FBFFF] bg-white text-[#2FBFFF] px-6 py-3 rounded-lg shadow-lg font-semibold"
              >
                <FaBox size={20} />
                View Orders
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center justify-center gap-2 border border-[#1F2A36] bg-white text-[#1F2A36] px-6 py-3 rounded-lg shadow-lg font-semibold"
              >
                <MdOutlineCategory size={20} />
                Manage Categories
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { title: 'Total Users', value: stats.totalUsers, icon: <FaUserTie className="text-[#00B0F4]" /> },
              { title: 'Total Orders', value: stats.totalOrders, icon: <FaBox className="text-[#00B0F4]" /> },
              {
                title: 'Total Revenue',
                value: `$${(stats.totalRevenue || 0).toFixed(2)}`,
                icon: <MdOutlineCurrencyExchange className="text-[#00B0F4]" />,
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-700 font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-3xl font-bold text-[#00B0F4]">
                      {item.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[#00B0F4]/15 border border-[#00B0F4]/70 rounded-full flex items-center justify-center text-white text-xl">
                    {item.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            {...fadeInUp}
          >
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>

            <div className="space-y-4">
              {(stats.recentOrders || []).map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center border-b pb-3 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.fullName}, from {order.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                    <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link
                href="/admin/orders"
                className="text-[#00B0F4] font-medium"
              >
                View All Orders →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
