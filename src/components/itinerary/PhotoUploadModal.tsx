"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Camera, Upload, CheckCircle } from "@/components/Icons";

interface PhotoUploadModalProps {
    itineraryId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PhotoUploadModal({ itineraryId, onClose, onSuccess }: PhotoUploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError("");

        try {
            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${itineraryId}/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('traveler-photos')
                .upload(filePath, file);

            if (uploadError) throw new Error("Failed to upload image to storage");

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('traveler-photos')
                .getPublicUrl(filePath);

            // 3. Save to database via API
            const response = await fetch('/api/photos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itinerary_id: itineraryId,
                    image_url: publicUrl,
                    caption
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to save photo record");
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="glass card" style={{
                maxWidth: '500px',
                width: '100%',
                padding: '32px',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--foreground)' }}>Share Your Trip</h2>
                <p style={{ color: 'var(--gray-400)', marginBottom: '32px' }}>Upload a photo from your journey using this itinerary.</p>

                <form onSubmit={handleUpload}>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            width: '100%',
                            height: '250px',
                            border: '2px dashed var(--border)',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            marginBottom: '24px',
                            background: 'var(--surface)',
                            position: 'relative'
                        }}
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <>
                                <Camera size={48} color="var(--gray-600)" style={{ marginBottom: '16px' }} />
                                <p style={{ color: 'var(--gray-400)', fontWeight: 600 }}>Click to select a photo</p>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--gray-400)', fontSize: '0.9rem' }}>Caption (Optional)</label>
                        <textarea
                            className="form-input"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Tell others what you loved about this spot..."
                            maxLength={200}
                            style={{ width: '100%', minHeight: '80px' }}
                        />
                    </div>

                    {error && (
                        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="btn btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        {loading ? 'Uploading...' : <><Upload size={18} /> Post to Gallery</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
