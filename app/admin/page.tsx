'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import api from '../../lib/api';
import { AdminDashboardStats } from '../../types/admin';
import { MdOutlineCategory, MdOutlineCurrencyExchange, MdDashboard } from 'react-icons/md';
import { FaBox, FaUserTie, FaUsers } from 'react-icons/fa6';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as dc from '../../lib/darkClasses';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: <MdDashboard size={18} /> },
  { href: '/admin/users', label: 'Users', icon: <FaUsers size={16} /> },
  { href: '/admin/orders', label: 'Orders', icon: <FaBox size={16} /> },
  { href: '/admin/categories', label: 'Categories', icon: <MdOutlineCategory size={18} /> },
  { href: '/profile', label: 'Profile', icon: <FaUserTie size={16} /> },
];

const PIE_COLORS = ['#7c3aed', '#a78bfa', '#c4b5fd'];
const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try { const res = await api.get('/api/admin/dashboard'); setStats(res.data.data || res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const revenueData = stats?.recentOrders?.slice(0, 6).map((o, i) => ({ name: `#${i + 1}`, revenue: o.totalAmount || 0 })) || [];
  const pieData = [
    { name: 'Customers', value: Math.max((stats?.totalUsers || 0) - ((stats as any)?.totalSellers || 0) - 1, 0) },
    { name: 'Sellers', value: (stats as any)?.totalSellers || 0 },
    { name: 'Admins', value: 1 },
  ].filter(d => d.value > 0);

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers ?? 0, icon: <FaUsers size={20} />, bg: 'bg-purple-50 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400' },
    { title: 'Total Orders', value: stats?.totalOrders ?? 0, icon: <FaBox size={18} />, bg: 'bg-emerald-50 dark:bg-emerald-900/30', color: 'text-emerald-600 dark:text-emerald-400' },
    { title: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, icon: <MdOutlineCurrencyExchange size={20} />, bg: 'bg-blue-50 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
  ];

  if (loading) return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <DashboardLayout title="Dashboard Overview" navItems={NAV_ITEMS} role="ADMIN" roleLabel="Admin">
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
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
                  <Bar dataKey="revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div {...fadeInUp} className={`${dc.card} p-5`}>
              <h3 className={`${dc.sectionTitle} mb-4`}>User Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                    label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`} labelLine={false}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div {...fadeInUp} className={`${dc.card} p-5`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={dc.sectionTitle}>Recent Orders</h3>
              <Link href="/admin/orders" className="text-xs text-purple-600 dark:text-purple-400 font-medium hover:underline">View All →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-700">
                    {['Customer', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} className={dc.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={dc.divider}>
                  {(stats?.recentOrders || []).map((order) => (
                    <tr key={order.id} className={dc.tr}>
                      <td className={dc.tdPrimary}>{order.fullName}</td>
                      <td className={dc.tdSecondary}>${order.totalAmount?.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">{order.status}</span>
                      </td>
                      <td className={dc.tdMuted}>{new Date(order.createdAt || '').toLocaleDateString()}</td>
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
