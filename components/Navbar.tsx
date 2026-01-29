'use client';

import Link from 'next/link';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const cartItemCount = getTotalItems();

  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout handler error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            MediStore
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/shop" className="text-gray-700 hover:text-blue-600">
              Shop
            </Link>
            
            {user ? (
              <>
                {user.role === 'CUSTOMER' && (
                  <Link href="/cart" className="text-gray-700 hover:text-blue-600 relative">
                    Cart
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
                {user.role === 'SELLER' && (
                  <Link href="/seller/dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600">
                    Admin
                  </Link>
                )}
                <span className="text-gray-700">Hi, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}