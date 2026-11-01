import { NextRequest, NextResponse } from 'next/server';
import { getUsers, updateUserRole } from '@/lib/db';

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id || !body.role) {
      return NextResponse.json({ error: 'البيانات غير مكتملة' }, { status: 400 });
    }
    const updated = await updateUserRole(body.id, body.role);
    if (!updated) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'فشل تعديل الصلاحية' }, { status: 500 });
  }
}
