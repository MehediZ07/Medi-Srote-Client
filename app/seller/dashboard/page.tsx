'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { DashboardStats } from '../../../types/seller';

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
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!stats) {
    return (
      <ProtectedRoute requiredRole="SELLER">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Failed to load dashboard data</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="SELLER">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Seller Dashboard</h1>
        
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Link href="/seller/medicines" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Manage Medicines
            </Link>
            <Link href="/seller/orders" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              View Orders
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
            <p className="text-3xl font-bold text-blue-600">${(stats.totalSales || 0).toFixed(2)}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Orders</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Products</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalProducts}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Pending Orders</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
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
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(order.total || 0).toFixed(2)}</p>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Top Products</h3>
            <div className="space-y-4">
              {(stats.topProducts || []).map(product => (
                <div key={product.id} className="flex justify-between items-center">
                  <span>{product.name}</span>
                  <span className="font-semibold">{product.soldCount} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}