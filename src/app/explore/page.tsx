"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
    const [durationRange, setDurationRange] = useState<[number, number]>([1, 30]);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "rating">("rating");
    const [showFilters, setShowFilters] = useState(false);
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
    }, [itineraries, searchQuery, selectedTags, priceRange, sortBy, durationRange, verifiedOnly, minRating]);

    async function fetchItineraries() {
        try {
            setIsLoading(true);
            const res = await fetch('/api/itineraries');
            if (!res.ok) throw new Error("Failed to fetch itineraries");
            const data = await res.json();

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
                difficulty_level: item.difficulty_level,
                currency: item.currency || "USD",
                purchase_count: item.purchases?.length || 0
            }));

            setItineraries(formattedData);
        } catch (error: any) {
            console.error("Fetch error:", error);
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

        // Duration filter
        filtered = filtered.filter(item => {
            const duration = item.duration_days || 1; // Default to 1 if not set
            return duration >= durationRange[0] && duration <= durationRange[1];
        });

        // Verified filter
        if (verifiedOnly) {
            filtered = filtered.filter(item => item.is_verified);
        }

        // Min Rating filter
        if (minRating > 0) {
            filtered = filtered.filter(item => item.average_rating >= minRating);
        }

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
        <>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Animated Mesh Gradient Background */}
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '120%',
                    height: '500px',
                    zIndex: -1,
                    opacity: 0.4,
                    filter: 'blur(80px)',
                    background: `
                        radial-gradient(at 0% 0%, rgba(255, 133, 162, 0.4) 0px, transparent 50%),
                        radial-gradient(at 50% 0%, rgba(139, 92, 246, 0.4) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.4) 0px, transparent 50%)
                    `,
                    animation: 'meshFlow 20s ease infinite alternate'
                }}></div>
                <style jsx>{`
                    @keyframes meshFlow {
                        0% { transform: scale(1) translate(0, 0); }
                        50% { transform: scale(1.1) translate(2%, 2%); }
                        100% { transform: scale(1) translate(-1%, -1%); }
                    }
                `}</style>

                <header style={{
                    padding: '100px 0 60px',
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    <div className="container">
                        <span style={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: 'var(--primary)',
                            display: 'block',
                            marginBottom: '16px'
                        }}>
                            Discover Your Next Journey
                        </span>
                        <h1 className="text-gradient" style={{
                            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                            fontWeight: 900,
                            marginBottom: '24px',
                            lineHeight: 1,
                            maxWidth: '900px',
                            margin: '0 auto 24px'
                        }}>
                            Your Next Masterpiece Adventure Starts Here.
                        </h1>
                        <p style={{
                            color: 'var(--gray-400)',
                            fontSize: '1.25rem',
                            maxWidth: '650px',
                            margin: '0 auto',
                            lineHeight: 1.6
                        }}>
                            Browse premium guides curated by travelers who live and breathe every destination.
                        </p>
                    </div>
                </header>
            </div>

            <div className="container" style={{ paddingBottom: '60px' }}>

                {/* Trending Section */}
                {!isLoading && itineraries.length > 0 && (
                    <div style={{ marginBottom: '60px', animation: 'slideUp 0.8s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Trending Now</h2>
                            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>View all Trending →</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: '24px',
                            overflowX: 'auto',
                            padding: '10px 5px 30px',
                            margin: '0 -5px',
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none'
                        }} className="hide-scrollbar">
                            {itineraries.slice(0, 5).map((item) => (
                                <div key={item.id} style={{ minWidth: '320px', flex: '0 0 320px' }}>
                                    <ItineraryCard
                                        itinerary={{
                                            ...item,
                                            image: item.image_url || item.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <style jsx>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

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
                            {(selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 50000 || durationRange[0] > 1 || durationRange[1] < 30 || verifiedOnly || minRating > 0) && (
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
                                    {selectedTags.length + (priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0) + (durationRange[0] > 1 || durationRange[1] < 30 ? 1 : 0) + (verifiedOnly ? 1 : 0) + (minRating > 0 ? 1 : 0)}
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
                                                        color: selectedTags.includes(tag) ? 'var(--background)' : 'var(--foreground)',
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
                                        Price Range: {priceRange[0]} - {priceRange[1]}
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

                                {/* Duration Range */}
                                <div>
                                    <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--gray-400)' }}>
                                        Duration: {durationRange[0]} - {durationRange[1]} Days
                                    </h4>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <input
                                            type="range"
                                            min="1"
                                            max="30"
                                            step="1"
                                            value={durationRange[0]}
                                            onChange={(e) => setDurationRange([Number(e.target.value), durationRange[1]])}
                                            style={{ flex: 1 }}
                                        />
                                        <input
                                            type="range"
                                            min="1"
                                            max="30"
                                            step="1"
                                            value={durationRange[1]}
                                            onChange={(e) => setDurationRange([durationRange[0], Number(e.target.value)])}
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </div>

                                {/* Minimum Rating */}
                                <div>
                                    <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--gray-400)' }}>Minimum Rating</h4>
                                    <select
                                        value={minRating}
                                        onChange={(e) => setMinRating(Number(e.target.value))}
                                        style={{
                                            padding: '10px 14px',
                                            borderRadius: '8px',
                                            background: 'var(--surface)',
                                            border: '1px solid var(--border)',
                                            color: 'var(--foreground)',
                                            width: '100%',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value={0}>Any Rating</option>
                                        <option value={3}>3+ Stars</option>
                                        <option value={4}>4+ Stars</option>
                                        <option value={4.5}>4.5+ Stars</option>
                                    </select>
                                </div>

                                {/* Verified Creators Only */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--foreground)', fontSize: '0.9rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={verifiedOnly}
                                            onChange={(e) => setVerifiedOnly(e.target.checked)}
                                            style={{
                                                width: '18px',
                                                height: '18px',
                                                cursor: 'pointer',
                                                accentColor: 'var(--primary)'
                                            }}
                                        />
                                        Verified Creators Only
                                        <VerifiedBadge size={16} />
                                    </label>
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {(selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 50000 || durationRange[0] > 1 || durationRange[1] < 30 || verifiedOnly || minRating > 0) && (
                                <button
                                    onClick={() => {
                                        setSelectedTags([]);
                                        setPriceRange([0, 50000]);
                                        setDurationRange([1, 30]);
                                        setVerifiedOnly(false);
                                        setMinRating(0);
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
        </>
    );
}
