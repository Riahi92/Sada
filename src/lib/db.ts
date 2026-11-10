import { Article, Category, Profile, SiteSettings, NewsletterSubscriber, Comment, ArticlePoll } from '@/types/database';
import { initialArticles, initialCategories, initialAuthors, initialSiteSettings, initialComments, initialPolls } from './initialData';
import { createClient } from './supabase/client';
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

// Local cache/store for zero-config seamless runtime
let inMemoryArticles: Article[] = loadPersistedArticles();
let inMemoryCategories: Category[] = [...initialCategories];
let inMemoryAuthors: Profile[] = [...initialAuthors];
let inMemorySettings: SiteSettings = { ...initialSiteSettings };
let inMemorySubscribers: NewsletterSubscriber[] = [
  { id: 'sub-1', email: 'reader1@example.com', is_active: true, subscribed_at: new Date().toISOString() },
  { id: 'sub-2', email: 'reader2@example.com', is_active: true, subscribed_at: new Date().toISOString() },
];
let inMemoryComments: Comment[] = [...initialComments];
let inMemoryPolls: Record<string, ArticlePoll> = { ...initialPolls };

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
      }
    } catch {
      // ignore
    }
  }

  // If no DB categories, return all 10 official categories
  if (dbCategories.length === 0) {
    return inMemoryCategories.map(cat => ({
      ...cat,
      article_count: inMemoryArticles.filter(a => (a.category_id === cat.id || a.category?.slug === cat.slug) && a.status === 'published').length,
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
      article_count: inMemoryArticles.filter(a => (a.category_id === id || a.category_id === officialCat.id || a.category?.slug === officialCat.slug) && a.status === 'published').length,
    };
  });
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cats = await getCategories();
  return cats.find(c => c.slug === slug) || initialCategories.find(c => c.slug === slug) || null;
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
  let filtered = [...inMemoryArticles];

  if (status !== 'all') {
    filtered = filtered.filter(a => a.status === status);
  }

  if (categoryId) {
    filtered = filtered.filter(a => a.category_id === categoryId);
  } else if (categorySlug) {
    const cat = inMemoryCategories.find(c => c.slug === categorySlug) || initialCategories.find(c => c.slug === categorySlug);
    if (cat) {
      filtered = filtered.filter(a => a.category_id === cat.id || a.category?.slug === categorySlug);
    }
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
  const articles = paginated.map(art => ({
    ...art,
    category: inMemoryCategories.find(c => c.id === art.category_id) || initialCategories.find(c => c.id === art.category_id || c.slug === art.category?.slug) || art.category,
    author: inMemoryAuthors.find(au => au.id === art.author_id) || art.author,
  }));

  return { articles, total };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const currentArticles = loadPersistedArticles();
  const art = currentArticles.find(a => a.slug === slug || a.id === slug);
  if (!art) return null;

  return {
    ...art,
    category: inMemoryCategories.find(c => c.id === art.category_id) || art.category,
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
    category: inMemoryCategories.find(c => c.id === art.category_id),
    author: inMemoryAuthors.find(au => au.id === art.author_id),
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

  const newArticle: Article = {
    id: `art-${Date.now()}`,
    title: data.title || 'بدون عنوان',
    slug: data.slug || `article-${Date.now()}`,
    excerpt: data.excerpt || '',
    content: data.content || '',
    featured_image: data.featured_image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
    category_id: data.category_id || inMemoryCategories[0].id,
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
  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('articles').insert({
        id: newArticle.id,
        title: newArticle.title,
        slug: newArticle.slug,
        excerpt: newArticle.excerpt,
        content: newArticle.content,
        featured_image: newArticle.featured_image,
        category_id: newArticle.category_id,
        author_id: newArticle.author_id,
        status: newArticle.status,
        is_featured: newArticle.is_featured,
        is_breaking: newArticle.is_breaking,
        views_count: 0,
        meta_title: newArticle.meta_title,
        meta_description: newArticle.meta_description,
        video_url: newArticle.video_url,
        published_at: newArticle.published_at,
      });
    } catch {}
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

  inMemoryArticles[index] = {
    ...inMemoryArticles[index],
    ...data,
    author_id: resolvedAuthorId,
    author: resolvedAuthor || inMemoryArticles[index].author,
    updated_at: new Date().toISOString(),
  };

  savePersistedArticles(inMemoryArticles);

  return inMemoryArticles[index];
}

export async function deleteArticle(id: string): Promise<boolean> {
  inMemoryArticles = loadPersistedArticles();
  const index = inMemoryArticles.findIndex(a => a.id === id);
  if (index === -1) return false;
  inMemoryArticles.splice(index, 1);
  savePersistedArticles(inMemoryArticles);
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
