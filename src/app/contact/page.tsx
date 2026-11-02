'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Facebook, Youtube, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <span className="text-brand-red text-xs font-bold tracking-widest uppercase bg-red-50 px-3 py-1 rounded-full mb-3 inline-block">
          تواصل معنا
        </span>
        <h1 className="font-heading font-black text-3xl md:text-5xl text-brand-navy mb-4">
          يسعدنا الاستماع إلى آرائكم وملاحظاتكم
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto font-tajawal">
          سواء كان لديكم مقترح تغطية خبرية، استفسار إعلاني، أو ملاحظة حول المحتوى المنشور، فريقنا جاهز للتواصل معكم على الدوام.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-brand-border p-6 shadow-sm space-y-5">
            <h2 className="font-heading font-bold text-xl text-brand-navy pb-3 border-b border-gray-100">
              معلومات الاتصال المباشر
            </h2>

            <div className="flex items-start gap-3 text-sm">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-brand-red flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-brand-navy">المقر الرئيسي:</strong>
                <span className="text-gray-600 text-xs">شارع الحبيب بورقيبة، تونس العاصمة</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-brand-red flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-brand-navy">البريد الإلكتروني:</strong>
                <span className="text-gray-600 text-xs">contact@sada-news.tn</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-brand-red flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-brand-navy">الهاتف:</strong>
                <span className="text-gray-600 text-xs">+216 71 000 000</span>
              </div>
            </div>
          </div>

          {/* Facebook Link Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <Facebook className="w-8 h-8 text-blue-600 mx-auto mb-2 fill-blue-600" />
            <h3 className="font-heading font-bold text-base text-brand-navy mb-1">
              صفحة فيسبوك الرسمية
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              تواصل مباشرة مع فريق التحرير عبر رسائل صفحتنا الرسمية
            </p>
            <a
              href="https://www.facebook.com/profile.php?id=61584651215444"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition shadow-sm"
            >
              <span>مراسلتنا على فيسبوك</span>
            </a>
          </div>

          {/* YouTube Channel Box */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
            <Youtube className="w-8 h-8 text-red-600 mx-auto mb-2 fill-red-600" />
            <h3 className="font-heading font-bold text-base text-brand-navy mb-1">
              قناة صدى الرقمية على يوتيوب
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              شاهد تقاريرنا وتغطياتنا المرئية الحصرية واشترك لمتابعة الجديد
            </p>
            <a
              href="https://www.youtube.com/@chaînenumériquesSada"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold transition shadow-sm"
            >
              <Youtube className="w-4 h-4 fill-white" />
              <span>زيارة القناة والاشتراك</span>
            </a>
          </div>
        </div>

        {/* Form (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-xl border border-brand-border p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="font-heading font-bold text-2xl text-brand-navy">
                تم استلام رسالتكم بنجاح!
              </h3>
              <p className="text-gray-600 text-sm max-w-sm mx-auto font-tajawal">
                شكراً لتواصلكم معنا. سيقوم أحد مسؤولي هيئة التحرير بمراجعة رسالتكم والرد عليها في أقرب وقت.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 bg-brand-navy text-white text-xs font-bold rounded-lg transition"
              >
                إرسال رسالة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-heading font-bold text-xl text-brand-navy mb-4">
                أرسل رسالة لهيئة التحرير
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-brand-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-brand-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">موضوع الرسالة *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-gray-50 border border-brand-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">نص الرسالة *</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-gray-50 border border-brand-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-red hover:bg-brand-redDark text-white font-bold rounded-lg text-sm shadow transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الرسالة</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
