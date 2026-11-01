'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  FolderTree, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  Globe, 
  LogOut, 
  Menu, 
  X,
  Bell,
  ShieldAlert
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sada_admin_token');
      localStorage.removeItem('sada_admin_user');
    }
    router.push('/login');
  };

  const navItems = [
    { name: 'لوحة المؤشرات', href: '/admin', icon: LayoutDashboard },
    { name: 'إدارة الأخبار', href: '/admin/articles', icon: FileText },
    { name: 'إضافة خبر جديد', href: '/admin/articles/new', icon: PlusCircle },
    { name: 'الأقسام والتصنيفات', href: '/admin/categories', icon: FolderTree },
    { name: 'مكتبة الوسائط', href: '/admin/media', icon: ImageIcon },
    { name: 'فريق العمل والصلاحيات', href: '/admin/users', icon: Users },
    { name: 'إعدادات المنصة', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-tajawal text-gray-800">
      {/* Mobile top bar */}
      <div className="md:hidden bg-brand-navy text-white p-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-brand-red text-white flex items-center justify-center font-bold">ص</div>
          <span className="font-heading font-black text-lg">لوحة تحكم صدى</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded bg-white/10 text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 right-0 h-screen w-64 bg-brand-navy text-white flex flex-col justify-between z-40 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-brand-navyLight flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-brand-red flex items-center justify-center text-white font-heading font-black text-xl shadow">
                ص
              </div>
              <div>
                <span className="font-heading font-black text-xl text-white tracking-wide block">
                  صَـدَى CMS
                </span>
                <span className="text-[10px] text-gray-300">منظومة التحرير والنشر</span>
              </div>
            </Link>
          </div>

          {/* User profile snippet */}
          <div className="p-4 mx-3 my-3 bg-brand-navyLight/50 rounded-lg border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-red text-white font-bold flex items-center justify-center">
              م
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-bold text-white truncate">مروان الرياحي</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono">
                مدير النظام (Admin)
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-brand-red text-white shadow'
                      : 'text-gray-300 hover:bg-brand-navyLight hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-brand-navyLight space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-brand-navyLight hover:text-white transition"
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>معاينة الموقع المباشر</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-950/40 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header inside CMS */}
        <header className="hidden md:flex bg-white border-b border-gray-200 px-8 py-3.5 items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">لوحة التحرير &larr;</span>
            <span className="text-sm font-bold text-brand-navy">
              {navItems.find(n => n.href === pathname)?.name || 'لوحة الإدارة'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-red hover:bg-brand-redDark text-white rounded-md text-xs font-bold transition shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>إضافة خبر جديد</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
