'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../lib/api';
import { AdminDashboardStats } from '../../types/admin';

export default function AdminDashboard() {
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
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!stats) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Failed to load dashboard data</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/users" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Manage Users
            </Link>
            <Link href="/admin/orders" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              View Orders
            </Link>
            <Link href="/admin/categories" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Manage Categories
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">${(stats.totalRevenue || 0).toFixed(2)}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Active Sellers</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.activeSellers}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {(stats.recentOrders || []).map(order => (
                <div key={order.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customerName} → {order.sellerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.totalAmount?.toFixed(2) || '0.00'}</p>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm">
                View All Orders →
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>New Users Today</span>
                <span className="font-semibold">{stats.newUsersToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Orders Today</span>
                <span className="font-semibold">{stats.ordersToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Revenue Today</span>
                <span className="font-semibold">${(stats.revenueToday || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}