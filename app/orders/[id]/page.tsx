'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiShoppingBag, FiUser } from 'react-icons/fi';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { Order } from '../../../types/orders';
import { reviewSchema, ReviewFormData } from '../../../lib/review-validation';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function OrderDetail({ params }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewingItem, setReviewingItem] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [currentRating, setCurrentRating] = useState(5);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  useEffect(() => {
    const initializePage = async () => {
      const resolvedParams = await params;
      setOrderId(resolvedParams.id);
      fetchOrder(resolvedParams.id);
    };
    
    initializePage();
  }, [params]);

  const fetchOrder = async (id: string) => {
    try {
      const response = await api.get(`/api/orders/${id}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const startReview = (medicineId: string) => {
    setReviewingItem(medicineId);
    setCurrentRating(5);
    setValue('medicineId', medicineId);
    setValue('rating', 5);
    setValue('comment', '');
  };

  const handleRatingChange = (rating: number) => {
    setCurrentRating(rating);
    setValue('rating', rating);
  };

  const cancelOrder = async () => {   
    try {
      await api.patch(`/api/orders/${orderId}/cancel`);
      fetchOrder(orderId);
      toast.success('Order cancelled successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const onSubmitReview = async (data: ReviewFormData) => {
    try {
      await api.post('/api/reviews', data);
      toast.success('Review submitted successfully!');
      setReviewingItem(null);
      setCurrentRating(5);
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
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

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type={interactive ? 'button' : undefined}
        onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
        className={`text-2xl ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
        disabled={!interactive}
      >
        ★
      </button>
    ));
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

  if (!order) {
    return (
      <ProtectedRoute requiredRole="CUSTOMER">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div className="text-center" {...fadeInUp}>
              <div className="text-6xl mb-4">📦</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] hover:from-blue-700 hover:to-blue-700 text-white px-8 py-3 rounded-full transition-all duration-200 shadow-lg font-semibold"
              >
                Back to Orders
              </motion.button>
            </motion.div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            onClick={() => window.history.back()}
            className="mb-6 text-[#00B0F4] hover:text-[#00B0F4] font-medium transition-colors"
            {...fadeInUp}
          >
            ← Back to Orders
          </motion.button>
          
          <motion.h1 className="text-3xl font-bold text-gray-900 mb-8" {...fadeInUp}>Order #{order.id}</motion.h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div className="lg:col-span-2" {...fadeInUp}>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Order Items</h3>
                
                {order.childOrders && order.childOrders.length > 0 ? (
                  <div className="space-y-6">
                    {order.childOrders.map((childOrder, index) => (
                      <div key={childOrder.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-900">Seller: {childOrder.seller.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(childOrder.status)}`}>
                            {childOrder.status}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {childOrder.orderItems.map(item => (
                            <motion.div key={item.id} whileHover={{ scale: 1.02 }} className="flex items-center justify-between border-b pb-3 last:border-b-0 hover:bg-gray-50 p-2 rounded transition-colors">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                  {item.medicine.image && (
                                    <img src={item.medicine.image} alt={item.medicine.name} className="w-full h-full object-cover" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{item.medicine.name}</h5>
                                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                                  <p className="text-[#00B0F4] font-medium text-sm">${item.price.toFixed(2)} each</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                {childOrder.status === 'DELIVERED' && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => startReview(item.medicineId)}
                                    className="mt-1 text-[#00B0F4] hover:text-[#00B0F4] text-xs font-medium transition-colors"
                                  >
                                    Review
                                  </motion.button>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-right font-medium text-gray-900">
                            Seller Total: ${childOrder.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {order.orderItems?.map(item => (
                      <motion.div key={item.id} whileHover={{ scale: 1.02 }} className="flex items-center justify-between border-b pb-4 last:border-b-0 hover:bg-gray-50 p-3 rounded transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                            {item.medicine.image && (
                              <img src={item.medicine.image} alt={item.medicine.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.medicine.name}</h4>
                            <p className="text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-[#00B0F4] font-medium">${item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          {order.status === 'DELIVERED' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              onClick={() => startReview(item.medicineId)}
                              className="mt-2 text-[#00B0F4] hover:text-[#00B0F4] text-sm font-medium transition-colors"
                            >
                              Write Review
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {order.status === 'PLACED' && (!order.childOrders || order.childOrders.every(child => child.status === 'PLACED')) && (
                  <div className="mt-4 pt-4 border-t">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => cancelOrder()}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                    >
                      Cancel Entire Order
                    </motion.button>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Shipping Address</h3>
                <div className="text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">{order.fullName}</p>
                  <p>{order.address}</p>
                  <p>{order.city}, {order.zipCode}</p>
                  <p>{order.phone}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div {...fadeInUp}>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Order Status</h3>
                
                {order.childOrders && order.childOrders.length > 0 ? (
                  <div className="space-y-3">
                    {order.childOrders.map((childOrder, index) => (
                      <div key={childOrder.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <FiUser className="text-green-600" size={12} />
                          </div>
                          <span className="text-gray-700">{childOrder.seller.name}</span>
                        </div>
                                          
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(childOrder.status)}`}>
                          {childOrder.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                )}
                
                <p className="text-gray-600 mt-3">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${(order.totalAmount - 5).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span>$5.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-3 text-gray-900">
                    <span>Total:</span>
                    <span className="bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] bg-clip-text text-transparent">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {reviewingItem && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Write a Review</h3>
                
                <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
                  <input {...register('medicineId')} type="hidden" />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {renderStars(currentRating, true, handleRatingChange)}
                    </div>
                    {errors.rating && (
                      <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      {...register('comment')}
                      rows={4}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#45CBFF] focus:border-[#45CBFF] transition-all"
                      placeholder="Share your experience with this medicine..."
                    />
                    {errors.comment && (
                      <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      type="button"
                      onClick={() => setReviewingItem(null)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] hover:from-blue-700 hover:to-blue-700 text-white py-2 rounded-lg transition-all duration-200 disabled:opacity-50 font-medium"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}