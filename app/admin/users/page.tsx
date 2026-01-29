'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { AdminUser, Seller } from '../../../types/admin';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'sellers'>('users');

  useEffect(() => {
    fetchUsers();
    fetchSellers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellers = async () => {
    try {
      const response = await api.get('/api/admin/sellers');
      setSellers(response.data.data);
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await api.patch(`/api/admin/users/${userId}`, { status: newStatus });
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return 'bg-blue-100 text-blue-800';
      case 'SELLER': return 'bg-purple-100 text-purple-800';
      case 'ADMIN': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>
        
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setActiveTab('sellers')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'sellers'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sellers
            </button>
          </div>
        </div>
        
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => toggleUserStatus(user.id, user.status)}
                          className={`px-3 py-1 rounded text-sm ${
                            user.status === 'ACTIVE'
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'sellers' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sellers.map(seller => (
                  <tr key={seller.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                        <div>
                          <p className="font-medium">{seller.name}</p>
                          <p className="text-sm text-gray-600">ID: {seller.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{seller.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{seller._count?.medicines || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${(seller.totalSales || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        seller.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {seller.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}