'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronLeft,
  Send
} from 'lucide-react';
import { Category, SiteSettings } from '@/types/database';

interface FooterProps {
  categories: Category[];
  settings?: SiteSettings;
}

export default function Footer({ categories, settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const facebookUrl = settings?.facebook_url || 'https://www.facebook.com/profile.php?id=61584651215444';

  return (
    <footer className="bg-[#051838] text-slate-300 border-t-4 border-[#d0121a] mt-16 pt-10 pb-6 text-sm font-tajawal" data-purpose="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Footer 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-blue-900/60">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-28">
                <Image
                  src="/images/logo.png"
                  alt="شعار صدى"
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-black text-white font-heading">أخبار اليوم</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              بوابة إخبارية تونسية شاملة تقدم تغطية إخبارية مستقلة وموثوقة على مدار الساعة برؤية وطنية متجددة وتغطية شاملة لكل ربوع الوطن.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-blue-900/50 hover:bg-[#d0121a] text-white flex items-center justify-center transition"
                title="صفحتنا على فيسبوك"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-blue-900/50 hover:bg-[#d0121a] text-white flex items-center justify-center transition"
                title="إكس / تويتر"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-blue-900/50 hover:bg-[#d0121a] text-white flex items-center justify-center transition"
                title="يوتيوب"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-blue-900/50 hover:bg-[#d0121a] text-white flex items-center justify-center transition"
                title="إنستغرام"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Sections */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-r-2 border-[#d0121a] pr-2 font-heading">
              أقسام الموقع
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-white transition flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-3 h-3 text-[#d0121a]" />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-r-2 border-[#d0121a] pr-2 font-heading">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronLeft className="w-3 h-3 text-[#d0121a]" />
                  <span>سياسة الخصوصية</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronLeft className="w-3 h-3 text-[#d0121a]" />
                  <span>شروط الاستخدام</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronLeft className="w-3 h-3 text-[#d0121a]" />
                  <span>ميثاق الشرف الصحفي</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronLeft className="w-3 h-3 text-[#d0121a]" />
                  <span>فريق التحرير</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronLeft className="w-3 h-3 text-[#d0121a]" />
                  <span>انضم إلينا</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-r-2 border-[#d0121a] pr-2 font-heading">
              اتصل بنا
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d0121a] shrink-0 mt-0.5" />
                <span>تونس العاصمة، الجمهورية التونسية</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d0121a] shrink-0" />
                <span dir="ltr" className="font-mono">+216 71 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d0121a] shrink-0" />
                <span>contact@sada-news.tn</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Rights & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {currentYear} أخبار اليوم (صدى تونس) - جميع الحقوق محفوظة.</p>
          <p className="text-slate-400">تصميم وتطوير المنصة الإعلامية الوطنية</p>
        </div>
      </div>
    </footer>
  );
}
