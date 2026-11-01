import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getArticles, getCategories } from '@/lib/db';
import { Search, Clock, Eye, Calendar, Folder } from 'lucide-react';

export const metadata: Metadata = {
  title: 'محرك البحث المتقدم في الأخبار والتقارير',
  description: 'ابحث في أرشيف صدى الإخباري بالعناوين والمحتوى والأقسام والتواريخ.',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string; date?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '', category = '', date = '' } = await searchParams;

  const [categories, { articles, total }] = await Promise.all([
    getCategories(),
    getArticles({
      search: q,
      categorySlug: category || undefined,
      limit: 30,
    }),
  ]);

  // Optional date filtering
  let filteredArticles = articles;
  if (date === 'today') {
    const today = new Date().toDateString();
    filteredArticles = articles.filter(a => new Date(a.published_at).toDateString() === today);
  } else if (date === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    filteredArticles = articles.filter(a => new Date(a.published_at) >= weekAgo);
  } else if (date === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    filteredArticles = articles.filter(a => new Date(a.published_at) >= monthAgo);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Header Form */}
      <div className="bg-white rounded-xl border border-brand-border p-6 md:p-8 mb-8 shadow-sm">
        <h1 className="font-heading font-black text-2xl md:text-3xl text-brand-navy mb-4 flex items-center gap-2">
          <Search className="w-6 h-6 text-brand-red" />
          <span>محرك البحث الإخباري</span>
        </h1>

        <form method="GET" action="/search" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="ابحث بكلمة مفتاحية، اسم شخصية، أو عنوان خبر..."
                className="w-full bg-gray-50 border border-brand-border rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy focus:bg-white"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category Select */}
            <select
              name="category"
              defaultValue={category}
              className="bg-gray-50 border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
            >
              <option value="">جميع الأقسام</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Date Select */}
            <select
              name="date"
              defaultValue={date}
              className="bg-gray-50 border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
            >
              <option value="">كل التواريخ</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-brand-red hover:bg-brand-redDark text-white px-8 py-3 rounded-lg text-sm font-bold shadow transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>بحث</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-6">
        <h2 className="font-heading font-bold text-lg text-brand-navy">
          نتائج البحث {q ? `عن: «${q}»` : ''} ({filteredArticles.length})
        </h2>
        {q && (
          <Link href="/search" className="text-xs text-brand-red font-bold hover:underline">
            إفراغ البحث
          </Link>
        )}
      </div>

      {/* Results Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-brand-border p-6">
          <p className="text-gray-600 font-bold text-base mb-2">
            لم يتم العثور على أية نتائج مطابقة لمعايير البحث.
          </p>
          <p className="text-xs text-gray-500">
            تأكد من كتابة الكلمات بشكل صحيح أو حاول البحث بمصطلحات أكثر عمومية.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
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
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  {article.category && (
                    <span className="absolute top-3 right-3 bg-brand-navy/90 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow">
                      {article.category.name}
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
                  اقرأ التقرير كاملاً &larr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
