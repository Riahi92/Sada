'use client';

import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Calendar,
  Sun,
  Home
} from 'lucide-react';
import { Category } from '@/types/database';
import CategoryIcon from '@/components/CategoryIcon';
import { WhatsAppIcon, SnapchatIcon, TikTokIcon, YouTubeIcon, FacebookIcon } from '@/components/SocialIcons';

interface HeaderProps {
  categories: Category[];
  facebookUrl?: string;
  youtubeUrl?: string;
  whatsappUrl?: string;
  snapchatUrl?: string;
  tiktokUrl?: string;
}

export default function Header({ 
  categories, 
  facebookUrl = 'https://www.facebook.com/profile.php?id=61584651215444',
  youtubeUrl = 'https://www.youtube.com/@chainenumeriquessada',
  whatsappUrl = 'https://api.whatsapp.com/message/NNTKTGMOHR3UI1?autoload=1&app_absent=0',
  snapchatUrl = 'https://www.snapchat.com/@chainesada?share_id=J8xO8av-uwM&locale=ar-AA',
  tiktokUrl = 'https://www.tiktok.com/@chainenumeriquesada1?_r=1&_t=ZS-9B35HfgOYOk',
}: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [arabicDate, setArabicDate] = useState('السبت 01 نوفمبر 2026');
  const pathname = usePathname();

  // Format dynamic Arabic date on mount
  useEffect(() => {
    try {
      const today = new Intl.DateTimeFormat('ar-TN', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date());
      setArabicDate(today);
    } catch {
      // Keep initial fallback
    }
  }, []);

  // If in /admin, do not render public header
  if (pathname.startsWith('/admin')) {
    return null;
  }

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
    <header className="w-full bg-white text-gray-900 border-b border-gray-100 z-40" data-purpose="site-header">
      
      {/* 1. TOP METADATA BAR (Black / Dark Slate with Date, Weather & Social) */}
      <div className="bg-[#111622] text-white/90 text-xs py-1.5 px-4 sm:px-8 border-b border-white/10 relative overflow-hidden">
        {/* Subtle decorative red swoosh on the far right edge matching reference screenshot */}
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#d0121a]/40 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          
          {/* Right Side: Social Media Channels */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition" 
              title="تواصل معنا عبر واتساب"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
            </a>
            <a 
              href={tiktokUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-black hover:text-white flex items-center justify-center transition" 
              title="حساب صدى على تيك توك"
            >
              <TikTokIcon className="w-3.5 h-3.5" />
            </a>
            <a 
              href={snapchatUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#FFFC00] hover:text-black flex items-center justify-center transition" 
              title="حساب صدى على سناب شات"
            >
              <SnapchatIcon className="w-3.5 h-3.5" />
            </a>
            <a 
              href={youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#ff0000] hover:text-white flex items-center justify-center transition" 
              title="قناة صدى الرقمية على يوتيوب"
            >
              <YouTubeIcon className="w-3.5 h-3.5" />
            </a>
            <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#1877f2] hover:text-white flex items-center justify-center transition" 
              title="صفحة صدى على فيسبوك"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Left Side: Arabic Date + Weather Widget + Live Broadcast */}
          <div className="flex items-center gap-3 sm:gap-5 text-[11px] sm:text-xs">
            {/* Live Arabic Date */}
            <div className="flex items-center gap-1.5 text-gray-300">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-medium">{arabicDate}</span>
            </div>

            {/* Separator */}
            <span className="text-gray-600 hidden xs:inline">|</span>

            {/* Weather Widget (Tunis 22° with Sun) */}
            <div className="flex items-center gap-1.5 text-gray-200">
              <Sun className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">تونس °22</span>
            </div>

            {/* Separator */}
            <span className="text-gray-600 hidden sm:inline">|</span>

            {/* Account Link */}
            <Link
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-gray-300 hover:text-white transition"
              title="تسجيل الدخول / الحساب"
            >
              <UserIcon className="w-3 h-3 text-gray-400" />
              <span>الحساب</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 2. PANORAMIC COVER PHOTO BANNER ("photo de couverture") */}
      <div className="relative w-full h-24 sm:h-28 md:h-32 lg:h-36 overflow-hidden bg-[#d9e8f0] border-b border-gray-200">
        {/* Background Panoramic Landscape with Tunisian Flag on the left & Mediterranean coast */}
        <div 
          className="absolute inset-0 bg-cover bg-left bg-no-repeat"
          style={{ backgroundImage: `url('/images/tunisia-panorama.jpg')` }}
        />

        {/* Dynamic Curved Vector Badge on the Right */}
        <div className="absolute top-0 bottom-0 right-0 flex items-center pr-3 sm:pr-6 md:pr-10 pl-6 sm:pl-10 md:pl-14 bg-white/95 backdrop-blur-xs rounded-l-[36px] sm:rounded-l-[55px] md:rounded-l-[70px] border-l-4 border-[#d0121a] shadow-sm z-10">
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3.5 hover:opacity-95 transition"
            title="صدى الرقمية - الصفحة الرئيسية"
          >
            {/* 1. Official Globe (on the far right in RTL) */}
            <div className="relative h-11 w-11 sm:h-13 sm:w-13 md:h-15 md:w-15 shrink-0">
              <Image
                src="/images/globe.png"
                alt="مجسم الكرة الأرضية"
                fill
                priority
                sizes="64px"
                className="object-contain"
              />
            </div>

            {/* 2. Logo right next to the globe (logo a droite a coté du globe) */}
            <div className="relative h-8 w-20 sm:h-10 sm:w-24 md:h-12 md:w-28 shrink-0">
              <Image
                src="/images/logo.png"
                alt="شعار صدى الرقمية"
                fill
                priority
                sizes="128px"
                className="object-contain"
              />
            </div>

            {/* 3. Text block to the left */}
            <div className="text-right">
              <span className="block text-base sm:text-xl md:text-2xl font-extrabold text-[#d0121a] tracking-tight font-tajawal leading-tight whitespace-nowrap">
                صدى الرقمية
              </span>
              <span className="block text-[8.5px] sm:text-[10px] font-bold text-gray-800 tracking-wider font-tajawal">
                SADA DIGITAL
              </span>
              <span className="block text-[7.5px] sm:text-[9.5px] text-gray-500 font-medium font-tajawal mt-0.5 whitespace-nowrap hidden sm:block">
                أخبار دقيقة .. وتحليل أعمق
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION BAR (Deep Midnight with Red Home Pill & Categories) */}
      <div className="bg-[#111622] text-white py-1 px-3 sm:px-6 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Right Side: Home Icon Pill + Category Dropdowns */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {/* Mobile Drawer Button */}
            <button 
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden text-white/90 p-1.5 hover:text-white hover:bg-white/10 rounded-md transition shrink-0 ml-1" 
              aria-label="القائمة الشاملة"
              title="القائمة الشاملة"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Home Pill (الرئيسية) with Red Background Highlight */}
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm font-bold text-xs sm:text-[13px] transition shrink-0 ${
                pathname === '/'
                  ? 'bg-[#d0121a] text-white shadow-xs'
                  : 'bg-[#d0121a]/90 hover:bg-[#d0121a] text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </Link>

            {/* Desktop Categories with Down Chevron */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-xs sm:text-[13px] font-semibold text-gray-200">
              {categories.map((cat) => {
                const isActive = pathname === `/category/${cat.slug}`;
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={`group flex items-center gap-1 px-2.5 py-1.5 rounded-sm transition whitespace-nowrap ${
                      isActive 
                        ? 'text-white font-bold bg-white/15' 
                        : 'text-gray-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-white transition" />
                  </Link>
                );
              })}

              {/* Video Link */}
              <Link
                href="/#videos"
                className="flex items-center gap-1 text-[#ff4d4d] hover:text-white hover:bg-white/10 px-2 py-1.5 rounded-sm transition text-xs sm:text-[13px] font-bold mr-1 shrink-0"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>فيديو</span>
              </Link>
            </nav>
          </div>

          {/* Left Side: Integrated Search Box */}
          <div className="flex items-center gap-2 shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="ابحث في الأخبار..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm rounded-full pl-8 pr-3.5 py-1 sm:py-1.5 w-32 xs:w-44 sm:w-56 focus:outline-none focus:ring-2 focus:ring-[#d0121a] transition shadow-inner"
              />
              <button 
                type="submit" 
                className="absolute left-1 top-1/2 -translate-y-1/2 bg-[#d0121a] hover:bg-[#a30c12] text-white p-1 rounded-full transition shadow-xs"
                title="بحث"
                aria-label="بحث"
              >
                <Search className="w-3 h-3" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* 4. FAST CATEGORY ICONS BAR (Representative Lucide Icons) */}
      <div className="bg-slate-50 border-b border-gray-200/80 py-1.5 px-3 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-start lg:justify-center gap-1.5 sm:gap-2 text-xs whitespace-nowrap">
          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold transition shrink-0 ${
                  isActive
                    ? 'bg-[#d0121a] text-white shadow-xs'
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

      {/* 5. TRENDING CAPSULE SUB-BAR */}
      <div className="bg-white py-1.5 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto bg-[#f8f9fa] border border-gray-200/80 rounded-full py-1 px-5 flex items-center justify-center gap-5 text-xs text-gray-700 shadow-2xs overflow-x-auto no-scrollbar">
          <TrendingUp className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
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

      {/* 6. FULL SLIDE-OUT DRAWER */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Menu Panel */}
          <div className="relative w-80 max-w-full bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto z-10 font-tajawal">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="relative h-10 w-28">
                  <Image
                    src="/images/logo.png"
                    alt="صدى الرقمية"
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
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">أقسام صدى الرقمية</span>
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
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366]" title="واتساب"><WhatsAppIcon className="w-4 h-4" /></a>
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-black" title="تيك توك"><TikTokIcon className="w-4 h-4" /></a>
                <a href={snapchatUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#e6b800]" title="سناب شات"><SnapchatIcon className="w-4 h-4" /></a>
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-600" title="صدى الرقمية على يوتيوب"><YouTubeIcon className="w-4 h-4" /></a>
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#1877f2]" title="صفحتنا على فيسبوك"><FacebookIcon className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
