import { NextRequest, NextResponse } from 'next/server';
import { incrementArticleViews } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const views = await incrementArticleViews(id);
    return NextResponse.json({ views });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
  }
}
