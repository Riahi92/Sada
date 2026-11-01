'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Shield, Check, AlertCircle, UserCheck } from 'lucide-react';
import { Profile, UserRole } from '@/types/database';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setUpdatingId(userId);
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setSuccessMsg('تم تحديث صلاحية المستخدم بنجاح');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert('فشل تحديث الصلاحية');
      }
    } catch {
      alert('حدث خطأ أثناء التحديث');
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded text-[11px] font-bold">مدير نظام (Admin)</span>;
      case 'editor':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded text-[11px] font-bold">محرر مسؤول (Editor)</span>;
      case 'journalist':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[11px] font-bold">صحفي ميداني (Journalist)</span>;
      default:
        return <span>{role}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl text-brand-navy">
            إدارة فريق العمل والصلاحيات
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            تحديد أدوار هيئة التحرير والصحفيين والمشرفين وفق نظام Supabase Auth وRLS
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Permissions Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <strong className="text-xs font-bold text-brand-navy">المدير العام (Admin)</strong>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            صلاحيات كاملة تشمل إدارة المستخدمين، إعدادات المنصة، إضافة وتعديل وحذف كافة الأخبار والأقسام والوسائط.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <strong className="text-xs font-bold text-brand-navy">المحرر (Editor)</strong>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            مراجعة المقالات ونشرها، تعديل مقالات الصحفيين، تحديد الأخبار العاجلة والرئيسية، وإدارة التصنيفات.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <strong className="text-xs font-bold text-brand-navy">الصحفي (Journalist)</strong>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            كتابة وتحرير المقالات الخاصة به وحفظها كمسودة أو إرسالها للمراجعة، ورفع الصور الصحفية.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-heading font-bold text-base text-brand-navy">
            قائمة المستخدمين المسجلين ({users.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400">
            جاري تحميل المستخدمين...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 font-bold">
                <tr>
                  <th className="py-3 px-4">المستخدم</th>
                  <th className="py-3 px-4">البريد الإلكتروني</th>
                  <th className="py-3 px-4">الدور الحالي</th>
                  <th className="py-3 px-4">تعديل الصلاحية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {u.avatar_url ? (
                            <Image
                              src={u.avatar_url}
                              alt={u.full_name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-brand-navy text-white flex items-center justify-center font-bold">
                              {u.full_name[0]}
                            </div>
                          )}
                        </div>
                        <span className="font-heading font-bold text-brand-navy">
                          {u.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600">
                      {u.email}
                    </td>
                    <td className="py-3 px-4">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        disabled={updatingId === u.id}
                        className="bg-gray-50 border border-gray-200 rounded px-2.5 py-1 text-xs font-bold text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                      >
                        <option value="admin">مدير (Admin)</option>
                        <option value="editor">محرر (Editor)</option>
                        <option value="journalist">صحفي (Journalist)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
