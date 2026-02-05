"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Sliders, Wand2, Heart, Users, User, ArrowUpCircle, Wallet } from "lucide-react";

interface CustomizationSectionProps {
    data: ItineraryContent["customization"];
    onChange: (data: ItineraryContent["customization"]) => void;
}

export default function CustomizationSection({ data, onChange }: CustomizationSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateField = (field: keyof ItineraryContent["customization"], value: any) => {
        onChange({ ...data, [field]: value });
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                coupleTips: "Book a private evening canal cruise in Kyoto ($80). Visit the 'Love Stones' at Kiyomizu-dera. Choose a Ryokan with a 'Kashikiri' (private) bath.",
                familyTips: "The Kyoto Railway Museum is a hit for kids. Stroller-friendly paths are marked in Arashiyama. Most temples have 'Omikuji' (fortunes) which kids find fun.",
                soloTips: "Eat at Ramen counters (very common for solo diners). Stay in a 'Capsule Hotel' for one night for the experience. Kyoto is extremely safe for solo night walks.",
                luxuryUpgrade: "Hire a private local guide ($300/day). Upgrade to a First Class Shinkansen seat. Stay at the Ritz-Carlton for the river views.",
                budgetSaver: "Buy a 'Bus Day Pass' (¥700). Eat 'Combini' (convenience store) meals for breakfast—they are high quality! Use the free walking tours."
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1c1917', marginBottom: '0.5rem' }}>
                        <Sliders style={{ color: '#9333ea' }} size={32} />
                        Customization Options
                    </h2>
                    <p style={{ color: '#78716c' }}>
                        A great itinerary works for everyone. Add specific advice for different traveler profiles and budget levels.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#9333ea', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Personalizing..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill Options</>}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

                {/* Profile Specific Tips */}
                <div style={{ padding: '2rem', border: '1px solid #f5f5f4', borderRadius: '1.5rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '2rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ec4899', margin: 0 }}>
                        <Users size={20} /> Traveler Profiles
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Heart size={14} style={{ color: '#ec4899' }} /> FOR COUPLES
                            </label>
                            <textarea
                                className="form-input"
                                style={{ backgroundColor: '#fdfbf7', minHeight: '100px' }}
                                placeholder="Romantic spots, private dinners..."
                                value={data.coupleTips || ""}
                                onChange={(e) => updateField("coupleTips", e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Users size={14} style={{ color: '#3b82f6' }} /> FOR FAMILIES
                            </label>
                            <textarea
                                className="form-input"
                                style={{ backgroundColor: '#fdfbf7', minHeight: '100px' }}
                                placeholder="Kid-friendly activities, stroller info..."
                                value={data.familyTips || ""}
                                onChange={(e) => updateField("familyTips", e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <User size={14} style={{ color: '#10b981' }} /> FOR SOLO TRAVELERS
                            </label>
                            <textarea
                                className="form-input"
                                style={{ backgroundColor: '#fdfbf7', minHeight: '100px' }}
                                placeholder="Safety for solos, social spots..."
                                value={data.soloTips || ""}
                                onChange={(e) => updateField("soloTips", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Tier Specific Advice */}
                <div style={{ padding: '2rem', border: '1px solid #f5f5f4', borderRadius: '1.5rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '2rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308', margin: 0 }}>
                        <ArrowUpCircle size={20} /> Budget & Luxury Tweaks
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <ArrowUpCircle size={14} style={{ color: '#f59e0b' }} /> LUXURY UPGRADES
                            </label>
                            <textarea
                                className="form-input"
                                style={{ backgroundColor: '#fdfbf7', minHeight: '160px' }}
                                placeholder="How to make this trip 'First Class'..."
                                value={data.luxuryUpgrade || ""}
                                onChange={(e) => updateField("luxuryUpgrade", e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Wallet size={14} style={{ color: '#10b981' }} /> BUDGET SAVING HACKS
                            </label>
                            <textarea
                                className="form-input"
                                style={{ backgroundColor: '#fdfbf7', minHeight: '160px' }}
                                placeholder="How to do this trip on a dime..."
                                value={data.budgetSaver || ""}
                                onChange={(e) => updateField("budgetSaver", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
