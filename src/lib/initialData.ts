import { Article, Category, Profile, SiteSettings } from '@/types/database';

export const initialCategories: Category[] = [
  {
    id: "cat-1",
    name: "أخبار تونس",
    slug: "tunisia",
    description: "أحدث الأخبار الوطنية والمحلية في تونس على مدار الساعة",
    icon: "Flag",
    order_index: 1,
    article_count: 5,
  },
  {
    id: "cat-2",
    name: "أخبار العالم",
    slug: "world",
    description: "متابعات دقيقة لأهم الأحداث والتطورات الدولية والعربية",
    icon: "Globe",
    order_index: 2,
    article_count: 4,
  },
  {
    id: "cat-3",
    name: "السياسة",
    slug: "politics",
    description: "تحليلات سياسية معمقة وقراءات في المشهد الدبلوماسي",
    icon: "Building2",
    order_index: 3,
    article_count: 3,
  },
  {
    id: "cat-4",
    name: "الاقتصاد",
    slug: "economy",
    description: "أسواق المال، المؤشرات المالية، الطاقة وريادة الأعمال",
    icon: "TrendingUp",
    order_index: 4,
    article_count: 4,
  },
  {
    id: "cat-5",
    name: "الرياضة",
    slug: "sports",
    description: "تغطية شاملة للدوري التونسي والبطولات العالمية والأوروبية",
    icon: "Trophy",
    order_index: 5,
    article_count: 4,
  },
  {
    id: "cat-6",
    name: "التكنولوجيا",
    slug: "technology",
    description: "أحدث تقنيات الذكاء الاصطناعي، الهواتف الذكية والأمن الرقمي",
    icon: "Cpu",
    order_index: 6,
    article_count: 3,
  },
  {
    id: "cat-7",
    name: "المجتمع",
    slug: "society",
    description: "قضايا المجتمع، الصحة، التعليم والبيئة والتنمية المستدامة",
    icon: "Users",
    order_index: 7,
    article_count: 3,
  },
  {
    id: "cat-8",
    name: "الثقافة والفن",
    slug: "culture",
    description: "إصدارات الكتب، المعارض الفنية، السينما والمهرجانات الثقافية",
    icon: "Palette",
    order_index: 8,
    article_count: 2,
  },
  {
    id: "cat-9",
    name: "منوعات",
    slug: "variety",
    description: "قصص ملهمة، طرائف واكتشافات علمية مشوقة من أنحاء العالم",
    icon: "Sparkles",
    order_index: 9,
    article_count: 2,
  },
];

export const initialAuthors: Profile[] = [
  {
    id: "author-1",
    email: "editor@sada.tn",
    full_name: "مروان الرياحي",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    role: "admin",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "author-2",
    email: "amel.mansour@sada.tn",
    full_name: "آمال المنصور",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    role: "editor",
    created_at: "2026-01-10T00:00:00Z",
  },
  {
    id: "author-3",
    email: "karim.benali@sada.tn",
    full_name: "كريم بن علي",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    role: "journalist",
    created_at: "2026-01-15T00:00:00Z",
  },
];

export const initialArticles: Article[] = [
  {
    id: "art-1",
    title: "تونس تطلق استراتيجية وطنية شاملة للتحول الرقمي وتطوير مراكز الذكاء الاصطناعي",
    slug: "tunisia-national-digital-transformation-ai-strategy",
    excerpt: "أعلنت وزارة تكنولوجيات الاتصال التونسية عن خطة طموحة لجذب استثمارات التقنية الحديثة وتأهيل أكثر من 20 ألف كادر تونسي في مجال الذكاء الاصطناعي والبيانات الضخمة بحلول 2028.",
    content: `
      <p class="lead">أعلنت رئاسة الحكومة التونسية بالتعاون مع وزارة تكنولوجيات الاتصال عن إطلاق الاستراتيجية الوطنية الكبرى للتحول الرقمي 2026-2030، التي تستهدف تعزيز البنية التحتية للحوسبة السحابية وبناء مراكز بيانات حديثة في تونس العاصمة وصفاقس وسوسة.</p>
      
      <h2>أهداف المبادرة الوطنية</h2>
      <p>تهدف المبادرة إلى رقمنة كافة المعاملات الإدارية وتسهيل النفاذ للخدمات العمومية للمواطنين والشركات، إلى جانب إنشاء صندوق استثماري حكومي-خاص لدعم الشركات الناشئة التونسية في مجالات التكنولوجيا العميقة (DeepTech).</p>
      
      <p>وأكد الخبراء أن تونس تمتلك طاقات هندسية متميزة قادرة على قيادة القاطرة التكنولوجية في منطقة شمال إفريقيا وحوض البحر الأبيض المتوسط.</p>

      <blockquote>"الاستثمار في الكفاءات الوطنية الشابة هو الضمان الحقيقي لاقتصاد معرفي مستدام ومواكب للمستقبل."</blockquote>

      <h2>شراكات دولية مع كبرى الشركات</h2>
      <p>تتضمن الخطة توقيع اتفاقيات شراكة استراتيجية مع عمالقة التقنية الدوليين لتوفير شهادات تخصصية مجانية لطلبة الجامعات وخريجي مدارس الهندسة، مما يرفع من تنافسية الكفاءات التونسية في الأسواق الإقليمية والدولية.</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-1",
    author_id: "author-1",
    status: "published",
    is_featured: true,
    is_breaking: true,
    views_count: 14250,
    meta_title: "تونس تطلق استراتيجية وطنية شاملة للتحول الرقمي | صدى",
    meta_description: "خطة طموحة في تونس لتأهيل الكفاءات وجذب الاستثمارات التكنولوجية ومراكز الذكاء الاصطناعي.",
    published_at: "2026-11-01T09:30:00Z",
    created_at: "2026-11-01T08:00:00Z",
    updated_at: "2026-11-01T10:15:00Z",
    category: initialCategories[0],
    author: initialAuthors[0],
  },
  {
    id: "art-2",
    title: "قمة المناخ الدولية تعلن إنشاء صندوق تمويل جديد لدعم مشاريع الطاقة المتجددة في إفريقيا",
    slug: "global-climate-summit-africa-renewable-energy-fund",
    excerpt: "اتفقت الوفود المشاركة في مؤتمر المناخ على رصد 35 مليار دولار لدعم مشاريع الطاقة الشمسية وطاقة الرياح في دول البحر الأبيض المتوسط والقارة الإفريقية.",
    content: `
      <p>شهدت الجلسة الختامية لقمة المناخ إجماعاً دولياً على ضرورة تسريع وتيرة التحول الطاقي العادل ودعم الدول النامية في مواجهة آثار التغيرات المناخية وتداعيات الجفاف وندرة المياه.</p>
      <h2>مشاريع الطاقة الشمسية في تونس والمغرب</h2>
      <p>ستحظى المشاريع الإقليمية، وخاصة مشاريع الهيدروجين الأخضر والربط الكهربائي القاري بين تونس وإيطاليا (مشروع ELMED)، بحصة رئيسية من حزم التمويل المعلنة لتعزيز أمن الطاقة المشترك.</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-2",
    author_id: "author-2",
    status: "published",
    is_featured: true,
    is_breaking: false,
    views_count: 9820,
    meta_title: "قمة المناخ الدولية تعلن صندوق تمويل الطاقة المتجددة في إفريقيا | صدى",
    meta_description: "تخصيص 35 مليار دولار لدعم مشاريع الطاقة النظيفة ومكافحة التغيرات المناخية في حوض المتوسط.",
    published_at: "2026-11-01T08:00:00Z",
    created_at: "2026-11-01T07:30:00Z",
    updated_at: "2026-11-01T08:00:00Z",
    category: initialCategories[1],
    author: initialAuthors[1],
  },
  {
    id: "art-3",
    title: "صعود تاريخي في صادرات زيت الزيتون التونسي محققاً عائدات قياسية للأسواق العالمية",
    slug: "tunisia-olive-oil-exports-record-revenue",
    excerpt: "سجلت وزارة الفلاحة والموارد المائية قفزة استثنائية في قيمة الصادرات بفضل الجودة العالية لزيت الزيتون المعلب والطلب المتزايد في أوروبا وأمريكا الشمالية.",
    content: `
      <p>أكد المرصد الوطني للفلاحة أن صادرات زيت الزيتون التونسي واصلت مسارها التصاعدي المتميز محققة عوائد تفوق 4.5 مليار دينار تونسي، مدفوعة بتعزيز التصدير تحت علامات تجارية تونسية فاخرة حاصلة على جوائز دولية.</p>
      <h2>الرهان على زيت الزيتون البيولوجي والمعلب</h2>
      <p>انتقلت تونس من مجرد مصدر للمواد الخام السائبة إلى منافس عالمي أول في إنتاج زيت الزيتون البكر الممتاز البيولوجي الحائز على الميداليات الذهبية في مسابقات نيويورك وطوكيو ولندن.</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-4",
    author_id: "author-3",
    status: "published",
    is_featured: true,
    is_breaking: false,
    views_count: 12100,
    meta_title: "صادرات زيت الزيتون التونسي تحقق أرقاماً قياسية | صدى",
    meta_description: "صادرات قياسية للمنتوج التونسي المعلب والبيولوجي في الأسواق الأوروبية والأمريكية.",
    published_at: "2026-11-01T07:15:00Z",
    created_at: "2026-11-01T06:00:00Z",
    updated_at: "2026-11-01T07:15:00Z",
    category: initialCategories[3],
    author: initialAuthors[2],
  },
  {
    id: "art-4",
    title: "المنتخب التونسي يختتم استعداداته للمباراة الحاسمة بتشكيلة هجومية متجددة وروح عالية",
    slug: "tunisia-national-football-team-preparation",
    excerpt: "أجرى نسور قرطاج حصتهم التدريبية الأخيرة قبل المواجهة المصيرية وسط حضور جماهيري وتشجيع حاشد لمواصلة صدارة المجموعة.",
    content: `
      <p>وسط أجواء مفعمة بالثقة والإصرار، أنهى المنتخب التونسي لكرة القدم آخر حصة تدريبية له على أرضية ملعب حمادي العقربي برادس، بحضور كافة اللاعبين المحترفين في الدوريات الأوروبية والمحلية.</p>
      <h2>خطة تكتيكية تركز على الضغط العالي</h2>
      <p>ركز الإطار الفني خلال التمارين على الانتشار السريع واستغلال الكرات الثابتة مع إحكام الخط الدفاعي لمباغتة الخصم منذ الدقائق الأولى.</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-5",
    author_id: "author-3",
    status: "published",
    is_featured: false,
    is_breaking: true,
    views_count: 18400,
    meta_title: "استعدادات نسور قرطاج للمباراة الحاسمة | صدى الرياضة",
    meta_description: "تغطية كاملة لآخر تحضيرات المنتخب التونسي قبل المواجهة المرتقبة.",
    published_at: "2026-11-01T11:00:00Z",
    created_at: "2026-11-01T10:00:00Z",
    updated_at: "2026-11-01T11:00:00Z",
    category: initialCategories[4],
    author: initialAuthors[2],
  },
  {
    id: "art-5",
    title: "جيل جديد من معالجات الذكاء الاصطناعي يحدث ثورة في كفاءة استهلاك الطاقة والحوسبة الفائقة",
    slug: "next-gen-ai-chips-energy-efficiency",
    excerpt: "كشفت مختبرات الأبحاث العالمية عن بنية معمارية ثورية لرقائق السيليكون والضوئيات تقلل استهلاك الطاقة بنسبة 70% وتضاعف سرعة تدريب النماذج اللغوية الضخمة.",
    content: `
      <p>في خطوة ستغير مشهد مراكز البيانات التي تعاني من الارتفاع الهائل في استهلاك الكهرباء، أعلنت فرق البحث المشتركة عن ابتكار معالجات نانوية تعتمد على الفوتونات والضوء بدلاً من الإلكترونات التقليدية لنقل البيانات بين أنوية المعالجة.</p>
      <h2>حل مستدام لأزمة الطاقة في قطاع الحوسبة</h2>
      <p>تمثل هذه القفزة العلمية استجابة ملحة للتحديات البيئية المرافقة لتوسع مراكز البيانات الذكية حول العالم.</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-6",
    author_id: "author-1",
    status: "published",
    is_featured: false,
    is_breaking: false,
    views_count: 8430,
    meta_title: "معالجات ذكاء اصطناعي جديدة تخفض استهلاك الطاقة بنسبة 70% | صدى التكنولوجيا",
    meta_description: "ثورة في رقائق السيليكون الضوئية تفتح آفاقاً جديدة للحوسبة الفائقة الصديقة للبيئة.",
    published_at: "2026-10-31T16:00:00Z",
    created_at: "2026-10-31T15:00:00Z",
    updated_at: "2026-10-31T16:00:00Z",
    category: initialCategories[5],
    author: initialAuthors[0],
  },
  {
    id: "art-6",
    title: "مهرجان قرطاج الدولي يعلن عن برنامجه الاستثنائي لدورته الجديدة بمشاركة قامات فنية عربية وعالمية",
    slug: "carthage-international-festival-new-edition",
    excerpt: "كشفت الهيئة المديرة لمهرجان قرطاج الدولي عن باقة من العروض الموسيقية والمسرحية الكبرى التي تحتضنها مدارج المسرح الأثري العريق بقرطاج.",
    content: `
      <p>تحت أضواء التاريخ ونسيم البحر الأبيض المتوسط، تستعد مدينة قرطاج لافتتاح موسمها الصيفي الفني الجديد ببرنامج ثري يجمع بين الأصالة العربية والتجديد الموسيقي الكلاسيكي والمعاصر.</p>
      <h2>تنوع ثقافي وعروض فرجوية كبرى</h2>
      <p>يشهد المهرجان هذا العام حضوراً لأبرز النجوم من تونس والعالم العربي ومشاركات عالمية من إسبانيا وإيطاليا وإفريقيا، إلى جانب تخصيص ليالٍ موسيقية لرواد الأغنية الملتزمة والموسيقى السمفونية التونسية.</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-8",
    author_id: "author-2",
    status: "published",
    is_featured: false,
    is_breaking: false,
    views_count: 7350,
    meta_title: "مهرجان قرطاج الدولي يعلن برنامج دورته الجديدة | صدى الثقافة",
    meta_description: "عروض فنية كبرى ومشاركات عربية وعالمية على مسرح قرطاج الأثري العريق.",
    published_at: "2026-10-31T12:00:00Z",
    created_at: "2026-10-31T11:00:00Z",
    updated_at: "2026-10-31T12:00:00Z",
    category: initialCategories[7],
    author: initialAuthors[1],
  },
  {
    id: "art-7",
    title: "تطوير منظومة الرعاية الصحية الأساسية في المناطق الداخلية: إطلاق 15 وحدة صحية متنقلة",
    slug: "healthcare-development-tunisia-interior-regions",
    excerpt: "بهدف تعزيز العدالة الصحية وتقريب الخدمات الطبية من المواطنين في الأرياف، دخلت 15 وحدة صحية مجهزة بأحدث تقنيات الفحص والمراقبة عن بعد حيز العمل.",
    content: `
      <p>أشرفت وزارة الصحة على تسليم قافلة من الوحدات الطبية المتنقلة المزودة بعيادات طب عام وطب أسنان وفحوصات مبكرة للأمراض المزمنة، مدعومة بمنظومة الاتصال الرقمي عن بعد مع المستشفيات الجامعية.</p>
      <h2>تقريب الخدمات الصحية من المواطنين</h2>
      <p>ستغطي هذه الوحدات أكثر من 60 قرية ومنطقة ريفية نائية، مما يخفف عناء التنقل على كبار السن والأطفال ويوفر رعاية صحية مستمرة وشاملة.</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-7",
    author_id: "author-2",
    status: "published",
    is_featured: false,
    is_breaking: false,
    views_count: 5210,
    meta_title: "إطلاق وحدات صحية متنقلة في المناطق الداخلية | صدى المجتمع",
    meta_description: "مبادرة وطنية لتقريب الخدمات الطبية وتوفير الرعاية المجانية لسكان المناطق الريفية.",
    published_at: "2026-10-30T14:30:00Z",
    created_at: "2026-10-30T13:00:00Z",
    updated_at: "2026-10-30T14:30:00Z",
    category: initialCategories[6],
    author: initialAuthors[1],
  },
  {
    id: "art-8",
    title: "اكتشاف أثري نادر في شمال غرب تونس يعود إلى العصر النوميدي يذهل علماء الآثار",
    slug: "archaeological-discovery-tunisia-numidian-era",
    excerpt: "عثر فريق تونسي فرنسي مشترك من الباحثين على معبد جنائزي ونقوش بالخط الليبي الفينيقي بحالة حفظ ممتازة تكشف تفاصيل جديدة عن الحضارة النوميدية.",
    content: `
      <p>أعلن المعهد الوطني للتراث عن اكتشاف أثري بالغ الأهمية بالقرب من الموقع الأثري بدقة وشمتو، يضم مقبرة جماعية ملكية ومنحوتات حجرية وأوانٍ فخارية نادرة تعود إلى القرن الثالث قبل الميلاد.</p>
      <h2>شهادة حية على عمق التاريخ التونسي</h2>
      <p>يؤكد هذا الاكتشاف الدور الريادي للمنطقة كمركز تجاري وثقافي مزدهر ربط بين قرطاج والممالك النوميدية المجاورة في العصور القديمة.</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-9",
    author_id: "author-3",
    status: "published",
    is_featured: false,
    is_breaking: false,
    views_count: 6180,
    meta_title: "اكتشاف أثري نوميدي نادر في تونس | صدى منوعات",
    meta_description: "تفاصيل الاكتشاف الأثري الجديد الذي يسلط الضوء على الحضارة النوميدية العريقة في تونس.",
    published_at: "2026-10-30T10:00:00Z",
    created_at: "2026-10-30T09:00:00Z",
    updated_at: "2026-10-30T10:00:00Z",
    category: initialCategories[8],
    author: initialAuthors[2],
  },
  {
    id: "art-9",
    title: "تقرير خاص: كيف أصبحت السياحة البيئية والصحراوية في الجنوب التونسي وجهة عالمية مفضلة؟",
    slug: "southern-tunisia-eco-tourism-global-destination",
    excerpt: "من واحات توزر ونفطة إلى رمال دوز وقصور تطاوين، تشهد مناطق الجنوب إقبالاً سياحياً لافتاً على الإقامات الريفية والتجارب الأصيلة.",
    content: `
      <p>مع بداية موسم الشتاء والربيع، تشهد مدن الجنوب التونسي حركية اقتصادية وثقافية استثنائية، بفضل تزايد الطلب على سياحة الاستكشاف والتخييم تحت سماء الصحراء الصافية وممارسة الرياضات الميكانيكية الرملية.</p>
      <h2>تجارب ضيافة فريدة وسط الطبيعة</h2>
      <p>تسهم بيوت الضيافة المبنية بالمواد المحلية التقليدية في الحفاظ على التراث المعماري وتشغيل الحرفيين وسكان الواحات، مما يقدم نموذجاً ملهماً للسياحة المستدامة والصديقة للبيئة.</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200&auto=format&fit=crop&q=80",
    category_id: "cat-1",
    author_id: "author-1",
    status: "published",
    is_featured: false,
    is_breaking: false,
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    views_count: 11300,
    meta_title: "السياحة الصحراوية والبيئية في الجنوب التونسي | صدى تقارير",
    meta_description: "استكشاف سحر الواحات وتجارب الضيافة الأصيلة في ربوع الجنوب التونسي.",
    published_at: "2026-10-29T15:00:00Z",
    created_at: "2026-10-29T14:00:00Z",
    updated_at: "2026-10-29T15:00:00Z",
    category: initialCategories[0],
    author: initialAuthors[0],
  },
];

export const initialSiteSettings: SiteSettings = {
  site_name: "صدى | المنصة الإخبارية الرقمية",
  site_description: "منصة إخبارية تونسية وعربية مستقلة تنقل الخبر بمصداقية وموضوعية وعمق على مدار الساعة.",
  logo_url: "/images/logo.png",
  contact_email: "contact@sada-news.tn",
  facebook_url: "https://www.facebook.com/profile.php?id=61584651215444",
  instagram_url: "https://instagram.com",
  twitter_url: "https://x.com",
  youtube_url: "https://youtube.com",
  breaking_ticker_enabled: true,
};
