'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, X, Youtube, ExternalLink } from 'lucide-react';
import { Article } from '@/types/database';

interface VideoSectionProps {
  articles: Article[];
  youtubeUrl?: string;
}

export default function VideoSection({ 
  articles, 
  youtubeUrl = 'https://www.youtube.com/@chaînenumériquesSada' 
}: VideoSectionProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (!articles || articles.length === 0) return null;

  const extractYoutubeId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const handleVideoClick = (item: Article) => {
    const ytId = extractYoutubeId(item.video_url);
    if (ytId) {
      setActiveVideo(ytId);
    } else if (item.video_url) {
      window.open(item.video_url, '_blank', 'noopener,noreferrer');
    } else {
      window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="py-8 bg-brand-navy text-white rounded-xl my-8 p-6 md:p-8" id="videos">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-navyLight mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
          <div>
            <h2 className="font-heading font-black text-2xl text-white">
              فيديو صدى | تغطيات مرئية
            </h2>
            <span className="text-xs text-gray-300 block">
              تقارير مصورة وفيديوهات حصرية من «قناة صدى الرقمية»
            </span>
          </div>
        </div>

        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#d9232d] hover:bg-[#b01c24] text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-sm w-fit"
          title="قناة صدى الرقمية على يوتيوب"
        >
          <Youtube className="w-4 h-4 fill-white" />
          <span>قناة صدى الرقمية على يوتيوب</span>
          <ExternalLink className="w-3 h-3 text-red-200" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((item) => {
          return (
            <div
              key={item.id}
              className="group cursor-pointer"
              onClick={() => handleVideoClick(item)}
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-brand-navyDark mb-3 border border-brand-navyLight group-hover:border-brand-red transition">
                <Image
                  src={item.featured_image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-brand-red/90 group-hover:bg-brand-red flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              <h4 className="font-heading font-bold text-sm text-gray-100 leading-snug line-clamp-2 group-hover:text-red-400 transition">
                {item.title}
              </h4>
            </div>
          );
        })}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 left-3 z-10 text-white bg-black/60 hover:bg-brand-red p-2 rounded-full transition"
              title="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="مشغل الفيديو"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
