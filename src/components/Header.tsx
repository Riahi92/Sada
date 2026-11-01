'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  User, 
  Calendar, 
  Clock,
  TrendingUp,
  Flame,
  ChevronDown
} from 'lucide-react';
import { Category } from '@/types/database';

interface HeaderProps {
  categories: Category[];
  facebookUrl?: string;
}

export default function Header({ categories, facebookUrl = 'https://www.facebook.com/profile.php?id=61584651215444' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Format Arabic Gregorian Date
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDateStr(now.toLocaleDateString('ar-TN', options));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'آخر الأخبار', href: '/news' },
    ...categories.map(c => ({
      name: c.name,
      href: `/category/${c.slug}`,
    })),
  ];

  return (
    <header className="w-full bg-white border-b border-brand-border sticky top-0 z-50 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-brand-navy text-white text-xs py-2 px-4 border-b border-brand-navyLight/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Date & Location */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gray-300">
              <Calendar className="w-3.5 h-3.5 text-brand-red" />
              <span>{currentDateStr || 'تونس | الأحد 1 نوفمبر 2026'}</span>
            </span>
            <span className="hidden md:inline-block text-gray-400">|</span>
            <span className="hidden md:flex items-center gap-1 text-gray-300">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>بتوقيت تونس (GMT+1)</span>
            </span>
          </div>

          {/* Social Links & CMS Admin link */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <a 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-7 h-7 rounded-full bg-brand-navyLight/60 hover:bg-brand-red flex items-center justify-center transition"
                title="تابعنا على فيسبوك"
              >
                <Facebook className="w-3.5 h-3.5 text-white" />
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-7 h-7 rounded-full bg-brand-navyLight/60 hover:bg-brand-red flex items-center justify-center transition"
                title="تابعنا على منصة إكس"
              >
                <Twitter className="w-3.5 h-3.5 text-white" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-7 h-7 rounded-full bg-brand-navyLight/60 hover:bg-brand-red flex items-center justify-center transition"
                title="تابعنا على إنستغرام"
              >
                <Instagram className="w-3.5 h-3.5 text-white" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-7 h-7 rounded-full bg-brand-navyLight/60 hover:bg-brand-red flex items-center justify-center transition"
                title="قناتنا على يوتيوب"
              >
                <Youtube className="w-3.5 h-3.5 text-white" />
              </a>
            </div>

            <span className="text-gray-400">|</span>

            <Link 
              href="/admin" 
              className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-red hover:bg-brand-redDark text-white font-medium rounded transition text-[11px]"
            >
              <User className="w-3 h-3" />
              <span>لوحة التحكم CMS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Brand Logo & Search Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo & Platform Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-36 sm:h-14 sm:w-44 transition group-hover:scale-105 duration-300">
              <Image
                src="/images/logo.png"
                alt="منصة صدى الإخبارية"
                fill
                priority
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block border-r border-gray-200 pr-3 mr-1">
              <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide inline-block mb-0.5">
                إخباري مستقل
              </span>
              <p className="text-[11px] text-brand-muted font-tajawal">
                صوت الكلمة الصادقة
              </p>
            </div>
          </Link>

          {/* Search Box on Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="ابحث في الأخبار والتقارير..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-brand-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy focus:bg-white transition"
              />
              <button 
                type="submit" 
                className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-brand-navy hover:bg-brand-navyLight text-white p-1.5 rounded-md transition"
                title="بحث"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick CTA or Weather Widget */}
          <div className="flex items-center gap-3">
            <Link
              href="/news?sortBy=trending"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition text-xs font-bold"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>الأكثر تداولاً</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-brand-navy hover:bg-gray-100 rounded-md transition"
              aria-label="القائمة الرئيسية"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Desktop) */}
      <nav className="hidden lg:block bg-brand-navy border-t border-brand-navyLight/40">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-start flex-wrap">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block py-3 px-3.5 text-sm font-semibold transition border-b-2 ${
                      isActive 
                        ? 'text-white border-brand-red bg-white/5' 
                        : 'text-gray-200 border-transparent hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-brand-border shadow-lg px-4 py-4 space-y-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="ابحث عن خبر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-brand-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
            />
            <button 
              type="submit" 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-brand-navy text-white p-1.5 rounded-md"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Links list */}
          <div className="grid grid-cols-2 gap-1 pt-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded text-sm font-medium transition ${
                    isActive 
                      ? 'bg-brand-red text-white' 
                      : 'text-brand-navy hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-brand-border flex items-center justify-between">
            <Link 
              href="/admin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-xs text-brand-red font-bold"
            >
              <User className="w-3.5 h-3.5" />
              <span>لوحة الإدارة CMS</span>
            </Link>
            <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 text-xs text-blue-600 font-bold"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>صفحتنا على فيسبوك</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
