'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Flame, 
  CheckCircle, 
  Clock, 
  Filter,
  Eye
} from 'lucide-react';
import { Article, Category } from '@/types/database';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/articles?status=all&limit=100');
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف المقال: "${title}"؟`)) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(articles.filter(a => a.id !== id));
      } else {
        alert('تعذر حذف المقال');
      }
    } catch {
      alert('حدث خطأ أثناء الحذف');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesSearch = !search || 
      a.title.toLowerCase().includes(search.toLowerCase()) || 
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !selectedCategory || a.category_id === selectedCategory || a.category?.slug === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="font-heading font-black text-2xl text-brand-navy">
            إدارة الأخبار والمقالات
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            عرض وتعديل وحذف وجدولة كافة الأخبار الصحفية
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-brand-redDark text-white rounded-lg text-xs font-bold transition shadow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إضافة خبر جديد</span>
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="بحث بالعنوان أو المحتوى..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-9 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-navy focus:bg-white"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-navy"
        >
          <option value="">جميع الأقسام</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-navy"
        >
          <option value="all">كافة الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
          <option value="scheduled">مجدول</option>
        </select>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">
            جاري تحميل قائمة الأخبار...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            لم يتم العثور على أية أخبار مطابقة للتصفية.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 font-bold">
                <tr>
                  <th className="py-3 px-4">الصورة والعنوان</th>
                  <th className="py-3 px-4">القسم</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4">المشاهدات</th>
                  <th className="py-3 px-4">تاريخ النشر</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3 max-w-md">
                        <div className="relative w-14 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={article.featured_image}
                            alt={article.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            {article.is_breaking && (
                              <span className="bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.2 rounded text-[9px] font-bold">
                                عاجل
                              </span>
                            )}
                            {article.is_featured && (
                              <span className="bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.2 rounded text-[9px] font-bold">
                                رئيسي
                              </span>
                            )}
                          </div>
                          <span className="font-heading font-bold text-brand-navy block line-clamp-1">
                            {article.title}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-gray-100 text-brand-navy px-2.5 py-0.5 rounded text-[11px] font-bold">
                        {article.category?.name || 'عام'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {article.status === 'published' ? (
                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200">
                          منشور
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                          مسودة
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-700">
                      {article.views_count.toLocaleString('ar-TN')}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(article.published_at).toLocaleDateString('ar-TN')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition"
                          title="تعديل المقال"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/news/${article.slug}`}
                          target="_blank"
                          className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded transition"
                          title="معاينة في الموقع"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          disabled={deletingId === article.id}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded transition disabled:opacity-50"
                          title="حذف المقال"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
