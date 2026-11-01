'use client';

import React from 'react';
import { Facebook, ExternalLink, ThumbsUp, Share2, CheckCircle2 } from 'lucide-react';

interface FacebookFeedSectionProps {
  facebookUrl?: string;
}

export default function FacebookFeedSection({ 
  facebookUrl = 'https://www.facebook.com/profile.php?id=61584651215444' 
}: FacebookFeedSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-brand-border p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b-2 border-blue-600 mb-4">
        <h3 className="font-heading font-black text-lg text-brand-navy flex items-center gap-2">
          <Facebook className="w-5 h-5 text-blue-600 fill-blue-600" />
          <span>مجتمع صدى على فيسبوك</span>
        </h3>
        <span className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">
          الصفحة الرسمية
        </span>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
            ص
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-heading font-bold text-base text-brand-navy">
                منصة صدى الإخبارية
              </h4>
              <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-100" />
            </div>
            <p className="text-xs text-brand-muted">
              المصدر الموثوق للأخبار العاجلة والتحليلات
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed font-tajawal">
          انضم إلى آلاف المتابعين لصفحتنا الرسمية على فيسبوك وكن أول من يتلقى التنبيهات الإخبارية اللحظية، البث المباشر، والتقارير الاستقصائية.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-sm transition"
          >
            <Facebook className="w-4 h-4 fill-white" />
            <span>متابعة الصفحة على فيسبوك</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
