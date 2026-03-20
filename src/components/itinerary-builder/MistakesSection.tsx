"use client";

import React from "react";
import { ItineraryContent } from "@/types/itinerary";
import { AlertCircle, Clock, DollarSign, XCircle, RotateCcw } from "lucide-react";

interface MistakesSectionProps {
    data: ItineraryContent["mistakes"];
    onChange: (data: ItineraryContent["mistakes"]) => void;
}

export default function MistakesSection({ data, onChange }: MistakesSectionProps) {
    const updateField = (field: string, value: any) => {
        const currentData = data || { biggestMistake: "", timeWasters: "", moneyWasters: "", neverAgain: "" };
        onChange({ ...currentData, [field]: value } as any);
    };

    const mistakeData = data || { biggestMistake: "", timeWasters: "", moneyWasters: "", neverAgain: "" };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                    <AlertCircle style={{ color: '#ef4444' }} size={32} />
                    Mistakes & Lessons
                </h2>
                <p style={{ color: 'var(--gray-400)' }}>
                    Share your failures so your buyers can have a perfect trip. This is pure value.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                        <XCircle size={18} /> BIGGEST MISTAKE
                    </label>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="The one thing that almost ruined the trip or was a massive let-down..."
                        value={mistakeData.biggestMistake}
                        onChange={(e) => updateField("biggestMistake", e.target.value)}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b' }}>
                            <Clock size={18} /> MASSIVE TIME WASTERS
                        </label>
                        <textarea
                            className="form-input"
                            style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                            placeholder="Things that took too much time for little reward..."
                            value={mistakeData.timeWasters}
                            onChange={(e) => updateField("timeWasters", e.target.value)}
                        />
                    </div>
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                            <DollarSign size={18} /> MASSIVE MONEY WASTERS
                        </label>
                        <textarea
                            className="form-input"
                            style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                            placeholder="Overpriced things that weren't worth it..."
                            value={mistakeData.moneyWasters}
                            onChange={(e) => updateField("moneyWasters", e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6' }}>
                        <RotateCcw size={18} /> NEVER AGAIN
                    </label>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="Something you did once and would NEVER do again..."
                        value={mistakeData.neverAgain}
                        onChange={(e) => updateField("neverAgain", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
