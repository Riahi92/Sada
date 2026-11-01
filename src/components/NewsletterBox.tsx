'use client';

import React, { useState } from 'react';
import { Mail, Check, AlertCircle, Loader2 } from 'lucide-react';

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
        setMessage(data.message || 'تم اشتراكك بنجاح في نشرة صدى اليومية!');
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
    <section className="bg-brand-navy rounded-xl p-8 text-white text-center my-10 relative overflow-hidden shadow-lg border border-brand-navyLight">
      {/* Decorative background shape */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-red/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-brand-navyLight/30 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-xl mx-auto relative z-10">
        <div className="w-14 h-14 bg-brand-red text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
          <Mail className="w-7 h-7" />
        </div>

        <h3 className="font-heading font-black text-2xl md:text-3xl text-white mb-2">
          اشترك في النشرة الإخبارية لـ «صدى»
        </h3>
        <p className="text-gray-300 text-sm md:text-base font-tajawal mb-6">
          احصل على ملخص يومي مركز لأهم الأخبار التونسية والعالمية والتحليلات السياسية مباشرة في صندوق بريدك كل صباح.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="أدخل بريدك الإلكتروني..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== 'idle') setStatus('idle');
            }}
            disabled={status === 'loading'}
            className="flex-1 bg-white text-brand-navy placeholder-gray-400 px-4 py-3 rounded-lg text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-red disabled:opacity-70"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-brand-red hover:bg-brand-redDark text-white px-6 py-3 rounded-lg text-sm font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-70"
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

        {status === 'success' && (
          <div className="mt-4 p-3 bg-green-900/60 border border-green-500/50 rounded-lg text-green-200 text-sm flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 p-3 bg-red-900/60 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{message}</span>
          </div>
        )}

        <p className="text-[11px] text-gray-400 mt-4">
          نحترم خصوصيتك تماماً. لا نرسل رسائل مزعجة ويمكنك إلغاء الاشتراك في أي وقت بنقرة واحدة.
        </p>
      </div>
    </section>
  );
}
