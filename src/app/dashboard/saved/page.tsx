"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ItineraryCard from "@/components/ItineraryCard";
import { Heart, Search } from "lucide-react";

export default function SavedItinerariesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [savedItineraries, setSavedItineraries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchSavedItineraries();
        }
    }, [status, router]);

    const fetchSavedItineraries = async () => {
        try {
            const res = await fetch('/api/wishlist');
            if (res.ok) {
                const data = await res.json();
                setSavedItineraries(data);
            } else {
                console.error("Failed to fetch saved itineraries");
            }
        } catch (error) {
            console.error("Error fetching saved itineraries:", error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="container" style={{ padding: '40px 0', minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading Saved Itineraries...</div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <header style={{ marginBottom: '48px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                    Saved Itineraries
                </h1>
                <p style={{ color: 'var(--gray-400)', fontSize: '1.1rem' }}>
                    Trips you've bookmarked for later. ({savedItineraries.length})
                </p>
            </header>

            {savedItineraries.length === 0 ? (
                <div className="glass card" style={{ padding: '64px 32px', textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(244, 63, 94, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px auto'
                    }}>
                        <Heart size={40} color="#f43f5e" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>No saved itineraries yet</h3>
                    <p style={{ color: 'var(--gray-400)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px auto' }}>
                        When you see an itinerary you like, click the heart icon to save it here for easy access later.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => router.push('/explore')}
                        style={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                        <Search size={18} style={{ marginRight: '8px' }} />
                        Explore Itineraries
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {savedItineraries.map((itinerary) => (
                        <ItineraryCard key={itinerary.id} itinerary={itinerary} />
                    ))}
                </div>
            )}
        </div>
    );
}
