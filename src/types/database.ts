export type UserRole = 'admin' | 'editor' | 'journalist';

export type ArticleStatus = 'published' | 'draft' | 'scheduled';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order_index?: number;
  created_at?: string;
  article_count?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: string;
  author_id?: string;
  status: ArticleStatus;
  is_featured: boolean;
  is_breaking: boolean;
  views_count: number;
  meta_title?: string;
  meta_description?: string;
  video_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  // joined relations
  category?: Category;
  author?: Profile;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleImage {
  id: string;
  article_id: string;
  image_url: string;
  caption?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  article_id: string;
  user_name: string;
  user_email: string;
  content: string;
  is_approved: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

export interface SiteSettings {
  id?: string;
  site_name: string;
  site_description: string;
  logo_url: string;
  contact_email: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
  breaking_ticker_enabled: boolean;
  updated_at?: string;
}

export interface ArticleView {
  id: string;
  article_id: string;
  viewer_ip?: string;
  user_agent?: string;
  viewed_at: string;
}
