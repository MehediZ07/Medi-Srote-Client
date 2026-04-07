'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useCartStore } from '../../store/cartStore';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCartShopping, FaTrash } from 'react-icons/fa6';

const fadeInUp = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();
  const shippingCost = 5.00;
  const totalPrice = getTotalPrice();
  const finalTotal = totalPrice + (totalPrice > 0 ? shippingCost : 0);

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8" {...fadeInUp}>
            Shopping Cart
          </motion.h1>

          {items.length === 0 ? (
            <motion.div className="text-center py-20" {...fadeInUp}>
              <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-5">
                <FaCartShopping size={32} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">Your cart is empty</p>
              <Link href="/shop" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-sm">
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Cart Items */}
              <motion.div className="lg:col-span-2" {...fadeInUp}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  {items.map((item, i) => (
                    <div key={item.medicineId}
                      className={`flex items-center justify-between p-5 ${i < items.length - 1 ? 'border-b border-gray-100 dark:border-slate-700' : ''} hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors`}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden flex-shrink-0">
                          {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                          <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">${item.price}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Stock: {item.stock}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors">
                            −
                          </motion.button>
                          <span className="w-8 text-center font-semibold text-gray-900 dark:text-white text-sm">{item.quantity}</span>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                            +
                          </motion.button>
                        </div>

                        <div className="text-right min-w-[70px]">
                          <p className="font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                          <motion.button whileHover={{ scale: 1.05 }} onClick={() => removeItem(item.medicineId)}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-xs font-medium transition-colors flex items-center gap-1 mt-0.5">
                            <FaTrash size={10} /> Remove
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div className="lg:col-span-1" {...fadeInUp}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                      <span>Items ({getTotalItems()})</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    {totalPrice > 0 && (
                      <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                        <span>Shipping</span>
                        <span>${shippingCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t border-gray-100 dark:border-slate-700 pt-3 text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span className="text-emerald-600 dark:text-emerald-400">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href="/checkout"
                    className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition-all shadow-sm">
                    Proceed to Checkout
                  </Link>
                  <Link href="/shop" className="block w-full text-center text-emerald-600 dark:text-emerald-400 text-sm font-medium mt-3 hover:underline">
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
