'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Pagination from '../../../components/dashboard/Pagination';
import api from '../../../lib/api';
import { SellerOrder } from '../../../types/seller';
import { MdDashboard } from 'react-icons/md';
import { FaBox, FaPills, FaUser } from 'react-icons/fa6';

const NAV_ITEMS = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: <MdDashboard size={18} /> },
  { href: '/seller/medicines', label: 'Medicines', icon: <FaPills size={16} /> },
  { href: '/seller/orders', label: 'Orders', icon: <FaBox size={16} /> },
  { href: '/profile', label: 'Profile', icon: <FaUser size={16} /> },
];

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-yellow-100 text-yellow-700',
  PLACED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const PER_PAGE = 8;

export default function SellerOrders() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try { const r = await api.get('/api/seller/orders'); setOrders(r.data.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    try { await api.patch(`/api/seller/orders/${id}/status`, { status }); fetchOrders(); }
    catch (e: any) { toast.error(e.response?.data?.message || 'Failed to update status'); }
  };

  const filtered = orders.filter(o => o.customer.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const handleSearch = (val: string) => { setSearch(val); setPage(1); };

  if (loading) return (
    <ProtectedRoute requiredRole="SELLER">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute requiredRole="SELLER">
      <DashboardLayout title="Orders" navItems={NAV_ITEMS} role="SELLER" roleLabel="Seller">
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} orders</p>
            <input type="text" placeholder="Search by customer..." value={search} onChange={e => handleSearch(e.target.value)}
              className="w-full sm:w-56 px-4 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-100 dark:border-slate-600">
                  <tr>
                    {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Update'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                  {paginated.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">#{order.id.slice(-8)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{order.customer.name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {order.orderItems?.map(item => (
                          <div key={item.id} className="text-xs">{item.medicine.name} ×{item.quantity}</div>
                        ))}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                          disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                          className="text-xs border border-gray-200 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed">
                          <option value="PLACED">Placed</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">No orders found</div>}
            <div className="px-4 pb-4">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} itemsPerPage={PER_PAGE} />
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
