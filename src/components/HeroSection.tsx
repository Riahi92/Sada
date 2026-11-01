import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, User, ArrowLeft } from 'lucide-react';
import { Article } from '@/types/database';

interface HeroSectionProps {
  mainArticle: Article | null;
  secondaryArticles: Article[];
}

export default function HeroSection({ mainArticle, secondaryArticles }: HeroSectionProps) {
  if (!mainArticle) return null;

  return (
    <section className="py-6 border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Story (8 Cols) */}
          <div className="lg:col-span-8">
            <article className="bg-white rounded-lg border border-brand-border overflow-hidden shadow-sm hover:shadow-md transition group h-full flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={mainArticle.featured_image}
                    alt={mainArticle.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  {/* Category Chip */}
                  {mainArticle.category && (
                    <Link
                      href={`/category/${mainArticle.category.slug}`}
                      className="absolute top-4 right-4 bg-brand-red text-white text-xs font-bold px-3 py-1.5 rounded shadow z-10 hover:bg-brand-redDark transition"
                    >
                      {mainArticle.category.name}
                    </Link>
                  )}
                  {mainArticle.is_breaking && (
                    <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-red-400 text-xs font-bold px-2.5 py-1 rounded shadow z-10 flex items-center gap-1.5 border border-red-500/30">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      تغطية خاصة
                    </span>
                  )}
                </div>

                <div className="p-6">
                  {/* Meta Bar */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-brand-muted mb-3">
                    {mainArticle.author && (
                      <span className="flex items-center gap-1 font-medium text-brand-navy">
                        <User className="w-3.5 h-3.5 text-brand-red" />
                        <span>{mainArticle.author.full_name}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(mainArticle.published_at).toLocaleDateString('ar-TN')}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{mainArticle.views_count.toLocaleString('ar-TN')} مشاهدة</span>
                    </span>
                  </div>

                  {/* Headline */}
                  <h1 className="font-heading font-black text-2xl md:text-3xl lg:text-4xl text-brand-navy leading-snug mb-3 group-hover:text-brand-red transition">
                    <Link href={`/news/${mainArticle.slug}`}>
                      {mainArticle.title}
                    </Link>
                  </h1>

                  {/* Excerpt */}
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed font-tajawal mb-4 line-clamp-3">
                    {mainArticle.excerpt}
                  </p>
                </div>
              </div>

              {/* Read Action Footer */}
              <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href={`/news/${mainArticle.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy group-hover:text-brand-red transition"
                >
                  <span>اقرأ التقرير كاملاً</span>
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition" />
                </Link>
                <span className="text-xs text-gray-400">قراءة في 3 دقائق</span>
              </div>
            </article>
          </div>

          {/* Secondary Featured Stories (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <h2 className="font-heading font-bold text-lg text-brand-navy flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-brand-red rounded-sm"></span>
                <span>أهم العناوين</span>
              </h2>
              <Link href="/news" className="text-xs font-semibold text-brand-red hover:underline">
                شاهد الكل
              </Link>
            </div>

            <div className="flex flex-col gap-4 flex-1 justify-between">
              {secondaryArticles.slice(0, 3).map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg border border-brand-border p-4 shadow-sm hover:shadow-md transition group flex gap-4"
                >
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 md:w-28 md:h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={article.featured_image}
                      alt={article.title}
                      fill
                      sizes="112px"
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      {article.category && (
                        <span className="text-[11px] font-bold text-brand-red mb-1 inline-block">
                          {article.category.name}
                        </span>
                      )}
                      <h3 className="font-heading font-bold text-sm text-brand-navy leading-snug line-clamp-2 group-hover:text-brand-red transition">
                        <Link href={`/news/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-brand-muted mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(article.published_at).toLocaleDateString('ar-TN')}</span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
