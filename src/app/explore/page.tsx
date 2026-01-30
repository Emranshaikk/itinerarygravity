"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const MOCK_ITINERARIES = [
    {
        id: "kyoto-traditional",
        title: "Kyoto: Traditional Japan",
        creator: "@SarahTravels",
        location: "Kyoto, Japan",
        price: 15.00,
        rating: 4.9,
        reviews: 124,
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
        tags: ["Cultural", "Food", "7 Days"]
    },
    {
        id: "bali-hidden",
        title: "Bali: Hidden Gems",
        creator: "@BaliExplorer",
        location: "Ubud, Bali",
        price: 12.00,
        rating: 5.0,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
        tags: ["Nature", "Adventure", "5 Days"]
    }
];

export default function ExplorePage() {
    const [itineraries, setItineraries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        async function fetchItineraries() {
            try {
                const res = await fetch('/api/itineraries');
                const data = await res.json();

                // Combine mock + real data for a full-looking page
                // In a real app, you'd just use 'data'
                const formattedData = data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    creator: item.profiles?.full_name || "@Influencer",
                    location: item.location,
                    price: Number(item.price),
                    rating: 4.5 + (Math.random() * 0.5), // Randomized for mock effect
                    reviews: Math.floor(Math.random() * 200),
                    image: item.image_url || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
                    tags: ["Verified", "New"]
                }));

                setItineraries([...formattedData, ...MOCK_ITINERARIES]);
            } catch (error) {
                console.error("Fetch error:", error);
                setItineraries(MOCK_ITINERARIES);
            } finally {
                setIsLoading(false);
            }
        }

        fetchItineraries();
    }, []);

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            {!mounted ? null : (
                <>
                    <header style={{ marginBottom: '48px' }}>
                        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '16px' }}>Explore Itineraries</h1>
                        <p style={{ color: 'var(--gray-400)', fontSize: '1.2rem', maxWidth: '600px' }}>
                            Discover curated travel guides from the world&apos;s most influential travelers.
                        </p>
                    </header>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--gray-400)' }}>
                            Loading amazing adventures...
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '32px'
                        }}>
                            {itineraries.map((item) => (
                                <Link href={`/itinerary/${item.id}`} key={item.id} className="glass card card-hover" style={{ padding: '0', overflow: 'hidden', display: 'block' }}>
                                    <div style={{
                                        position: 'relative',
                                        height: '240px',
                                        backgroundImage: `url(${item.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            background: 'rgba(15, 23, 42, 0.8)',
                                            backdropFilter: 'blur(4px)',
                                            padding: '4px 12px',
                                            borderRadius: '99px',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            color: 'var(--white)'
                                        }}>
                                            ${item.price.toFixed(2)}
                                        </div>
                                    </div>
                                    <div style={{ padding: '24px' }}>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                            {item.tags?.map((tag: any) => (
                                                <span key={tag} className="badge" style={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '0.65rem' }}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--white)' }}>{item.title}</h3>
                                        <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '20px' }}>
                                            by {item.creator} • {item.location}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span style={{ color: '#fbbf24' }}>★</span>
                                                <span style={{ fontWeight: 600 }}>{item.rating?.toFixed(1)}</span>
                                                <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>({item.reviews} reviews)</span>
                                            </div>
                                            <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>View Details →</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
