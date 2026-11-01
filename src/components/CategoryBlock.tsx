import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock } from 'lucide-react';
import { Article, Category } from '@/types/database';

interface CategoryBlockProps {
  category: Category;
  articles: Article[];
}

export default function CategoryBlock({ category, articles }: CategoryBlockProps) {
  if (!articles || articles.length === 0) return null;

  const leadArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <div className="bg-white rounded-lg border border-brand-border p-5 shadow-sm">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-brand-navy mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-5 bg-brand-red rounded-sm"></span>
          <h3 className="font-heading font-black text-xl text-brand-navy">
            {category.name}
          </h3>
        </div>
        <Link
          href={`/category/${category.slug}`}
          className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1"
        >
          <span>المزيد من القسم</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Main lead story in category */}
        {leadArticle && (
          <div className="md:col-span-7">
            <article className="group">
              <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden bg-gray-100 mb-3">
                <Image
                  src={leadArticle.featured_image}
                  alt={leadArticle.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-muted mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(leadArticle.published_at).toLocaleDateString('ar-TN')}</span>
              </div>
              <h4 className="font-heading font-bold text-base md:text-lg text-brand-navy leading-snug mb-2 group-hover:text-brand-red transition">
                <Link href={`/news/${leadArticle.slug}`}>
                  {leadArticle.title}
                </Link>
              </h4>
              <p className="text-gray-600 text-sm font-tajawal line-clamp-2">
                {leadArticle.excerpt}
              </p>
            </article>
          </div>
        )}

        {/* Side mini-stories */}
        <div className="md:col-span-5 flex flex-col justify-between divide-y divide-gray-100">
          {sideArticles.map((article) => (
            <article key={article.id} className="py-2.5 first:pt-0 last:pb-0 flex gap-3 group">
              <div className="relative w-20 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  sizes="80px"
                  className="object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="flex-1">
                <h5 className="font-heading font-bold text-xs text-brand-navy leading-snug line-clamp-2 group-hover:text-brand-red transition">
                  <Link href={`/news/${article.slug}`}>
                    {article.title}
                  </Link>
                </h5>
                <span className="text-[10px] text-brand-muted mt-1 inline-block">
                  {new Date(article.published_at).toLocaleDateString('ar-TN')}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
