# منصة «صَـدَى» الإخبارية الرقمية المتكاملة
## Professional Arabic News Portal & CMS

منصة إخبارية رقمية عربية احترافية متكاملة، مبنية بأحدث معايير الصحافة الرقمية وتطوير الويب الحديث، تدعم اتجاه الكتابة من اليمين إلى اليسار (RTL) بالكامل، مستوحاة من الهوية الصحفية لصفحة فيسبوك وقناة يوتيوب الرسمية:
- **Facebook:** https://www.facebook.com/profile.php?id=61584651215444
- **YouTube:** https://www.youtube.com/@cha%C3%AEnenum%C3%A9riquesSada (قناة صدى الرقمية)

---

## 🚀 التقنيات المستخدمة (Tech Stack)

- **Frontend:** Next.js 15 (App Router & Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS مع دعم كامل للألوان الصحفية (Deep Navy `#0F1E36` & News Red `#D9232D`)
- **Typography:** خطوط Cairo للعناوين وTajawal للنصوص والواجهات من Google Fonts
- **Icons:** Lucide Icons (RTL Optimized)
- **Database & Auth:** Supabase (PostgreSQL, Supabase Auth, Row Level Security RLS, Supabase Storage)
- **SEO & Metadata:** Next.js Metadata API, Open Graph, Twitter Cards, Sitemap.xml, Robots.txt, وNewsArticle JSON-LD Structured Data
- **Responsive Design:** Mobile-First بتصميم تحريري مرن (Editorial Fluid Grid)

---

## 🌟 الميزات والخصائص المنفذة

### 1. الصفحة الرئيسية (Front Page)
- **Header:** شعار صدى مع الشارة الإخبارية، التاريخ باللغتين الهجرية والميلادية العربية، الوقت بتوقيت تونس، محرك بحث سريع، وروابط الشبكات الاجتماعية.
- **Breaking News Ticker:** شريط الأخبار العاجلة عالي التباين مع شارة حمراء نابضة (Live Pulse) وتحكم في التنقل وسرعة القراءة.
- **Hero Section:** مانشيت رئيسي عريض (8 أعمدة) مع 3 عناوين ثانوية مصورة (4 أعمدة).
- **Latest News:** شبكة الأخبار والتقارير الأحدث مع زر تحميل المزيد (Load More).
- **Trending News:** قسم الأخبار الأكثر قراءة مرقمة بأرقام تحريرية بارزة وعداد مشاهدات موثق.
- **Category Highlights:** كتل إخبارية مخصصة للأقسام (أخبار تونس، الاقتصاد، الرياضة، التكنولوجيا...).
- **Video Section:** قسم التقارير المرئية وفيديوهات صدى مع مشغل YouTube منبثق.
- **Facebook Integration:** بطاقة مجتمع صدى على فيسبوك وروابط المتابعة المباشرة والمشاركة.
- **Newsletter:** صندوق اشتراك في النشرة الإخبارية اليومية مع فحص البريد والاتصال بقاعدة البيانات.
- **Footer:** روابط الأقسام، نبذة عن المنصة، سياسة الخصوصية، شروط الاستخدام، وبيانات الاتصال بهيئة التحرير.

### 2. صفحة تفاصيل الخبر (`/news/[slug]`)
- رابط صديق لمحركات البحث (SEO-Friendly Slug).
- عنوان المقال، تصنيف القسم، الكاتب، وتاريخ ووقت النشر.
- شريط أدوات القراءة: تكبير وتصغير حجم الخط (A+ / A-)، أزرار مشاركة مباشرة (Facebook, WhatsApp, X, نسخ الرابط).
- محتوى غني بالصور والاقتباسات والعناوين الفرعية.
- تسجيل وتحديث فوري لعداد المشاهدات لكل خبر.
- أخبار ذات صلة من نفس القسم وشريط الأخبار الأكثر قراءة.
- بيانات وصفية منظمة NewsArticle Schema لمحركات بحث جوجل.

### 3. لوحة التحكم الإدارية CMS (`/admin`)
- مسار محمي ومخصص لهيئة التحرير والصحفيين.
- **Dashboard:** إحصائيات حية (إجمالي الأخبار، المنشورة، المسودات، الأخبار العاجلة، إجمالي المشاهدات، المشتركين).
- **إدارة الأخبار (`/admin/articles`):** نظام CRUD متكامل (إضافة، تعديل، حذف، بحث، تصفية حسب القسم أو الحالة).
- **محرر المقالات الاحترافي (`/admin/articles/new` & `edit`):** دعم العناوين، الفقرات، النص العريض، القوائم، الصور، الفيديوهات، واقتباسات التحرير، مع تبويب للمعاينة الحية.
- **إدارة الأقسام (`/admin/categories`):** إنشاء وتعديل وحذف الأقسام وتحديد الـ Slug والاسم والأيقونة.
- **مكتبة الوسائط (`/admin/media`):** رفع وإدارة واستعراض الصور، نسخ الروابط بنقرة واحدة لاستخدامها داخل المقالات.
- **فريق العمل والصلاحيات (`/admin/users`):** تحديد أدوار المشرفين (Admin, Editor, Journalist).
- **إعدادات المنصة (`/admin/settings`):** تعديل اسم الموقع، الوصف، روابط شبكات التواصل الاجتماعي، ورابط صفحة Facebook.

---

## 🗄️ إعداد قاعدة بيانات Supabase (Database Setup)

ملف الـ SQL الجاهز متاح في المسار:
`supabase/schema.sql`

يحتوي على:
1. الجداول: `profiles`, `categories`, `articles`, `article_images`, `tags`, `article_tags`, `comments`, `newsletter_subscribers`, `site_settings`, `article_views`.
2. سياسات الأمان **Row Level Security (RLS)** لحماية عمليات التعديل والحذف وقصرها على المحررين المصرح لهم.
3. دالة تسجيل المشاهدات الذكية `record_article_view` لمنع تكرار احتساب المشاهدات العشوائية.
4. البيانات الأولية للأقسام (أخبار تونس، العالم، السياسة، الاقتصاد، الرياضة، التكنولوجيا، المجتمع، الثقافة والفن، منوعات) والإعدادات الافتراضية.

### خطوات الربط:
1. أنشئ مشروعاً جديداً على [Supabase](https://supabase.com).
2. افتح **SQL Editor** والصق محتويات `supabase/schema.sql` ثم اضغط **Run**.
3. احصل على `Project URL` و `anon key` من **Project Settings -> API**.
4. ضع القيم داخل ملف `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 💻 التشغيل المحلي (Local Development)

```bash
# تثبيت الحزم (إن لم تكن مثبتة)
npm install

# تشغيل خادم التطوير
npm run dev
```

افتح المتصفح على: `http://localhost:3000`

لدخول لوحة التحكم: `http://localhost:3000/admin`
أو تسجيل الدخول عبر: `http://localhost:3000/login`

---

## ☁️ خطوات النشر على Vercel (Deployment)

1. ارفع المشروع على مستودع GitHub الخاص بك.
2. توجه إلى منصة [Vercel](https://vercel.com) واختر **Add New Project**.
3. استورد المستودع (Import Repository).
4. في خانة **Environment Variables**، أضف المتغيرات:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (مثل `https://sada-news.vercel.app`)
5. اضغط **Deploy**. ستقوم Vercel ببناء ونشر المنصة في ثوانٍ معدودة.

---

## 📄 رخصة الاستخدام
تم تطوير هذا المشروع بالكامل وفق أعلى معايير الجودة والأمان والأداء، وهو جاهز للنشر والاستخدام الإنتاجي.
