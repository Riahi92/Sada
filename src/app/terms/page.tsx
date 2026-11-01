import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شروط الاستخدام وحقوق النشر',
  description: 'شروط استخدام منصة صدى الإخبارية، حقوق الملكية الفكرية، والمحتوى التحريري.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl border border-brand-border p-8 shadow-sm space-y-6 text-gray-700 leading-relaxed font-tajawal">
        <h1 className="font-heading font-black text-3xl text-brand-navy pb-4 border-b border-brand-border">
          شروط الاستخدام وحقوق الملكية الفكرية
        </h1>

        <p className="text-sm text-brand-muted">
          آخر تحديث: 1 نوفمبر 2026
        </p>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-brand-navy">1. الموافقة على الشروط</h2>
          <p>
            باستخدامك لمنصة «صدى» وتصفح محتوياتها الإخبارية أو التفاعل معها، فإنك توافق التزاماً تاماً على الامتثال لهذه الشروط والأحكام والقوانين المعمول بها.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-brand-navy">2. حقوق الملكية الفكرية والنشر</h2>
          <p>
            كافة المقالات، التحقيقات، الصور، مقاطع الفيديو، والتصاميم المنشورة على موقع «صدى» هي ملكية حصرية للمنصة ومحمية بموجب قوانين الملكية الفكرية وحقوق المؤلف الدولية والمحلية. يمنع نسخ أو إعادة نشر المحتوى لأغراض تجارية دون إذن كتابي مسبق مع ضرورة ذكر المصدر ورابط المقال الأصلي.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-brand-navy">3. سياسة التعليقات والمشاركات</h2>
          <p>
            نرحب بكافة الآراء والتعليقات البناءة. نحتفظ بالحق الكامل في إزالة أي تعليق يتضمن خطاب كراهية، سباً وقذفاً، تحريضاً على العنف، أو ترويجاً لمحتوى تجاري دون إشعار مسبق.
          </p>
        </section>
      </div>
    </div>
  );
}
