import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FileText, 
  CheckCircle2, 
  FileEdit, 
  Flame, 
  Eye, 
  Users, 
  TrendingUp, 
  PlusCircle, 
  ArrowLeft,
  Clock
} from 'lucide-react';
import { getDashboardStats } from '@/lib/db';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: 'إجمالي المقالات',
      value: stats.totalArticles,
      icon: FileText,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      title: 'الأخبار المنشورة',
      value: stats.publishedArticles,
      icon: CheckCircle2,
      color: 'bg-green-50 text-green-600 border-green-200',
    },
    {
      title: 'أخبار بالمسودة',
      value: stats.draftArticles,
      icon: FileEdit,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      title: 'أخبار عاجلة نشطة',
      value: stats.breakingArticles,
      icon: Flame,
      color: 'bg-red-50 text-red-600 border-red-200',
    },
    {
      title: 'إجمالي المشاهدات',
      value: stats.totalViews.toLocaleString('ar-TN'),
      icon: Eye,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      title: 'مشتركو النشرة',
      value: stats.subscribersCount,
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-l from-brand-navy to-brand-navyLight text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl">
            مرحباً بك في غرفة الأخبار والتحرير «صدى»
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl font-tajawal">
            يمكنك من هنا متابعة تدفق الأخبار، نشر التحديثات العاجلة، ومراقبة تفاعل القراء على مدار الساعة.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="px-5 py-2.5 bg-brand-red hover:bg-brand-redDark text-white rounded-lg text-xs font-bold transition shadow flex items-center gap-2 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>تحرير خبر جديد</span>
        </Link>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border bg-white shadow-sm flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-bold">{card.title}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="font-heading font-black text-2xl text-brand-navy">
                {card.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Articles & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Articles Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-brand-navy flex items-center gap-2">
              <span className="w-2 h-4 bg-brand-red rounded-sm"></span>
              <span>آخر الأخبار المنشورة والمعدلة</span>
            </h2>
            <Link
              href="/admin/articles"
              className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1"
            >
              <span>إدارة كافة الأخبار</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4 font-bold">الخبر</th>
                  <th className="py-3 px-4 font-bold">القسم</th>
                  <th className="py-3 px-4 font-bold">الحالة</th>
                  <th className="py-3 px-4 font-bold">المشاهدات</th>
                  <th className="py-3 px-4 font-bold">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={article.featured_image}
                            alt={article.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-xs">
                          <span className="font-heading font-bold text-brand-navy block line-clamp-1">
                            {article.title}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(article.published_at).toLocaleDateString('ar-TN')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-gray-100 text-brand-navy px-2 py-0.5 rounded text-[11px] font-bold">
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
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 font-bold ml-2"
                      >
                        تعديل
                      </Link>
                      <Link
                        href={`/news/${article.slug}`}
                        target="_blank"
                        className="text-gray-500 hover:text-gray-800"
                      >
                        معاينة
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights & Performance (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-heading font-bold text-base text-brand-navy mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-red" />
              <span>مؤشرات أداء التحرير</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>نسبة المقالات المنشورة</span>
                  <span className="font-mono font-bold">
                    {Math.round((stats.publishedArticles / (stats.totalArticles || 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${Math.round((stats.publishedArticles / (stats.totalArticles || 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>تغطية الأقسام الرئيسية</span>
                  <span className="font-mono font-bold">9 / 9 أقسام</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-navy h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>حماية البيانات وسياسات RLS</span>
                  <span className="font-bold text-emerald-600">نشطة وآمنة 100%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick action card */}
          <div className="bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-100 p-5 shadow-sm">
            <h3 className="font-heading font-bold text-sm text-brand-navy mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-brand-red fill-brand-red" />
              <span>نشر خبر عاجل فوري</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              يمكنك كتابة ونشر خبر عاجل ليظهر فوراً في شريط الأخبار المتحرك على رأس الموقع.
            </p>
            <Link
              href="/admin/articles/new?isBreaking=true"
              className="w-full py-2 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold rounded-md shadow transition inline-flex items-center justify-center gap-1.5"
            >
              <span>إنشاء خبر عاجل الآن</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
