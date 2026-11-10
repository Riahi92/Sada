'use client';

import React, { useState, useEffect } from 'react';
import { Save, Settings, Check, AlertCircle, Facebook, Globe, Mail, Radio } from 'lucide-react';
import { SiteSettings } from '@/types/database';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'تم حفظ إعدادات الموقع بنجاح' });
      } else {
        setMessage({ type: 'error', text: 'فشل حفظ الإعدادات' });
      }
    } catch {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء الاتصال بالخادم' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-xs text-gray-400">جاري تحميل الإعدادات...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="font-heading font-black text-2xl text-brand-navy">
          إعدادات المنصة والهوية الرقمية
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          تخصيص اسم الموقع، الشعار، روابط التواصل الاجتماعي والتكامل مع Facebook
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-bold ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Brand Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-heading font-bold text-base text-brand-navy pb-2 border-b border-gray-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-red" />
            <span>معلومات الهوية العامة</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">اسم الموقع والمنصة *</label>
            <input
              type="text"
              required
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">وصف المنصة (Tagline) *</label>
            <textarea
              rows={3}
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-navy resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">البريد الإلكتروني الرسمي *</label>
              <input
                type="email"
                required
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">رابط الشعار (Logo URL)</label>
              <input
                type="text"
                value={settings.logo_url}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>
          </div>
        </div>

        {/* Social Media & Facebook Integration */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-heading font-bold text-base text-brand-navy pb-2 border-b border-gray-100 flex items-center gap-2">
            <Facebook className="w-4 h-4 text-blue-600" />
            <span>التكامل مع Facebook وشبكات التواصل</span>
          </h2>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <label className="block text-xs font-bold text-blue-900 mb-1">
              رابط صفحة Facebook الرسمية للمنصة *
            </label>
            <input
              type="url"
              required
              value={settings.facebook_url}
              onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
              className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 text-xs font-mono text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <p className="text-[11px] text-blue-700 mt-1">
              تظهر هذه الصفحة في شريط الهيدر، الفوتر، بطاقة المتابعة في الصفحة الرئيسية، وأزرار المراسلة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">رابط واتساب (WhatsApp)</label>
              <input
                type="url"
                value={settings.whatsapp_url || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp_url: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
                placeholder="https://api.whatsapp.com/message/..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">رابط تيك توك (TikTok)</label>
              <input
                type="url"
                value={settings.tiktok_url || ''}
                onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
                placeholder="https://www.tiktok.com/@..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">رابط سناب شات (Snapchat)</label>
              <input
                type="url"
                value={settings.snapchat_url || ''}
                onChange={(e) => setSettings({ ...settings, snapchat_url: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
                placeholder="https://www.snapchat.com/@..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">رابط يوتيوب صدى الرقمية</label>
              <input
                type="url"
                value={settings.youtube_url}
                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">رابط X (تويتر سابقاً)</label>
              <input
                type="url"
                value={settings.twitter_url}
                onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">رابط إنستغرام</label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-heading font-bold text-base text-brand-navy pb-2 border-b border-gray-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-brand-red" />
            <span>خيارات العرض العامة</span>
          </h2>

          <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <div>
              <span className="block text-xs font-bold text-brand-navy">تفعيل شريط الأخبار العاجلة في رأس الموقع</span>
              <span className="text-[11px] text-gray-500">يعرض الأخبار المعينة كـ "عاجل" تلقائياً في الشريط المتحرك</span>
            </div>
            <input
              type="checkbox"
              checked={settings.breaking_ticker_enabled}
              onChange={(e) => setSettings({ ...settings, breaking_ticker_enabled: e.target.checked })}
              className="w-4 h-4 text-brand-red rounded"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-2 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'جاري الحفظ...' : 'حفظ كافة الإعدادات'}</span>
        </button>
      </form>
    </div>
  );
}
