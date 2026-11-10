import { Article, Category, Profile, SiteSettings, NewsletterSubscriber, Comment, ArticlePoll } from '@/types/database';
import { initialArticles, initialCategories, initialAuthors, initialSiteSettings, initialComments, initialPolls } from './initialData';
import { createClient } from './supabase/client';
import { getAdminSupabaseClient } from './supabase/admin';
import fs from 'fs';
import path from 'path';

// Persistent storage file path for seamless zero-loss article persistence
const ARTICLES_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'articles.json');

function savePersistedArticles(articles: Article[]) {
  try {
    const dir = path.dirname(ARTICLES_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ARTICLES_FILE_PATH, JSON.stringify(articles, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving persisted articles:', err);
  }
}

function loadPersistedArticles(): Article[] {
  try {
    if (fs.existsSync(ARTICLES_FILE_PATH)) {
      const content = fs.readFileSync(ARTICLES_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } else {
      // First run: save initialArticles to disk
      savePersistedArticles(initialArticles);
      return [...initialArticles];
    }
  } catch (err) {
    console.error('Error loading persisted articles:', err);
  }
  return [...initialArticles];
}

function saveBase64Image(dataUri?: string, prefix: string = 'img'): string {
  try {
    if (!dataUri || !dataUri.startsWith('data:image/')) {
      return dataUri || '';
    }
    const matches = dataUri.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) return dataUri;

    const ext = matches[1].toLowerCase() === 'jpeg' ? '.jpg' : `.${matches[1].toLowerCase()}`;
    const buffer = Buffer.from(matches[2], 'base64');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}${ext}`;
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Error saving base64 image to disk:', err);
    return dataUri || '';
  }
}

// Local cache/store for zero-config seamless runtime
let inMemoryArticles: Article[] = loadPersistedArticles();
let inMemoryCategories: Category[] = [...initialCategories];
let cachedDbCategories: Category[] = [];
let inMemoryAuthors: Profile[] = [...initialAuthors];
let inMemorySettings: SiteSettings = { ...initialSiteSettings };
let inMemorySubscribers: NewsletterSubscriber[] = [
  { id: 'sub-1', email: 'reader1@example.com', is_active: true, subscribed_at: new Date().toISOString() },
  { id: 'sub-2', email: 'reader2@example.com', is_active: true, subscribed_at: new Date().toISOString() },
];
let inMemoryComments: Comment[] = [...initialComments];
let inMemoryPolls: Record<string, ArticlePoll> = { ...initialPolls };

/**
 * Universal Category Resolver:
 * Reliably maps any identifier (Supabase UUID, standard ID like 'cat-1',
 * slug like 'tunisia', or legacy prefix like 'cat-culture') to the full Category object.
 */
export function resolveCategory(catIdentifier?: string): Category | undefined {
  if (!catIdentifier) return undefined;

  // 1. Direct match on id in initialCategories
  let match = initialCategories.find(c => c.id === catIdentifier);
  if (match) return match;

  // 2. Direct match on slug
  match = initialCategories.find(c => c.slug === catIdentifier);
  if (match) return match;

  // 3. Match 'cat-' + slug (e.g. 'cat-culture' -> 'culture', 'cat-sports' -> 'sports')
  if (catIdentifier.startsWith('cat-')) {
    const slugFromId = catIdentifier.substring(4);
    match = initialCategories.find(c => c.slug === slugFromId);
    if (match) return match;
  }

  // 4. Match in cached Supabase DB categories (by UUID id or slug)
  if (cachedDbCategories && cachedDbCategories.length > 0) {
    const dbMatch = cachedDbCategories.find(c => c.id === catIdentifier || c.slug === catIdentifier);
    if (dbMatch) {
      const official = initialCategories.find(c => c.slug === dbMatch.slug);
      return official ? { ...official, id: dbMatch.id } : dbMatch;
    }
  }

  // 5. Match in dynamic inMemoryCategories
  match = inMemoryCategories.find(c => c.id === catIdentifier || c.slug === catIdentifier || (catIdentifier.startsWith('cat-') && c.slug === catIdentifier.substring(4)));
  if (match) return match;

  return undefined;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
      if (!error && data) return data;
    } catch {
      // Fall through to memory
    }
  }
  return inMemorySettings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  inMemorySettings = { ...inMemorySettings, ...settings, updated_at: new Date().toISOString() };
  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('site_settings').upsert(inMemorySettings);
    } catch {
      // ignore
    }
  }
  return inMemorySettings;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  let dbCategories: Category[] = [];
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('order_index', { ascending: true });
      if (!error && data && data.length > 0) {
        dbCategories = data;
        cachedDbCategories = data;
      }
    } catch {
      // ignore
    }
  }

  // If no DB categories, return all 10 official categories
  if (dbCategories.length === 0) {
    return inMemoryCategories.map(cat => ({
      ...cat,
      article_count: inMemoryArticles.filter(a => {
        const aCat = resolveCategory(a.category_id) || a.category;
        return (aCat?.id === cat.id || aCat?.slug === cat.slug || a.category_id === cat.id || a.category?.slug === cat.slug) && a.status === 'published';
      }).length,
    }));
  }

  // Ensure all 10 official categories are present even if Supabase DB had older seeds
  return initialCategories.map(officialCat => {
    const existing = dbCategories.find(c => c.slug === officialCat.slug);
    const id = existing ? existing.id : officialCat.id;
    return {
      ...officialCat,
      id,
      name: officialCat.name,
      icon: officialCat.icon || existing?.icon,
      order_index: officialCat.order_index,
      article_count: inMemoryArticles.filter(a => {
        const aCat = resolveCategory(a.category_id) || a.category;
        return (aCat?.id === id || aCat?.slug === officialCat.slug || a.category_id === id || a.category_id === officialCat.id || a.category?.slug === officialCat.slug) && a.status === 'published';
      }).length,
    };
  });
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cats = await getCategories();
  return cats.find(c => c.slug === slug) || initialCategories.find(c => c.slug === slug) || resolveCategory(slug) || null;
}

export interface GetArticlesParams {
  categorySlug?: string;
  categoryId?: string;
  status?: 'published' | 'draft' | 'all';
  search?: string;
  limit?: number;
  offset?: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
  sortBy?: 'latest' | 'views' | 'trending';
}

export async function getArticles(params: GetArticlesParams = {}): Promise<{ articles: Article[]; total: number }> {
  const {
    categorySlug,
    categoryId,
    status = 'published',
    search,
    limit = 20,
    offset = 0,
    isFeatured,
    isBreaking,
    sortBy = 'latest',
  } = params;

  inMemoryArticles = loadPersistedArticles();
  let baseArticles = [...inMemoryArticles];

  // Try fetching articles from Supabase if connected
  const supabase = getAdminSupabaseClient() || createClient();
  if (supabase) {
    try {
      const { data: dbArticles, error: dbErr } = await supabase.from('articles').select('*');
      if (!dbErr && dbArticles && dbArticles.length > 0) {
        const dbMapped: Article[] = dbArticles.map((da: any) => {
          const resolvedCat = resolveCategory(da.category_id);
          return {
            id: da.id,
            title: da.title,
            slug: da.slug,
            excerpt: da.excerpt || '',
            content: da.content || '',
            featured_image: da.featured_image,
            category_id: da.category_id,
            category: resolvedCat,
            author_id: da.author_id,
            author: inMemoryAuthors[0],
            status: da.status,
            is_featured: !!da.is_featured,
            is_breaking: !!da.is_breaking,
            views_count: Number(da.views_count) || 0,
            meta_title: da.meta_title || da.title,
            meta_description: da.meta_description || da.excerpt,
            video_url: da.video_url || '',
            published_at: da.published_at,
            created_at: da.created_at,
            updated_at: da.updated_at,
          };
        });

        const mergedSlugs = new Set(dbMapped.map(a => a.slug));
        baseArticles = [...dbMapped, ...baseArticles.filter(a => !mergedSlugs.has(a.slug))];
      }
    } catch {}
  }

  let filtered = baseArticles;

  if (status !== 'all') {
    filtered = filtered.filter(a => a.status === status);
  }

  if (categoryId) {
    const targetCat = resolveCategory(categoryId);
    filtered = filtered.filter(a => {
      if (a.category_id === categoryId) return true;
      const aCat = resolveCategory(a.category_id) || a.category;
      if (targetCat && aCat && aCat.slug === targetCat.slug) return true;
      return false;
    });
  } else if (categorySlug) {
    filtered = filtered.filter(a => {
      const aCat = resolveCategory(a.category_id) || a.category;
      return aCat?.slug === categorySlug;
    });
  }

  if (isFeatured !== undefined) {
    filtered = filtered.filter(a => a.is_featured === isFeatured);
  }

  if (isBreaking !== undefined) {
    filtered = filtered.filter(a => a.is_breaking === isBreaking);
  }

  if (search && search.trim() !== '') {
    const query = search.trim().toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(query) ||
      a.excerpt.toLowerCase().includes(query) ||
      a.content.toLowerCase().includes(query)
    );
  }

  // Sorting
  if (sortBy === 'views' || sortBy === 'trending') {
    filtered.sort((a, b) => b.views_count - a.views_count);
  } else {
    filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  // Populate category and author
  const articles = paginated.map(art => {
    const resolvedCat = resolveCategory(art.category_id) || art.category;
    return {
      ...art,
      category: resolvedCat,
      author: inMemoryAuthors.find(au => au.id === art.author_id) || art.author,
    };
  });

  return { articles, total };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const currentArticles = loadPersistedArticles();
  let art = currentArticles.find(a => a.slug === slug || a.id === slug);

  const supabase = getAdminSupabaseClient() || createClient();
  if (supabase) {
    try {
      const { data: dbArt } = await supabase
        .from('articles')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .limit(1)
        .maybeSingle();

      if (dbArt) {
        art = {
          id: dbArt.id,
          title: dbArt.title,
          slug: dbArt.slug,
          excerpt: dbArt.excerpt || '',
          content: dbArt.content || '',
          featured_image: dbArt.featured_image,
          category_id: dbArt.category_id,
          category: resolveCategory(dbArt.category_id),
          author_id: dbArt.author_id,
          author: inMemoryAuthors[0],
          status: dbArt.status,
          is_featured: !!dbArt.is_featured,
          is_breaking: !!dbArt.is_breaking,
          views_count: Number(dbArt.views_count) || 0,
          meta_title: dbArt.meta_title || dbArt.title,
          meta_description: dbArt.meta_description || dbArt.excerpt,
          video_url: dbArt.video_url || '',
          published_at: dbArt.published_at,
          created_at: dbArt.created_at,
          updated_at: dbArt.updated_at,
        };
      }
    } catch {}
  }

  if (!art) return null;

  return {
    ...art,
    category: resolveCategory(art.category_id) || art.category,
    author: inMemoryAuthors.find(au => au.id === art.author_id) || art.author,
  };
}

export async function incrementArticleViews(id: string): Promise<number> {
  inMemoryArticles = loadPersistedArticles();
  const index = inMemoryArticles.findIndex(a => a.id === id || a.slug === id);
  if (index !== -1) {
    inMemoryArticles[index].views_count += 1;
    savePersistedArticles(inMemoryArticles);
    return inMemoryArticles[index].views_count;
  }
  return 0;
}

export async function getBreakingNews(): Promise<Article[]> {
  const { articles } = await getArticles({ isBreaking: true, limit: 5 });
  return articles;
}

export async function getFeaturedHero(): Promise<{ main: Article | null; secondary: Article[] }> {
  const { articles: featured } = await getArticles({ isFeatured: true, limit: 5 });
  const { articles: latest } = await getArticles({ limit: 5 });

  if (featured.length === 0) {
    return {
      main: latest[0] || null,
      secondary: latest.slice(1, 5),
    };
  }

  // If the newest article in the system is newer than the featured article, prioritize it or use featured
  return {
    main: featured[0],
    secondary: featured.slice(1, 5).concat(latest.filter(l => l.id !== featured[0].id)).slice(0, 4),
  };
}

export async function getTrendingArticles(limit: number = 6): Promise<Article[]> {
  const { articles } = await getArticles({ sortBy: 'views', limit });
  return articles;
}

export async function getVideoArticles(limit: number = 4): Promise<Article[]> {
  const currentArticles = loadPersistedArticles();
  const filtered = currentArticles.filter(a => a.video_url && a.video_url.length > 0 && a.status === 'published');
  return filtered.slice(0, limit).map(art => ({
    ...art,
    category: resolveCategory(art.category_id) || art.category,
    author: inMemoryAuthors.find(au => au.id === art.author_id) || art.author,
  }));
}

export async function getRelatedArticles(articleId: string, categoryId: string, limit: number = 4): Promise<Article[]> {
  const { articles } = await getArticles({ categoryId, limit: limit + 1 });
  return articles.filter(a => a.id !== articleId).slice(0, limit);
}

// ==========================================
// ADMIN CRUD & MANAGEMENT
// ==========================================

export async function createArticle(data: Partial<Article>): Promise<Article> {
  inMemoryArticles = loadPersistedArticles();

  let resolvedAuthor = data.author;
  let resolvedAuthorId = data.author_id || (inMemoryAuthors[0] ? inMemoryAuthors[0].id : undefined);

  if (data.author && data.author.full_name) {
    if (data.author.avatar_url) {
      data.author.avatar_url = saveBase64Image(data.author.avatar_url, 'author');
    }
    const existing = inMemoryAuthors.find(a => a.full_name === data.author?.full_name || a.id === data.author_id);
    if (existing) {
      if (data.author.avatar_url) existing.avatar_url = data.author.avatar_url;
      resolvedAuthorId = existing.id;
      resolvedAuthor = existing;
    } else {
      const newAuthor: Profile = {
        id: `author-${Date.now()}`,
        email: `${Date.now()}@sada.tn`,
        full_name: data.author.full_name,
        avatar_url: data.author.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        role: 'journalist',
        created_at: new Date().toISOString()
      };
      inMemoryAuthors.push(newAuthor);
      resolvedAuthorId = newAuthor.id;
      resolvedAuthor = newAuthor;
    }
  }

  const savedFeaturedImage = saveBase64Image(data.featured_image, 'cover') || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80';
  const resolvedCategory = resolveCategory(data.category_id) || initialCategories[0];
  const finalCategoryId = resolvedCategory?.id || data.category_id || initialCategories[0].id;

  const newArticle: Article = {
    id: `art-${Date.now()}`,
    title: data.title || 'بدون عنوان',
    slug: data.slug || `article-${Date.now()}`,
    excerpt: data.excerpt || '',
    content: data.content || '',
    featured_image: savedFeaturedImage,
    category_id: finalCategoryId,
    category: resolvedCategory,
    author_id: resolvedAuthorId,
    author: resolvedAuthor,
    status: (data.status as any) || 'published', // Always default to published so it appears immediately!
    is_featured: !!data.is_featured,
    is_breaking: !!data.is_breaking,
    views_count: 0,
    meta_title: data.meta_title || data.title,
    meta_description: data.meta_description || data.excerpt,
    video_url: data.video_url || '',
    published_at: data.published_at || new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  inMemoryArticles.unshift(newArticle);
  savePersistedArticles(inMemoryArticles);

  // Sync with Supabase if available
  const supabase = getAdminSupabaseClient() || createClient();
  if (supabase) {
    try {
      let supabaseCatId: string | undefined = undefined;
      if (cachedDbCategories && cachedDbCategories.length > 0) {
        const found = cachedDbCategories.find(c => c.id === newArticle.category_id || c.slug === resolvedCategory?.slug);
        if (found) supabaseCatId = found.id;
      }
      if (!supabaseCatId) {
        const { data: dbCats } = await supabase.from('categories').select('id, slug');
        if (dbCats && dbCats.length > 0) {
          cachedDbCategories = dbCats as any;
          const found = dbCats.find(c => c.id === newArticle.category_id || c.slug === resolvedCategory?.slug);
          if (found) supabaseCatId = found.id;
        }
      }

      if (supabaseCatId) {
        const { data: inserted, error: insertError } = await supabase.from('articles').upsert({
          title: newArticle.title,
          slug: newArticle.slug,
          excerpt: newArticle.excerpt,
          content: newArticle.content,
          featured_image: newArticle.featured_image,
          category_id: supabaseCatId,
          status: newArticle.status,
          is_featured: newArticle.is_featured,
          is_breaking: newArticle.is_breaking,
          views_count: newArticle.views_count || 0,
          meta_title: newArticle.meta_title,
          meta_description: newArticle.meta_description,
          video_url: newArticle.video_url,
          published_at: newArticle.published_at,
        }, { onConflict: 'slug' }).select('id');

        if (insertError) {
          console.error('[Supabase Sync] Article insert error:', insertError.message, insertError.code);
        } else {
          console.log('[Supabase Sync] Article synced successfully to Supabase!');
        }
      } else {
        console.warn('[Supabase Sync] Could not match Supabase category UUID for slug:', resolvedCategory?.slug);
      }
    } catch (err: any) {
      console.error('[Supabase Sync] Exception during article sync:', err?.message || err);
    }
  }

  return newArticle;
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<Article | null> {
  inMemoryArticles = loadPersistedArticles();
  const index = inMemoryArticles.findIndex(a => a.id === id);
  if (index === -1) return null;

  let resolvedAuthor = data.author;
  let resolvedAuthorId = data.author_id || inMemoryArticles[index].author_id;

  if (data.author && data.author.full_name) {
    const existing = inMemoryAuthors.find(a => a.full_name === data.author?.full_name || a.id === data.author_id);
    if (existing) {
      if (data.author.avatar_url) existing.avatar_url = data.author.avatar_url;
      resolvedAuthorId = existing.id;
      resolvedAuthor = existing;
    } else {
      const newAuthor: Profile = {
        id: `author-${Date.now()}`,
        email: `${Date.now()}@sada.tn`,
        full_name: data.author.full_name,
        avatar_url: data.author.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        role: 'journalist',
        created_at: new Date().toISOString()
      };
      inMemoryAuthors.push(newAuthor);
      resolvedAuthorId = newAuthor.id;
      resolvedAuthor = newAuthor;
    }
  }

  const targetCategoryId = data.category_id || inMemoryArticles[index].category_id;
  const resolvedCategory = resolveCategory(targetCategoryId) || inMemoryArticles[index].category;

  inMemoryArticles[index] = {
    ...inMemoryArticles[index],
    ...data,
    category_id: resolvedCategory?.id || targetCategoryId,
    category: resolvedCategory,
    author_id: resolvedAuthorId,
    author: resolvedAuthor || inMemoryArticles[index].author,
    updated_at: new Date().toISOString(),
  };

  savePersistedArticles(inMemoryArticles);

  // Sync update with Supabase
  const supabase = getAdminSupabaseClient() || createClient();
  if (supabase) {
    try {
      let supabaseCatId: string | undefined = undefined;
      if (resolvedCategory?.slug && cachedDbCategories.length > 0) {
        const found = cachedDbCategories.find(c => c.slug === resolvedCategory.slug);
        if (found) supabaseCatId = found.id;
      }
      const updatePayload: any = {
        title: inMemoryArticles[index].title,
        slug: inMemoryArticles[index].slug,
        excerpt: inMemoryArticles[index].excerpt,
        content: inMemoryArticles[index].content,
        featured_image: inMemoryArticles[index].featured_image,
        status: inMemoryArticles[index].status,
        is_featured: inMemoryArticles[index].is_featured,
        is_breaking: inMemoryArticles[index].is_breaking,
        meta_title: inMemoryArticles[index].meta_title,
        meta_description: inMemoryArticles[index].meta_description,
        video_url: inMemoryArticles[index].video_url,
        published_at: inMemoryArticles[index].published_at,
        updated_at: new Date().toISOString(),
      };
      if (supabaseCatId) {
        updatePayload.category_id = supabaseCatId;
      }
      const { error: updateError } = await supabase
        .from('articles')
        .update(updatePayload)
        .eq('slug', inMemoryArticles[index].slug);

      if (updateError) {
        console.error('[Supabase Sync] Update error:', updateError.message);
      }
    } catch (err) {
      console.error('[Supabase Sync] Update exception:', err);
    }
  }

  return inMemoryArticles[index];
}

export async function deleteArticle(id: string): Promise<boolean> {
  inMemoryArticles = loadPersistedArticles();
  const index = inMemoryArticles.findIndex(a => a.id === id);
  if (index === -1) return false;
  const targetSlug = inMemoryArticles[index].slug;
  inMemoryArticles.splice(index, 1);
  savePersistedArticles(inMemoryArticles);

  // Sync delete with Supabase
  const supabase = getAdminSupabaseClient() || createClient();
  if (supabase) {
    try {
      await supabase.from('articles').delete().eq('slug', targetSlug);
    } catch (err) {
      console.error('[Supabase Sync] Delete exception:', err);
    }
  }

  return true;
}

export async function createCategory(cat: { name: string; slug: string; description?: string; icon?: string }): Promise<Category> {
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    icon: cat.icon || 'Folder',
    order_index: inMemoryCategories.length + 1,
    created_at: new Date().toISOString(),
  };
  inMemoryCategories.push(newCat);
  return newCat;
}

export async function updateCategory(id: string, cat: Partial<Category>): Promise<Category | null> {
  const index = inMemoryCategories.findIndex(c => c.id === id);
  if (index === -1) return null;
  inMemoryCategories[index] = { ...inMemoryCategories[index], ...cat };
  return inMemoryCategories[index];
}

export async function deleteCategory(id: string): Promise<boolean> {
  const index = inMemoryCategories.findIndex(c => c.id === id);
  if (index === -1) return false;
  inMemoryCategories.splice(index, 1);
  return true;
}

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'يرجى إدخال بريد إلكتروني صالح.' };
  }
  const exists = inMemorySubscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { success: true, message: 'أنت مشترك بالفعل في نشرتنا البريدية!' };
  }
  inMemorySubscribers.push({
    id: `sub-${Date.now()}`,
    email,
    is_active: true,
    subscribed_at: new Date().toISOString(),
  });
  return { success: true, message: 'شكراً لاشتراكك في نشرة صدى الإخبارية!' };
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  return inMemorySubscribers;
}

export async function getUsers(): Promise<Profile[]> {
  return inMemoryAuthors;
}

export async function updateUserRole(id: string, role: Profile['role']): Promise<Profile | null> {
  const index = inMemoryAuthors.findIndex(u => u.id === id);
  if (index === -1) return null;
  inMemoryAuthors[index].role = role;
  return inMemoryAuthors[index];
}

export async function getDashboardStats() {
  const total = inMemoryArticles.length;
  const published = inMemoryArticles.filter(a => a.status === 'published').length;
  const draft = inMemoryArticles.filter(a => a.status === 'draft').length;
  const breaking = inMemoryArticles.filter(a => a.is_breaking).length;
  const totalViews = inMemoryArticles.reduce((acc, cur) => acc + (cur.views_count || 0), 0);
  const categoriesCount = inMemoryCategories.length;
  const subscribersCount = inMemorySubscribers.length;
  const commentsCount = inMemoryComments.length;

  return {
    totalArticles: total,
    publishedArticles: published,
    draftArticles: draft,
    breakingArticles: breaking,
    totalViews,
    categoriesCount,
    subscribersCount,
    commentsCount,
    recentArticles: inMemoryArticles.slice(0, 5).map(a => ({
      ...a,
      category: inMemoryCategories.find(c => c.id === a.category_id),
      author: inMemoryAuthors.find(au => au.id === a.author_id),
    })),
  };
}

// -------------------------------------------------------------
// COMMENTS FUNCTIONS
// -------------------------------------------------------------

export async function getCommentsByArticleId(articleId: string): Promise<Comment[]> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // fallback to memory
    }
  }

  return inMemoryComments
    .filter(c => c.article_id === articleId && c.is_approved)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function addComment(commentData: {
  article_id: string;
  user_name: string;
  user_email?: string;
  content: string;
}): Promise<Comment> {
  const newComment: Comment = {
    id: `com-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    article_id: commentData.article_id,
    user_name: commentData.user_name.trim(),
    user_email: (commentData.user_email || 'visitor@sada.tn').trim(),
    content: commentData.content.trim(),
    is_approved: true,
    likes_count: 0,
    created_at: new Date().toISOString(),
  };

  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          article_id: newComment.article_id,
          user_name: newComment.user_name,
          user_email: newComment.user_email,
          content: newComment.content,
          is_approved: true,
        })
        .select('*')
        .single();
      if (!error && data) {
        inMemoryComments.unshift(data);
        return data;
      }
    } catch {
      // fallback
    }
  }

  inMemoryComments.unshift(newComment);
  return newComment;
}

export async function likeComment(commentId: string): Promise<number> {
  const comment = inMemoryComments.find(c => c.id === commentId);
  if (comment) {
    comment.likes_count = (comment.likes_count || 0) + 1;
    return comment.likes_count;
  }
  return 1;
}

// -------------------------------------------------------------
// POLL / SONDAGE FUNCTIONS
// -------------------------------------------------------------

export async function getArticlePoll(articleId: string): Promise<ArticlePoll> {
  if (inMemoryPolls[articleId]) {
    return inMemoryPolls[articleId];
  }

  const article = inMemoryArticles.find(a => a.id === articleId);
  const articleTitle = article?.title ? `«${article.title.substring(0, 50)}...»` : 'هذا المقال';

  const defaultPoll: ArticlePoll = {
    id: `poll-${articleId}`,
    article_id: articleId,
    question: `ما هو تقييمك ورأيك في مضمون ${articleTitle}؟`,
    options: [
      { id: 'opt-1', text: 'مفيد جداً ومقنع بالمعلومات والحقائق', votes: 19 },
      { id: 'opt-2', text: 'طرح متوازن وموضوعي إلى حد كبير', votes: 14 },
      { id: 'opt-3', text: 'يحتاج لمزيد من الدقة والتحليل المعمق', votes: 6 },
      { id: 'opt-4', text: 'لا أتفق مع زاوية التناول أو النتائج', votes: 3 },
    ],
    total_votes: 42,
  };

  inMemoryPolls[articleId] = defaultPoll;
  return defaultPoll;
}

export async function voteArticlePoll(articleId: string, optionId: string): Promise<ArticlePoll> {
  let poll = inMemoryPolls[articleId];
  if (!poll) {
    poll = await getArticlePoll(articleId);
  }

  const option = poll.options.find(o => o.id === optionId);
  if (option) {
    option.votes += 1;
    poll.total_votes += 1;
  }

  return { ...poll, options: [...poll.options.map(o => ({ ...o }))] };
}
