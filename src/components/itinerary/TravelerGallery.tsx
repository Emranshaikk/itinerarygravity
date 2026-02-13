"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Camera, Plus, MapPin } from "@/components/Icons";
import Image from "next/image";
import PhotoUploadModal from "./PhotoUploadModal";

interface TravelerPhoto {
    id: string;
    image_url: string;
    caption: string;
    created_at: string;
    profiles: {
        full_name: string;
        avatar_url: string;
    };
}

interface TravelerGalleryProps {
    itineraryId: string;
    isPurchased: boolean;
}

export default function TravelerGallery({ itineraryId, isPurchased }: TravelerGalleryProps) {
    const [photos, setPhotos] = useState<TravelerPhoto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);

    useEffect(() => {
        fetchPhotos();
    }, [itineraryId]);

    async function fetchPhotos() {
        try {
            const response = await fetch(`/api/photos?itinerary_id=${itineraryId}`);
            if (response.ok) {
                const data = await response.json();
                setPhotos(data);
            }
        } catch (error) {
            console.error("Error fetching traveler photos:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section style={{ marginBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Camera size={32} color="var(--primary)" />
                        Traveler Stories
                    </h2>
                    <p style={{ color: 'var(--gray-400)' }}>
                        Photos from people who have explored this itinerary.
                    </p>
                </div>
                {isPurchased && (
                    <button
                        className="btn btn-outline"
                        onClick={() => setShowUploadModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={18} /> Share Your Photo
                    </button>
                )}
            </div>

            {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>Loading stories...</div>
            ) : photos.length === 0 ? (
                <div className="glass card" style={{ padding: '60px', textAlign: 'center', border: '1px dashed var(--border)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📸</div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--foreground)', marginBottom: '8px' }}>No traveler photos yet</h3>
                    <p style={{ color: 'var(--gray-400)', maxWidth: '400px', margin: '0 auto' }}>
                        {isPurchased
                            ? "Been here? Be the first to share your experience with other travelers!"
                            : "Unlock this itinerary to see photos from other travelers and post your own."}
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '24px'
                }}>
                    {photos.map((photo) => (
                        <div key={photo.id} className="glass card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ height: '300px', position: 'relative' }}>
                                <Image
                                    src={photo.image_url}
                                    alt={photo.caption || "Traveler photo"}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)'
                                    }}>
                                        {photo.profiles?.avatar_url ? (
                                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                <Image
                                                    src={photo.profiles.avatar_url}
                                                    alt={photo.profiles.full_name}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                                                {photo.profiles?.full_name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{photo.profiles?.full_name || "Adventurer"}</span>
                                </div>
                                {photo.caption && (
                                    <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)', lineHeight: '1.6', fontStyle: 'italic' }}>
                                        "{photo.caption}"
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showUploadModal && (
                <PhotoUploadModal
                    itineraryId={itineraryId}
                    onClose={() => setShowUploadModal(false)}
                    onSuccess={fetchPhotos}
                />
            )}
        </section>
    );
}
