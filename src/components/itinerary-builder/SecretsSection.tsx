"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Star, Wand2, Plus, Trash2, MapPin, Clock, Users, AlertCircle } from "lucide-react";

interface SecretsSectionProps {
    data: ItineraryContent["secrets"];
    onChange: (data: ItineraryContent["secrets"]) => void;
}

export default function SecretsSection({ data, onChange }: SecretsSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const addPlace = () => {
        onChange({
            ...data,
            places: [
                ...data.places,
                { name: "", description: "", type: "", bestTime: "", idealFor: "", tips: "" }
            ]
        });
    };

    const removePlace = (index: number) => {
        const newPlaces = data.places.filter((_, i) => i !== index);
        onChange({ ...data, places: newPlaces });
    };

    const updatePlace = (index: number, field: string, value: string) => {
        const newPlaces = [...data.places];
        (newPlaces[index] as any)[field] = value;
        onChange({ ...data, places: newPlaces });
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                places: [
                    {
                        name: "Omoide Yokocho (Piss Alley)",
                        type: "Experience",
                        description: "A narrow, smoky alleyway packed with tiny yakitori stalls. It feels like stepping back into the Showa era. Authentic, gritty, and delicious.",
                        bestTime: "After 7 PM for the full atmosphere.",
                        idealFor: "Photographers & Foodies",
                        tips: "Most stalls have a cover charge. Bring cash. Not for claustrophobics.",
                        locationUrl: "https://goo.gl/maps/..."
                    },
                    {
                        name: "Gotokuji Temple",
                        type: "Viewpoint",
                        description: "The birthplace of the 'Maneki-neko' (beckoning cat). Hundreds of white cat statues are tucked into a quiet corner of the temple grounds.",
                        bestTime: "Morning (9-10 AM) for quiet photos.",
                        idealFor: "Cat lovers & Instagrammers",
                        tips: "It's a residential area, so be respectful. The shop selling cat figurines closes at 4 PM."
                    },
                    {
                        name: "Nakameguro Under the Tracks",
                        type: "Shopping/Art",
                        description: "A trendy collection of bookstores, cafes, and galleries under the train tracks. Very local vibe, far from the chaotic Shibuya crowds.",
                        bestTime: "Afternoon for coffee and browsing.",
                        idealFor: "Hipsters & Design lovers",
                        tips: "Check out the Tsutaya Books nearby for a great lounge spot."
                    }
                ]
            });
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1c1917', marginBottom: '0.5rem' }}>
                        <Star style={{ color: '#eab308' }} size={32} />
                        Hidden Gems & Secrets
                    </h2>
                    <p style={{ color: '#78716c' }}>
                        Reveal the spots that make this trip special. Not over-touristy, loved by locals, and authentic.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#eab308', color: 'black', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Revealing Gems..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill Gems</>}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {data.places.map((place, index) => (
                    <div key={index} style={{ border: '1px solid #f5f5f4', borderRadius: '2rem', backgroundColor: 'white', overflow: 'hidden', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', transition: 'all 0.2s ease' }}>
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1.5rem' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                                        <input
                                            style={{ backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid #f5f5f4', fontSize: '1.875rem', fontWeight: 'bold', color: '#1c1917', width: '100%', outline: 'none', padding: '0.25rem 0' }}
                                            placeholder="Name of Hidden Gem"
                                            value={place.name}
                                            onChange={(e) => updatePlace(index, "name", e.target.value)}
                                        />
                                        <input
                                            style={{ backgroundColor: '#fdfbf7', border: '1px solid #f5f5f4', borderRadius: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#eab308', fontWeight: '600', width: '180px' }}
                                            placeholder="Type (e.g. Viewpoint)"
                                            value={place.type}
                                            onChange={(e) => updatePlace(index, "type", e.target.value)}
                                        />
                                    </div>
                                    <textarea
                                        className="form-input"
                                        style={{ backgroundColor: '#fdfbf7', minHeight: '100px', fontSize: '0.925rem' }}
                                        placeholder="Why is it special? What's the vibe?"
                                        value={place.description}
                                        onChange={(e) => updatePlace(index, "description", e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => removePlace(index)}
                                    style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#a8a29e', cursor: 'pointer', borderRadius: '0.75rem', transition: 'background 0.2s' }}
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f5f5f4' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Clock size={12} style={{ color: '#3b82f6' }} /> BEST TIME TO VISIT
                                    </label>
                                    <input
                                        className="form-input"
                                        style={{ backgroundColor: '#fdfbf7', fontSize: '0.875rem' }}
                                        placeholder="e.g. Sunset or Early Morning"
                                        value={place.bestTime || ""}
                                        onChange={(e) => updatePlace(index, "bestTime", e.target.value)}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Users size={12} style={{ color: '#9333ea' }} /> PERFECT FOR
                                    </label>
                                    <input
                                        className="form-input"
                                        style={{ backgroundColor: '#fdfbf7', fontSize: '0.875rem' }}
                                        placeholder="e.g. Photographers, Couples"
                                        value={place.idealFor || ""}
                                        onChange={(e) => updatePlace(index, "idealFor", e.target.value)}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <AlertCircle size={12} style={{ color: '#ef4444' }} /> CAUTIONS / TIPS
                                    </label>
                                    <input
                                        className="form-input"
                                        style={{ backgroundColor: '#fdfbf7', fontSize: '0.875rem' }}
                                        placeholder="e.g. Cash only, hard to find"
                                        value={place.tips || ""}
                                        onChange={(e) => updatePlace(index, "tips", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {data.places.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed #e7e5e4', borderRadius: '1.5rem', backgroundColor: '#fafaf9' }}>
                        <Star size={48} style={{ margin: '0 auto 1.5rem', color: '#e7e5e4' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#78716c', marginBottom: '0.5rem' }}>No Secrets Revealed Yet</h3>
                        <p style={{ color: '#a8a29e', maxWidth: '400px', margin: '0 auto 2rem' }}>
                            This is often the most valuable part of the itinerary. Share local spots that aren't in generic guidebooks.
                        </p>
                        <button onClick={addPlace} style={{ padding: '1rem 2rem', borderRadius: '1rem', border: '1px solid #eab308', backgroundColor: 'transparent', color: '#eab308', fontWeight: 'bold', cursor: 'pointer' }}>
                            Add First Hidden Gem
                        </button>
                    </div>
                )}

                {data.places.length > 0 && (
                    <button
                        onClick={addPlace}
                        style={{ width: '100%', padding: '1.5rem', border: '2px dashed #e7e5e4', borderRadius: '1.5rem', backgroundColor: 'transparent', color: '#78716c', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer' }}
                    >
                        <Plus size={24} /> Add Another Hidden Gem
                    </button>
                )}
            </div>
        </div>
    );
}
