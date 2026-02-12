"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { PlaneLanding, Wand2, MapPin, Coffee, Key, Clock, Train, Luggage } from "lucide-react";

interface ArrivalSectionProps {
    data: ItineraryContent["arrival"];
    onChange: (data: ItineraryContent["arrival"]) => void;
}

export default function ArrivalSection({ data, onChange }: ArrivalSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateField = (field: keyof ItineraryContent["arrival"], value: any) => {
        onChange({ ...data, [field]: value });
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                airportToCity: "Take the Haruka Express from KIX (Kansai Airport) directly to Kyoto Station (75 mins). Use a Suica/ICOCA card.",
                checkInProcess: "Most Ryokans allow luggage drop-off from 10 AM, even if check-in is at 3 PM. Use the 'Sagawa' delivery service if you want your bags sent ahead.",
                firstMealSuggestion: "Nishiki Market. It's a 10-min walk from most downtown hotels and has 100+ stalls for snacks.",
                orientationTips: "Kyoto is a grid. If you are lost, find the Kyoto Tower; it's always south (near the station).",
                simCardPickUp: "There is a Bic Camera at Kyoto Station (Floor 2) that sells prepaid SIMs if you didn't get an eSIM."
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                        <PlaneLanding style={{ color: '#2563eb' }} size={32} />
                        Arrival Day Experience
                    </h2>
                    <p style={{ color: 'var(--gray-400)' }}>
                        The first 4 hours are the most stressful. Guide them from the airport to their first "I'm finally here" moment.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Landing..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill Arrival</>}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Getting from Airport */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', position: 'relative' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1d4ed8', margin: 0 }}>
                        <Train size={20} /> Airport to City Transfer
                    </h3>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '120px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="Step-by-step instructions. Which train? Which exit?"
                        value={data.airportToCity}
                        onChange={(e) => updateField("airportToCity", e.target.value)}
                    />
                </div>

                {/* Check-in & Luggage */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', position: 'relative' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9333ea', margin: 0 }}>
                        <Key size={20} /> Check-in & Luggage Info
                    </h3>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '120px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="Can they drop bags early? Any quirks about hotels here?"
                        value={data.checkInProcess}
                        onChange={(e) => updateField("checkInProcess", e.target.value)}
                    />
                </div>

                {/* First Meal */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', position: 'relative' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ea580c', margin: 0 }}>
                        <Coffee size={20} /> First "Welcome" Meal
                    </h3>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '120px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="Suggest somewhere easy and iconic near the main hub."
                        value={data.firstMealSuggestion}
                        onChange={(e) => updateField("firstMealSuggestion", e.target.value)}
                    />
                </div>

                {/* Orientation */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', position: 'relative' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', margin: 0 }}>
                        <MapPin size={20} /> Quick Orientation Tips
                    </h3>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '120px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="How to find their bearings? Landmark suggestions?"
                        value={data.orientationTips}
                        onChange={(e) => updateField("orientationTips", e.target.value)}
                    />
                </div>

                {/* Last-Minute Tech */}
                <div style={{ gridColumn: '1 / -1', padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', margin: 0 }}>
                        <Clock size={20} /> Last-Minute Essentials (SIM/Cash)
                    </h3>
                    <input
                        className="form-input"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="e.g. Best place to pick up a physical SIM or withdraw cash at arrival."
                        value={data.simCardPickUp || ""}
                        onChange={(e) => updateField("simCardPickUp", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
