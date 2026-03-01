import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using upload_stream
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'itinerarygravity',
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            // Write buffer to stream
            uploadStream.end(buffer);
        });

        const url = (result as any).secure_url;

        return NextResponse.json({ success: true, url, publicUrl: url });
    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 });
    }
}
