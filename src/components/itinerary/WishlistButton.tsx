"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";

interface WishlistButtonProps {
    itineraryId: string;
}

export default function WishlistButton({ itineraryId }: WishlistButtonProps) {
    const { data: session } = useSession();
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetchWishlistStatus();
        } else {
            setIsLoading(false);
        }
    }, [session, itineraryId]);

    const fetchWishlistStatus = async () => {
        try {
            const res = await fetch('/api/wishlist');
            if (res.ok) {
                const savedItineraries = await res.json();
                const saved = savedItineraries.some((item: any) => item.id === itineraryId);
                setIsSaved(saved);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSave = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to the itinerary page when clicking the heart
        e.stopPropagation();

        if (!session) {
            alert("Please log in to save itineraries.");
            return;
        }

        const action = isSaved ? 'unsave' : 'save';

        // Optimistic UI update
        setIsSaved(!isSaved);

        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itinerary_id: itineraryId, action })
            });

            if (!res.ok) {
                // Revert on failure
                setIsSaved(isSaved);
            }
        } catch (error) {
            console.error(`Failed to ${action} itinerary:`, error);
            // Revert on failure
            setIsSaved(isSaved);
        }
    };

    if (isLoading) {
        return <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(15, 23, 42, 0.4)' }}></div>;
    }

    return (
        <button
            onClick={toggleSave}
            title={isSaved ? "Remove from Saved" : "Save for Later"}
            style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: isSaved ? '#f43f5e' : 'white'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            <Heart
                size={18}
                fill={isSaved ? '#f43f5e' : 'none'}
                strokeWidth={isSaved ? 0 : 2}
            />
        </button>
    );
}
