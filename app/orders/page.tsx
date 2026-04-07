'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Link from 'next/link';
import api from '../../lib/api';
import { Order } from '../../types/orders';
import { FaCartShopping, FaUser, FaClipboardList } from 'react-icons/fa6';
import * as dc from '../../lib/darkClasses';

const NAV_ITEMS = [
  { href: '/orders', label: 'My Orders', icon: <FaClipboardList size={16} /> },
  { href: '/cart', label: 'Cart', icon: <FaCartShopping size={16} /> },
  { href: '/profile', label: 'Profile', icon: <FaUser size={16} /> },
];

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
  SHIPPED: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
  PROCESSING: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400',
  PLACED: 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300',
  CANCELLED: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try { const r = await api.get('/api/orders'); setOrders(r.data.data || r.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  if (loading) return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <DashboardLayout title="My Orders" navItems={NAV_ITEMS} role="CUSTOMER" roleLabel="Customer">
        {orders.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-20 ${dc.card}`}>
            <FaClipboardList size={40} className="text-gray-200 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-5">You haven't placed any orders yet</p>
            <Link href="/shop" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`${dc.card} p-5 hover:shadow-sm transition-shadow`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaClipboardList size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Order #{order.id.slice(-8)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()} ·{' '}
                        {order.childOrders ? order.childOrders.reduce((t, c) => t + c.orderItems.length, 0) : order.orderItems?.length || 0} item(s)
                      </p>
                      {order.childOrders && order.childOrders.length > 1 && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Split across {order.childOrders.length} sellers</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'}`}>
                      {order.status}
                    </span>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">${order.totalAmount?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-700 flex justify-end">
                  <Link href={`/orders/${order.id}`} className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
