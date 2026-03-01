"use client";

import { useState, useEffect } from "react";
import { Heart } from "@/components/Icons";
import { useSession } from "next-auth/react";

interface WishlistButtonProps {
    itineraryId: string;
    initialStatus?: boolean;
    size?: number;
}

export default function WishlistButton({ itineraryId, initialStatus = false, size = 20 }: WishlistButtonProps) {
    const { data: session } = useSession();
    const [isWishlisted, setIsWishlisted] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkWishlistStatus = async () => {
            if (!session?.user) return;

            try {
                const res = await fetch(`/api/wishlists?itinerary_id=${itineraryId}`);
                if (res.ok) {
                    const data = await res.json();
                    setIsWishlisted(data.inWishlist);
                }
            } catch (error) {
                console.error("Error checking wishlist status:", error);
            }
        };

        checkWishlistStatus();
    }, [itineraryId, session]);

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session?.user) {
            // alert("Please login to save to wishlist!");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/wishlists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itinerary_id: itineraryId })
            });

            if (res.ok) {
                const data = await res.json();
                setIsWishlisted(data.inWishlist);
            }
        } catch (error) {
            console.error("Wishlist error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!session?.user) return null;

    return (
        <button
            onClick={toggleWishlist}
            disabled={isLoading}
            style={{
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isWishlisted ? 'var(--primary)' : 'white',
                transition: 'all 0.2s',
                zIndex: 10
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                size={size}
                fill={isWishlisted ? "var(--primary)" : "none"}
                style={{ filter: isWishlisted ? 'drop-shadow(0 0 8px var(--primary))' : 'none' }}
            />
        </button>
    );
}
