import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      // Also check if sent as single 'file'
      const singleFile = formData.get('file') as File | null;
      if (singleFile) {
        files.push(singleFile);
      } else {
        return NextResponse.json({ error: 'No files provided' }, { status: 400 });
      }
    }

    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'devices');

    for (const file of files) {
      if (!file.name || typeof file.arrayBuffer !== 'function') continue;

      // Validate mime type
      const mime = file.type;
      if (!mime.startsWith('image/')) {
        return NextResponse.json(
          { error: `File ${file.name} is not an image.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate clean unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}_${randomStr}_${cleanName}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/devices/${filename}`);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files. Please try again.' },
      { status: 500 }
    );
  }
}
