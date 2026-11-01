import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md bg-white rounded-2xl border border-brand-border p-8 shadow-sm">
        <span className="font-heading font-black text-6xl text-brand-red block mb-2">
          404
        </span>
        <h1 className="font-heading font-black text-2xl text-brand-navy mb-3">
          عذراً، الصفحة غير موجودة
        </h1>
        <p className="text-sm text-gray-600 font-tajawal mb-6 leading-relaxed">
          يبدو أن الصفحة أو التقرير الإخباري الذي تبحث عنه قد تم نقله أو حذفه، أو أن الرابط غير صحيح.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-navy hover:bg-brand-navyLight text-white rounded-lg text-xs font-bold transition shadow"
          >
            <Home className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-brand-navy rounded-lg text-xs font-bold transition"
          >
            <Search className="w-4 h-4" />
            <span>محرك البحث الإخباري</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
