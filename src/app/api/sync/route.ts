import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/client';
import { getArticles, getCategories } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient() || createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
    }

    const [categories, { articles }] = await Promise.all([
      getCategories(),
      getArticles({ status: 'all', limit: 100 }),
    ]);

    // Fetch Supabase categories UUIDs
    const { data: dbCats, error: catErr } = await supabase.from('categories').select('id, slug');
    if (catErr) {
      return NextResponse.json({ error: `Supabase categories error: ${catErr.message}` }, { status: 500 });
    }

    const catMap = new Map<string, string>();
    (dbCats || []).forEach((c: any) => catMap.set(c.slug, c.id));

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const article of articles) {
      const catSlug = article.category?.slug;
      const targetCatId = catSlug ? catMap.get(catSlug) : null;

      if (!targetCatId) {
        results.failed++;
        results.errors.push(`Category '${catSlug}' not found in Supabase for article '${article.title}'`);
        continue;
      }

      const payload = {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || '',
        content: article.content || '',
        featured_image: article.featured_image,
        category_id: targetCatId,
        status: article.status || 'published',
        is_featured: !!article.is_featured,
        is_breaking: !!article.is_breaking,
        views_count: article.views_count || 0,
        meta_title: article.meta_title || article.title,
        meta_description: article.meta_description || article.excerpt,
        video_url: article.video_url || '',
        published_at: article.published_at || new Date().toISOString(),
      };

      const { error: upsertErr } = await supabase
        .from('articles')
        .upsert(payload, { onConflict: 'slug' });

      if (upsertErr) {
        results.failed++;
        results.errors.push(`Article '${article.slug}': ${upsertErr.message}`);
      } else {
        results.success++;
      }
    }

    return NextResponse.json({
      message: `Synchronisation terminée: ${results.success} réussis, ${results.failed} échecs.`,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Erreur inconnue' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = getAdminSupabaseClient() || createClient();
    if (!supabase) {
      return NextResponse.json({ connected: false, message: 'Supabase URL/Key non configuré' });
    }

    const { data: arts, error: artErr } = await supabase.from('articles').select('id, title, slug, status, category_id');
    const { data: cats, error: catErr } = await supabase.from('categories').select('id, name, slug');

    return NextResponse.json({
      connected: true,
      articlesInSupabase: arts?.length || 0,
      articlesError: artErr ? { code: artErr.code, message: artErr.message } : null,
      categoriesInSupabase: cats?.length || 0,
      categoriesError: catErr ? { code: catErr.code, message: catErr.message } : null,
    });
  } catch (error: any) {
    return NextResponse.json({ connected: false, error: error?.message });
  }
}
