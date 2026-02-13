"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "@/components/Icons";
import VerifiedBadge from "@/components/VerifiedBadge";

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
    };
}

export default function ItineraryCard({ itinerary }: ItineraryCardProps) {
    const slug = itinerary.slug || itinerary.id;

    return (
        <Link
            href={`/itinerary/${slug}`}
            className="glass card card-hover"
            style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}
        >
            <div style={{
                position: 'relative',
                height: '240px',
                width: '100%'
            }}>
                <Image
                    src={itinerary.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800"}
                    alt={itinerary.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 350px"
                />
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
                    ₹{itinerary.price.toFixed(2)}
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
                        <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                            View Details →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
