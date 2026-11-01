import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/db';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'اسم القسم والرابط التعريفي مطلوبان' }, { status: 400 });
    }
    const created = await createCategory(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل إضافة القسم' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'معرف القسم مطلوب' }, { status: 400 });
    }
    const updated = await updateCategory(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'القسم غير موجود' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'فشل تعديل القسم' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'معرف القسم مطلوب' }, { status: 400 });
    }
    const success = await deleteCategory(id);
    if (!success) {
      return NextResponse.json({ error: 'القسم غير موجود' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'تم حذف القسم بنجاح' });
  } catch (error) {
    return NextResponse.json({ error: 'فشل حذف القسم' }, { status: 500 });
  }
}
