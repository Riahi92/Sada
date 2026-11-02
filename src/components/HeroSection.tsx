'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BarChart2, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles,
  Flame,
  Tag
} from 'lucide-react';
import { Article } from '@/types/database';
import CategoryIcon from '@/components/CategoryIcon';

interface HeroSectionProps {
  mainArticle: Article | null;
  secondaryArticles?: Article[];
  trendingArticles?: Article[];
  latestArticles?: Article[];
}

export default function HeroSection({ 
  mainArticle, 
  secondaryArticles = [], 
  trendingArticles = [], 
  latestArticles = [] 
}: HeroSectionProps) {
  // Carousel slides combine mainArticle + secondaryArticles
  const slides = [
    ...(mainArticle ? [mainArticle] : []),
    ...secondaryArticles
  ];

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  if (slides.length === 0) return null;

  const currentSlide = slides[activeSlideIndex] || slides[0];

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // 5 Most Read articles
  const mostReadList = trendingArticles.slice(0, 5);

  // 5 Latest Feed articles
  const latestFeedList = latestArticles.slice(0, 5);

  // Format short time (e.g. 16:45)
  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'الآن';
    }
  };

  return (
    <section className="py-6" data-purpose="hero-tri-column">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* 1. Left Column: الأكثر قراءة (Most Read) - 3 Columns */}
        <aside className="lg:col-span-3 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col order-2 lg:order-1" data-purpose="most-read-column">
          {/* Title Banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2.5 flex items-center justify-between font-bold">
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <BarChart2 className="w-4 h-4" />
              <span>الأكثر قراءة</span>
            </span>
            <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded font-normal">اليوم</span>
          </div>

          {/* Ranked Articles List */}
          <div className="divide-y divide-gray-100 flex-1 flex flex-col justify-between p-2">
            {mostReadList.map((item, idx) => (
              <article key={item.id} className="p-2.5 flex items-center gap-3 hover:bg-red-50/50 rounded transition group cursor-pointer">
                {/* Ranking Circle Badge */}
                <span className="w-6 h-6 rounded-full bg-[#d0121a] text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-110 transition shadow-sm">
                  {idx + 1}
                </span>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <Link href={`/news/${item.slug}`}>
                    <h3 className="text-xs font-bold text-gray-800 leading-snug group-hover:text-[#d0121a] transition line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                </div>

                {/* Thumbnail Icon/Image */}
                <div className="w-12 h-12 rounded bg-slate-100 shrink-0 overflow-hidden relative border border-gray-100">
                  {item.featured_image ? (
                    <Image
                      src={item.featured_image}
                      alt={item.title}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Flame className="w-5 h-5 text-amber-600" />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </aside>

        {/* 2. Center Column: Feature Slider Hero - 6 Columns */}
        <section className="lg:col-span-6 rounded-lg overflow-hidden border border-gray-200 shadow-md relative min-h-[420px] lg:min-h-[460px] flex flex-col justify-end group bg-slate-900 order-1 lg:order-2" data-purpose="hero-featured-news">
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none"></div>

          {/* Hero Image */}
          {currentSlide.featured_image && (
            <Image
              src={currentSlide.featured_image}
              alt={currentSlide.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          )}

          {/* Tunisian National / Special Coverage Badge */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d0121a] animate-ping"></span>
            <span className="text-xs font-bold text-white tracking-wide">
              {currentSlide.is_breaking ? 'تغطية عاجلة' : 'الحدث الوطني'}
            </span>
          </div>

          {/* Carousel Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button 
                onClick={handlePrevSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#d0121a] text-white flex items-center justify-center transition border border-white/20 backdrop-blur"
                title="السابق"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNextSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#d0121a] text-white flex items-center justify-center transition border border-white/20 backdrop-blur"
                title="التالي"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Slide Content */}
          <div className="relative z-20 p-6 text-white text-center">
            {/* Category Pill */}
            {currentSlide.category && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 bg-[#d0121a] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  <CategoryIcon slug={currentSlide.category.slug} icon={currentSlide.category.icon} className="w-3.5 h-3.5" />
                  <span>{currentSlide.category.name}</span>
                </span>
              </div>
            )}

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white font-heading drop-shadow-md leading-relaxed">
              <Link href={`/news/${currentSlide.slug}`} className="hover:underline">
                {currentSlide.title}
              </Link>
            </h2>

            {/* Subhead / Excerpt in Amber */}
            <p className="text-amber-300 text-xs sm:text-sm font-semibold mb-4 drop-shadow font-tajawal line-clamp-2 max-w-xl mx-auto">
              {currentSlide.excerpt}
            </p>

            {/* Read Button */}
            <div className="flex items-center justify-center gap-3">
              <Link
                href={`/news/${currentSlide.slug}`}
                className="inline-flex items-center gap-2 bg-[#d0121a] hover:bg-[#a30c12] text-white text-xs sm:text-sm font-bold px-5 py-2 rounded-full transition shadow-lg hover:shadow-red-600/40"
              >
                <span>اقرأ المزيد</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            {/* Slider Indicators */}
            {slides.length > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-4">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlideIndex(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === activeSlideIndex ? 'w-6 bg-[#d0121a]' : 'w-2.5 bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`شريحة ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 3. Right Column: آخر الأخبار (Latest News Timetable) - 3 Columns */}
        <aside className="lg:col-span-3 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col order-3" data-purpose="latest-news-column">
          {/* Title Banner */}
          <div className="bg-gradient-to-l from-blue-900 to-blue-800 text-white px-4 py-2.5 flex items-center justify-between font-bold">
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <Clock className="w-4 h-4" />
              <span>آخر الأخبار</span>
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          {/* News Feed List with Times */}
          <div className="divide-y divide-gray-100 flex-1 flex flex-col justify-between p-2 text-xs">
            {latestFeedList.map((item) => (
              <article key={item.id} className="p-2.5 hover:bg-blue-50/50 rounded transition group cursor-pointer">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="font-bold text-[#d0121a] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[10px]" />
                    <span>{formatTime(item.published_at)}</span>
                  </span>
                  {item.category && (
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                      <CategoryIcon slug={item.category.slug} icon={item.category.icon} className="w-3 h-3 text-[#d0121a]" />
                      <span>{item.category.name}</span>
                    </span>
                  )}
                </div>
                <Link href={`/news/${item.slug}`}>
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-900 transition leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </aside>

      </div>
    </section>
  );
}
