'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '@/types/database';

interface BreakingTickerProps {
  articles: Article[];
}

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [articles.length]);

  if (!articles || articles.length === 0) return null;

  const currentArticle = articles[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  return (
    <section className="bg-white border-b border-gray-200 py-1.5 px-4 sm:px-8 shadow-sm z-20" data-purpose="breaking-news">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Breaking Label */}
        <div className="flex items-center bg-[#d0121a] text-white font-extrabold text-sm px-4 py-1.5 rounded shadow-sm shrink-0">
          <Zap className="w-4 h-4 ml-1.5 animate-bounce fill-white text-white" />
          <span>عاجل</span>
        </div>

        {/* Marquee / Ticker text */}
        <div className="flex-1 overflow-hidden relative">
          <Link
            href={`/news/${currentArticle.slug}`}
            className="text-sm font-bold text-gray-800 truncate hover:text-[#d0121a] cursor-pointer transition block"
          >
            {currentArticle.title}
          </Link>
        </div>

        {/* Arrow Controls */}
        {articles.length > 1 && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] text-gray-400 font-mono ml-2 hidden sm:inline-block">
              {currentIndex + 1} / {articles.length}
            </span>
            <button
              onClick={handlePrev}
              className="w-7 h-7 rounded bg-gray-100 hover:bg-[#d0121a] hover:text-white text-gray-700 flex items-center justify-center transition text-xs"
              title="السابق"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="w-7 h-7 rounded bg-gray-100 hover:bg-[#d0121a] hover:text-white text-gray-700 flex items-center justify-center transition text-xs"
              title="التالي"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
