"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Shield, Wand2, Plus, Trash2, AlertTriangle, Scale, Phone, UserX } from "lucide-react";

interface SafetySectionProps {
    data: ItineraryContent["safety"];
    onChange: (data: ItineraryContent["safety"]) => void;
}

export default function SafetySection({ data, onChange }: SafetySectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateField = (field: keyof ItineraryContent["safety"], value: any) => {
        onChange({ ...data, [field]: value });
    };

    const addScam = () => updateField("commonScams", [...data.commonScams, ""]);
    const removeScam = (index: number) => updateField("commonScams", data.commonScams.filter((_, i) => i !== index));

    const addTip = () => updateField("safetyTips", [...data.safetyTips, ""]);
    const removeTip = (index: number) => updateField("safetyTips", data.safetyTips.filter((_, i) => i !== index));

    const addDoDont = () => updateField("culturalDosAndDonts", [...data.culturalDosAndDonts, ""]);
    const removeDoDont = (index: number) => updateField("culturalDosAndDonts", data.culturalDosAndDonts.filter((_, i) => i !== index));

    const addEmergency = () => updateField("emergencyNumbers", [...data.emergencyNumbers, { name: "", number: "" }]);
    const removeEmergency = (index: number) => updateField("emergencyNumbers", data.emergencyNumbers.filter((_, i) => i !== index));

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                commonScams: [
                    "Taxi overcharging in tourist areas (Ask for the meter).",
                    "Fake monk bracelets near temples (politely refuse and walk on).",
                    "Spiked drinks at bars in Shibuya/Kabukicho (never leave drinks unattended)."
                ],
                safetyTips: [
                    "Japan is extremely safe, but stay alert in crowded stations for pickpockets.",
                    "Download the 'Safety Tips' app for official earthquake/disaster alerts.",
                    "Always keep a copy of your passport on your phone."
                ],
                culturalDosAndDonts: [
                    "DO: Bow slightly when being greeted or thanking someone.",
                    "DON'T: Tip! It's considered rude and creates confusion.",
                    "DO: Carry your own small bag for trash, as public bins are rare.",
                    "DON'T: Talk loudly on public transport."
                ],
                emergencyNumbers: [
                    { name: "Police", number: "110" },
                    { name: "Ambulance / Fire", number: "119" },
                    { name: "Japan Helpline (English)", number: "0570-000-911" }
                ]
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                        <Shield style={{ color: '#eab308' }} size={32} />
                        Safety, Scams & Culture
                    </h2>
                    <p style={{ color: 'var(--gray-400)' }}>
                        Empower your travelers with confidence. Knowing what NOT to do is as important as knowing what to do.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#eab308', color: 'black', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Securing..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill Safety</>}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

                {/* Common Scams */}
                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', margin: 0 }}>
                            <UserX size={20} /> Common Scams & Traps
                        </h3>
                        <button onClick={addScam} style={{ fontSize: '0.75rem', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            + Add Scam
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.commonScams.map((scam, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                                <textarea
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--input-bg)', fontSize: '0.875rem', flex: 1, minHeight: '60px', color: 'var(--foreground)' }}
                                    placeholder="e.g. 'Broken' taxi meters..."
                                    value={scam}
                                    onChange={(e) => {
                                        const newScams = [...data.commonScams];
                                        newScams[i] = e.target.value;
                                        updateField("commonScams", newScams);
                                    }}
                                />
                                <button onClick={() => removeScam(i)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Culture Dos & Don'ts */}
                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', margin: 0 }}>
                            <Scale size={20} /> Cultural Dos & Don'ts
                        </h3>
                        <button onClick={addDoDont} style={{ fontSize: '0.75rem', color: '#3b82f6', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            + Add Item
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.culturalDosAndDonts.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                                <textarea
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--input-bg)', fontSize: '0.875rem', flex: 1, minHeight: '60px', color: 'var(--foreground)' }}
                                    placeholder="e.g. DO: Bow slightly..."
                                    value={item}
                                    onChange={(e) => {
                                        const newItems = [...data.culturalDosAndDonts];
                                        newItems[i] = e.target.value;
                                        updateField("culturalDosAndDonts", newItems);
                                    }}
                                />
                                <button onClick={() => removeDoDont(i)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Safety Tips */}
                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308', margin: 0 }}>
                            <AlertTriangle size={20} /> General Safety Tips
                        </h3>
                        <button onClick={addTip} style={{ fontSize: '0.75rem', color: '#eab308', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            + Add Tip
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.safetyTips.map((tip, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--input-bg)', fontSize: '0.875rem', flex: 1, color: 'var(--foreground)' }}
                                    placeholder="e.g. Keep a copy of your passport..."
                                    value={tip}
                                    onChange={(e) => {
                                        const newTips = [...data.safetyTips];
                                        newTips[i] = e.target.value;
                                        updateField("safetyTips", newTips);
                                    }}
                                />
                                <button onClick={() => removeTip(i)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Numbers */}
                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', margin: 0 }}>
                            <Phone size={20} /> Emergency Numbers
                        </h3>
                        <button onClick={addEmergency} style={{ fontSize: '0.75rem', color: '#10b981', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            + Add Number
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.emergencyNumbers.map((entry, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--input-bg)', fontSize: '0.875rem', flex: 1, color: 'var(--foreground)' }}
                                    placeholder="Agency Name"
                                    value={entry.name}
                                    onChange={(e) => {
                                        const newNums = [...data.emergencyNumbers];
                                        newNums[i].name = e.target.value;
                                        updateField("emergencyNumbers", newNums);
                                    }}
                                />
                                <input
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--input-bg)', fontSize: '0.875rem', width: '120px', color: 'var(--foreground)' }}
                                    placeholder="Number"
                                    value={entry.number}
                                    onChange={(e) => {
                                        const newNums = [...data.emergencyNumbers];
                                        newNums[i].number = e.target.value;
                                        updateField("emergencyNumbers", newNums);
                                    }}
                                />
                                <button onClick={() => removeEmergency(i)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
