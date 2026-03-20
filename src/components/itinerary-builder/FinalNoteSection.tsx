"use client";

import React from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Quote, Send, ShieldCheck, Heart } from "lucide-react";

interface FinalNoteSectionProps {
    data: string;
    onChange: (data: string) => void;
}

export default function FinalNoteSection({ data, onChange }: FinalNoteSectionProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                    <Quote style={{ color: '#8b5cf6' }} size={32} />
                    Final Note to Buyer
                </h2>
                <p style={{ color: 'var(--gray-400)' }}>
                    A personal message to the person who just bought your expertise.
                </p>
            </div>

            <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--foreground)' }}>Your Message</label>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '200px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', fontSize: '1.125rem', lineHeight: '1.6' }}
                        placeholder="Write a warm closing note. Why should they follow this? How much time/money will they save? Wish them a great trip!"
                        value={data || ""}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                        <ShieldCheck size={18} style={{ color: '#10b981' }} /> PROVEN TO SAVE TIME
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                        <Heart size={18} style={{ color: '#ef4444' }} /> BUILT WITH PASSION
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                        <Send size={18} style={{ color: '#3b82f6' }} /> TRAVEL WITH CONFIDENCE
                    </div>
                </div>
            </div>
        </div>
    );
}
