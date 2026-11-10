import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getArticles, getCategories } from '@/lib/db';
import { Clock, Eye, Filter } from 'lucide-react';
import CategoryIcon from '@/components/CategoryIcon';

export const metadata: Metadata = {
  title: 'آخر الأخبار والتقارير الشاملة',
  description: 'تغطية شاملة لآخر الأخبار والتقارير في تونس والوطن العربي والعالم على مدار الساعة.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface NewsPageProps {
  searchParams: Promise<{ sortBy?: string; category?: string; page?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const sortBy = (params.sortBy as 'latest' | 'views' | 'trending') || 'latest';
  const categorySlug = params.category || undefined;
  const currentPage = params.page ? parseInt(params.page) : 1;
  const limit = 12;
  const offset = (currentPage - 1) * limit;

  const [{ articles, total }, categories] = await Promise.all([
    getArticles({
      categorySlug,
      sortBy,
      limit,
      offset,
    }),
    getCategories(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-brand-border gap-4 mb-8">
        <div>
          <h1 className="font-heading font-black text-3xl text-brand-navy flex items-center gap-2">
            <span className="w-3 h-7 bg-brand-red rounded-sm"></span>
            <span>أحدث الأخبار والتقارير</span>
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            إجمالي {total} تقريراً وخبر موثق
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg text-xs font-bold text-brand-navy">
          <Link
            href={`/news?${categorySlug ? `category=${categorySlug}&` : ''}sortBy=latest`}
            className={`px-3 py-1.5 rounded-md transition ${
              sortBy === 'latest' ? 'bg-white shadow text-brand-red' : 'hover:bg-white/60'
            }`}
          >
            الأحدث أولاً
          </Link>
          <Link
            href={`/news?${categorySlug ? `category=${categorySlug}&` : ''}sortBy=views`}
            className={`px-3 py-1.5 rounded-md transition ${
              sortBy === 'views' ? 'bg-white shadow text-brand-red' : 'hover:bg-white/60'
            }`}
          >
            الأكثر قراءة
          </Link>
          <Link
            href={`/news?${categorySlug ? `category=${categorySlug}&` : ''}sortBy=trending`}
            className={`px-3 py-1.5 rounded-md transition ${
              sortBy === 'trending' ? 'bg-white shadow text-brand-red' : 'hover:bg-white/60'
            }`}
          >
            الشائع
          </Link>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        <Link
          href="/news"
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
            !categorySlug ? 'bg-brand-navy text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
        >
          كل الأقسام
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/news?category=${cat.slug}&sortBy=${sortBy}`}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              categorySlug === cat.slug ? 'bg-brand-red text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <CategoryIcon slug={cat.slug} icon={cat.icon} className={`w-3.5 h-3.5 ${categorySlug === cat.slug ? 'text-white' : 'text-[#d0121a]'}`} />
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-brand-border">
          <p className="text-gray-500 font-bold">لا توجد أخبار مطابقة للتصفية الحالية.</p>
          <Link href="/news" className="text-xs text-brand-red font-bold mt-2 inline-block hover:underline">
            إعادة تعيين التصفية
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
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
                    <span className="inline-flex items-center gap-1 absolute top-3 right-3 bg-brand-navy/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow backdrop-blur-xs">
                      <CategoryIcon slug={article.category.slug} icon={article.category.icon} className="w-3 h-3 text-red-400" />
                      <span>{article.category.name}</span>
                    </span>
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

                  <h2 className="font-heading font-bold text-base md:text-lg text-brand-navy leading-snug mb-2 group-hover:text-brand-red transition line-clamp-2">
                    <Link href={`/news/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

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
                  اقرأ التقرير كاملاً &larr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isCurrent = pageNum === currentPage;
            return (
              <Link
                key={pageNum}
                href={`/news?page=${pageNum}${categorySlug ? `&category=${categorySlug}` : ''}&sortBy=${sortBy}`}
                className={`w-9 h-9 rounded-md flex items-center justify-center text-xs font-bold transition ${
                  isCurrent ? 'bg-brand-red text-white' : 'bg-white border border-gray-200 text-brand-navy hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
