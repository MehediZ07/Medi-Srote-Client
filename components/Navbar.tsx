'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { GiMedicines } from 'react-icons/gi';
import { FaCartPlus } from 'react-icons/fa6';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = getTotalItems();

  const handleLogout = async () => {
    const success = await logout();
    if (success) window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2">
          <img src="/Medi-Store.png" alt="MediStore" className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 pl-12">
          <Link href="/" className="text-sm text-gray-600 hover:text-[#00B0F4]">Home</Link>
          <Link href="/shop" className="text-sm text-gray-600 hover:text-[#00B0F4]">Shop</Link>
          <Link href="/about" className="text-sm text-gray-600 hover:text-[#00B0F4]">About</Link>
          <Link href="/privacy" className="text-sm text-gray-600 hover:text-[#00B0F4]">Privacy</Link>

          {user?.role === 'CUSTOMER' && (
            <Link href="/orders" className="text-sm text-gray-600 hover:text-[#00B0F4]">Orders</Link>
          )}

          {user?.role === 'SELLER' && (
            <Link href="/seller/dashboard" className="text-sm text-gray-600 hover:text-[#00B0F4]">Dashboard</Link>
          )}

          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-sm text-gray-600 hover:text-[#00B0F4]">Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">

          {user?.role === 'CUSTOMER' && (
            <Link href="/cart" className="relative">
              <div className="p-2 rounded-fullhover:bg-gray-100 text-md">
                <FaCartPlus className="text-2xl text-[#00B0F4]" />
              </div>

              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 border border-[#00B0F4] text-[#00B0F4] text-xs rounded-full px-1.5">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          {user && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                  {user.name?.charAt(0)}
                </div>
                <span className="text-sm text-gray-700">{user.name}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2">
                  <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <HiX className="text-2xl text-gray-700" />
            ) : (
              <HiMenu className="text-2xl text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700">Home</Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700">Shop</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700">About</Link>
            <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700">Privacy</Link>

            {user?.role === 'CUSTOMER' && (
              <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700">
                Orders
              </Link>
            )}

            {user?.role === 'SELLER' && (
              <Link href="/seller/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700">
                Dashboard
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700">
                Admin
              </Link>
            )}

            <hr />

            {user ? (
              <>
                <Link href="/profile" className="block text-gray-700">Profile</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-gray-700">Login</Link>
                <Link
                  href="/register"
                  className="block text-center bg-[#00B0F4] text-white py-2 rounded-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
