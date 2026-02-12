"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { ImageIcon, Wand2, Share2, Heart, Map, Sparkles, Camera } from "lucide-react";

interface PostTripSectionProps {
    data: ItineraryContent["postTrip"];
    onChange: (data: ItineraryContent["postTrip"]) => void;
}

export default function PostTripSection({ data, onChange }: PostTripSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateField = (field: keyof ItineraryContent["postTrip"], value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleNextDestinations = (val: string) => {
        updateField("nextDestinationIdeas", val.split(",").map(s => s.trim()));
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                jetLagRecovery: "Hydrate heavily. Take a long walk in the morning sunlight (don't sleep during the day). Melatonin can help for the first 3 nights.",
                photoTips: "Use the 'Lightroom' app with 'Analog Japan' presets to get that classic Kyoto film look. Organize your photos by Day Number immediately upon return.",
                nextDestinationIdeas: ["Hokkaido (for nature)", "Osaka (for food)", "Kanazawa (for a quiet Kyoto vibe)"]
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                        <ImageIcon style={{ color: '#9333ea' }} size={32} />
                        Post-Trip & Reflection
                    </h2>
                    <p style={{ color: 'var(--gray-400)' }}>
                        Keep the adventure alive. Help them process their photos, recover from jet lag, and plan their next dream destination.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#9333ea', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Reflecting..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill Reflection</>}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

                {/* Jet Lag & Health */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', margin: 0 }}>
                        <Sparkles size={20} /> Jet Lag & Recovery Hacks
                    </h3>
                    <textarea
                        className="form-input"
                        style={{ backgroundColor: 'var(--input-bg)', minHeight: '120px', color: 'var(--foreground)' }}
                        placeholder="How to adapt back to their home timezone smoothly..."
                        value={data.jetLagRecovery || ""}
                        onChange={(e) => updateField("jetLagRecovery", e.target.value)}
                    />
                </div>

                {/* Content & Photography */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ec4899', margin: 0 }}>
                        <Camera size={20} /> Photo Editing & Sharing Tips
                    </h3>
                    <textarea
                        className="form-input"
                        style={{ backgroundColor: 'var(--input-bg)', minHeight: '120px', color: 'var(--foreground)' }}
                        placeholder="Presets to use, best way to organize 1000+ photos..."
                        value={data.photoTips || ""}
                        onChange={(e) => updateField("photoTips", e.target.value)}
                    />
                </div>

                {/* Where Next? */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', margin: 0 }}>
                        <Map size={20} /> "Where to Next?" Ideas
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            className="form-input"
                            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                            placeholder="e.g. Hokkaido, Osaka, Nara (separated by commas)"
                            value={data.nextDestinationIdeas?.join(", ") || ""}
                            onChange={(e) => handleNextDestinations(e.target.value)}
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {data.nextDestinationIdeas?.map((dest, i) => (
                                <span key={i} style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--input-bg)', color: '#0891b2', fontSize: '0.75rem', borderRadius: '1rem', border: '1px solid var(--border)', fontWeight: 'bold' }}>
                                    {dest}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Community & Reviews */}
                <div style={{ padding: '2rem', border: '2px dashed var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--input-bg)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
                    <Share2 size={40} style={{ color: 'var(--gray-400)' }} />
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--foreground)', margin: 0 }}>Feedback Is A Gift</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontStyle: 'italic', margin: 0, maxWidth: '240px' }}>
                        Encourage your travelers to tag you in their photos! This builds your brand and shows others that your itineraries work.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Heart size={16} style={{ color: '#ec4899' }} />
                        <Heart size={16} style={{ color: '#ec4899' }} />
                        <Heart size={16} style={{ color: '#ec4899' }} />
                    </div>
                </div>

            </div>
        </div>
    );
}
