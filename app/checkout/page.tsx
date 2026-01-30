'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useCartStore } from '../../store/cartStore';
import { checkoutSchema, CheckoutFormData } from '../../lib/checkout-validation';

import {
  HiLocationMarker,
  HiCreditCard,
  HiClipboardList,
  HiShoppingCart
} from 'react-icons/hi';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};

export default function Checkout() {
  const router = useRouter();
  const { items, getTotalPrice, clear } = useCartStore();

  const shippingCost = 5;
  const totalPrice = getTotalPrice();
  const finalTotal = totalPrice + shippingCost;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'cash_on_delivery' },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      await api.post('/api/orders', {
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
      });

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
        <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
          <motion.div {...fadeInUp} className="text-center">
            <HiShoppingCart className="mx-auto text-6xl text-[#00B0F4] mb-4" />
            <p className="text-gray-600 mb-6">Your cart is empty</p>
            <button
              onClick={() => router.push('/shop')}
              className="bg-[#00B0F4] hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Continue Shopping
            </button>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="min-h-screen bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.h1 {...fadeInUp} className="text-2xl md:text-3xl font-bold mb-6">
            Checkout
          </motion.h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">

                <motion.div variants={fadeInUp} className="bg-white rounded-xl p-6 shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-[#45CBFF] flex items-center justify-center">
                      <HiLocationMarker className="text-white text-xl" />
                    </div>
                    <h3 className="font-semibold text-lg">Shipping Address</h3>
                  </div>

                  <div className="space-y-4">
                    <input {...register('fullName')} placeholder="Full Name" className="input" />
                    {errors.fullName && <p className="error">{errors.fullName.message}</p>}

                    <input {...register('address')} placeholder="Address" className="input" />
                    {errors.address && <p className="error">{errors.address.message}</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input {...register('city')} placeholder="City" className="input" />
                      <input {...register('zipCode')} placeholder="ZIP Code" className="input" />
                    </div>

                    <input {...register('phone')} placeholder="Phone Number" className="input" />
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="bg-white rounded-xl p-6 shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-[#45CBFF] flex items-center justify-center">
                      <HiCreditCard className="text-white text-xl" />
                    </div>
                    <h3 className="font-semibold text-lg">Payment Method</h3>
                  </div>

                  <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-blue-50">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="cash_on_delivery"
                    />
                    <span className="font-medium">Cash on Delivery</span>
                  </label>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div className="bg-white rounded-xl p-6 shadow lg:sticky lg:top-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-[#45CBFF] flex items-center justify-center">
                      <HiClipboardList className="text-white text-xl" />
                    </div>
                    <h3 className="font-semibold text-lg">Order Summary</h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    {items.map(item => (
                      <div key={item.medicineId} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-[#00B0F4]">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {errors.root && (
                    <p className="text-red-500 text-sm mt-3">{errors.root.message}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-[#00B0F4] hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </motion.div>

            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }
        .input:focus {
          outline: none;
          border-color: #45cbff;
          box-shadow: 0 0 0 2px rgba(69,203,255,0.3);
        }
        .error {
          color: #ef4444;
          font-size: 0.875rem;
        }
      `}</style>
    </ProtectedRoute>
  );
}
