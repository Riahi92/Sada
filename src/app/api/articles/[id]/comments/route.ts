import { NextRequest, NextResponse } from 'next/server';
import { getCommentsByArticleId, addComment } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const comments = await getCommentsByArticleId(id);
    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { user_name, user_email, content } = body;

    if (!user_name || !user_name.trim()) {
      return NextResponse.json({ error: 'الاسم مطلوب' }, { status: 400 });
    }
    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'نص التعليق مطلوب' }, { status: 400 });
    }

    const newComment = await addComment({
      article_id: id,
      user_name,
      user_email,
      content,
    });

    return NextResponse.json({ comment: newComment, message: 'تم إرسال تعليقك بنجاح' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في حفظ التعليق' }, { status: 500 });
  }
}
