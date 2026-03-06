"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "@/components/Icons";
import VerifiedBadge from "@/components/VerifiedBadge";
import WishlistButton from "@/components/itinerary/WishlistButton";

interface ItineraryCardProps {
    itinerary: {
        id: string;
        slug?: string;
        title: string;
        creator: string;
        location: string;
        price: number;
        average_rating: number;
        review_count: number;
        image: string;
        tags: string[];
        is_verified?: boolean;
        duration_days?: number;
        purchase_count?: number;
    };
}

export default function ItineraryCard({ itinerary }: ItineraryCardProps) {
    const slug = itinerary.slug || itinerary.id || "";

    return (
        <Link
            href={`/itinerary/${slug}`}
            prefetch={true}
            className="glass card card-hover"
            style={{
                padding: '0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                textDecoration: 'none',
                cursor: 'pointer'
            }}
        >
            <div style={{
                position: 'relative',
                height: '240px',
                width: '100%',
                overflow: 'hidden'
            }} className="card-image-container">
                <Image
                    src={itinerary.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34"}
                    alt={itinerary.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    className="card-image"
                    priority={false} // Only load when near viewport
                />

                {/* Premium Overlay on Hover */}
                <div className="card-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: 5
                }}>
                    <span style={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        padding: '10px 20px',
                        borderRadius: '99px',
                        background: 'var(--primary)',
                        transform: 'translateY(20px)',
                        transition: 'transform 0.3s ease'
                    }} className="overlay-text">
                        View Details →
                    </span>
                </div>

                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    zIndex: 10
                }}>
                    <WishlistButton itineraryId={itinerary.id} />
                </div>
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(4px)',
                    padding: '6px 14px',
                    borderRadius: '99px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'white',
                    zIndex: 2
                }}>
                    {(itinerary as any).currency === 'INR' ? '₹' : (itinerary as any).currency === 'USD' ? '$' : (itinerary as any).currency === 'EUR' ? '€' : (itinerary as any).currency || '₹'}
                    {itinerary.price.toFixed(2)}
                </div>
                {itinerary.duration_days && (
                    <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '16px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(4px)',
                        padding: '4px 12px',
                        borderRadius: '99px',
                        fontSize: '0.75rem',
                        color: 'white',
                        zIndex: 2
                    }}>
                        {itinerary.duration_days} Days
                    </div>
                )}
            </div>
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <style jsx>{`
                    .card-hover:hover .card-image {
                        transform: scale(1.1);
                    }
                    .card-hover:hover .card-overlay {
                        opacity: 1;
                    }
                    .card-hover:hover .overlay-text {
                        transform: translateY(0);
                    }
                    .card-hover {
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .card-hover:hover {
                        box-shadow: 0 0 25px rgba(255, 133, 162, 0.3);
                        border-color: var(--primary) !important;
                    }
                `}</style>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {itinerary.tags?.slice(0, 3).map((tag: string) => (
                        <span
                            key={tag}
                            className="badge"
                            style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                fontSize: '0.65rem'
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--foreground)', fontWeight: 700 }}>
                    {itinerary.title}
                </h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} />
                    {itinerary.location}
                </p>
                <div style={{ marginTop: 'auto' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        by {itinerary.creator}
                        {itinerary.is_verified && <VerifiedBadge size={14} />}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Star size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                            <span style={{ fontWeight: 600 }}>
                                {itinerary.average_rating > 0 ? itinerary.average_rating.toFixed(1) : 'New'}
                            </span>
                            {itinerary.review_count > 0 && (
                                <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                                    ({itinerary.review_count})
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {itinerary.purchase_count && itinerary.purchase_count > 0 ? (
                                <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>
                                    {itinerary.purchase_count} Purchased
                                </span>
                            ) : null}
                            <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                                View Details →
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
