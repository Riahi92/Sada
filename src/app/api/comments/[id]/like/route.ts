import { NextRequest, NextResponse } from 'next/server';
import { likeComment } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const likes = await likeComment(id);
    return NextResponse.json({ likes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to like comment' }, { status: 500 });
  }
}
