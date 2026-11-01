import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Award, Users, Target, Newspaper, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'من نحن ورسالتنا الصحفية',
  description: 'تعرف على منصة صدى الإخبارية، رؤيتنا، قيمنا التحريرية، وفريق العمل الصحفي.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <span className="text-brand-red text-xs font-bold tracking-widest uppercase bg-red-50 px-3 py-1 rounded-full mb-3 inline-block">
          عن منصة صدى
        </span>
        <h1 className="font-heading font-black text-3xl md:text-5xl text-brand-navy mb-4">
          صوت الحقيقة والكلمة الصادقة
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto font-tajawal leading-relaxed">
          منصة إخبارية تونسية وعربية مستقلة وشاملة، تأسست لتواكب عصر الصحافة الرقمية وتقدم تغطية مهنية قائمة على الدقة والحياد والعمق التحليلي.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-brand-navy flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-brand-red" />
          </div>
          <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">رؤيتنا</h2>
          <p className="text-sm text-gray-600 font-tajawal leading-relaxed">
            أن نكون المنصة الإخبارية الأولى والأكثر موثوقية في تونس والعالم العربي لتقديم المعلومة المؤكدة والتحليل الاستشرافي.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-brand-navy flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-brand-red" />
          </div>
          <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">قيمنا التحريرية</h2>
          <p className="text-sm text-gray-600 font-tajawal leading-relaxed">
            النزاهة، الاستقلالية التامة، التدقيق في المصادر، احترام أخلاقيات المهنة، ومحاربة الأخبار الزائفة والتضليل الإعلامي.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-brand-navy flex items-center justify-center mb-4">
            <Newspaper className="w-6 h-6 text-brand-red" />
          </div>
          <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">رسالتنا</h2>
          <p className="text-sm text-gray-600 font-tajawal leading-relaxed">
            تمكين القارئ من فهم سياق الأحداث وصناعة الرأي العام المستنير عبر صحافة استقصائية حرة وتحقيقات معمقة.
          </p>
        </div>
      </div>

      {/* Editorial Content */}
      <div className="bg-white rounded-xl border border-brand-border p-8 shadow-sm space-y-6 text-gray-700 leading-relaxed font-tajawal">
        <h2 className="font-heading font-bold text-2xl text-brand-navy">
          ميثاق الشرف الصحفي لمنصة «صدى»
        </h2>
        <p>
          نؤمن في «صدى» بأن المعلومة حق أساسي لكل مواطن وقارئ. لذلك نلتزم بتقديم الأخبار كما هي، دون تحريف أو تهويل أو انحياز. يستند عملنا على شبكة من المراسلين والصحفيين الميدانيين المتمرسين في مختلف ولايات الجمهورية التونسية والعواصم العربية والدولية.
        </p>
        <p>
          كما نفتح صفحاتنا للحوار البناء ومقالات الرأي المتنوعة التي تحترم قيم الديمقراطية والتعددية وحقوق الإنسان، ونوفر أحدث أدوات التفاعل الرقمي لتكون التجربة الإخبارية سلسة، تفاعلية وسريعة.
        </p>
      </div>
    </div>
  );
}
