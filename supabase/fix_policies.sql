-- ==============================================================================
-- Sada News Platform - RLS Policies Fix (إصلاح وتفعيل صلاحيات الجداول)
-- Run this script in the Supabase SQL Editor to enable all public & admin policies.
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.article_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.article_views ENABLE ROW LEVEL SECURITY;

-- 2. Newsletter Subscribers Policies (Fixes the syntax error)
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view newsletter subscribers" ON public.newsletter_subscribers FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 3. Comments Policies
DROP POLICY IF EXISTS "Approved comments readable by everyone" ON public.comments;
CREATE POLICY "Approved comments readable by everyone" ON public.comments FOR SELECT USING (is_approved = true OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can submit comments" ON public.comments;
CREATE POLICY "Anyone can submit comments" ON public.comments FOR INSERT WITH CHECK (true);

-- 4. Categories Policies
DROP POLICY IF EXISTS "Categories are readable by everyone" ON public.categories;
CREATE POLICY "Categories are readable by everyone" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Categories writable by admin/editor" ON public.categories;
CREATE POLICY "Categories writable by admin/editor" ON public.categories FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- 5. Articles Policies
DROP POLICY IF EXISTS "Published articles are readable by everyone" ON public.articles;
CREATE POLICY "Published articles are readable by everyone" ON public.articles FOR SELECT USING (status = 'published' OR (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid())));

DROP POLICY IF EXISTS "Staff can insert articles" ON public.articles;
CREATE POLICY "Staff can insert articles" ON public.articles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Staff can update articles" ON public.articles;
CREATE POLICY "Staff can update articles" ON public.articles FOR UPDATE USING (auth.uid() IS NOT NULL AND (author_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))));

DROP POLICY IF EXISTS "Admin and editors can delete articles" ON public.articles;
CREATE POLICY "Admin and editors can delete articles" ON public.articles FOR DELETE USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- 6. Article Images Policies
DROP POLICY IF EXISTS "Article images readable by everyone" ON public.article_images;
CREATE POLICY "Article images readable by everyone" ON public.article_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Article images writable by staff" ON public.article_images;
CREATE POLICY "Article images writable by staff" ON public.article_images FOR ALL USING (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()));

-- 7. Tags Policies
DROP POLICY IF EXISTS "Tags readable by everyone" ON public.tags;
CREATE POLICY "Tags readable by everyone" ON public.tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Article tags readable by everyone" ON public.article_tags;
CREATE POLICY "Article tags readable by everyone" ON public.article_tags FOR SELECT USING (true);

-- 8. Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile or admins can update any." ON public.profiles;
CREATE POLICY "Users can update own profile or admins can update any." ON public.profiles FOR UPDATE USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 9. Settings Policies
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.site_settings;
CREATE POLICY "Settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can update settings" ON public.site_settings;
CREATE POLICY "Only admins can update settings" ON public.site_settings FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 10. Article Views Policies
DROP POLICY IF EXISTS "Anyone can record views" ON public.article_views;
CREATE POLICY "Anyone can record views" ON public.article_views FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Views readable by everyone" ON public.article_views;
CREATE POLICY "Views readable by everyone" ON public.article_views FOR SELECT USING (true);
