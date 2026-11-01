'use client';

import React, { useState } from 'react';
import { Mail, Check, AlertCircle, Loader2, Newspaper } from 'lucide-react';

export default function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('يرجى إدخال عنوان بريد إلكتروني صالح.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'تم اشتراكك بنجاح في خدمة الأخبار العاجلة!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'حدث خطأ أثناء محاولة الاشتراك.');
      }
    } catch {
      setStatus('error');
      setMessage('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.');
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#061d44] via-[#072557] to-[#0b3574] rounded-xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg my-10 border border-blue-900/60" data-purpose="newsletter-cta">
      {/* Decorative background newspaper icon */}
      <div className="absolute -left-6 -bottom-6 opacity-10 pointer-events-none">
        <Newspaper className="w-48 h-48 text-white" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="text-right max-w-xl">
          <span className="bg-[#d0121a] text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2 shadow-sm">
            النشرة الإخبارية
          </span>
          <h3 className="text-2xl sm:text-3xl font-black mb-2 font-heading">
            اشترك الآن في خدمة الأخبار العاجلة
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm font-tajawal leading-relaxed">
            ابقَ على اطلاع دائم بآخر المستجدات الوطنية والدولية والتقارير الاستقصائية الحصرية مباشرة عبر بريدك الإلكتروني وهاتفك المحمول.
          </p>

          {status === 'success' && (
            <div className="mt-3 p-2.5 bg-green-900/60 border border-green-500/50 rounded-lg text-green-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-3 p-2.5 bg-red-900/60 border border-red-500/50 rounded-lg text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{message}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2">
          <input
            type="email"
            placeholder="أدخل بريدك الإلكتروني..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== 'idle') setStatus('idle');
            }}
            disabled={status === 'loading'}
            required
            className="px-4 py-3 rounded-lg text-gray-800 text-sm w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#d0121a] border-0 shadow-inner disabled:opacity-70"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full sm:w-auto bg-[#d0121a] hover:bg-[#a30c12] text-white font-bold text-sm px-6 py-3 rounded-lg transition shadow-md whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الاشتراك...</span>
              </>
            ) : (
              <span>اشتراك مجاني</span>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
