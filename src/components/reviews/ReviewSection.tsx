"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star } from "@/components/Icons";

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles: {
        full_name: string;
        email: string;
        avatar_url?: string;
    };
}

interface ReviewSectionProps {
    itineraryId: string;
    averageRating: number;
    reviewCount: number;
}

export default function ReviewSection({ itineraryId, averageRating, reviewCount }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    useEffect(() => {
        fetchReviews();
    }, [itineraryId]);

    async function fetchReviews() {
        try {
            const response = await fetch(`/api/reviews?itinerary_id=${itineraryId}`);
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    }

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={16}
                style={{
                    color: i < rating ? '#fbbf24' : 'var(--gray-600)',
                    fill: i < rating ? '#fbbf24' : 'none'
                }}
            />
        ));
    };

    if (loading) {
        return (
            <div className="glass card" style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: 'var(--gray-400)' }}>Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className="glass card" style={{ padding: '0', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '32px', borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Reviews & Ratings</h2>

                {/* Average Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 700 }}>
                                {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                            </span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {renderStars(Math.round(averageRating))}
                            </div>
                        </div>
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                            Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>

                    {/* Rating Distribution (Optional - can add later) */}
                </div>
            </div>

            {/* Reviews List */}
            <div style={{ padding: '32px' }}>
                {reviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-400)' }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No reviews yet</p>
                        <p style={{ fontSize: '0.9rem' }}>Be the first to review this itinerary!</p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {currentReviews.map((review) => (
                                <div
                                    key={review.id}
                                    style={{
                                        padding: '24px',
                                        background: 'var(--surface)',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border)'
                                    }}
                                >
                                    {/* Reviewer Info */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                        <div
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: 'var(--primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700,
                                                fontSize: '1.1rem',
                                                color: 'var(--background)'
                                            }}
                                        >
                                            {(review.profiles.full_name || review.profiles.email).charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, marginBottom: '4px' }}>
                                                {review.profiles.full_name || review.profiles.email.split('@')[0]}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review Comment */}
                                    {review.comment && (
                                        <p style={{ color: 'var(--foreground)', opacity: 0.9, lineHeight: '1.6' }}>
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="btn btn-outline"
                                    style={{
                                        padding: '8px 16px',
                                        opacity: currentPage === 1 ? 0.5 : 1,
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Previous
                                </button>
                                <span style={{ padding: '8px 16px', color: 'var(--gray-400)' }}>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="btn btn-outline"
                                    style={{
                                        padding: '8px 16px',
                                        opacity: currentPage === totalPages ? 0.5 : 1,
                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
