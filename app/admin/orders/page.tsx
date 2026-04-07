'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Pagination from '../../../components/dashboard/Pagination';
import api from '../../../lib/api';
import { AdminOrder } from '../../../types/admin';
import { MdOutlineCategory, MdDashboard } from 'react-icons/md';
import { FaBox, FaUserTie, FaUsers } from 'react-icons/fa6';
import * as dc from '../../../lib/darkClasses';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: <MdDashboard size={18} /> },
  { href: '/admin/users', label: 'Users', icon: <FaUsers size={16} /> },
  { href: '/admin/orders', label: 'Orders', icon: <FaBox size={16} /> },
  { href: '/admin/categories', label: 'Categories', icon: <MdOutlineCategory size={18} /> },
  { href: '/profile', label: 'Profile', icon: <FaUserTie size={16} /> },
];

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
  SHIPPED: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
  PROCESSING: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400',
  PLACED: 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300',
  PENDING: 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300',
  CANCELLED: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
};

const PER_PAGE = 8;

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try { const res = await api.get('/api/admin/orders'); setOrders(res.data.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const filtered = orders.filter(o =>
    o.orderItems && o.orderItems.length > 0 &&
    (o.customer?.name || o.fullName || '').toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const handleSearch = (val: string) => { setSearch(val); setPage(1); };

  if (loading) return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <DashboardLayout title="Order Management" navItems={NAV_ITEMS} role="ADMIN" roleLabel="Admin">
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} orders found</p>
            <input type="text" placeholder="Search by customer name..." value={search} onChange={e => handleSearch(e.target.value)}
              className={`${dc.input} w-full sm:w-64 focus:ring-purple-200 dark:focus:ring-purple-800 focus:border-purple-400`} />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={dc.tableWrapper}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={dc.thead}>
                  <tr>{['Customer', 'Address', 'Items', 'Seller', 'Total', 'Status', 'Date'].map(h => <th key={h} className={dc.th}>{h}</th>)}</tr>
                </thead>
                <tbody className={dc.divider}>
                  {paginated.map(order => (
                    <tr key={order.id} className={dc.tr}>
                      <td className={dc.tdPrimary}>{order.customer?.name || order.fullName}</td>
                      <td className={`${dc.tdSecondary} text-xs`}>{order.address}, {order.city}</td>
                      <td className={dc.tdSecondary}>
                        {order.orderItems?.map((item, i) => <div key={i} className="text-xs">{item.medicine.name} ×{item.quantity}</div>)}
                      </td>
                      <td className={`${dc.tdSecondary} text-xs`}>
                        {[...new Set(order.orderItems?.map(i => i.medicine.seller?.name).filter(Boolean))].join(', ') || 'N/A'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className={dc.tdMuted}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <div className={dc.emptyState}>No orders found</div>}
            <div className="px-4 pb-4">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} itemsPerPage={PER_PAGE} />
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
