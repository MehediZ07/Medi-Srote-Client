'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { GiMedicines } from 'react-icons/gi';
import { FaCartPlus, FaUser } from 'react-icons/fa6';
import { HiMenu, HiX } from 'react-icons/hi';
import { LuLogOut } from 'react-icons/lu';
import { MdDashboard, MdAdminPanelSettings } from 'react-icons/md';
import { FaShoppingBag } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const cartItemCount = getTotalItems();

  const handleLogout = async () => {
    const success = await logout();
    if (success) window.location.href = '/';
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2 rounded-sm">
          <img src="/Medi-Store.png" alt="MediStore" className="h-10 w-auto rounded-sm" />
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
              <div className="p-2 rounded-full hover:bg-gray-100">
                <FaCartPlus className="text-2xl text-[#00B0F4]" />
              </div>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#00B0F4] text-white text-xs font-medium rounded-full px-1.5 py-0.5 min-w-[18px] h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="relative hidden md:block">
              <button
                ref={buttonRef}
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
              >
                <div className="h-9 w-9 rounded-full overflow-hidden bg-gradient-to-br from-[#00B0F4]/20 to-blue-100 border-2 border-[#00B0F4]/30 shadow-sm flex items-center justify-center text-[#006B94] font-semibold text-lg relative">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'User'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML = getInitials(user.name);
                      }}
                    />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>

                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.name?.split(' ')[0] || 'User'}
                </span>
              </button>

              {showDropdown && (
                <div 
                  ref={dropdownRef}
                  className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                >
                  <Link
                    href="/profile"
                    className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaUser className="text-gray-700" /> Profile
                  </Link>
                  
                  {user.role === 'CUSTOMER' && (
                    <Link
                      href="/orders"
                      className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaShoppingBag className="text-gray-700" /> Orders
                    </Link>
                  )}
                  
                  {user.role === 'SELLER' && (
                    <Link
                      href="/seller/dashboard"
                      className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      onClick={() => setShowDropdown(false)}
                    >
                      <MdDashboard className="text-gray-700" /> Dashboard
                    </Link>
                  )}
                  
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      onClick={() => setShowDropdown(false)}
                    >
                      <MdAdminPanelSettings className="text-gray-700" /> Admin
                    </Link>
                  )}
                  
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <LuLogOut className="text-red-600" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="border border-[#00B0F4] text-[#00B0F4] px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#00B0F4]/5 transition">
                Login
              </Link>
              <Link href="/register" className="bg-[#00B0F4] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#0099d9] transition">
                Register
              </Link>
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
          <div className="px-5 py-5 space-y-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 font-medium">Home</Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 font-medium">Shop</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 font-medium">About</Link>
            <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 font-medium">Privacy</Link>

            {user?.role === 'CUSTOMER' && (
              <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 font-medium">Orders</Link>
            )}
            {user?.role === 'SELLER' && (
              <Link href="/seller/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 font-medium">Dashboard</Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 font-medium">Admin</Link>
            )}

            <hr className="my-3 border-gray-200" />

            {user ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-[#00B0F4]/20 to-blue-100 border border-[#00B0F4]/30 flex items-center justify-center text-[#006B94] font-semibold text-xl">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    ) : getInitials(user.name)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 font-medium py-1">Profile</Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-red-600 font-medium py-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-gray-800 font-medium py-2">Login</Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-[#00B0F4] text-white py-3 rounded-xl font-medium mt-2"
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