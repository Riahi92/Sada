'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, ChevronDown } from 'lucide-react';
import { Article } from '@/types/database';

interface LatestNewsSectionProps {
  initialArticles: Article[];
}

export default function LatestNewsSection({ initialArticles }: LatestNewsSectionProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [visibleCount, setVisibleCount] = useState(6);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const displayedArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between pb-4 border-b-2 border-brand-navy mb-6">
        <div className="flex items-center gap-3">
          <span className="w-3 h-6 bg-brand-red rounded-sm"></span>
          <h2 className="font-heading font-black text-2xl text-brand-navy">
            آخر الأخبار والتقارير
          </h2>
        </div>
        <span className="text-xs text-brand-muted">
          تحديث مستمر على مدار الساعة
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedArticles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-lg border border-brand-border overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                {article.category && (
                  <Link
                    href={`/category/${article.category.slug}`}
                    className="absolute top-3 right-3 bg-brand-navy/90 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow hover:bg-brand-red transition"
                  >
                    {article.category.name}
                  </Link>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3 text-xs text-brand-muted mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(article.published_at).toLocaleDateString('ar-TN')}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{article.views_count.toLocaleString('ar-TN')}</span>
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base md:text-lg text-brand-navy leading-snug mb-2 group-hover:text-brand-red transition line-clamp-2">
                  <Link href={`/news/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="text-gray-600 text-sm font-tajawal leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <Link
                href={`/news/${article.slug}`}
                className="text-xs font-bold text-brand-navy group-hover:text-brand-red transition inline-block pt-2 border-t border-gray-100 w-full"
              >
                اقرأ المزيد &larr;
              </Link>
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-navy hover:bg-brand-navyLight text-white rounded-md text-sm font-bold shadow transition"
          >
            <span>تحميل المزيد من الأخبار</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
