"use client";

import { useState, useEffect } from "react";
import { Heart } from "@/components/Icons";
import { createClient } from "@/lib/supabase/client";

interface WishlistButtonProps {
    itineraryId: string;
    initialStatus?: boolean;
    size?: number;
}

export default function WishlistButton({ itineraryId, initialStatus = false, size = 20 }: WishlistButtonProps) {
    const [isWishlisted, setIsWishlisted] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data } = await supabase
                    .from('wishlists')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('itinerary_id', itineraryId)
                    .single();

                if (data) setIsWishlisted(true);
            }
        };
        fetchUser();
    }, [itineraryId]);

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            // alert("Please login to save to wishlist!");
            return;
        }

        setIsLoading(true);
        try {
            if (isWishlisted) {
                await fetch('/api/wishlist', {
                    method: 'DELETE',
                    body: JSON.stringify({ itinerary_id: itineraryId })
                });
                setIsWishlisted(false);
            } else {
                await fetch('/api/wishlist', {
                    method: 'POST',
                    body: JSON.stringify({ itinerary_id: itineraryId })
                });
                setIsWishlisted(true);
            }
        } catch (error) {
            console.error("Wishlist error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

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
