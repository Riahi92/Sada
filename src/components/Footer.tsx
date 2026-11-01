import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { Category, SiteSettings } from '@/types/database';

interface FooterProps {
  categories: Category[];
  settings?: SiteSettings;
}

export default function Footer({ categories, settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const facebookUrl = settings?.facebook_url || 'https://www.facebook.com/profile.php?id=61584651215444';

  return (
    <footer className="bg-brand-navyDark text-gray-300 border-t-4 border-brand-red mt-16 font-tajawal">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center text-white font-heading font-black text-xl shadow">
                ص
              </div>
              <span className="font-heading font-black text-2xl text-white tracking-wide">
                مـنـصـة صَـدَى
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              منصة إخبارية تونسية وعربية مستقلة وشاملة، تنقل الخبر بمصداقية وعمق وموضوعية، ملتزمة بأعلى معايير النزاهة الصحفية ومواكبة الثورة الرقمية.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-navy hover:bg-brand-red flex items-center justify-center transition text-white"
                title="صفحتنا على فيسبوك"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-navy hover:bg-brand-red flex items-center justify-center transition text-white"
                title="تويتر / إكس"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-navy hover:bg-brand-red flex items-center justify-center transition text-white"
                title="إنستغرام"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-navy hover:bg-brand-red flex items-center justify-center transition text-white"
                title="يوتيوب"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 pb-2 border-b border-brand-navyLight flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-red rounded-full"></span>
              <span>الأقسام الإخبارية</span>
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-white hover:underline transition py-1 block"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 pb-2 border-b border-brand-navyLight flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-red rounded-full"></span>
              <span>روابط تهمك</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  من نحن ورسالتنا الصحفية
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  شروط الاستخدام وحقوق النشر
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  اتصل بهيئة التحرير
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-brand-red font-bold hover:underline transition">
                  دخول المحررين ولوحة الإدارة
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 pb-2 border-b border-brand-navyLight flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-red rounded-full"></span>
              <span>اتصل بنا</span>
            </h4>
            <div className="space-y-3 text-xs text-gray-300">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <span>تونس العاصمة، شارع الحبيب بورقيبة، الجمهورية التونسية</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-red flex-shrink-0" />
                <span>contact@sada-news.tn</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-red flex-shrink-0" />
                <span>+216 71 000 000</span>
              </p>
              <div className="pt-2">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>تواصل معنا عبر صفحة فيسبوك</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/50 py-4 px-4 border-t border-white/5 text-xs text-center text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {currentYear} منصة صدى الإخبارية. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1">
            <span>صمم وطور بأحدث تقنيات الويب الحديثة</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
