'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useCartStore } from '../../store/cartStore';
import { checkoutSchema, CheckoutFormData } from '../../lib/checkout-validation';

export default function Checkout() {
  const router = useRouter();
  const { items, getTotalPrice, clear } = useCartStore();
  const shippingCost = 5.00;
  const totalPrice = getTotalPrice();
  const finalTotal = totalPrice + shippingCost;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cash_on_delivery',
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        items: items.map(item => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          fullName: data.fullName,
          address: data.address,
          city: data.city,
          zipCode: data.zipCode,
          phone: data.phone
        },
        paymentMethod: data.paymentMethod,
        totalAmount: finalTotal
      };

      await api.post('/api/orders', orderData);
      
      clear();
      router.push('/orders');
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Order creation failed',
      });
    }
  };

  if (items.length === 0) {
    return (
      <ProtectedRoute requiredRole="CUSTOMER">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button 
              onClick={() => router.push('/shop')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                <div className="space-y-4">
                  <div>
                    <input 
                      {...register('fullName')}
                      placeholder="Full Name" 
                      className="w-full p-3 border rounded-lg" 
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <input 
                      {...register('address')}
                      placeholder="Address" 
                      className="w-full p-3 border rounded-lg" 
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input 
                        {...register('city')}
                        placeholder="City" 
                        className="p-3 border rounded-lg w-full" 
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <input 
                        {...register('zipCode')}
                        placeholder="ZIP Code" 
                        className="p-3 border rounded-lg w-full" 
                      />
                      {errors.zipCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <input 
                      {...register('phone')}
                      placeholder="Phone Number" 
                      className="w-full p-3 border rounded-lg" 
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input 
                      {...register('paymentMethod')}
                      type="radio" 
                      value="credit_card"
                      className="mr-2" 
                    />
                    Credit Card
                  </label>
                  <label className="flex items-center">
                    <input 
                      {...register('paymentMethod')}
                      type="radio" 
                      value="cash_on_delivery"
                      className="mr-2" 
                    />
                    Cash on Delivery
                  </label>
                </div>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.medicineId} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                {errors.root && (
                  <p className="text-red-500 text-sm mt-4">{errors.root.message}</p>
                )}
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}