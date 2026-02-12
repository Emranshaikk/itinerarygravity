"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { LogOut, Wand2, Clock, Luggage, Coffee, Train, HandMetal } from "lucide-react";

interface DepartureSectionProps {
    data: ItineraryContent["departure"];
    onChange: (data: ItineraryContent["departure"]) => void;
}

export default function DepartureSection({ data, onChange }: DepartureSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateField = (field: keyof ItineraryContent["departure"], value: any) => {
        onChange({ ...data, [field]: value });
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                checkoutTips: "Most hotels in Kyoto have an 11 AM checkout. You can leave your bags at the front desk for free for the day. If you have extra junk, use the 'Mottainai' donation bins at some stations.",
                airportBuffer: "Allow 3.5 hours for Kyoto Station to KIX (Kansai Airport) travel and check-in. The Haruka Express can occasionally be delayed by wind, so don't risk the last possible train."
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                        <LogOut style={{ color: '#f97316' }} size={32} />
                        Departure Plan
                    </h2>
                    <p style={{ color: 'var(--gray-400)' }}>
                        Make the last day as smooth as the first. Help them leave without the "Airport Panic."
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Packing up..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill Departure</>}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

                {/* Checkout Experience */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', margin: 0 }}>
                        <Luggage size={20} /> Checkout & Bags
                    </h3>
                    <textarea
                        className="form-input"
                        style={{ backgroundColor: 'var(--input-bg)', minHeight: '160px', color: 'var(--foreground)' }}
                        placeholder="Checkout times, bag storage, early morning taxi booking..."
                        value={data.checkoutTips}
                        onChange={(e) => updateField("checkoutTips", e.target.value)}
                    />
                </div>

                {/* Getting Out */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e', margin: 0 }}>
                        <Train size={20} /> Getting to the Airport
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold' }}>Buffer Time Suggestion</label>
                            <input
                                className="form-input"
                                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                                placeholder="e.g. 3-4 Hours"
                                value={data.airportBuffer}
                                onChange={(e) => updateField("airportBuffer", e.target.value)}
                            />
                        </div>
                        <div style={{ padding: '1.25rem', backgroundColor: 'var(--input-bg)', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                <Coffee size={16} style={{ color: '#ca8a04' }} /> The "Last Meal" Tradition
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontStyle: 'italic', margin: 0 }}>
                                Suggest one last spot for their final meal before heading to the airport.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final Goodbye */}
                <div style={{ gridColumn: '1 / -1', padding: '3rem 2rem', border: '1px solid var(--border)', borderRadius: '2rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderBottom: '6px solid #f97316' }}>
                    <HandMetal size={48} style={{ color: '#f97316' }} />
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--foreground)', fontStyle: 'italic', margin: 0 }}>"Arigato Gozaimasu"</h3>
                    <p style={{ color: 'var(--gray-400)', maxWidth: '600px', fontSize: '1.125rem' }}>
                        Encourage them to leave a review for the hotels/restaurants they loved, or suggest a final scenic spot to sit and reflect on the journey.
                    </p>
                </div>

            </div>
        </div>
    );
}
