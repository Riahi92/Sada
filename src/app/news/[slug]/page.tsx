import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';
import ArticleReader from '@/components/ArticleReader';
import TrendingSection from '@/components/TrendingSection';
import ArticlePoll from '@/components/ArticlePoll';
import ArticleComments from '@/components/ArticleComments';
import { getArticleBySlug, getRelatedArticles, getTrendingArticles, getCommentsByArticleId, getArticlePoll } from '@/lib/db';
import { Clock, Eye, Share2, Tag, ArrowRight, Folder } from 'lucide-react';
import CategoryIcon from '@/components/CategoryIcon';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: ArticlePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'المقال غير موجود | صدى',
    };
  }

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.published_at,
      authors: [article.author?.full_name || 'صدى'],
      images: [
        {
          url: article.featured_image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.featured_image],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [relatedArticles, trendingArticles, comments, poll] = await Promise.all([
    getRelatedArticles(article.id, article.category_id, 4),
    getTrendingArticles(5),
    getCommentsByArticleId(article.id),
    getArticlePoll(article.id),
  ]);

  // Schema.org NewsArticle JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.featured_image],
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: [
      {
        '@type': 'Person',
        name: article.author?.full_name || 'هيئة تحرير صدى',
      },
    ],
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'صدى الإخباري',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sada-news.tn/logo.png',
      },
    },
    description: article.excerpt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-brand-muted mb-4 font-tajawal">
          <Link href="/" className="hover:text-brand-red transition">الرئيسية</Link>
          <span>/</span>
          {article.category && (
            <>
              <Link href={`/category/${article.category.slug}`} className="hover:text-brand-red transition">
                {article.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-400 line-clamp-1 max-w-sm">{article.title}</span>
        </nav>

        {/* Title & Category Header */}
        <div className="mb-6">
          {article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="inline-flex items-center gap-1.5 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full mb-3 hover:bg-brand-redDark transition shadow-sm"
            >
              <CategoryIcon slug={article.category.slug} icon={article.category.icon} className="w-3.5 h-3.5" />
              <span>{article.category.name}</span>
            </Link>
          )}
          <h1 className="font-heading font-black text-2xl md:text-3xl lg:text-4xl text-brand-navy leading-snug mb-4">
            {article.title}
          </h1>
          <p className="text-gray-600 text-base md:text-lg font-tajawal leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Main Featured Image */}
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-100 shadow-md mb-8">
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>

        {/* Two Columns Grid: Reader Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            <ArticleReader article={article} />

            {/* Poll & Survey Section */}
            <div id="poll" className="scroll-mt-6">
              <ArticlePoll articleId={article.id} initialPoll={poll} />
            </div>

            {/* Comments Section */}
            <div id="comments" className="scroll-mt-6">
              <ArticleComments articleId={article.id} initialComments={comments} />
            </div>

            {/* Related Articles in Same Category */}
            {relatedArticles.length > 0 && (
              <div className="mt-12 pt-8 border-t border-brand-border">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2.5 h-6 bg-brand-red rounded-sm"></span>
                  <h3 className="font-heading font-black text-xl text-brand-navy">
                    أخبار ذات صلة من قسم «{article.category?.name}»
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedArticles.map((rel) => (
                    <article
                      key={rel.id}
                      className="bg-white rounded-lg border border-brand-border overflow-hidden p-3 shadow-sm hover:shadow-md transition group flex gap-3"
                    >
                      <div className="relative w-24 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={rel.featured_image}
                          alt={rel.title}
                          fill
                          sizes="96px"
                          className="object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <h4 className="font-heading font-bold text-xs text-brand-navy leading-snug line-clamp-2 group-hover:text-brand-red transition">
                          <Link href={`/news/${rel.slug}`}>
                            {rel.title}
                          </Link>
                        </h4>
                        <span className="text-[10px] text-brand-muted">
                          {new Date(rel.published_at).toLocaleDateString('ar-TN')}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <TrendingSection articles={trendingArticles} />

            {/* Category Quick Box */}
            <div className="bg-white rounded-lg border border-brand-border p-5 shadow-sm">
              <h4 className="font-heading font-bold text-base text-brand-navy mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Folder className="w-4 h-4 text-brand-red" />
                <span>عن هذا القسم</span>
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed font-tajawal mb-4">
                {article.category?.description || 'تغطية إخبارية حصرية ومتابعة آنية لكافة التطورات والمستجدات.'}
              </p>
              {article.category && (
                <Link
                  href={`/category/${article.category.slug}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-brand-navy hover:bg-brand-navyLight text-white rounded text-xs font-bold transition"
                >
                  <span>تصفح كل أخبار {article.category.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
