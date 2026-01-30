'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { DashboardStats } from '../../../types/seller';
import { MdManageHistory } from 'react-icons/md';
import { FaDollarSign, FaBox, FaPills, FaHourglassHalf } from 'react-icons/fa6';
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function SellerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/api/seller/dashboard');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="SELLER">
        <div className="bg-gradient-to-br from-blue-50 to-blue-50 flex justify-center items-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-[#00B0F4]"
          ></motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!stats) {
    return (
      <ProtectedRoute requiredRole="SELLER">
        <div className="bg-gradient-to-br from-blue-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.p className="text-center text-gray-600" {...fadeInUp}>Failed to load dashboard data</motion.p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="SELLER">
      <div className="bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.h1 className="text-3xl font-bold text-gray-900 mb-8" {...fadeInUp}>Seller Dashboard</motion.h1>
          
          <motion.div className="mb-8" {...fadeInUp}>
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/seller/medicines"
                className="flex items-center justify-center gap-2 bg-[#2FBFFF] text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition-all duration-200"
              >
                <MdManageHistory className="text-[20px]" />
                Manage Medicines
              </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/seller/orders" className="flex items-center justify-center gap-2 border border-[#2FBFFF] bg-white/50 bg-blur-md text-[#2FBFFF] px-6 py-3 rounded-lg transition-all duration-200 shadow-lg font-semibold">
                  <FaBox className="text-[20px]" /> View Orders
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" variants={staggerContainer} initial="initial" animate="animate">
  
            <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] bg-clip-text text-transparent">${(stats.totalSales || 0).toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-[#2FBFFF] rounded-full flex items-center justify-center">
                  <FaDollarSign className="text-white text-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Orders</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-[#00B0F4] bg-clip-text text-transparent">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-[#00B0F4] rounded-full flex items-center justify-center">
                  <FaBox className="text-white text-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Pending Orders</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{stats.pendingOrders}</p>
                </div>
                <div className="w-12 h-12 bg-[#FF7A00] rounded-full flex items-center justify-center">
                  <FaHourglassHalf className="text-white text-xl" />
                </div>
              </div>
            </motion.div>

          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <motion.div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100" {...fadeInUp}>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Orders</h3>
              <div className="space-y-4">
                {(stats.recentOrders || []).map(order => (
                  <motion.div key={order.id} whileHover={{ scale: 1.02 }} className="flex justify-between items-center border-b pb-3 last:border-b-0 hover:bg-gray-50 p-2 rounded transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${(order.total || 0).toFixed(2)}</p>
                      <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                        {order.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}