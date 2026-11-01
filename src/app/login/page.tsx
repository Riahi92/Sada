'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ShieldCheck
} from 'lucide-react';
import FloatingAiBar from '@/components/FloatingAiBar';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('editor@sada.tn');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle OAuth sign in
  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setLoading(true);
      setError('');
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/admin`,
          },
        });
        if (error) throw error;
      } else {
        setError(`سيتم تحويلك إلى خدمة تسجيل الدخول عبر ${provider === 'google' ? 'غوغل' : provider === 'facebook' ? 'فيسبوك' : 'آبل'} بمجرد ربط مفاتيح OAuth في Supabase.`);
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء محاولة تسجيل الدخول الاجتماعي');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه للوحة التحكم...');
        if (typeof window !== 'undefined') {
          localStorage.setItem('sada_admin_token', 'authenticated');
          localStorage.setItem('sada_admin_user', JSON.stringify(data.user));
        }
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 600);
      } else {
        setError(data.message || 'بيانات الدخول غير صحيحة');
      }
    } catch {
      setError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] bg-white text-gray-900 flex flex-col items-center justify-center font-tajawal selection:bg-brand-red selection:text-white px-4 py-10 pb-28">
      {/* Main Authentication Container */}
      <div className="max-w-md w-full mx-auto">
        {/* Main Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8 font-heading text-center tracking-tight">
          سجل الدخول أو أنشئ حسابًا
        </h1>

        {/* Status Alerts */}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Social Authentication Buttons (Exact match to uploaded image) */}
        <div className="w-full space-y-3 mb-6">
          {/* 1. Google Button */}
          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            className="w-full border border-gray-300 rounded-full py-3 px-5 flex items-center justify-center gap-3 text-sm font-bold text-gray-800 hover:bg-gray-50 transition shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>الاستمرار عبر غوغل</span>
          </button>

          {/* 2. Facebook Button */}
          <button
            type="button"
            onClick={() => handleOAuthSignIn('facebook')}
            disabled={loading}
            className="w-full border border-gray-300 rounded-full py-3 px-5 flex items-center justify-center gap-3 text-sm font-bold text-gray-800 hover:bg-gray-50 transition shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            <svg className="w-5 h-5 text-[#1877f2] fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>الاستمرار عبر فيسبوك</span>
          </button>

          {/* 3. Apple Button */}
          <button
            type="button"
            onClick={() => handleOAuthSignIn('apple')}
            disabled={loading}
            className="w-full border border-gray-300 rounded-full py-3 px-5 flex items-center justify-center gap-3 text-sm font-bold text-gray-800 hover:bg-gray-50 transition shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current text-black shrink-0" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.61 1.35-.55.64-.99 1.7-.87 2.73 1 .08 2.03-.53 2.55-1.23z"/>
            </svg>
            <span>الاستمرار عبر آبل</span>
          </button>
        </div>

        {/* Divider with "أو" */}
        <div className="relative flex items-center justify-center my-4 w-full">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-4 text-xs text-gray-500 font-medium absolute">أو</span>
        </div>

        {/* Email & Password Input Form */}
        <form onSubmit={handleEmailAuth} className="w-full space-y-4 mt-2">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 text-right">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل البريد الإلكتروني"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition placeholder-gray-400 text-right"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 text-right">
              كلمة المرور
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition placeholder-gray-400 text-right"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold rounded-full text-sm shadow-md transition flex items-center justify-center gap-2 mt-3 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              <span>متابعة</span>
            )}
          </button>

          {/* Admin preset shortcut */}
          <div className="pt-3 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail('editor@sada.tn');
                setPassword('admin123456');
              }}
              className="text-xs text-gray-500 hover:text-black transition flex items-center justify-center gap-1 mx-auto"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>تعبئة بيانات مدير التحرير (editor@sada.tn)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
