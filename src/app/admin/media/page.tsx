'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UploadCloud, Trash2, Copy, Check, ExternalLink, Image as ImageIcon, Eye, X } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  created_at: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Upload Form
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/media');
      const data = await res.json();
      setMedia(data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl) return;

    setUploading(true);
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: uploadName || `صورة-${Date.now()}.jpg`,
          url: uploadUrl,
          size: '1.5 MB',
        }),
      });
      if (res.ok) {
        setUploadUrl('');
        setUploadName('');
        fetchMedia();
      }
    } catch {
      alert('فشل إضافة الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل تريد حذف هذه الصورة من مكتبة الوسائط؟')) return;
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedia(media.filter(m => m.id !== id));
      }
    } catch {
      alert('تعذر الحذف');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl text-brand-navy">
            مكتبة الوسائط والصور الصحفية
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            إدارة ورفع وتنظيم الصور الإخبارية وتخزين Supabase Storage
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="font-heading font-bold text-sm text-brand-navy mb-4 flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-brand-red" />
          <span>إضافة أو رفع صورة إلى المكتبة</span>
        </h2>

        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-gray-700 mb-1">
              رابط الصورة (URL أو رابط Supabase Storage) *
            </label>
            <input
              type="text"
              required
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... أو https://...supabase.co/storage/..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-gray-700 mb-1">
              اسم أو وصف الصورة
            </label>
            <input
              type="text"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              placeholder="مثال: مؤتمر صحفي بقصر قرطاج"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-2 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold rounded-lg shadow transition flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{uploading ? 'جاري الإضافة...' : 'إضافة للمكتبة'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Media Grid */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <h3 className="font-heading font-bold text-base text-brand-navy">
            ملفات الوسائط المحفوظة ({media.length})
          </h3>
          <span className="text-xs text-gray-400">
            انقر على زر النسخ لاستخدام رابط الصورة داخل أي مقال
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-gray-400">
            جاري تحميل الوسائط...
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-400">
            لا توجد صور في المكتبة حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="group border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="relative aspect-video w-full bg-gray-200 overflow-hidden cursor-pointer" onClick={() => setPreviewItem(item)}>
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="p-3">
                  <span className="font-heading font-bold text-xs text-brand-navy block truncate mb-1" title={item.name}>
                    {item.name}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2">
                    <span>{item.size}</span>
                    <span>{new Date(item.created_at).toLocaleDateString('ar-TN')}</span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleCopy(item.id, item.url)}
                      className={`flex-1 py-1 px-2 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition ${
                        copiedId === item.id ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-brand-navy'
                      }`}
                      title="نسخ رابط الصورة"
                    >
                      {copiedId === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === item.id ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl overflow-hidden max-w-2xl w-full shadow-2xl relative">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-3 left-3 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-brand-red transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-video w-full bg-black">
              <Image
                src={previewItem.url}
                alt={previewItem.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4">
              <h4 className="font-heading font-bold text-base text-brand-navy mb-1">{previewItem.name}</h4>
              <p className="text-xs font-mono text-gray-500 break-all">{previewItem.url}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
