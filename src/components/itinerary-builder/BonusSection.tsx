"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Gift, Wand2, Map, FileCheck, DollarSign, ExternalLink, AlertTriangle, Plus, Trash2, Crown } from "lucide-react";

interface BonusSectionProps {
    data: ItineraryContent["bonus"];
    onChange: (data: ItineraryContent["bonus"]) => void;
}

export default function BonusSection({ data, onChange }: BonusSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateField = (field: keyof ItineraryContent["bonus"], value: any) => {
        onChange({ ...data, [field]: value });
    };

    const addLink = () => {
        onChange({
            ...data,
            externalLinks: [...data.externalLinks, { label: "", url: "" }]
        });
    };

    const updateLink = (index: number, field: "label" | "url", value: string) => {
        const newLinks = [...data.externalLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        onChange({ ...data, externalLinks: newLinks });
    };

    const removeLink = (index: number) => {
        const newLinks = data.externalLinks.filter((_, i) => i !== index);
        onChange({ ...data, externalLinks: newLinks });
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                ...data,
                googleMapsLink: "https://goo.gl/maps/example...",
                reservationTips: "Book 'Omakase' dinners at least 2 months in advance. Use 'TableCheck' for easier reservations in Japan.",
                commonMistakes: "Don't tip! It's considered rude. Don't eat while walking. Don't be loud on trains.",
                tripUpgrades: "Hire a private photographer for an hour in Gion ($150). Rent a kimono ($40). Stay one night in a Ryokan with private onset ($300).",
                includePackingChecklist: true,
                includeBudgetPlanner: true,
                externalLinks: [
                    { label: "HyperDia (Train Schedules)", url: "https://www.hyperdia.com/" },
                    { label: "Japan Guide (Culture)", url: "https://www.japan-guide.com/" }
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
                        <Gift style={{ color: '#ec4899' }} size={32} />
                        Bonus & Value Adds
                    </h2>
                    <p style={{ color: '#78716c' }}>
                        This is where you over-deliver. Add resources, maps, and insider warnings to increase the itinerary's perceived value.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#ec4899', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Adding Value..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill Bonus</>}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

                {/* Master Map & Downloads */}
                <div style={{ padding: '2rem', border: '1px solid #f5f5f4', borderRadius: '1.5rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderLeft: '4px solid #10b981' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1c1917', margin: 0 }}>
                        <Map style={{ color: '#10b981' }} size={20} /> Master Resources
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: 'bold' }}>Google Maps Master List URL</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    className="form-input"
                                    style={{ backgroundColor: '#fdfbf7', flex: 1 }}
                                    placeholder="https://goo.gl/maps/..."
                                    value={data.googleMapsLink}
                                    onChange={(e) => updateField("googleMapsLink", e.target.value)}
                                />
                                <a
                                    href={data.googleMapsLink || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e7e5e4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: data.googleMapsLink ? '#10b981' : '#a8a29e', backgroundColor: 'white' }}
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                            <p style={{ fontSize: '0.7rem', color: '#a8a29e' }}>Create a saved list in Google Maps and share the link here.</p>
                        </div>

                        <div style={{ backgroundColor: '#fdfbf7', borderRadius: '1rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#1c1917' }}>Include Auto-Generated Resources?</label>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #f5f5f4' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <FileCheck style={{ color: '#3b82f6' }} size={20} />
                                    <span style={{ fontSize: '0.875rem', color: '#1c1917' }}>Packing Checklist PDF</span>
                                </div>
                                <input
                                    type="checkbox"
                                    style={{ width: '1.25rem', height: '1.25rem', accentColor: '#10b981' }}
                                    checked={data.includePackingChecklist}
                                    onChange={(e) => updateField("includePackingChecklist", e.target.checked)}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #f5f5f4' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <DollarSign style={{ color: '#eab308' }} size={20} />
                                    <span style={{ fontSize: '0.875rem', color: '#1c1917' }}>Budget Planner Template</span>
                                </div>
                                <input
                                    type="checkbox"
                                    style={{ width: '1.25rem', height: '1.25rem', accentColor: '#10b981' }}
                                    checked={data.includeBudgetPlanner}
                                    onChange={(e) => updateField("includeBudgetPlanner", e.target.checked)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reservation & Upgrades */}
                <div style={{ padding: '2rem', border: '1px solid #f5f5f4', borderRadius: '1.5rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderLeft: '4px solid #9333ea' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1c1917', margin: 0 }}>
                        <Crown style={{ color: '#9333ea' }} size={20} /> Expert Advice
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: 'bold' }}>Reservation & Booking Tips</label>
                            <textarea
                                className="form-input"
                                style={{ backgroundColor: '#fdfbf7', minHeight: '100px' }}
                                placeholder="e.g. Book X restaurant 2 months ahead..."
                                value={data.reservationTips}
                                onChange={(e) => updateField("reservationTips", e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: 'bold' }}>Suggested Trip Upgrades</label>
                            <textarea
                                className="form-input"
                                style={{ backgroundColor: '#fdfbf7', minHeight: '100px' }}
                                placeholder="e.g. Upgrade to Green Car on Shinkansen ($50)..."
                                value={data.tripUpgrades}
                                onChange={(e) => updateField("tripUpgrades", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Common Mistakes */}
                <div style={{ gridColumn: '1 / -1', padding: '2rem', border: '1px solid #f5f5f4', borderRadius: '1.5rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderLeft: '4px solid #ef4444' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1c1917', margin: 0 }}>
                        <AlertTriangle style={{ color: '#ef4444' }} size={20} /> "Don't Do This" - Common Mistakes
                    </h3>
                    <textarea
                        className="form-input"
                        style={{ backgroundColor: '#fdfbf7', minHeight: '100px', fontSize: '1.125rem' }}
                        placeholder="e.g. Do not tip in Japan. Avoid visiting Kyoto on weekends..."
                        value={data.commonMistakes}
                        onChange={(e) => updateField("commonMistakes", e.target.value)}
                    />
                </div>

                {/* External Links */}
                <div style={{ gridColumn: '1 / -1', padding: '2rem', border: '1px solid #f5f5f4', borderRadius: '1.5rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1c1917', margin: 0 }}>
                            <ExternalLink style={{ color: '#3b82f6' }} size={20} /> Helpful External Links
                        </h3>
                        <button onClick={addLink} style={{ fontSize: '0.75rem', color: '#3b82f6', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            + Add Link
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.externalLinks.map((link, index) => (
                            <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input
                                    className="form-input"
                                    style={{ backgroundColor: '#fdfbf7', flex: 1 }}
                                    placeholder="Label (e.g. Official Train Site)"
                                    value={link.label}
                                    onChange={(e) => updateLink(index, "label", e.target.value)}
                                />
                                <input
                                    className="form-input"
                                    style={{ backgroundColor: '#fdfbf7', flex: 2 }}
                                    placeholder="URL (https://...)"
                                    value={link.url}
                                    onChange={(e) => updateLink(index, "url", e.target.value)}
                                />
                                <button onClick={() => removeLink(index)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#a8a29e', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {data.externalLinks.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#a8a29e', backgroundColor: '#fdfbf7', borderRadius: '1rem', border: '1px dashed #e7e5e4' }}>
                                No external resources added.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
