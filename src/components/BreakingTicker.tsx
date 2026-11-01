'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="w-full bg-brand-navy border-b border-brand-border/20 text-white overflow-hidden shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-12">
        {/* Urgent Badge */}
        <div className="flex-shrink-0 flex items-center gap-2 bg-brand-red text-white px-3.5 py-1.5 rounded font-heading font-black text-sm tracking-wide z-10 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-pulseGlow"></span>
          <span>عـاجـل</span>
        </div>

        {/* Headline Display */}
        <div className="flex-1 overflow-hidden px-4 text-sm font-medium font-cairo">
          <Link
            href={`/news/${currentArticle.slug}`}
            className="hover:text-red-300 transition line-clamp-1 block"
          >
            {currentArticle.title}
          </Link>
        </div>

        {/* Navigation Controls */}
        {articles.length > 1 && (
          <div className="flex-shrink-0 flex items-center gap-1">
            <span className="text-[11px] text-gray-400 font-mono ml-2">
              {currentIndex + 1} / {articles.length}
            </span>
            <button
              onClick={handlePrev}
              className="p-1 text-gray-300 hover:text-white hover:bg-white/10 rounded transition"
              title="الخبر السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 text-gray-300 hover:text-white hover:bg-white/10 rounded transition"
              title="الخبر التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
