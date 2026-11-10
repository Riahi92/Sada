import { NextRequest, NextResponse } from 'next/server';

let mediaLibrary = [
  {
    id: "med-1",
    name: "استراتيجية التحول الرقمي.jpg",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    size: "1.4 MB",
    created_at: "2026-11-01T08:00:00Z"
  },
  {
    id: "med-2",
    name: "قمة المناخ والطاقة.jpg",
    url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80",
    size: "2.1 MB",
    created_at: "2026-11-01T07:30:00Z"
  },
  {
    id: "med-3",
    name: "صادرات زيت الزيتون التونسي.jpg",
    url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&auto=format&fit=crop&q=80",
    size: "1.8 MB",
    created_at: "2026-11-01T06:00:00Z"
  },
  {
    id: "med-4",
    name: "منتخب نسور قرطاج.jpg",
    url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
    size: "3.2 MB",
    created_at: "2026-11-01T10:00:00Z"
  },
  {
    id: "med-5",
    name: "مهرجان قرطاج الدولي.jpg",
    url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80",
    size: "2.4 MB",
    created_at: "2026-10-31T11:00:00Z"
  },
  {
    id: "med-6",
    name: "معالجات الذكاء الاصطناعي.jpg",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
    size: "1.9 MB",
    created_at: "2026-10-31T15:00:00Z"
  }
];

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET() {
  return NextResponse.json(mediaLibrary);
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    // Support multipart form-data upload from PC
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'لم يتم تحديد أي ملف' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      const originalName = file.name || 'image.jpg';
      const ext = path.extname(originalName) || '.jpg';
      const safeBaseName = path.basename(originalName, ext).replace(/[^\w\d-]/g, '_').slice(0, 30);
      const filename = `sada_${Date.now()}_${safeBaseName}${ext}`;
      await writeFile(path.join(uploadsDir, filename), buffer);

      const fileUrl = `/uploads/${filename}`;
      const fileSizeFormatted = file.size > 1024 * 1024 
        ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        : (file.size / 1024).toFixed(0) + ' KB';

      const newMedia = {
        id: `med-${Date.now()}`,
        name: originalName,
        url: fileUrl,
        size: fileSizeFormatted,
        created_at: new Date().toISOString()
      };
      mediaLibrary.unshift(newMedia);
      return NextResponse.json(newMedia, { status: 201 });
    }

    const body = await request.json();
    const newMedia = {
      id: `med-${Date.now()}`,
      name: body.name || `image-${Date.now()}.jpg`,
      url: body.url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80",
      size: body.size || "1.2 MB",
      created_at: new Date().toISOString()
    };
    mediaLibrary.unshift(newMedia);
    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل رفع الملف' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    mediaLibrary = mediaLibrary.filter(m => m.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل حذف الملف' }, { status: 500 });
  }
}
