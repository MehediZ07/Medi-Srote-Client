'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LuLogOut } from 'react-icons/lu';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaChevronRight } from 'react-icons/fa6';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  navItems: NavItem[];
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  roleLabel: string;
}

export default function DashboardLayout({ children, title, navItems, role, roleLabel }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
  };

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-700',
    SELLER: 'bg-emerald-100 text-emerald-700',
    CUSTOMER: 'bg-blue-100 text-blue-700',
  };

  const activeColors: Record<string, string> = {
    ADMIN: 'bg-purple-600 text-white shadow-sm shadow-purple-200',
    SELLER: 'bg-emerald-600 text-white shadow-sm shadow-emerald-200',
    CUSTOMER: 'bg-blue-600 text-white shadow-sm shadow-blue-200',
  };

  const hoverColors: Record<string, string> = {
    ADMIN: 'hover:bg-purple-50 hover:text-purple-700',
    SELLER: 'hover:bg-emerald-50 hover:text-emerald-700',
    CUSTOMER: 'hover:bg-blue-50 hover:text-blue-700',
  };

  const accentColor = activeColors[role];
  const hoverColor = hoverColors[role];
  const roleBadge = roleColors[role];

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/Medi-Store.png" alt="MediStore" className="h-8 w-auto" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
            <HiX size={18} className="text-gray-500" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <span className="text-gray-600 font-semibold text-sm">{getInitials(user?.name)}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{user?.name}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadge}`}>{roleLabel}</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive ? accentColor : `text-gray-600 dark:text-gray-300 ${hoverColor}`
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {isActive && <FaChevronRight size={10} className="opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LuLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-5 py-3.5 flex items-center gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <HiMenu size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h1>
          </div>
          <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors hidden sm:block">
            ← Back to site
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-6 bg-gray-50 dark:bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}
