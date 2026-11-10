'use client';

import React, { useState, useRef } from 'react';
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
  Sparkles,
  Upload,
  User,
  Camera,
  Trash2
} from 'lucide-react';
import { Article, Category, Profile } from '@/types/database';

interface ArticleFormProps {
  initialData?: Article | null;
  categories: Category[];
  authors?: Profile[];
  isEdit?: boolean;
}

export default function ArticleForm({ initialData, categories, authors = [], isEdit = false }: ArticleFormProps) {
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

  // Author State
  const defaultAuthor = initialData?.author || (authors && authors[0]) || null;
  const [authorId, setAuthorId] = useState<string>(initialData?.author_id || defaultAuthor?.id || 'custom');
  const [authorName, setAuthorName] = useState<string>(initialData?.author?.full_name || defaultAuthor?.full_name || 'شيماء اسماعيلي');
  const [authorAvatar, setAuthorAvatar] = useState<string>(initialData?.author?.avatar_url || defaultAuthor?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
  const [authorRole, setAuthorRole] = useState<string>(initialData?.author?.role || 'journalist');
  const [isCustomAuthor, setIsCustomAuthor] = useState<boolean>(!initialData?.author_id && !defaultAuthor?.id);

  // Uploading states
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAuthor, setUploadingAuthor] = useState(false);
  const [uploadingBody, setUploadingBody] = useState(false);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSlugCustomized, setIsSlugCustomized] = useState(Boolean(initialData?.slug));

  // Read file as Base64 helper
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Compress image if needed
  const compressImageIfNeeded = async (file: File): Promise<string> => {
    const base64 = await readFileAsBase64(file);
    if (typeof window === 'undefined' || file.size < 1.5 * 1024 * 1024) {
      return base64;
    }

    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(base64);
        }
      };
      img.onerror = () => resolve(base64);
      img.src = base64;
    });
  };

  // File upload helper from PC with 100% resilient fallback
  const uploadImageFile = async (file: File): Promise<string | null> => {
    try {
      // 1. Prepare image data
      const base64 = await compressImageIfNeeded(file);

      // 2. Attempt server storage
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, name: file.name }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) return data.url;
        }
      } catch (serverErr) {
        console.warn('Server upload fallback active:', serverErr);
      }

      // 3. Resilient fallback to Data URL
      return base64;
    } catch (err) {
      console.error('File upload error:', err);
      try {
        return await readFileAsBase64(file);
      } catch {
        setMessage({ type: 'error', text: 'تعذر قراءة الصورة من الجهاز، يرجى المحاولة بصورة أخرى.' });
        return null;
      }
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const url = await uploadImageFile(file);
    if (url) {
      setFeaturedImage(url);
      setMessage({ type: 'success', text: 'تم تحديد ورفع صورة الغلاف بنجاح!' });
    }
    setUploadingCover(false);
    e.target.value = '';
  };

  const handleAuthorAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAuthor(true);
    const url = await uploadImageFile(file);
    if (url) {
      setAuthorAvatar(url);
      setMessage({ type: 'success', text: 'تم تحديد وتحديث صورة الكاتب بنجاح!' });
    }
    setUploadingAuthor(false);
    e.target.value = '';
  };

  const handleBodyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBody(true);
    const url = await uploadImageFile(file);
    if (url) {
      const cleanFileName = file.name.replace(/\.[^/.]+$/, '');
      const figureHtml = `\n<figure class="my-6">\n  <img src="${url}" alt="${cleanFileName}" class="w-full rounded-xl shadow-md object-cover" />\n  <figcaption class="text-xs text-gray-500 mt-2 text-center font-tajawal">وصف توضيحي للصورة: ${cleanFileName}</figcaption>\n</figure>\n`;
      setContent((prev) => prev + figureHtml);
      setMessage({ type: 'success', text: 'تم رفع وإدراج الصورة داخل المقال!' });
    }
    setUploadingBody(false);
    e.target.value = '';
  };

  const handleAuthorSelect = (selectedVal: string) => {
    setAuthorId(selectedVal);
    if (selectedVal === 'custom') {
      setIsCustomAuthor(true);
      setAuthorName('');
      setAuthorAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
    } else {
      setIsCustomAuthor(false);
      const chosen = authors?.find((a) => a.id === selectedVal);
      if (chosen) {
        setAuthorName(chosen.full_name);
        setAuthorAvatar(chosen.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
        setAuthorRole(chosen.role || 'journalist');
      }
    }
  };

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'يرجى كتابة عنوان المقال أولاً' });
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const finalSlug = slug.trim() || generateSlug(title) || `article-${Date.now()}`;

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim() || `<p>${title.trim()}</p>`,
      category_id: categoryId || (categories[0]?.id || 'cat-1'),
      featured_image: featuredImage,
      author_id: authorId !== 'custom' ? authorId : undefined,
      author: {
        id: authorId !== 'custom' ? authorId : undefined,
        full_name: authorName.trim() || 'هيئة التحرير',
        avatar_url: authorAvatar,
        role: authorRole as any,
      },
      status: status || 'published',
      is_featured: isFeatured,
      is_breaking: isBreaking,
      video_url: videoUrl,
      meta_title: metaTitle || title,
      meta_description: metaDescription || excerpt || title,
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
        setMessage({ type: 'success', text: isEdit ? 'تم تحديث المقال بنجاح!' : 'تم نشر المقال بنجاح! جاري التوجيه...' });
        try { router.refresh(); } catch {}
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/articles';
          } else {
            router.push('/admin/articles');
          }
        }, 800);
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessage({ type: 'error', text: errData.error || 'حدث خطأ أثناء حفظ المقال' });
      }
    } catch {
      setMessage({ type: 'error', text: 'تعذر الاتصال بالخادم' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
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
              handleSubmit();
            }}
            disabled={saving}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-brand-navy text-xs font-bold rounded-lg transition disabled:opacity-60 cursor-pointer"
          >
            حفظ كمسودة
          </button>

          <button
            type="button"
            onClick={() => {
              setStatus('published');
              handleSubmit();
            }}
            disabled={saving}
            className="px-5 py-2 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ والنشر...' : isEdit ? 'تحديث ونشر' : 'نشر المقال'}</span>
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
                    title="إدراج صورة عبر رابط URL"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>

                  {/* Direct Image Upload from PC into Article Content */}
                  <label
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-brand-red rounded-md text-[11px] font-bold cursor-pointer transition border border-red-200"
                    title="رفع صورة من الحاسوب وإدراجها مباشرة داخل المقال"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBodyImageUpload}
                      disabled={uploadingBody}
                      className="hidden"
                    />
                    <Upload className={`w-3.5 h-3.5 ${uploadingBody ? 'animate-bounce' : ''}`} />
                    <span>{uploadingBody ? 'جاري رفع الصورة...' : 'رفع صورة من الحاسوب'}</span>
                  </label>

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

          {/* Author Settings (Photo and Name) */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-heading font-bold text-sm text-brand-navy flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-red" />
                <span>بيانات كاتب ومحرر المقال</span>
              </h3>
              <span className="text-[10px] text-gray-400 font-tajawal">تظهر أسفل وأعلى المقال</span>
            </div>

            {/* Author Selector */}
            {authors.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  اختر من فريق التحرير أو أضف اسماً جديداً:
                </label>
                <select
                  value={authorId}
                  onChange={(e) => handleAuthorSelect(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand-navy"
                >
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.full_name} ({a.role === 'admin' ? 'مدير تحرير' : a.role === 'editor' ? 'محرر أول' : 'صحفي'})
                    </option>
                  ))}
                  <option value="custom">+ كتابة اسم وصورة كاتب مخصص / كاتب جديد</option>
                </select>
              </div>
            )}

            {/* Author Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                اسم الكاتب / الصحفي *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="مثال: شيماء اسماعيلي / أنيس الشابي"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            {/* Author Avatar & Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                صورة الكاتب الشخصية:
              </label>

              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-brand-red/30 flex-shrink-0 shadow-sm">
                  {authorAvatar ? (
                    <Image
                      src={authorAvatar}
                      alt={authorName || 'صورة الكاتب'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <label className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-brand-navy text-xs font-bold rounded-lg cursor-pointer transition border border-gray-300">
                    <Camera className="w-3.5 h-3.5 text-brand-red" />
                    <span>{uploadingAuthor ? 'جاري رفع الصورة...' : 'رفع صورة الكاتب من الحاسوب'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAuthorAvatarUpload}
                      disabled={uploadingAuthor}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={authorAvatar}
                    onChange={(e) => setAuthorAvatar(e.target.value)}
                    placeholder="أو ضع رابط صورة الكاتب (URL)..."
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 text-[11px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image (Cover Photo for Homepage and Article Header) */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-heading font-bold text-sm text-brand-navy flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-brand-red" />
                <span>صورة الغلاف (الواجهة الرئيسية والمقال) *</span>
              </h3>
            </div>

            <p className="text-[11px] text-gray-500 font-tajawal">
              هذه الصورة هي التي تظهر في الصفحة الرئيسية كغلاف للخبر، وتظهر بحجم عريض أعلى المقال.
            </p>

            {/* Cover Preview */}
            {featuredImage && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm group">
                <Image
                  src={featuredImage}
                  alt="معاينة صورة الغلاف"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-brand-navy/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  صورة الغلاف الحالية
                </div>
              </div>
            )}

            {/* Upload from PC Button */}
            <div className="space-y-2">
              <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-sm">
                <Upload className={`w-4 h-4 ${uploadingCover ? 'animate-bounce' : ''}`} />
                <span>{uploadingCover ? 'جاري رفع صورة الغلاف من الحاسوب...' : 'رفع صورة الغلاف من جهاز الحاسوب'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                  className="hidden"
                />
              </label>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  أو أدخل رابط مباشر لصورة الغلاف (URL):
                </label>
                <input
                  type="text"
                  required
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy font-mono text-gray-600"
                />
              </div>
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
