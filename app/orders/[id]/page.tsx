'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { Order } from '../../../types/orders';
import { reviewSchema, ReviewFormData } from '../../../lib/review-validation';

interface Props {
  params: Promise<{ id: string }>;
}

export default function OrderDetail({ params }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewingItem, setReviewingItem] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');

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
    setValue('medicineId', medicineId);
    setValue('rating', 5);
    setValue('comment', '');
  };

  const cancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await api.patch(`/api/orders/${orderId}/cancel`);
      fetchOrder(orderId);
      alert('Order cancelled successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const onSubmitReview = async (data: ReviewFormData) => {
    try {
      await api.post('/api/reviews', data);
      alert('Review submitted successfully!');
      setReviewingItem(null);
      reset();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit review');
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
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return (
      <ProtectedRoute requiredRole="CUSTOMER">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
            <button 
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => window.history.back()}
          className="mb-6 text-blue-600 hover:text-blue-800"
        >
          ← Back to Orders
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order #{order.id}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.orderItems?.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded">
                        {item.medicine.image && (
                          <img src={item.medicine.image} alt={item.medicine.name} className="w-full h-full object-cover rounded" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.medicine.name}</h4>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              {order.status === 'DELIVERED' && (
                        <button
                          onClick={() => startReview(item.medicineId)}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Write Review
                        </button>
                      )}
                      {(order.status === 'PLACED') && (
                        <button
                          onClick={() => cancelOrder()}
                          className="mt-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
              <div className="text-gray-600">
                <p>{order.fullName}</p>
                <p>{order.address}</p>
                <p>{order.city}, {order.zipCode}</p>
                <p>{order.phone}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Order Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <p className="text-gray-600 mt-2">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${(order.totalAmount - 5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {reviewingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              
              <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
                <input {...register('medicineId')} type="hidden" />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {renderStars(5, true, (rating) => setValue('rating', rating))}
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your experience with this medicine..."
                  />
                  {errors.comment && (
                    <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setReviewingItem(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}