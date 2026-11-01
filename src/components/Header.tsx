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
  Landmark,
  Users,
  Trophy,
  Cpu,
  HeartPulse,
  Palette,
  Sparkles,
  Heart,
  Sun,
  Mic,
  CloudSun,
  Coins,
  Radio,
  Home
} from 'lucide-react';
import { Category } from '@/types/database';

interface HeaderProps {
  categories: Category[];
  facebookUrl?: string;
}

// Icon and color mapping for categories to match the Stitch design
const categoryMetaMap: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  politics: { icon: Landmark, color: 'text-blue-300' },
  economy: { icon: TrendingUp, color: 'text-amber-400' },
  society: { icon: Users, color: 'text-emerald-400' },
  sports: { icon: Trophy, color: 'text-blue-300' },
  technology: { icon: Cpu, color: 'text-cyan-400' },
  health: { icon: HeartPulse, color: 'text-rose-400' },
  culture: { icon: Palette, color: 'text-purple-300' },
  variety: { icon: Sparkles, color: 'text-yellow-400' },
  women: { icon: Heart, color: 'text-pink-400' },
  weather: { icon: Sun, color: 'text-amber-300' },
};

export default function Header({ categories, facebookUrl = 'https://www.facebook.com/profile.php?id=61584651215444' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full text-white shadow-md z-30" data-purpose="site-header">
      {/* 1. Top Utility Bar */}
      <div className="bg-[#051c40] border-b border-blue-900/60 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Social Icons & Search Trigger */}
          <div className="flex items-center space-x-2.5 space-x-reverse">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-7 h-7 rounded-full bg-blue-900/80 hover:bg-[#d0121a] flex items-center justify-center transition-colors text-white" 
              title="بحث في الأخبار"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-7 rounded-full bg-red-600 hover:opacity-90 flex items-center justify-center transition" 
              title="YouTube"
            >
              <Youtube className="w-3.5 h-3.5 text-white" />
            </a>
            <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-7 rounded-full bg-[#1877f2] hover:opacity-90 flex items-center justify-center transition" 
              title="Facebook"
            >
              <Facebook className="w-3.5 h-3.5 text-white" />
            </a>
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-7 rounded-full bg-black hover:opacity-90 flex items-center justify-center transition border border-gray-700" 
              title="X (Twitter)"
            >
              <Twitter className="w-3.5 h-3.5 text-white" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 flex items-center justify-center transition" 
              title="Instagram"
            >
              <Instagram className="w-3.5 h-3.5 text-white" />
            </a>
          </div>

          {/* Center Date */}
          <div className="flex items-center gap-2 text-slate-200 font-medium tracking-wide text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#d0121a]" />
            <span>{currentDateStr || 'الأحد 01 نوفمبر 2026'}</span>
          </div>

          {/* Secondary Links & Admin CMS */}
          <nav className="flex items-center gap-3 text-slate-300 font-medium text-xs">
            <Link href="/about" className="hover:text-white transition">من نحن</Link>
            <span className="text-blue-700">|</span>
            <Link href="/contact" className="hover:text-white transition">اتصل بنا</Link>
            <span className="text-blue-700">|</span>
            <Link href="/contact" className="hover:text-white transition">إعلاناتنا</Link>
            <span className="text-blue-700">|</span>
            <Link 
              href="/admin" 
              className="flex items-center gap-1 text-white bg-[#d0121a] hover:bg-[#a30c12] px-2 py-0.5 rounded transition font-bold"
            >
              <User className="w-3 h-3" />
              <span>لوحة التحكم CMS</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Inline Search Bar (Drop down) */}
      {isSearchOpen && (
        <div className="bg-[#041633] border-b border-blue-800 px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="ابحث في الأخبار والتقارير والمقالات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-[#072557] border border-blue-700 text-white placeholder-slate-400 rounded-lg pl-12 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d0121a]"
              />
              <button 
                type="submit" 
                className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-[#d0121a] hover:bg-[#a30c12] text-white p-1.5 rounded-md transition"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Main Branding Header Banner */}
      <div className="header-gradient-bg py-4 px-4 sm:px-8 border-b-2 border-[#d0121a]/70 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative">
          {/* Left Banner: Live Microphone & Tagline Graphic */}
          <div className="hidden lg:flex items-center gap-4 order-3 md:order-1">
            <div className="relative flex items-center justify-center">
              {/* Tuned microphone emblem */}
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">البث المباشر 24/7</div>
              <div className="text-sm font-semibold text-slate-200">صوت تونس النابض</div>
            </div>
          </div>

          {/* Center Brand Title and Taglines */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 order-1 md:order-2 flex-1">
            {/* Tunisian Flag Emblem */}
            <div className="relative w-16 h-11 sm:w-20 sm:h-14 bg-[#d0121a] rounded shadow-md overflow-hidden flex items-center justify-center border border-white/30 hidden sm:flex shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center relative">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#d0121a] absolute"></div>
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white absolute translate-x-0.5"></div>
                <span className="text-[7px] text-[#d0121a] absolute translate-x-[-1px] font-bold">★</span>
              </div>
            </div>

            {/* Masthead & Sada Logo Integration */}
            <Link href="/" className="text-center flex flex-col items-center group">
              <div className="flex items-center gap-3">
                {/* Sada Official 3D Logo Image */}
                <div className="relative h-12 w-28 sm:h-16 sm:w-36 transition duration-300 group-hover:scale-105">
                  <Image
                    src="/images/logo.png"
                    alt="شعار صدى"
                    fill
                    priority
                    sizes="(max-width: 640px) 112px, 144px"
                    className="object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
                  />
                </div>
                {/* Arabic Headline "أخبار اليوم" */}
                <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight drop-shadow-md">
                  أخبار <span className="text-red-500 underline decoration-red-600/60 decoration-4 underline-offset-4">اليوم</span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1 tracking-wider font-tajawal">
                مصداقية .. سرعة .. في قلب الحدث
              </p>
            </Link>
          </div>

          {/* Right Side: Weather & Currency snippet + Mobile Toggle */}
          <div className="flex items-center gap-3 order-2 md:order-3">
            <div className="hidden md:flex items-center gap-3 text-xs text-slate-300">
              <div className="bg-blue-950/60 backdrop-blur px-3 py-1.5 rounded border border-blue-700/50 flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">تونس 24°C</span>
                  <span className="text-[10px] text-slate-400">طقس مستقر</span>
                </div>
              </div>
              <div className="bg-blue-950/60 backdrop-blur px-3 py-1.5 rounded border border-blue-700/50 flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">1 € = 3.38 DT</span>
                  <span className="text-[10px] text-slate-400">سعر الصرف</span>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white bg-blue-900/70 hover:bg-[#d0121a] rounded-md transition"
              aria-label="القائمة الرئيسية"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <nav className="bg-[#08285c] border-b border-blue-900 text-white font-bold text-sm tracking-wide shadow-lg" data-purpose="main-nav">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <ul className="flex items-center whitespace-nowrap">
            {/* Active 'الرئيسية' with bright red background */}
            <li>
              <Link 
                href="/" 
                className={`flex items-center gap-2 px-5 py-3 transition shadow-inner ${
                  pathname === '/' 
                    ? 'bg-[#d0121a] hover:bg-[#a30c12] text-white' 
                    : 'hover:bg-blue-900 text-slate-100 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>الرئيسية</span>
              </Link>
            </li>

            {/* Dynamic Categories */}
            {categories.map((cat) => {
              const meta = categoryMetaMap[cat.slug] || { icon: Landmark, color: 'text-blue-300' };
              const IconComp = meta.icon;
              const isActive = pathname === `/category/${cat.slug}`;

              return (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className={`flex items-center gap-1.5 px-4 py-3 transition ${
                      isActive 
                        ? 'bg-[#d0121a] text-white' 
                        : 'hover:bg-blue-900 text-slate-100 hover:text-white'
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${meta.color}`} />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Live Badge on Nav */}
          <div className="hidden md:flex items-center px-4 py-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600/30 text-red-300 border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              مباشر
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#051c40] border-t border-blue-800 shadow-xl px-4 py-4 space-y-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="ابحث عن خبر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#072557] border border-blue-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d0121a]"
            />
            <button 
              type="submit" 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#d0121a] text-white p-1.5 rounded-md"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Links list */}
          <div className="grid grid-cols-2 gap-1.5 pt-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`py-2 px-3 rounded text-sm font-medium transition flex items-center gap-2 ${
                pathname === '/' ? 'bg-[#d0121a] text-white' : 'text-slate-200 hover:bg-blue-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </Link>
            {categories.map((cat) => {
              const meta = categoryMetaMap[cat.slug] || { icon: Landmark, color: 'text-blue-300' };
              const IconComp = meta.icon;
              const isActive = pathname === `/category/${cat.slug}`;

              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive ? 'bg-[#d0121a] text-white' : 'text-slate-200 hover:bg-blue-900'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${meta.color}`} />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-blue-800 flex items-center justify-between text-xs">
            <Link 
              href="/admin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-white bg-[#d0121a] px-3 py-1.5 rounded font-bold"
            >
              <User className="w-3.5 h-3.5" />
              <span>لوحة الإدارة CMS</span>
            </Link>
            <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 text-slate-300 hover:text-white font-bold"
            >
              <Facebook className="w-3.5 h-3.5 text-[#1877f2]" />
              <span>صفحتنا على فيسبوك</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
