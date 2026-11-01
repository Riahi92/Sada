import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getCategoryBySlug, getArticles, getCategories } from '@/lib/db';
import { Clock, Eye, Folder } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'القسم غير موجود | صدى' };
  }

  return {
    title: `${category.name} | صدى للأخبار`,
    description: category.description || `أحدث أخبار وتقارير قسم ${category.name} على مدار الساعة.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const currentPage = page ? parseInt(page) : 1;
  const limit = 9;
  const offset = (currentPage - 1) * limit;

  const [{ articles, total }, allCategories] = await Promise.all([
    getArticles({
      categoryId: category.id,
      limit,
      offset,
    }),
    getCategories(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="bg-white rounded-xl border border-brand-border p-6 md:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-2xl shadow">
            <Folder className="w-7 h-7 text-brand-red" />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl md:text-3xl text-brand-navy">
              {category.name}
            </h1>
            <p className="text-sm text-gray-600 mt-1 font-tajawal">
              {category.description || 'متابعة شاملة لجميع التطورات والتقارير الحصرية في هذا القسم.'}
            </p>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-brand-border">
          <p className="text-gray-500 font-bold">لا توجد مقالات منشورة في هذا القسم حالياً.</p>
          <Link href="/" className="text-xs text-brand-red font-bold mt-2 inline-block hover:underline">
            العودة للرئيسية
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
                href={`/category/${slug}?page=${pageNum}`}
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
