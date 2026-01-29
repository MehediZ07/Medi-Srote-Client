'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useCartStore } from '../../store/cartStore';
import Link from 'next/link';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();
  const shippingCost = 5.00;
  const totalPrice = getTotalPrice();
  const finalTotal = totalPrice + (totalPrice > 0 ? shippingCost : 0);

  if (items.length === 0) {
    return (
      <ProtectedRoute requiredRole="CUSTOMER">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link 
              href="/shop" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {items.map((item) => (
                <div key={item.medicineId} className="flex items-center justify-between border-b p-6 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">${item.price}</p>
                      <p className="text-sm text-gray-500">Stock: {item.stock}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        onClick={() => removeItem(item.medicineId)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Items ({getTotalItems()}):</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                {totalPrice > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}