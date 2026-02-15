"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Star, Search, Filter, X } from "@/components/Icons";
import VerifiedBadge from "@/components/VerifiedBadge";
import ItineraryCard from "@/components/ItineraryCard";

interface Itinerary {
    id: string;
    title: string;
    creator: string;
    creator_id: string;
    location: string;
    price: number;
    average_rating: number;
    review_count: number;
    image?: string;
    image_url?: string;
    tags: string[];
    is_verified?: boolean;
    duration_days?: number;
    difficulty_level?: string;
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<div className="container" style={{ padding: '60px 0' }}>Loading...</div>}>
            <ExploreContent />
        </Suspense>
    );
}

function ExploreContent() {
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);
    const [filteredItineraries, setFilteredItineraries] = useState<Itinerary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
    const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "rating">("rating");
    const [showFilters, setShowFilters] = useState(false);
    const supabase = createClient();
    const searchParams = useSearchParams();

    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch) {
            setSearchQuery(urlSearch);
            document.title = `Explore ${urlSearch} | ItineraryGravity`;
        } else {
            document.title = `Explore Adventures | ItineraryGravity`;
        }
        fetchItineraries();
    }, [searchParams]);

    useEffect(() => {
        filterAndSortItineraries();
    }, [itineraries, searchQuery, selectedTags, priceRange, sortBy]);

    async function fetchItineraries() {
        try {
            // First, try to fetch with profiles join
            let { data, error } = await supabase
                .from('itineraries')
                .select(`
                    *,
                    profiles:creator_id (
                        full_name,
                        email,
                        is_verified
                    )
                `)
                .eq('is_published', true)
                .eq('is_approved', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Supabase query error:", {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });

                // Fallback: try without the profiles join
                console.log("Attempting fallback query without profiles join...");
                const fallback = await supabase
                    .from('itineraries')
                    .select('*')
                    .eq('is_published', true)
                    .eq('is_approved', true)
                    .order('created_at', { ascending: false });

                if (fallback.error) {
                    console.error("Fallback query also failed:", fallback.error);
                    throw fallback.error;
                }

                data = fallback.data;
            }

            const formattedData: Itinerary[] = (data || []).map((item: any) => ({
                id: item.id,
                title: item.title,
                creator: item.profiles?.full_name || item.profiles?.email || "@Creator",
                creator_id: item.creator_id,
                location: item.location || "Unknown",
                price: Number(item.price) || 0,
                average_rating: Number(item.average_rating) || 0,
                review_count: item.review_count || 0,
                image: item.image_url || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
                tags: item.tags || [],
                is_verified: item.profiles?.is_verified || false,
                duration_days: item.duration_days,
                difficulty_level: item.difficulty_level
            }));

            console.log(`Successfully loaded ${formattedData.length} itineraries`);
            setItineraries(formattedData);
        } catch (error: any) {
            console.error("Fetch error:", error);
            console.error("Error details:", {
                message: error?.message,
                code: error?.code,
                details: error?.details,
                hint: error?.hint,
                type: typeof error,
                keys: error ? Object.keys(error) : []
            });
        } finally {
            setIsLoading(false);
        }
    }

    function filterAndSortItineraries() {
        let filtered = [...itineraries];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.location.toLowerCase().includes(query) ||
                item.creator.toLowerCase().includes(query)
            );
        }

        // Tag filter
        if (selectedTags.length > 0) {
            filtered = filtered.filter(item =>
                selectedTags.some(tag => item.tags.includes(tag))
            );
        }

        // Price filter
        filtered = filtered.filter(item =>
            item.price >= priceRange[0] && item.price <= priceRange[1]
        );

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return 0; // Already sorted by created_at
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "rating":
                    // Multi-level sort for "Rating": 
                    // Verified > Rating > Review Count > Newest
                    const aVerified = a.is_verified ? 1 : 0;
                    const bVerified = b.is_verified ? 1 : 0;
                    if (aVerified !== bVerified) return bVerified - aVerified;

                    if (b.average_rating !== a.average_rating) {
                        return b.average_rating - a.average_rating;
                    }
                    return b.review_count - a.review_count;
                default:
                    return 0;
            }
        });

        setFilteredItineraries(filtered);
    }

    const allTags = Array.from(new Set(itineraries.flatMap(i => i.tags)));

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <header style={{ marginBottom: '48px' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '16px' }}>
                    Your Next Masterpiece Adventure Starts Here.
                </h1>
                <p style={{ color: 'var(--gray-400)', fontSize: '1.2rem', maxWidth: '600px' }}>
                    Browse premium guides from creators who live and breathe travel.
                </p>
            </header>

            {/* Search and Filter Bar */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {/* Search */}
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                        <input
                            type="text"
                            placeholder="Search by title, location, or creator..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 48px',
                                borderRadius: '12px',
                                background: 'var(--input-bg)',
                                border: '1px solid var(--border)',
                                color: 'var(--foreground)',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: 'var(--input-bg)',
                            border: '1px solid var(--border)',
                            color: 'var(--foreground)',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="rating" style={{ background: '#1a1a1a', color: '#ffffff' }}>Highest Rated</option>
                        <option value="newest" style={{ background: '#1a1a1a', color: '#ffffff' }}>Newest First</option>
                        <option value="price-low" style={{ background: '#1a1a1a', color: '#ffffff' }}>Price: Low to High</option>
                        <option value="price-high" style={{ background: '#1a1a1a', color: '#ffffff' }}>Price: High to Low</option>
                    </select>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Filter size={18} />
                        Filters
                        {(selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 50000) && (
                            <span style={{
                                background: 'var(--primary)',
                                color: 'var(--background)',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 700
                            }}>
                                {selectedTags.length + (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="glass card" style={{ padding: '24px', marginTop: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
                            {/* Tags */}
                            {allTags.length > 0 && (
                                <div>
                                    <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--gray-400)' }}>Categories</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {allTags.map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => toggleTag(tag)}
                                                className="badge"
                                                style={{
                                                    background: selectedTags.includes(tag) ? 'var(--primary)' : 'var(--surface)',
                                                    border: selectedTags.includes(tag) ? '1px solid var(--primary)' : '1px solid var(--border)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Price Range */}
                            <div>
                                <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--gray-400)' }}>
                                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                                </h4>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="50000"
                                        step="500"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                        style={{ flex: 1 }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="50000"
                                        step="500"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                            <button
                                onClick={() => {
                                    setSelectedTags([]);
                                    setPriceRange([0, 50000]);
                                }}
                                className="btn btn-outline"
                                style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <X size={16} /> Clear All Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div style={{ marginBottom: '24px', color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                Showing {filteredItineraries.length} of {itineraries.length} itineraries
            </div>

            {/* Itineraries Grid */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--gray-400)' }}>
                    Loading amazing adventures...
                </div>
            ) : filteredItineraries.length === 0 ? (
                <div className="glass card" style={{ padding: '60px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No guides here yet</h3>
                    <p style={{ color: 'var(--gray-400)', marginBottom: '24px' }}>
                        Request a guide for this location!
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedTags([]);
                            setPriceRange([0, 50000]);
                        }}
                        className="btn btn-primary"
                    >
                        Clear All Filters
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '32px'
                }}>
                    {filteredItineraries.map((item) => (
                        <ItineraryCard
                            key={item.id}
                            itinerary={{
                                ...item,
                                image: item.image_url || item.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
