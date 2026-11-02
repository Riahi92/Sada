'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ChevronDown, 
  TrendingUp, 
  Play, 
  User as UserIcon, 
  Search, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ShieldCheck
} from 'lucide-react';
import { Category } from '@/types/database';
import CategoryIcon from '@/components/CategoryIcon';

interface HeaderProps {
  categories: Category[];
  facebookUrl?: string;
  youtubeUrl?: string;
}

export default function Header({ 
  categories, 
  facebookUrl = 'https://www.facebook.com/profile.php?id=61584651215444',
  youtubeUrl = 'https://www.youtube.com/@chaînenumériquesSada'
}: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  // If in /admin, do not render public header
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navCategories = [
    { name: 'الرئيسية', hasChevron: false, href: '/' },
    { name: 'أخبار', hasChevron: true, href: '/news' },
    { name: 'اقتصاد', hasChevron: true, href: '/category/economy' },
    { name: 'رياضة', hasChevron: true, href: '/category/sports' },
    { name: 'رأي', hasChevron: true, href: '/category/politics' },
    { name: 'ميدان', hasChevron: true, href: '/category/society' },
    { name: 'متخصصة', hasChevron: true, href: '/category/technology' },
    { name: 'محليات', hasChevron: true, href: '/category/tunisia' },
    { name: 'فيديو', hasChevron: true, href: '/#videos' },
  ];

  const trendingTags = [
    { name: 'فلسطين', href: '/search?q=فلسطين' },
    { name: 'انتخابات أمريكا', href: '/search?q=انتخابات+أمريكا' },
    { name: 'اليمن', href: '/search?q=اليمن' },
    { name: 'إيران', href: '/search?q=إيران' },
    { name: 'تونس', href: '/search?q=تونس' },
    { name: 'اقتصاد', href: '/search?q=اقتصاد' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="w-full bg-white text-gray-900 border-b border-gray-100 sticky top-0 z-40 shadow-sm" data-purpose="site-header">
      {/* 1. Main Navigation Bar (Clean Al-Jazeera Portal Style) */}
      <div className="py-2.5 px-4 sm:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Right Side: Hamburger + Logo + Category Dropdowns */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              onClick={() => setDrawerOpen(true)}
              className="text-gray-800 p-1.5 hover:text-black hover:bg-gray-100 rounded-md transition" 
              aria-label="القائمة الشاملة"
              title="القائمة الشاملة"
            >
              <Menu className="w-6 h-6 stroke-[2]" />
            </button>

            {/* Official 3D Sada Logo */}
            <Link href="/" className="relative h-10 w-28 sm:h-12 sm:w-36 block shrink-0">
              <Image
                src="/images/logo.png"
                alt="شعار صدى"
                fill
                priority
                sizes="144px"
                className="object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-2.5 2xl:gap-3.5 text-sm font-semibold text-gray-800">
              <Link
                href="/"
                className={`flex items-center gap-1.5 hover:text-[#d0121a] transition py-1 text-[13px] ${
                  pathname === '/' ? 'text-[#d0121a] font-bold' : 'text-gray-800'
                }`}
              >
                <span>الرئيسية</span>
              </Link>

              {categories.map((cat) => {
                const isActive = pathname === `/category/${cat.slug}`;
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={`flex items-center gap-1 hover:text-[#d0121a] transition py-1 text-[12.5px] 2xl:text-[13px] whitespace-nowrap ${
                      isActive ? 'text-[#d0121a] font-bold' : 'text-gray-800'
                    }`}
                  >
                    <CategoryIcon slug={cat.slug} icon={cat.icon} className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#d0121a] shrink-0" />
                    <span>{cat.name}</span>
                  </Link>
                );
              })}

              <Link
                href="/#videos"
                className="flex items-center gap-1 text-[#d0121a] hover:text-[#a30c12] transition py-1 text-[13px] font-bold pr-2 border-r border-gray-200 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-[#d0121a]" />
                <span>فيديو</span>
              </Link>
            </nav>
          </div>

          {/* Left Side: الحساب + البث الحي */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition"
              title="بحث في الأخبار"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* الحساب (Account Login Link - opens in a new tab) */}
            <Link
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-800 hover:text-[#d0121a] transition"
            >
              <div className="w-5 h-5 rounded-full border border-gray-800 flex items-center justify-center">
                <UserIcon className="w-3 h-3 text-gray-800" />
              </div>
              <span>الحساب</span>
            </Link>

            {/* البث الحي (Live Stream Capsule Button) */}
            <Link
              href="/#videos"
              className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition shadow-sm"
            >
              <div className="w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center">
                <Play className="w-2 h-2 fill-white ml-0.5" />
              </div>
              <span>البث الحي</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 2. Search Dropdown */}
      {searchOpen && (
        <div className="bg-gray-50 border-b border-gray-200 py-3 px-4">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center relative">
            <input
              type="text"
              placeholder="ابحث في الأخبار والتقارير والمقالات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-white border border-gray-300 text-gray-900 rounded-full pl-12 pr-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button 
              type="submit" 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black hover:bg-gray-800 text-white p-2 rounded-full transition"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* 3. Fast Categories Navigation Bar with Representative Icons */}
      <div className="bg-slate-50/90 border-b border-gray-200/80 py-2 px-3 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-start lg:justify-center gap-1.5 sm:gap-2 text-xs whitespace-nowrap">
          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold transition shrink-0 ${
                  isActive
                    ? 'bg-[#d0121a] text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:text-[#d0121a] hover:bg-gray-100 border border-gray-200/80 shadow-2xs'
                }`}
              >
                <CategoryIcon 
                  slug={cat.slug} 
                  icon={cat.icon} 
                  className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#d0121a]'}`} 
                />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Trending Capsule Sub-bar (Matched to the uploaded image) */}
      <div className="bg-white py-2 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto bg-[#f8f9fa] border border-gray-200/80 rounded-full py-1 px-6 flex items-center justify-center gap-6 text-xs text-gray-700 shadow-sm overflow-x-auto no-scrollbar">
          <TrendingUp className="w-4 h-4 text-[#2563eb] shrink-0" />
          {trendingTags.map((tag) => (
            <Link
              key={tag.name}
              href={tag.href}
              className="hover:text-black hover:underline transition whitespace-nowrap font-medium text-[12px]"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 5. Full Slide-out Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Menu Panel */}
          <div className="relative w-80 max-w-full bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto z-10 font-tajawal">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="relative h-10 w-28">
                  <Image
                    src="/images/logo.png"
                    alt="صدى"
                    fill
                    sizes="112px"
                    className="object-contain"
                  />
                </div>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-full text-gray-500 hover:text-black hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation list */}
              <div className="py-4 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">أقسام موقع قناة صدى الرقمية</span>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between py-2 px-2.5 text-xs font-bold text-gray-800 hover:text-[#d0121a] hover:bg-gray-50 rounded-lg transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <CategoryIcon slug={cat.slug} icon={cat.icon} showBadge className="w-3.5 h-3.5 shrink-0" />
                      <span>{cat.name}</span>
                    </div>
                    {cat.article_count !== undefined && (
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-red-50 group-hover:text-red-600 transition">
                        {cat.article_count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Admin shortcut & Social links */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <Link
                href="/login"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition shadow-sm"
              >
                <UserIcon className="w-4 h-4" />
                <span>تسجيل الدخول / الحساب (نافذة جديدة)</span>
              </Link>

              <Link
                href="/admin"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2 bg-[#d0121a] hover:bg-[#a30c12] text-white text-xs font-bold rounded-lg transition shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>دخول لوحة التحكم CMS</span>
              </Link>

              <div className="flex items-center justify-center gap-3 pt-2 text-gray-600">
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#1877f2]" title="صفحتنا على فيسبوك"><Facebook className="w-4 h-4" /></a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-black" title="إكس"><Twitter className="w-4 h-4" /></a>
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-600" title="قناة صدى الرقمية على يوتيوب"><Youtube className="w-4 h-4" /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600" title="إنستغرام"><Instagram className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
