'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Cpu, 
  TrendingUp, 
  Trophy, 
  HeartPulse, 
  CloudSun, 
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';
import { Article, Category } from '@/types/database';

interface ThematicCategoriesSectionProps {
  articles: Article[];
  categories: Category[];
}

interface ThematicTheme {
  slug: string;
  name: string;
  gradient: string;
  hoverColor: string;
  icon: React.ComponentType<{ className?: string }>;
  fallbackTitle: string;
  fallbackImage: string;
}

const THEMES: ThematicTheme[] = [
  {
    slug: 'technology',
    name: 'التكنولوجيا',
    gradient: 'from-teal-600 to-cyan-700',
    hoverColor: 'group-hover:text-teal-600',
    icon: Cpu,
    fallbackTitle: 'الذكاء الاصطناعي.. ثورة تكنولوجية لا تتوقف وفرص العمل الجديدة',
    fallbackImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'economy',
    name: 'الاقتصاد',
    gradient: 'from-amber-600 to-orange-600',
    hoverColor: 'group-hover:text-orange-600',
    icon: TrendingUp,
    fallbackTitle: 'مؤشرات إيجابية للاقتصاد التونسي وتحسن الصادرات في القطاعات الواعدة',
    fallbackImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'sports',
    name: 'الرياضة',
    gradient: 'from-blue-600 to-indigo-700',
    hoverColor: 'group-hover:text-blue-600',
    icon: Trophy,
    fallbackTitle: 'الترجي الرياضي والأندية التونسية في سباق المسابقات القارية والدولية',
    fallbackImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'health',
    name: 'الصحة',
    gradient: 'from-purple-700 to-fuchsia-700',
    hoverColor: 'group-hover:text-purple-700',
    icon: HeartPulse,
    fallbackTitle: 'نصائح طبية مهمة للحفاظ على صحة وسلامة القلب والشرايين وجودة الحياة',
    fallbackImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'weather',
    name: 'الطقس',
    gradient: 'from-emerald-600 to-green-700',
    hoverColor: 'group-hover:text-emerald-700',
    icon: CloudSun,
    fallbackTitle: 'طقس مستقر مع درجات حرارة ملائمة في كافة ولايات الجمهورية',
    fallbackImage: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80',
  },
];

export default function ThematicCategoriesSection({ articles, categories }: ThematicCategoriesSectionProps) {
  // Helper to calculate "منذ X ساعات"
  const getTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'منذ قليل';
    const diffHours = Math.max(1, Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60)));
    if (diffHours < 24) return `منذ ${diffHours} ساعات`;
    const diffDays = Math.floor(diffHours / 24);
    return `منذ ${diffDays} أيام`;
  };

  return (
    <section className="space-y-4 my-8" data-purpose="thematic-categories">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#d0121a] pb-2">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 font-heading">
          <span className="w-3 h-6 bg-[#d0121a] rounded-sm"></span>
          <span>أقسام الموقع المميزة</span>
        </h2>
        <Link 
          href="/news" 
          className="text-xs font-bold text-[#08285c] hover:text-[#d0121a] flex items-center gap-1 transition"
        >
          <span>عرض كل الأقسام</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* 5-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {THEMES.map((theme) => {
          const IconComp = theme.icon;
          // Find matching article for this theme or fallback to an article
          const matchingArticle = articles.find(
            (a) => a.category?.slug === theme.slug || a.tags?.some((t) => t.slug === theme.slug)
          );

          const title = matchingArticle?.title || theme.fallbackTitle;
          const image = matchingArticle?.featured_image || theme.fallbackImage;
          const href = matchingArticle ? `/news/${matchingArticle.slug}` : `/category/${theme.slug}`;
          const timeAgo = getTimeAgo(matchingArticle?.published_at);

          return (
            <article 
              key={theme.slug}
              className="news-card-hover bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col group cursor-pointer shadow-sm hover:shadow-md transition"
            >
              {/* Card Header Bar */}
              <div className={`bg-gradient-to-r ${theme.gradient} text-white px-3 py-2 flex items-center justify-between font-bold text-xs`}>
                <span className="flex items-center gap-1.5">
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{theme.name}</span>
                </span>
                <ChevronLeft className="w-3.5 h-3.5 text-white/80 group-hover:-translate-x-1 transition" />
              </div>

              {/* Image Container */}
              <div className="relative h-36 overflow-hidden bg-slate-900">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Card Body */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <Link href={href}>
                  <h3 className={`text-xs font-bold text-gray-800 leading-snug line-clamp-2 transition ${theme.hoverColor}`}>
                    {title}
                  </h3>
                </Link>
                <div className="flex items-center justify-between text-[10px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
                  <span>{timeAgo}</span>
                  <span className="font-semibold text-gray-600 group-hover:text-[#d0121a] flex items-center gap-0.5">
                    اقرأ المزيد
                    <ArrowLeft className="w-3 h-3 inline" />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
