'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '../../components/ProtectedRoute';
import Link from 'next/link';
import api from '../../lib/api';
import { Order } from '../../types/orders';

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

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders');
      setOrders(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'PLACED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="CUSTOMER">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 flex justify-center items-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-[#00B0F4]"
          ></motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.h1 className="text-3xl font-bold text-gray-900 mb-8" {...fadeInUp}>My Orders</motion.h1>
          
          {orders.length === 0 ? (
            <motion.div className="text-center py-16" {...fadeInUp}>
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600 mb-4 text-lg">No orders found</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/shop" 
                  className="bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] hover:from-blue-700 hover:to-blue-700 text-white px-8 py-3 rounded-full transition-all duration-200 shadow-lg font-semibold"
                >
                  Start Shopping
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
              {orders.map(order => (
                <motion.div key={order.id} variants={fadeInUp} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#45CBFF] to-[#45CBFF] rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">#{order.id.toString().slice(-2)}</span>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900">Order #{order.id}</h3>
                      </div>
                      <p className="text-gray-600 ml-11">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </motion.span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.childOrders ? 
                            order.childOrders.reduce((total, childOrder) => total + childOrder.orderItems.length, 0) :
                            order.orderItems?.length || 0
                          } item(s)
                        </p>
                        <p className="text-lg font-bold bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] bg-clip-text text-transparent">
                          Total: ${order.totalAmount?.toFixed(2) || '0.00'}
                        </p>
                        {order.childOrders && order.childOrders.length > 1 && (
                          <p className="text-sm text-gray-500">
                            Split across {order.childOrders.length} sellers
                          </p>
                        )}
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                          href={`/orders/${order.id}`}
                          className="bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] hover:from-blue-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 font-semibold shadow-lg"
                        >
                          View Details
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}