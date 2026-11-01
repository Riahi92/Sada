'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowUp, Mic, Sparkles } from 'lucide-react';

export default function FloatingAiBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] sm:w-full px-2 pointer-events-auto">
      <form
        onSubmit={handleSearch}
        className="bg-white/95 backdrop-blur-md border border-gray-200/90 shadow-2xl rounded-full px-4 py-2 flex items-center justify-between gap-3 ring-1 ring-black/5 hover:border-gray-300 transition"
      >
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="submit"
            className="w-8 h-8 rounded-full bg-[#1877f2] hover:bg-blue-700 text-white flex items-center justify-center transition shadow-md"
            title="إرسال / بحث"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => {
              if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                alert('يمكنك التحدث للبحث الصوتي في الأخبار...');
              } else {
                alert('البحث الصوتي مدعوم في متصفحات Chrome و Edge.');
              }
            }}
            className="w-7 h-7 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center justify-center transition"
            title="بحث صوتي"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        {/* Center Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="... اسأل عن أي خبر"
          className="flex-1 text-sm text-gray-800 placeholder-gray-400 font-tajawal text-right bg-transparent border-0 focus:outline-none focus:ring-0 px-2"
        />

        {/* Right AI Crystal Orb */}
        <div className="shrink-0 flex items-center gap-1.5 pl-1">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-300 via-sky-200 to-indigo-400 shadow-inner flex items-center justify-center border border-white/60">
            <Sparkles className="w-3.5 h-3.5 text-indigo-700 animate-pulse" />
          </div>
        </div>
      </form>
    </div>
  );
}
