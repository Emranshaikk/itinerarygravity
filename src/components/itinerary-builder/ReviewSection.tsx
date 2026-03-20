"use client";

import React from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Star, ThumbsUp, ThumbsDown, BarChart } from "lucide-react";

interface ReviewSectionProps {
    data: ItineraryContent["review"];
    onChange: (data: ItineraryContent["review"]) => void;
}

export default function ReviewSection({ data, onChange }: ReviewSectionProps) {
    const updateField = (field: string, value: any) => {
        const currentData = data || { exceededExpectations: "", disappointments: "", recommendOverall: "" };
        onChange({ ...currentData, [field]: value } as any);
    };

    const reviewData = data || { exceededExpectations: "", disappointments: "", recommendOverall: "" };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                    <Star style={{ color: '#f59e0b' }} size={32} />
                    Honest Review
                </h2>
                <p style={{ color: 'var(--gray-400)' }}>
                    Your raw, unfiltered verdict on this trip.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                        <ThumbsUp size={18} /> WHAT EXCEEDED EXPECTATIONS
                    </label>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="The highlights that were even better than you thought..."
                        value={reviewData.exceededExpectations}
                        onChange={(e) => updateField("exceededExpectations", e.target.value)}
                    />
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                        <ThumbsDown size={18} /> DISAPPOINTMENTS
                    </label>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="Things that didn't live up to the hype..."
                        value={reviewData.disappointments}
                        onChange={(e) => updateField("disappointments", e.target.value)}
                    />
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6' }}>
                        <BarChart size={18} /> WOULD I RECOMMEND THIS OVERALL?
                    </label>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="Final verdict and why users should (or shouldn't) follow this itinerary..."
                        value={reviewData.recommendOverall}
                        onChange={(e) => updateField("recommendOverall", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
