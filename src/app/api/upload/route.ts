import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // 1. Handle JSON Base64 Upload
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const base64Data = body.image || body.data;
      if (!base64Data) {
        return NextResponse.json({ error: 'لم يتم إرسال بيانات الصورة' }, { status: 400 });
      }

      // Format: data:image/jpeg;base64,...
      const matches = base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      let ext = '.jpg';
      let buffer: Buffer;

      if (matches) {
        const type = matches[1].toLowerCase();
        ext = type === 'jpeg' ? '.jpg' : `.${type}`;
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(base64Data, 'base64');
      }

      const safeBaseName = (body.name || 'image').replace(/[^\w\d-]/g, '_').slice(0, 30);
      const filename = `sada_${Date.now()}_${safeBaseName}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      await writeFile(filePath, buffer);
      const fileUrl = `/uploads/${filename}`;

      return NextResponse.json({
        success: true,
        url: fileUrl,
        name: body.name || filename,
        size: `${(buffer.length / 1024).toFixed(0)} KB`,
      });
    }

    // 2. Handle Multipart Form-Data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'لم يتم تحديد أي ملف للرفع' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || 'image.jpg';
    let ext = path.extname(originalName) || '.jpg';
    if (!ext || ext.length < 2) ext = '.jpg';

    const safeBaseName = path.basename(originalName, ext).replace(/[^\w\d-]/g, '_').slice(0, 30) || 'upload';
    const filename = `sada_${Date.now()}_${safeBaseName}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;
    const fileSizeFormatted = file.size > 1024 * 1024 
      ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      : (file.size / 1024).toFixed(0) + ' KB';

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: originalName,
      size: fileSizeFormatted,
    });
  } catch (error: any) {
    console.error('Upload route error:', error);
    return NextResponse.json({ 
      error: error?.message || 'حدث خطأ أثناء حفظ الملف على الخادم' 
    }, { status: 500 });
  }
}
