"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star } from "@/components/Icons";

interface ReviewFormProps {
    itineraryId: string;
    onReviewSubmitted: () => void;
    existingReview?: {
        id: string;
        rating: number;
        comment: string;
    };
}

export default function ReviewForm({ itineraryId, onReviewSubmitted, existingReview }: ReviewFormProps) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(existingReview?.comment || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const supabase = createClient();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const endpoint = existingReview ? '/api/reviews' : '/api/reviews';
            const method = existingReview ? 'PATCH' : 'POST';

            const body = existingReview
                ? { review_id: existingReview.id, rating, comment }
                : { itinerary_id: itineraryId, rating, comment };

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit review');
            }

            // Reset form
            if (!existingReview) {
                setRating(0);
                setComment("");
            }

            onReviewSubmitted();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const renderStarSelector = () => {
        return (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            transition: 'transform 0.2s'
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.transform = 'scale(0.9)';
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <Star
                            size={32}
                            style={{
                                color: star <= (hoverRating || rating) ? '#fbbf24' : 'var(--gray-600)',
                                fill: star <= (hoverRating || rating) ? '#fbbf24' : 'none',
                                transition: 'all 0.2s'
                            }}
                        />
                    </button>
                ))}
                <span style={{ marginLeft: '12px', alignSelf: 'center', color: 'var(--gray-400)' }}>
                    {rating > 0 ? `${rating} ${rating === 1 ? 'star' : 'stars'}` : 'Select rating'}
                </span>
            </div>
        );
    };

    return (
        <div className="glass card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
                {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>

            <form onSubmit={handleSubmit}>
                {/* Star Rating */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>
                        Your Rating *
                    </label>
                    {renderStarSelector()}
                </div>

                {/* Comment */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>
                        Your Review (Optional)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this itinerary..."
                        rows={5}
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '12px',
                            background: 'var(--input-bg)',
                            border: '1px solid var(--border)',
                            color: 'white',
                            fontSize: '0.95rem',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                    />
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginTop: '8px' }}>
                        {comment.length}/500 characters
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        marginBottom: '24px',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || rating === 0}
                    className="btn btn-primary"
                    style={{
                        opacity: loading || rating === 0 ? 0.5 : 1,
                        cursor: loading || rating === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
}
