import { NextRequest, NextResponse } from 'next/server';
import { getArticleBySlug, updateArticle, deleteArticle } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const article = await getArticleBySlug(id);
    if (!article) {
      return NextResponse.json({ error: 'المقال غير موجود' }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'فشل جلب المقال' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateArticle(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'المقال غير موجود' }, { status: 404 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/news');
      revalidatePath(`/news/${updated.slug}`);
      revalidatePath('/admin/articles');
      if (updated.category?.slug) {
        revalidatePath(`/category/${updated.category.slug}`);
        revalidatePath(`/news?category=${updated.category.slug}`);
      }
    } catch {}

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'فشل تحديث المقال' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = await deleteArticle(id);
    if (!success) {
      return NextResponse.json({ error: 'المقال غير موجود' }, { status: 404 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/news');
      revalidatePath('/admin/articles');
    } catch {}

    return NextResponse.json({ success: true, message: 'تم حذف المقال بنجاح' });
  } catch (error) {
    return NextResponse.json({ error: 'فشل حذف المقال' }, { status: 500 });
  }
}
