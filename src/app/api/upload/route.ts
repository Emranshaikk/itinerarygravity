import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate a unique filename
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const uploadDir = join(process.cwd(), 'public', 'uploads');

        // Ensure directory exists
        const fs = require('fs');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const path = join(uploadDir, filename);
        await writeFile(path, buffer);

        // Files in /public/uploads are served at /uploads/...
        const url = `/uploads/${filename}`;

        return NextResponse.json({ success: true, url, publicUrl: url });
    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 });
    }
}
