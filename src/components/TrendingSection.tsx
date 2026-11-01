import React from 'react';
import Link from 'next/link';
import { Flame, Eye } from 'lucide-react';
import { Article } from '@/types/database';

interface TrendingSectionProps {
  articles: Article[];
}

export default function TrendingSection({ articles }: TrendingSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <aside className="bg-white rounded-lg border border-brand-border p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b-2 border-brand-red mb-4">
        <h3 className="font-heading font-black text-lg text-brand-navy flex items-center gap-2">
          <Flame className="w-5 h-5 text-brand-red fill-brand-red" />
          <span>الأكثر قراءة الآن</span>
        </h3>
        <span className="text-xs bg-red-50 text-brand-red px-2 py-0.5 rounded font-bold">
          شائع
        </span>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {articles.slice(0, 5).map((article, index) => (
          <div key={article.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3 group">
            {/* Index rank */}
            <span className="font-heading font-black text-2xl text-gray-300 group-hover:text-brand-red transition w-6 text-center flex-shrink-0">
              {index + 1}
            </span>

            {/* Info */}
            <div className="flex-1">
              {article.category && (
                <span className="text-[10px] font-bold text-brand-navyLight block mb-0.5">
                  {article.category.name}
                </span>
              )}
              <h4 className="font-heading font-bold text-sm text-brand-navy leading-snug line-clamp-2 group-hover:text-brand-red transition">
                <Link href={`/news/${article.slug}`}>
                  {article.title}
                </Link>
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-brand-muted mt-1.5">
                <Eye className="w-3 h-3" />
                <span>{article.views_count.toLocaleString('ar-TN')} قراءة</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
