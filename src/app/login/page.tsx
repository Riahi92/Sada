'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Mail, ArrowLeft, ArrowRight, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('editor@sada.tn');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
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
        }, 800);
      } else {
        setError(data.message || 'بيانات الدخول غير صحيحة');
      }
    } catch {
      setError('حدث خطأ أثناء محاولة تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-brand-border p-8 shadow-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="relative h-14 w-48 mx-auto mb-4">
            <Image
              src="/images/logo.png"
              alt="منصة صدى"
              fill
              priority
              sizes="192px"
              className="object-contain"
            />
          </div>
          <h1 className="font-heading font-black text-2xl text-brand-navy">
            منظومة إدارة المحتوى «صدى»
          </h1>
          <p className="text-xs text-brand-muted mt-1.5 font-tajawal">
            دخول هيئة التحرير والصحفيين المعتمدين
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editor@sada.tn"
                className="w-full bg-gray-50 border border-brand-border rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy focus:bg-white"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1.5">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-brand-border rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy focus:bg-white"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-brand-red" />
              <span>تذكرني على هذا الجهاز</span>
            </label>
            <span className="text-brand-muted">صلاحيات آمنة (RLS)</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-red hover:bg-brand-redDark text-white font-bold rounded-lg text-sm shadow transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Shield className="w-4 h-4" />
            <span>{loading ? 'جاري التحقق...' : 'تسجيل الدخول إلى CMS'}</span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <Link
            href="/"
            className="text-xs font-bold text-brand-navy hover:text-brand-red transition inline-flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة إلى الصفحة الرئيسية للموقع</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
