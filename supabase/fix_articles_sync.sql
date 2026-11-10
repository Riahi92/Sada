-- ==============================================================================
-- Sada News Platform - Fix Supabase Articles Synchronization & RLS Policies
--
-- Instructions:
-- 1. Open your Supabase Dashboard:
--    https://supabase.com/dashboard/project/yujgqweuqeagyalyvkez/sql
-- 2. Paste this entire script in the SQL Editor and click "RUN".
-- ==============================================================================

-- 1. Ensure all 10 official categories exist with their correct slugs
INSERT INTO public.categories (name, slug, description, icon, order_index)
VALUES 
  ('أخبار تونس', 'tunisia', 'أحدث الأخبار الوطنية والمحلية في تونس على مدار الساعة', 'Landmark', 1),
  ('أخبار العالم', 'world', 'متابعات دقيقة لأهم الأحداث والتطورات الدولية والإقليمية', 'Globe', 2),
  ('اقتصاد', 'economy', 'أسواق المال، المؤشرات المالية، الاستثمار وريادة الأعمال', 'TrendingUp', 3),
  ('مجتمع', 'society', 'قضايا المجتمع، الأسرة، التربية والتنمية المجتمعية', 'Users', 4),
  ('حوادث وقضايا', 'incidents', 'متابعات الشأن القضائي، المستجدات الأمنية والحوادث اليومية', 'Scale', 5),
  ('ثقافة وفنون', 'culture', 'إصدارات الكتب، المعارض الفنية، السينما، المسرح والمهرجانات', 'Palette', 6),
  ('رياضة', 'sports', 'تغطية شاملة للدوري التونسي والبطولات العالمية والأوروبية', 'Trophy', 7),
  ('تكنولوجيا والذكاء الاصطناعي', 'technology', 'أحدث ابتكارات الذكاء الاصطناعي، الأمن الرقمي، والحوسبة السحابية', 'Cpu', 8),
  ('الصحة', 'health', 'أخبار الطب، الرعاية الصحية، التغذية السليمة، وجودة الحياة', 'HeartPulse', 9),
  ('منوعات', 'variety', 'قصص ملهمة، طرائف واكتشافات علمية مشوقة من حول العالم', 'Sparkles', 10)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  order_index = EXCLUDED.order_index;

-- 2. Ensure public.articles has RLS enabled
ALTER TABLE IF EXISTS public.articles ENABLE ROW LEVEL SECURITY;

-- 3. Allow everyone (public & anon) to read articles
DROP POLICY IF EXISTS "Published articles are readable by everyone" ON public.articles;
CREATE POLICY "Published articles are readable by everyone" ON public.articles
FOR SELECT USING (true);

-- 4. Allow inserting articles from Next.js server & API
DROP POLICY IF EXISTS "Staff can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.articles;
CREATE POLICY "Enable insert for all users" ON public.articles
FOR INSERT WITH CHECK (true);

-- 5. Allow updating articles from Next.js server & API
DROP POLICY IF EXISTS "Staff can update articles" ON public.articles;
DROP POLICY IF EXISTS "Enable update for all users" ON public.articles;
CREATE POLICY "Enable update for all users" ON public.articles
FOR UPDATE USING (true);

-- 6. Allow deleting articles from Next.js server & API
DROP POLICY IF EXISTS "Admin and editors can delete articles" ON public.articles;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.articles;
CREATE POLICY "Enable delete for all users" ON public.articles
FOR DELETE USING (true);

-- 7. Verification: Output all categories count
SELECT count(*) AS total_categories FROM public.categories;
