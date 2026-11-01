import React from 'react';
import HeroSection from '@/components/HeroSection';
import LatestNewsSection from '@/components/LatestNewsSection';
import TrendingSection from '@/components/TrendingSection';
import CategoryBlock from '@/components/CategoryBlock';
import VideoSection from '@/components/VideoSection';
import FacebookFeedSection from '@/components/FacebookFeedSection';
import NewsletterBox from '@/components/NewsletterBox';
import { 
  getFeaturedHero, 
  getArticles, 
  getTrendingArticles, 
  getCategories, 
  getVideoArticles, 
  getSiteSettings 
} from '@/lib/db';

export const revalidate = 60; // ISR cache revalidation every minute

export default async function HomePage() {
  const [
    heroData,
    { articles: latestArticles },
    trendingArticles,
    categories,
    videoArticles,
    settings,
  ] = await Promise.all([
    getFeaturedHero(),
    getArticles({ limit: 9 }),
    getTrendingArticles(6),
    getCategories(),
    getVideoArticles(4),
    getSiteSettings(),
  ]);

  // Group some articles by category for category blocks
  const tunisiaArticles = latestArticles.filter(a => a.category?.slug === 'tunisia');
  const economyArticles = latestArticles.filter(a => a.category?.slug === 'economy');
  const sportsArticles = latestArticles.filter(a => a.category?.slug === 'sports');

  const tunisiaCategory = categories.find(c => c.slug === 'tunisia') || categories[0];
  const economyCategory = categories.find(c => c.slug === 'economy') || categories[3];

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* 1. Hero Section */}
      <HeroSection 
        mainArticle={heroData.main} 
        secondaryArticles={heroData.secondary} 
      />

      {/* 2. Main Content Grid (Two Columns: Main Flow + Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
        {/* Left Column: Latest News & Category Blocks (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Latest News Grid */}
          <LatestNewsSection initialArticles={latestArticles} />

          {/* Category Highlight 1: Tunisia News */}
          {tunisiaCategory && (
            <CategoryBlock
              category={tunisiaCategory}
              articles={tunisiaArticles.length > 0 ? tunisiaArticles : latestArticles.slice(0, 4)}
            />
          )}

          {/* Category Highlight 2: Economy & Business */}
          {economyCategory && (
            <CategoryBlock
              category={economyCategory}
              articles={economyArticles.length > 0 ? economyArticles : latestArticles.slice(2, 6)}
            />
          )}
        </div>

        {/* Right Sidebar: Trending, Facebook Community, Editorials (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Trending News */}
          <TrendingSection articles={trendingArticles} />

          {/* Facebook Official Page Integration */}
          <FacebookFeedSection facebookUrl={settings.facebook_url} />

          {/* Fast Poll or Quick Opinion */}
          <div className="bg-white rounded-lg border border-brand-border p-5 shadow-sm">
            <h4 className="font-heading font-bold text-base text-brand-navy mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-red rounded-full"></span>
              <span>استطلاع رأي الأسبوع</span>
            </h4>
            <p className="text-xs text-gray-700 mb-4 leading-relaxed">
              هل ترى أن الاستراتيجية الوطنية للتحول الرقمي ستسهم في تحسين جودة الخدمات الإدارية في تونس؟
            </p>
            <div className="space-y-2 text-xs font-semibold">
              <label className="flex items-center gap-2 p-2 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input type="radio" name="poll" className="text-brand-red" defaultChecked />
                <span>نعم، بالتأكيد</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input type="radio" name="poll" className="text-brand-red" />
                <span>إلى حد ما</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input type="radio" name="poll" className="text-brand-red" />
                <span>لا أعتقد ذلك</span>
              </label>
            </div>
            <button 
              type="button" 
              className="w-full mt-4 py-2 bg-brand-navy hover:bg-brand-navyLight text-white rounded text-xs font-bold transition"
            >
              تصويت
            </button>
          </div>
        </div>
      </div>

      {/* 3. Video Showcase Section */}
      {videoArticles.length > 0 && (
        <VideoSection articles={videoArticles} />
      )}

      {/* 4. Newsletter Subscription */}
      <NewsletterBox />
    </div>
  );
}
