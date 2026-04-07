'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Pagination from '../../../components/dashboard/Pagination';
import api from '../../../lib/api';
import { AdminUser, Seller } from '../../../types/admin';
import { MdOutlineCategory, MdDashboard } from 'react-icons/md';
import { FaBox, FaUserTie, FaUsers } from 'react-icons/fa6';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: <MdDashboard size={18} /> },
  { href: '/admin/users', label: 'Users', icon: <FaUsers size={16} /> },
  { href: '/admin/orders', label: 'Orders', icon: <FaBox size={16} /> },
  { href: '/admin/categories', label: 'Categories', icon: <MdOutlineCategory size={18} /> },
  { href: '/profile', label: 'Profile', icon: <FaUserTie size={16} /> },
];

const ROLE_BADGE: Record<string, string> = {
  CUSTOMER: 'bg-blue-100 text-blue-700',
  SELLER: 'bg-emerald-100 text-emerald-700',
  ADMIN: 'bg-purple-100 text-purple-700',
};

const PER_PAGE = 8;

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'users' | 'sellers'>('users');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { fetchUsers(); fetchSellers(); }, []);

  const fetchUsers = async () => {
    try { const r = await api.get('/api/admin/users'); setUsers(r.data.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const fetchSellers = async () => {
    try { const r = await api.get('/api/admin/sellers'); setSellers(r.data.data); }
    catch (e) { console.error(e); }
  };

  const toggleStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/api/admin/users/${id}`, { status: status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' });
      fetchUsers();
    } catch (e: any) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleTabChange = (t: 'users' | 'sellers') => { setTab(t); setPage(1); setSearch(''); };
  const handleSearch = (val: string) => { setSearch(val); setPage(1); };

  const Avatar = ({ name, image }: { name: string; image?: string }) => (
    <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
      {image ? <img src={image} alt={name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
        : <span className="text-gray-600 text-xs font-semibold">{name.charAt(0).toUpperCase()}</span>}
    </div>
  );

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const filteredSellers = sellers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  const paginatedUsers = filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const paginatedSellers = filteredSellers.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil((tab === 'users' ? filteredUsers : filteredSellers).length / PER_PAGE);

  if (loading) return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <DashboardLayout title="User Management" navItems={NAV_ITEMS} role="ADMIN" roleLabel="Admin">
        <div className="space-y-5">

          {/* Tabs + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-2">
              {(['users', 'sellers'] as const).map(t => (
                <button key={t} onClick={() => handleTabChange(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${tab === t ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {t}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Search..." value={search} onChange={e => handleSearch(e.target.value)}
              className="w-full sm:w-56 px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400" />
          </div>

          {/* Users Table */}
          {tab === 'users' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['User', 'Email', 'Role', 'Status', 'Joined', 'Action'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.name} image={user.image} />
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_BADGE[user.role] || 'bg-gray-100 text-gray-700'}`}>{user.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{user.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          {user.role !== 'ADMIN' && (
                            <button onClick={() => toggleStatus(user.id, user.status)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${user.status === 'ACTIVE' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                              {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No users found</div>}
              <div className="px-4 pb-4">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filteredUsers.length} itemsPerPage={PER_PAGE} />
              </div>
            </motion.div>
          )}

          {/* Sellers Table */}
          {tab === 'sellers' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Seller', 'Email', 'Products', 'Total Sales', 'Status', 'Joined'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedSellers.map(seller => (
                      <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={seller.name} image={seller.image} />
                            <span className="font-medium text-gray-900">{seller.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{seller.email}</td>
                        <td className="px-4 py-3 text-gray-700">{seller._count?.medicines || 0}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">${(seller.totalSales || 0).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${seller.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{seller.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(seller.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredSellers.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No sellers found</div>}
              <div className="px-4 pb-4">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filteredSellers.length} itemsPerPage={PER_PAGE} />
              </div>
            </motion.div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
