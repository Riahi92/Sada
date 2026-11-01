'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Save, 
  Eye, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Quote, 
  List, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Video, 
  Flame, 
  Star, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Article, Category } from '@/types/database';

interface ArticleFormProps {
  initialData?: Article | null;
  categories: Category[];
  isEdit?: boolean;
}

export default function ArticleForm({ initialData, categories, isEdit = false }: ArticleFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || (categories[0]?.id || ''));
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80');
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>(initialData?.status || 'published');
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [isBreaking, setIsBreaking] = useState(initialData?.is_breaking || false);
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || '');
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || '');
  const [publishedAt, setPublishedAt] = useState(initialData?.published_at ? new Date(initialData.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSlugCustomized, setIsSlugCustomized] = useState(Boolean(initialData?.slug));

  // Helper to generate clean slug (supports Arabic, English, numbers)
  const generateSlug = (text: string): string => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto slug generation from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustomized) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setIsSlugCustomized(true);
  };

  const handleRegenerateSlug = () => {
    const autoSlug = generateSlug(title);
    setSlug(autoSlug || `article-${Date.now()}`);
    setIsSlugCustomized(false);
  };

  // Editor formatting helper
  const insertFormatting = (tagOpen: string, tagClose: string = '') => {
    setContent(prev => prev + `${tagOpen}نص هنا${tagClose}`);
  };

  const handleImagePrompt = () => {
    const url = prompt('أدخل رابط الصورة (URL):', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200');
    if (url) {
      setContent(prev => prev + `\n<figure><img src="${url}" alt="صورة داخل المقال" class="rounded-lg my-4" /><figcaption class="text-xs text-gray-500 mt-1">وصف توضيحي للصورة</figcaption></figure>\n`);
    }
  };

  const handleVideoPrompt = () => {
    const url = prompt('أدخل رابط فيديو YouTube:', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    if (url) {
      setVideoUrl(url);
      setContent(prev => prev + `\n<div class="video-container my-4 aspect-video rounded-lg overflow-hidden bg-black"><iframe src="${url.replace('watch?v=', 'embed/')}" class="w-full h-full border-0"></iframe></div>\n`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'يرجى كتابة عنوان المقال' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const finalSlug = slug.trim() || generateSlug(title) || `article-${Date.now()}`;

    const payload = {
      title,
      slug: finalSlug,
      excerpt,
      content,
      category_id: categoryId,
      featured_image: featuredImage,
      status,
      is_featured: isFeatured,
      is_breaking: isBreaking,
      video_url: videoUrl,
      meta_title: metaTitle || title,
      meta_description: metaDescription || excerpt,
      published_at: new Date(publishedAt).toISOString(),
    };

    try {
      const endpoint = isEdit ? `/api/articles/${initialData?.id}` : '/api/articles';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: isEdit ? 'تم تحديث المقال بنجاح!' : 'تم نشر المقال بنجاح!' });
        setTimeout(() => {
          router.push('/admin/articles');
        }, 1200);
      } else {
        setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ المقال' });
      }
    } catch {
      setMessage({ type: 'error', text: 'تعذر الاتصال بالخادم' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky top-4 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition"
            title="رجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading font-black text-xl text-brand-navy">
              {isEdit ? 'تعديل الخبر الصحفي' : 'إنشاء خبر صحفي جديد'}
            </h1>
            <span className="text-[11px] text-gray-400">
              {isEdit ? `معرف: ${initialData?.id}` : 'مسودة جديدة'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setStatus('draft');
              handleSubmit({ preventDefault: () => {} } as any);
            }}
            disabled={saving}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-brand-navy text-xs font-bold rounded-lg transition disabled:opacity-60"
          >
            حفظ كمسودة
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : isEdit ? 'تحديث ونشر' : 'نشر المقال'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs font-bold ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Grid: 8 Cols Editor + 4 Cols Sidebar Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Article Core Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                عنوان الخبر الرئيسي *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="أدخل عنواناً صحفياً قوياً وجذاباً..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-base font-heading font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-gray-600">
                  الرابط الدائم (Slug) *
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-medium ${
                    isSlugCustomized 
                      ? 'text-amber-700 bg-amber-50 border border-amber-200' 
                      : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    {isSlugCustomized ? 'معدل يدوياً' : 'يتم التوليد تلقائياً'}
                  </span>
                  <button
                    type="button"
                    onClick={handleRegenerateSlug}
                    className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 transition font-bold"
                    title="إعادة التوليد تلقائياً من العنوان"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>توليد تلقائي</span>
                  </button>
                </div>
              </div>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="يتم توليد الرابط تلقائياً بمجرد كتابة عنوان الخبر..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-navy focus:bg-white transition"
              />
              <p className="text-[10px] text-gray-400 mt-1 font-mono" dir="ltr">
                https://sada-news.tn/news/{slug || 'article-slug'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                الموجز / الملخص الإخباري (Excerpt)
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="فقرة موجزة تمهيدية تلخص جوهر الخبر وتظهر في البطاقات ومحركات البحث..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand-navy focus:bg-white resize-none"
              ></textarea>
            </div>
          </div>

          {/* Rich Content Editor */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Tabs & Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                    activeTab === 'editor' ? 'bg-white shadow text-brand-red' : 'text-gray-600 hover:bg-white/60'
                  }`}
                >
                  المحرر التحريري
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1 ${
                    activeTab === 'preview' ? 'bg-white shadow text-brand-red' : 'text-gray-600 hover:bg-white/60'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة المحتوى</span>
                </button>
              </div>

              {/* Formatting Toolbar */}
              {activeTab === 'editor' && (
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md p-1 text-gray-600">
                  <button
                    type="button"
                    onClick={() => insertFormatting('<strong>', '</strong>')}
                    className="p-1.5 hover:bg-gray-100 rounded"
                    title="عريض (Bold)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<em>', '</em>')}
                    className="p-1.5 hover:bg-gray-100 rounded"
                    title="مائل (Italic)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n<h2>', '</h2>\n')}
                    className="p-1.5 hover:bg-gray-100 rounded text-xs font-bold"
                    title="عنوان رئيسي (H2)"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n<h3>', '</h3>\n')}
                    className="p-1.5 hover:bg-gray-100 rounded text-xs font-bold"
                    title="عنوان فرعي (H3)"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n<blockquote>', '</blockquote>\n')}
                    className="p-1.5 hover:bg-gray-100 rounded"
                    title="اقتباس (Quote)"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n<ul>\n  <li>عنصر 1</li>\n  <li>عنصر 2</li>\n</ul>\n')}
                    className="p-1.5 hover:bg-gray-100 rounded"
                    title="قائمة نقطية"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleImagePrompt}
                    className="p-1.5 hover:bg-gray-100 rounded"
                    title="إدراج صورة داخل المقال"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleVideoPrompt}
                    className="p-1.5 hover:bg-gray-100 rounded"
                    title="إدراج فيديو YouTube"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Editor Body */}
            {activeTab === 'editor' ? (
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب تفاصيل التقرير الصحفي هنا (يدعم فقرات HTML وعناوين h2 وh3 وصور واقتباسات)..."
                className="w-full p-4 text-sm font-tajawal leading-relaxed focus:outline-none resize-y min-h-[350px]"
              ></textarea>
            ) : (
              <div
                className="p-6 prose prose-lg max-w-none text-gray-800 font-tajawal leading-relaxed min-h-[350px] bg-white"
                dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400">لا يوجد محتوى للمعاينة حتى الآن...</p>' }}
              />
            )}
          </div>

          {/* SEO Metadata Box */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-brand-navy pb-2 border-b border-gray-100">
              إعدادات تحسين محركات البحث (SEO & Meta)
            </h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                عنوان Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="عنوان مخصص لجوجل ومحركات البحث..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                وصف Meta Description
              </label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="الوصف الذي يظهر أسفل رابط المقال في نتائج محركات البحث..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right: Publishing Settings Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publication & Status */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-brand-navy pb-2 border-b border-gray-100">
              حالة النشر والجدولة
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">الحالة</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand-navy"
              >
                <option value="published">منشور فوري (Published)</option>
                <option value="draft">مسودة (Draft)</option>
                <option value="scheduled">مجدول للنشر (Scheduled)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                تاريخ وتوقيت النشر
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-3">
              {/* Breaking Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-red-100 bg-red-50/50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-brand-red fill-brand-red" />
                  <span className="text-xs font-bold text-brand-navy">تعيين كخبر عاجل</span>
                </div>
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="rounded text-brand-red w-4 h-4"
                />
              </label>

              {/* Featured Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-blue-100 bg-blue-50/50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
                  <span className="text-xs font-bold text-brand-navy">تعيين كخبر رئيسي (Hero)</span>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Category Selection */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-heading font-bold text-sm text-brand-navy pb-2 border-b border-gray-100">
              القسم الإخباري *
            </h3>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand-navy"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-heading font-bold text-sm text-brand-navy pb-2 border-b border-gray-100">
              الصورة الرئيسية للمقال *
            </h3>

            {featuredImage && (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={featuredImage}
                  alt="معاينة الصورة الرئيسية"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                رابط الصورة (URL أو من مكتبة الوسائط):
              </label>
              <input
                type="text"
                required
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>
          </div>

          {/* Video Attachment */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-heading font-bold text-sm text-brand-navy pb-2 border-b border-gray-100 flex items-center gap-1.5">
              <Video className="w-4 h-4 text-brand-red" />
              <span>فيديو مرفق (YouTube)</span>
            </h3>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
