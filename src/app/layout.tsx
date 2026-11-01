import type { Metadata } from 'next';
import { Cairo, Tajawal } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import FloatingAiBar from '@/components/FloatingAiBar';
import { getCategories, getBreakingNews, getSiteSettings } from '@/lib/db';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sada-news.tn'),
  title: {
    default: 'صدى | المنصة الإخبارية التونسية والعربية المتكاملة',
    template: '%s | صدى',
  },
  description: 'منصة إخبارية تونسية وعربية مستقلة وشاملة، تغطية حصرية للأخبار الوطنية، العالمية، السياسة، الاقتصاد، والرياضة على مدار 24 ساعة.',
  keywords: ['أخبار تونس', 'صدى', 'أخبار العالم', 'سياسة', 'اقتصاد', 'رياضة', 'تونس', 'أخبار عاجلة'],
  authors: [{ name: 'منصة صدى الإخبارية' }],
  creator: 'صدى للأخبار',
  publisher: 'Sada News Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'صدى | المنصة الإخبارية الرقمية المتكاملة',
    description: 'تغطية إخبارية مستقلة وموثوقة على مدار الساعة لأحدث المستجدات في تونس والعالم.',
    url: 'https://sada-news.tn',
    siteName: 'صدى الإخباري',
    locale: 'ar_TN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'صدى | المنصة الإخبارية الرقمية المتكاملة',
    description: 'تغطية إخبارية مستقلة وموثوقة على مدار الساعة في تونس والعالم.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, breakingArticles, settings] = await Promise.all([
    getCategories(),
    getBreakingNews(),
    getSiteSettings(),
  ]);

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col bg-brand-canvas text-brand-text antialiased selection:bg-brand-red selection:text-white">
        <Header categories={categories} facebookUrl={settings.facebook_url} />
        {settings.breaking_ticker_enabled && breakingArticles.length > 0 && (
          <BreakingTicker articles={breakingArticles} />
        )}
        <main className="flex-1">
          {children}
        </main>
        <Footer categories={categories} settings={settings} />
        <FloatingAiBar />
      </body>
    </html>
  );
}
