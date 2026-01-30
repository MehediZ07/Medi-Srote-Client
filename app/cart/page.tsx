'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useCartStore } from '../../store/cartStore';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();
  const shippingCost = 5.00;
  const totalPrice = getTotalPrice();
  const finalTotal = totalPrice + (totalPrice > 0 ? shippingCost : 0);

  if (items.length === 0) {
    return (
      <ProtectedRoute requiredRole="CUSTOMER">
        <div className=" bg-gradient-to-br from-blue-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.h1 className="text-3xl font-bold text-gray-900 mb-8" {...fadeInUp}>Shopping Cart</motion.h1>
            <motion.div className="text-center py-16" {...fadeInUp}>
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-600 mb-4 text-lg">Your cart is empty</p>
              <Link 
                href="/shop" 
                className="bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] hover:from-blue-700 hover:to-blue-700 text-white px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className=" bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.h1 className="text-3xl font-bold text-gray-900 mb-8" {...fadeInUp}>Shopping Cart</motion.h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div className="lg:col-span-2" {...fadeInUp}>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <motion.div variants={staggerContainer} initial="initial" animate="animate">
                  {items.map((item) => (
                    <motion.div key={item.medicineId} variants={fadeInUp} className="flex items-center justify-between border-b p-6 last:border-b-0 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-[#00B0F4] font-medium">${item.price}</p>
                          <p className="text-sm text-gray-500">Stock: {item.stock}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-[#45CBFF] to-[#45CBFF] text-white flex items-center justify-center hover:shadow-lg transition-all"
                          >
                            -
                          </motion.button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-[#45CBFF] to-[#45CBFF] text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </motion.button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            onClick={() => removeItem(item.medicineId)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            Remove
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div className="lg:col-span-1" {...fadeInUp}>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({getTotalItems()}):</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  {totalPrice > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping:</span>
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-3 text-gray-900">
                    <span>Total:</span>
                    <span className="bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] bg-clip-text text-transparent">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/checkout"
                    className="block w-full text-center bg-gradient-to-r from-[#00B0F4] to-[#00B0F4] hover:from-blue-700 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                  >
                    Proceed to Checkout
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}