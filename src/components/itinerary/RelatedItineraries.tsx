"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ArrowRight } from "@/components/Icons";
import { createClient } from "@/lib/supabase/client";

interface RelatedItinerariesProps {
    itineraryId: string;
    location: string;
    creatorId: string;
}

export default function RelatedItineraries({ itineraryId, location, creatorId }: RelatedItinerariesProps) {
    const [related, setRelated] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchRelated() {
            try {
                // Fetch itineraries in the same location or from same creator
                const { data, error } = await supabase
                    .from('itineraries')
                    .select(`
                        id,
                        title,
                        slug,
                        location,
                        price,
                        average_rating,
                        review_count,
                        profiles:creator_id (
                            full_name
                        )
                    `)
                    .neq('id', itineraryId)
                    .eq('is_approved', true) // Only approved ones
                    .or(`location.ilike.%${location}%,creator_id.eq.${creatorId}`)
                    .limit(3);

                if (data) setRelated(data);
            } catch (error) {
                console.error("Error fetching related itineraries:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchRelated();
    }, [itineraryId, location, creatorId]);

    if (isLoading || related.length === 0) return null;

    return (
        <section style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Explore Similar Adventures</h2>
                    <p style={{ color: 'var(--gray-400)' }}>Hand-picked travel guides to keep your journey going.</p>
                </div>
                <Link href="/explore" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    View All <ArrowRight size={18} />
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                {related.map((item) => (
                    <Link
                        key={item.id}
                        href={`/itinerary/${item.slug || item.id}`}
                        className="glass card"
                        style={{
                            padding: 0,
                            overflow: 'hidden',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ height: '220px', position: 'relative', width: '100%' }}>
                            <Image
                                src={item.image_url || `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800`}
                                alt={item.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '8px', color: 'white', fontWeight: 700 }}>
                                ₹{item.price}
                            </div>
                        </div>
                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px' }}>
                                <MapPin size={14} /> {item.location}
                            </div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontWeight: 700, color: 'var(--foreground)' }}>{item.title}</h3>
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>by @{item.profiles?.full_name}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Star size={14} color="#fbbf24" fill="#fbbf24" />
                                    <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{item.average_rating?.toFixed(1) || '0.0'}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
