import { NextRequest, NextResponse } from 'next/server';
import { subscribeNewsletter, getSubscribers } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await subscribeNewsletter(body.email);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء الاشتراك' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const subscribers = await getSubscribers();
    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json({ error: 'فشل جلب المشتركين' }, { status: 500 });
  }
}
