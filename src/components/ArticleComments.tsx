'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Send, CheckCircle2, User, Clock, AlertCircle } from 'lucide-react';
import { Comment } from '@/types/database';

interface ArticleCommentsProps {
  articleId: string;
  initialComments?: Comment[];
}

export default function ArticleComments({ articleId, initialComments }: ArticleCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!initialComments) {
      fetch(`/api/articles/${articleId}/comments`)
        .then((res) => res.json())
        .then((data) => {
          if (data.comments) setComments(data.comments);
        })
        .catch(() => {});
    }

    if (typeof window !== 'undefined') {
      try {
        const storedLikes = localStorage.getItem(`sada_liked_comments_${articleId}`);
        if (storedLikes) {
          setLikedComments(JSON.parse(storedLikes));
        }
      } catch {}
    }
  }, [articleId, initialComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('يرجى إدخال اسمك أو اسمك المستعار');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('يرجى كتابة نص التعليق');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: name.trim(),
          user_email: email.trim() || undefined,
          content: content.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'تعذر إرسال التعليق، يرجى المحاولة لاحقاً');
        return;
      }

      if (data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setContent('');
        setSuccessMessage('شكراً لك! تم نشر تعليقك بنجاح.');
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch {
      setErrorMessage('حدث خطأ في الاتصال بالخادم، يرجى إعادة المحاولة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (likedComments[commentId]) return;

    // Optimistic UI update
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, likes_count: (c.likes_count || 0) + 1 } : c
      )
    );

    const updatedLikes = { ...likedComments, [commentId]: true };
    setLikedComments(updatedLikes);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`sada_liked_comments_${articleId}`, JSON.stringify(updatedLikes));
    }

    try {
      await fetch(`/api/comments/${commentId}/like`, { method: 'POST' });
    } catch {}
  };

  const formatCommentDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ar-TN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'مؤخراً';
    }
  };

  // Helper for avatar colors based on name
  const getAvatarColor = (nameStr: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-600',
      'bg-emerald-600',
      'bg-purple-600',
      'bg-amber-600',
      'bg-teal-600',
      'bg-indigo-600',
    ];
    let hash = 0;
    for (let i = 0; i < nameStr.length; i++) {
      hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="bg-white rounded-xl border border-brand-border p-5 md:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-navy/10 text-brand-navy flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4 text-brand-navy" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg md:text-xl text-brand-navy">
              تعليقات القراء
            </h3>
            <p className="text-xs text-brand-muted font-tajawal">
              مساحة حرة لمشاركة آرائكم ومناقشة تفاصيل الخبر
            </p>
          </div>
        </div>

        <span className="text-xs font-bold bg-gray-100 text-brand-navy px-3 py-1 rounded-full">
          {comments.length} تعليق{comments.length !== 1 ? 'ات' : ''}
        </span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50/80 rounded-xl p-4 md:p-5 border border-gray-200">
        <h4 className="font-heading font-bold text-sm text-brand-navy mb-3">
          أضف تعليقك الآن
        </h4>

        {successMessage && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-xs p-3 rounded-lg mb-3">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg mb-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              الاسم أو اللقب <span className="text-brand-red">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: محمد التونسي"
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              البريد الإلكتروني <span className="text-gray-400 font-normal">(اختياري - لن ينشر)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            نص التعليق <span className="text-brand-red">*</span>
          </label>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="اكتب وجهة نظرك أو تعقيبك حول ما ورد في هذا المقال..."
            className="w-full text-xs md:text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white resize-y"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-500 font-tajawal hidden sm:inline">
            يلتزم الموقع بعدم نشر التعليقات المخالفة للقانون أو التي تتضمن إساءة.
          </span>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold text-white transition shadow-sm ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-brand-navy hover:bg-brand-navyLight'
            }`}
          >
            <Send className="w-3.5 h-3.5 rotate-180" />
            <span>{isSubmitting ? 'جاري الإرسال...' : 'نشر التعليق'}</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {comments.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700 mb-1">لا توجد تعليقات بعد</p>
            <p className="text-xs text-gray-500">
              كن أول من يعلق ويبدي رأيه في هذا الموضوع!
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const hasLiked = likedComments[comment.id];
            const initialLetter = comment.user_name.trim().charAt(0) || 'ق';
            const avatarBg = getAvatarColor(comment.user_name);

            return (
              <div
                key={comment.id}
                className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 bg-white transition space-y-2.5 shadow-sm"
              >
                {/* Comment Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-inner ${avatarBg}`}
                    >
                      {initialLetter}
                    </div>
                    <div>
                      <h5 className="font-heading font-bold text-xs md:text-sm text-brand-navy leading-tight">
                        {comment.user_name}
                      </h5>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatCommentDate(comment.created_at)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(comment.id)}
                    disabled={hasLiked}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                      hasLiked
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 cursor-default'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                    title="أعجبني التعليق"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-blue-600 text-blue-600' : ''}`} />
                    <span>{comment.likes_count || 0}</span>
                  </button>
                </div>

                {/* Comment Content */}
                <p className="font-tajawal text-xs md:text-sm text-gray-700 leading-relaxed pr-10 whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
