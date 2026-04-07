'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import api from '../../../lib/api';
import { DashboardStats } from '../../../types/seller';
import { MdDashboard } from 'react-icons/md';
import { FaDollarSign, FaBox, FaPills, FaHourglassHalf, FaUser } from 'react-icons/fa6';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import * as dc from '../../../lib/darkClasses';

const NAV_ITEMS = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: <MdDashboard size={18} /> },
  { href: '/seller/medicines', label: 'Medicines', icon: <FaPills size={16} /> },
  { href: '/seller/orders', label: 'Orders', icon: <FaBox size={16} /> },
  { href: '/profile', label: 'Profile', icon: <FaUser size={16} /> },
];

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function SellerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try { const r = await api.get('/api/seller/dashboard'); setStats(r.data.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const revenueData = stats?.recentOrders?.slice(0, 6).map((o, i) => ({ name: `#${i + 1}`, total: o.total || 0 })) || [];
  const topData = stats?.topProducts?.slice(0, 5).map(m => ({
    name: m.name?.length > 12 ? m.name.slice(0, 12) + '…' : m.name,
    sold: m.soldCount || 0,
  })) || [];

  const statCards = [
    { title: 'Total Sales', value: `$${(stats?.totalSales || 0).toFixed(2)}`, icon: <FaDollarSign size={18} />, bg: 'bg-emerald-50 dark:bg-emerald-900/30', color: 'text-emerald-600 dark:text-emerald-400' },
    { title: 'Total Orders', value: stats?.totalOrders ?? 0, icon: <FaBox size={16} />, bg: 'bg-blue-50 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
    { title: 'Pending Orders', value: stats?.pendingOrders ?? 0, icon: <FaHourglassHalf size={16} />, bg: 'bg-orange-50 dark:bg-orange-900/30', color: 'text-orange-500 dark:text-orange-400' },
  ];

  const tooltipStyle = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' };

  if (loading) return (
    <ProtectedRoute requiredRole="SELLER">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute requiredRole="SELLER">
      <DashboardLayout title="Seller Dashboard" navItems={NAV_ITEMS} role="SELLER" roleLabel="Seller">
        <div className="space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statCards.map((card, i) => (
              <motion.div key={card.title} {...fadeInUp} transition={{ delay: i * 0.08 }} className={dc.statCard}>
                <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center ${card.color}`}>{card.icon}</div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <motion.div {...fadeInUp} className={`${dc.card} p-5`}>
              <h3 className={`${dc.sectionTitle} mb-4`}>Recent Order Revenue</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="total" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div {...fadeInUp} className={`${dc.card} p-5`}>
              <h3 className={`${dc.sectionTitle} mb-4`}>Top Selling Medicines</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} width={80} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="sold" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div {...fadeInUp} className={`${dc.card} p-5`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={dc.sectionTitle}>Recent Orders</h3>
              <Link href="/seller/orders" className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline">View All →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-700">
                    {['Customer', 'Amount', 'Status'].map(h => <th key={h} className={dc.th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody className={dc.divider}>
                  {(stats?.recentOrders || []).map(order => (
                    <tr key={order.id} className={dc.tr}>
                      <td className={dc.tdPrimary}>{order.customerName}</td>
                      <td className={dc.tdSecondary}>${(order.total || 0).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
