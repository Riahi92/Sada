import { NextRequest, NextResponse } from 'next/server';
import { getArticles, createArticle } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('categorySlug') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const status = (searchParams.get('status') as 'published' | 'draft' | 'all') || 'published';
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    const isFeatured = searchParams.has('isFeatured') ? searchParams.get('isFeatured') === 'true' : undefined;
    const isBreaking = searchParams.has('isBreaking') ? searchParams.get('isBreaking') === 'true' : undefined;
    const sortBy = (searchParams.get('sortBy') as 'latest' | 'views' | 'trending') || 'latest';

    const result = await getArticles({
      categorySlug,
      categoryId,
      status,
      search,
      limit,
      offset,
      isFeatured,
      isBreaking,
      sortBy,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 });
    }
    const created = await createArticle(body);

    // Invalidate caches so the newly created article shows immediately everywhere
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/news');
      revalidatePath('/admin/articles');
      if (created.category?.slug) {
        revalidatePath(`/category/${created.category.slug}`);
      }
    } catch {}

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل إنشاء المقال' }, { status: 500 });
  }
}
