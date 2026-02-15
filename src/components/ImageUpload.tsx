"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
    value?: string; // Current image URL
    onChange: (url: string) => void;
    bucket?: string; // Supabase storage bucket name
    folder?: string; // Folder within bucket
    label?: string;
    accept?: string;
    maxSizeMB?: number;
}

export default function ImageUpload({
    value,
    onChange,
    bucket = "itinerary-images",
    folder = "uploads",
    label = "Upload Image",
    accept = "image/*",
    maxSizeMB = 5
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const uploadFile = async (file: File) => {
        try {
            setUploading(true);
            setError(null);
            setProgress(0);

            // Validate file size
            if (file.size > maxSizeMB * 1024 * 1024) {
                throw new Error(`File size must be less than ${maxSizeMB}MB`);
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('File must be an image');
            }

            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            // Simulate progress for better UX
            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 100);

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            clearInterval(progressInterval);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            setProgress(100);
            onChange(publicUrl);

            // Reset after success
            setTimeout(() => {
                setProgress(0);
                setUploading(false);
            }, 500);

        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload image');
            setUploading(false);
            setProgress(0);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleRemove = () => {
        onChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {label && (
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)', textTransform: 'uppercase' }}>
                    {label}
                </label>
            )}

            {value ? (
                // Image Preview
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img
                        src={value}
                        alt="Uploaded"
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <button
                        onClick={handleRemove}
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(8px)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>
            ) : (
                // Upload Area
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    style={{
                        border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: '12px',
                        padding: '2rem',
                        textAlign: 'center',
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        background: dragActive ? 'var(--surface-hover)' : 'var(--surface)',
                        transition: 'all 0.2s',
                        position: 'relative'
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        disabled={uploading}
                    />

                    {uploading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                            <div style={{ width: '100%', maxWidth: '200px', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s' }} />
                            </div>
                            <p style={{ margin: 0, color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                                Uploading... {progress}%
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                            <Upload size={32} style={{ color: 'var(--gray-400)' }} />
                            <div>
                                <p style={{ margin: 0, fontWeight: '600', color: 'var(--foreground)' }}>
                                    Click to upload or drag and drop
                                </p>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--gray-400)' }}>
                                    PNG, JPG, GIF up to {maxSizeMB}MB
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#ef4444' }}>
                    {error}
                </p>
            )}
        </div>
    );
}

// Add spin animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
