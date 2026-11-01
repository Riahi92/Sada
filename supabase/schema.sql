-- ========================================================
-- Sada News Platform (منصة صدى الإخبارية) - Database Schema
-- PostgreSQL with Supabase Auth, Storage & RLS
-- ========================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'journalist' CHECK (role IN ('admin', 'editor', 'journalist')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'scheduled')),
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_breaking BOOLEAN DEFAULT FALSE NOT NULL,
    views_count BIGINT DEFAULT 0 NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    video_url TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. ARTICLE IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.article_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. TAGS TABLE
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. ARTICLE_TAGS JOIN TABLE
CREATE TABLE IF NOT EXISTS public.article_tags (
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- 7. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name TEXT NOT NULL DEFAULT 'صدى - منصة إخبارية رقمية',
    site_description TEXT NOT NULL DEFAULT 'منصة إخبارية تونسية وعربية مستقلة تنقل الخبر بمصداقية وعمق على مدار الساعة.',
    logo_url TEXT DEFAULT '/images/logo.png',
    contact_email TEXT DEFAULT 'contact@sada-news.tn',
    facebook_url TEXT DEFAULT 'https://www.facebook.com/profile.php?id=61584651215444',
    instagram_url TEXT DEFAULT 'https://instagram.com',
    twitter_url TEXT DEFAULT 'https://twitter.com',
    youtube_url TEXT DEFAULT 'https://youtube.com',
    breaking_ticker_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. ARTICLE VIEWS TABLE (Tracking unique views)
CREATE TABLE IF NOT EXISTS public.article_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    viewer_ip TEXT,
    user_agent TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_views ON public.articles(views_count DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_views_article ON public.article_views(article_id);

-- FUNCTION & TRIGGER: Update Updated_At timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- FUNCTION: Increment Article Views safely (Avoiding spam)
CREATE OR REPLACE FUNCTION record_article_view(p_article_id UUID, p_viewer_ip TEXT DEFAULT NULL, p_user_agent TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    -- Check if IP viewed in the last 30 minutes to prevent duplicate counter spam
    IF p_viewer_ip IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 FROM public.article_views
            WHERE article_id = p_article_id
              AND viewer_ip = p_viewer_ip
              AND viewed_at > NOW() - INTERVAL '30 minutes'
        ) THEN
            RETURN;
        END IF;
    END IF;

    -- Insert log
    INSERT INTO public.article_views (article_id, viewer_ip, user_agent, viewed_at)
    VALUES (p_article_id, p_viewer_ip, p_user_agent, NOW());

    -- Increment counter
    UPDATE public.articles
    SET views_count = views_count + 1
    WHERE id = p_article_id;
END;
$$ LANGUAGE plpgsql;

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile or admins can update any." 
ON public.profiles FOR UPDATE USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. Categories Policies (Public read, admin/editor write)
CREATE POLICY "Categories are readable by everyone"
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Categories writable by admin/editor"
ON public.categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- 3. Articles Policies (Public can read published articles, staff can read all)
CREATE POLICY "Published articles are readable by everyone"
ON public.articles FOR SELECT USING (
    status = 'published' OR 
    (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()))
);

CREATE POLICY "Staff can insert articles"
ON public.articles FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Staff can update articles"
ON public.articles FOR UPDATE USING (
    auth.uid() IS NOT NULL AND (
        author_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    )
);

CREATE POLICY "Admin and editors can delete articles"
ON public.articles FOR DELETE USING (
    auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- 4. Newsletter Subscribers Policies (Anyone can insert, admin can view)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view newsletter subscribers"
ON public.newsletter_subscribers FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Comments Policies
CREATE POLICY "Approved comments readable by everyone"
ON public.comments FOR SELECT USING (is_approved = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can submit comments"
ON public.comments FOR INSERT WITH CHECK (true);

-- 6. Settings Policies
CREATE POLICY "Settings are viewable by everyone"
ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Only admins can update settings"
ON public.site_settings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ========================================================
-- SEED DATA (الأقسام والإعدادات الافتراضية)
-- ========================================================

INSERT INTO public.categories (name, slug, description, icon, order_index) VALUES
('أخبار تونس', 'tunisia', 'أحدث الأخبار الوطنية والمحلية في تونس', 'Flag', 1),
('أخبار العالم', 'world', 'متابعات حصرية للأحداث الدولية والعالمية', 'Globe', 2),
('السياسة', 'politics', 'تحليلات وتقارير سياسية شاملة', 'Building2', 3),
('الاقتصاد', 'economy', 'أسواق المال، المؤشرات الاقتصادية والشركات', 'TrendingUp', 4),
('الرياضة', 'sports', 'كرة القدم والرياضات الوطنية والدولية', 'Trophy', 5),
('التكنولوجيا', 'technology', 'الذكاء الاصطناعي، الأجهزة والابتكارات الرقمية', 'Cpu', 6),
('المجتمع', 'society', 'قضايا المجتمع، التعليم، والصحة والبيئة', 'Users', 7),
('الثقافة والفن', 'culture', 'الأدب، السينما، المسرح والمعارض الفنية', 'Palette', 8),
('منوعات', 'variety', 'أخبار خفيفة، طرائف واكتشافات حول العالم', 'Sparkles', 9)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.site_settings (site_name, site_description, facebook_url) VALUES
('صدى - منصة إخبارية رقمية متكاملة', 'منصة إخبارية تونسية وعربية مستقلة تنقل الخبر بمصداقية وعمق على مدار الساعة.', 'https://www.facebook.com/profile.php?id=61584651215444')
ON CONFLICT DO NOTHING;
