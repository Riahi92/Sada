import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية وحماية البيانات',
  description: 'سياسة الخصوصية وحماية البيانات الشخصية لزوار ومستخدمي منصة صدى الإخبارية.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl border border-brand-border p-8 shadow-sm space-y-6 text-gray-700 leading-relaxed font-tajawal">
        <h1 className="font-heading font-black text-3xl text-brand-navy pb-4 border-b border-brand-border">
          سياسة الخصوصية وحماية البيانات
        </h1>

        <p className="text-sm text-brand-muted">
          آخر تحديث: 1 نوفمبر 2026
        </p>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-brand-navy">1. التزامنا تجاه خصوصيتك</h2>
          <p>
            تولي منصة «صدى» الإخبارية أهمية قصوى لخصوصية زوارها ومستخدميها. توضح هذه الوثيقة كيفية جمع البيانات غير الشخصية والشخصية، ونوعيتها، وسبل حمايتها واستخدامها بما يتطابق مع القوانين والتشريعات المنظمة لسلامة المعطيات الشخصية.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-brand-navy">2. البيانات التي نجمعها</h2>
          <ul className="list-disc list-inside space-y-2 text-sm pr-2">
            <li><strong>بيانات التصفح والاستخدام:</strong> مثل عنوان بروتوكول الإنترنت (IP)، نوع المتصفح، نظام التشغيل، والصفحات التي تمت زيارتها، لأغراض إحصائية وتحسين تجربة التصفح وسرعة الموقع.</li>
            <li><strong>بيانات الاشتراك في النشرة البريدية:</strong> نقوم بحفظ عنوان بريدك الإلكتروني حصراً لإرسال الملخصات الإخبارية اليومية والأسبوعية التي اشتركت بها طواعية.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-brand-navy">3. ملفات تعريف الارتباط (Cookies)</h2>
          <p>
            نستخدم ملفات الكوكيز لتحسين تجربة المستخدم، وحفظ تفضيلات القراءة (مثل حجم الخط والوضع الليلي)، وتحليل حركة المرور دون انتهاك خصوصية أي فرد.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-xl text-brand-navy">4. عدم مشاركة البيانات مع أطراف ثالثة</h2>
          <p>
            نؤكد في منصة «صدى» أننا لا نقوم ببيع أو تأجير أو مشاركة أي بيانات شخصية للمشتركين أو القراء مع أية جهات تسويقية أو تجارية خارجية تحت أي ظرف.
          </p>
        </section>
      </div>
    </div>
  );
}
