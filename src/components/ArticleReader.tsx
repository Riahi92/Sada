'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Share2, 
  Copy, 
  Check, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  MessageCircle,
  Eye,
  Clock,
  User,
  ArrowRight
} from 'lucide-react';
import { Article } from '@/types/database';

interface ArticleReaderProps {
  article: Article;
}

export default function ArticleReader({ article }: ArticleReaderProps) {
  const [fontSize, setFontSize] = useState<number>(18);
  const [copied, setCopied] = useState<boolean>(false);
  const [views, setViews] = useState<number>(article.views_count);

  useEffect(() => {
    // Increment view count on mount
    fetch(`/api/articles/${article.id}/view`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.views) setViews(data.views);
      })
      .catch(() => {});
  }, [article.id]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareTitle = encodeURIComponent(article.title);

  return (
    <div className="space-y-6">
      {/* Top Reading Toolbar */}
      <div className="bg-white rounded-lg border border-brand-border p-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Meta details */}
        <div className="flex items-center gap-4 text-xs text-brand-muted">
          <span className="flex items-center gap-1 font-semibold text-brand-navy">
            <User className="w-3.5 h-3.5 text-brand-red" />
            <span>{article.author?.full_name || 'هيئة التحرير'}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(article.published_at).toLocaleString('ar-TN', { dateStyle: 'long', timeStyle: 'short' })}</span>
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{views.toLocaleString('ar-TN')} مشاهدة</span>
          </span>
        </div>

        {/* Action Tools: Font Size & Share */}
        <div className="flex items-center gap-2">
          {/* Font resize buttons */}
          <div className="flex items-center bg-gray-100 rounded-md p-1 gap-1 text-xs text-brand-navy">
            <span className="text-[11px] font-bold px-1 text-gray-500">حجم الخط:</span>
            <button
              onClick={() => setFontSize(prev => Math.min(prev + 2, 28))}
              className="p-1 hover:bg-white rounded transition"
              title="تكبير الخط"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFontSize(prev => Math.max(prev - 2, 14))}
              className="p-1 hover:bg-white rounded transition"
              title="تصغير الخط"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFontSize(18)}
              className="p-1 hover:bg-white rounded transition"
              title="إعادة ضبط الخط"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-1.5">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
              title="مشاركة على فيسبوك"
            >
              <Facebook className="w-3.5 h-3.5 fill-white" />
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-green-600 hover:bg-green-700 text-white transition"
              title="مشاركة عبر واتساب"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-black hover:bg-gray-800 text-white transition"
              title="مشاركة على إكس / تويتر"
            >
              <Twitter className="w-3.5 h-3.5 fill-white" />
            </a>
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded transition flex items-center gap-1 text-xs font-bold ${
                copied ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-brand-navy'
              }`}
              title="نسخ الرابط"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Article Rich Text Body */}
      <div 
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-tajawal bg-white rounded-lg border border-brand-border p-6 md:p-8 shadow-sm"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Facebook Page sharing box */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-heading font-bold text-base text-brand-navy mb-1">
            تابع التغطية الميدانية على صفحتنا الرسمية
          </h4>
          <p className="text-xs text-gray-600">
            انضم إلى مجتمع صدى على فيسبوك وشارك بالتعليقات والآراء في هذا التقرير.
          </p>
        </div>
        <a
          href="https://www.facebook.com/profile.php?id=61584651215444"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow flex items-center gap-2 flex-shrink-0 transition"
        >
          <Facebook className="w-4 h-4 fill-white" />
          <span>متابعة على فيسبوك</span>
        </a>
      </div>
    </div>
  );
}
