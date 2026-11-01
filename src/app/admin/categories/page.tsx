'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Folder, Check, AlertCircle, Save } from 'lucide-react';
import { Category } from '@/types/database';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Folder');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setIcon(cat.icon || 'Folder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setIcon('Folder');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      setMessage({ type: 'error', text: 'اسم القسم والرابط مطلوبان' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      if (editingCategory) {
        // Update
        const res = await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCategory.id,
            name,
            slug,
            description,
            icon,
          }),
        });
        if (res.ok) {
          setMessage({ type: 'success', text: 'تم تعديل القسم بنجاح' });
          handleCancelEdit();
          fetchCategories();
        } else {
          setMessage({ type: 'error', text: 'تعذر تعديل القسم' });
        }
      } else {
        // Create
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            slug,
            description,
            icon,
          }),
        });
        if (res.ok) {
          setMessage({ type: 'success', text: 'تم إنشاء القسم بنجاح' });
          handleCancelEdit();
          fetchCategories();
        } else {
          setMessage({ type: 'error', text: 'تعذر إضافة القسم' });
        }
      }
    } catch {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء المعالجة' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`هل أنت متأكد من حذف القسم "${catName}"؟`)) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        alert('تعذر حذف القسم');
      }
    } catch {
      alert('حدث خطأ أثناء الحذف');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="font-heading font-black text-2xl text-brand-navy">
          إدارة الأقسام والتصنيفات الإخبارية
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          تنظيم وهيكلة أقسام الموقع، وتحديد الروابط الدائمة والأيقونات التحريرية
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-heading font-bold text-base text-brand-navy flex items-center gap-2">
              <Folder className="w-4 h-4 text-brand-red" />
              <span>{editingCategory ? 'تعديل قسم قائم' : 'إضافة قسم جديد'}</span>
            </h2>
            {editingCategory && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                إلغاء
              </button>
            )}
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                اسم القسم بالعربية *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingCategory && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="مثال: أخبار الطاقة، شؤون دولية..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                الرابط التعريفي (Slug) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="energy-news"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                أيقونة القسم (Lucide Icon Name)
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Folder, Globe, Trophy, Cpu..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                وصف موجز للقسم
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف تحريري يظهر أعلى صفحة القسم..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-brand-navy hover:bg-brand-navyLight text-white rounded-lg text-xs font-bold shadow transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'جاري الحفظ...' : editingCategory ? 'حفظ التعديلات' : 'إضافة القسم'}</span>
            </button>
          </form>
        </div>

        {/* Categories List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-brand-navy">
              قائمة الأقسام المسجلة ({categories.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-gray-400">
              جاري تحميل الأقسام...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 font-bold">
                  <tr>
                    <th className="py-3 px-4">اسم القسم</th>
                    <th className="py-3 px-4">الرابط (Slug)</th>
                    <th className="py-3 px-4">المقالات</th>
                    <th className="py-3 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-bold text-brand-navy">
                        {cat.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-500">
                        {cat.slug}
                      </td>
                      <td className="py-3 px-4 font-bold text-brand-red">
                        {cat.article_count || 0}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(cat)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition"
                            title="تعديل"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded transition"
                            title="حذف"
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
    </div>
  );
}
