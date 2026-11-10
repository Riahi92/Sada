import { NextRequest, NextResponse } from 'next/server';
import { getArticlePoll, voteArticlePoll } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const poll = await getArticlePoll(id);
    return NextResponse.json({ poll });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch article poll' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { option_id } = body;

    if (!option_id) {
      return NextResponse.json({ error: 'خيار التصويت مطلوب' }, { status: 400 });
    }

    const updatedPoll = await voteArticlePoll(id, option_id);
    return NextResponse.json({ poll: updatedPoll, message: 'تم تسجيل تصويتك بنجاح' });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في تسجيل التصويت' }, { status: 500 });
  }
}
