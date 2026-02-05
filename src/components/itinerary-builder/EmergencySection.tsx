"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { AlertCircle, Wand2, Plus, Trash2, Phone, Hospital, MapPin, ExternalLink } from "lucide-react";

interface EmergencySectionProps {
    data: ItineraryContent["safety"];
    onChange: (data: ItineraryContent["safety"]) => void;
}

export default function EmergencySection({ data, onChange }: EmergencySectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateEmergencyNumbers = (newNums: { name: string; number: string }[]) => {
        onChange({ ...data, emergencyNumbers: newNums });
    };

    const addNumber = () => {
        updateEmergencyNumbers([...data.emergencyNumbers, { name: "", number: "" }]);
    };

    const removeNumber = (index: number) => {
        updateEmergencyNumbers(data.emergencyNumbers.filter((_, i) => i !== index));
    };

    const updateNumber = (index: number, field: "name" | "number", value: string) => {
        const newNums = [...data.emergencyNumbers];
        newNums[index] = { ...newNums[index], [field]: value };
        updateEmergencyNumbers(newNums);
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                ...data,
                emergencyNumbers: [
                    { name: "Police", number: "110" },
                    { name: "Ambulance / Fire", number: "119" },
                    { name: "Japan Helpline (English)", number: "0570-000-911" },
                    { name: "AMDA International Medical Information Center", number: "03-5285-8088" }
                ]
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1c1917', marginBottom: '0.5rem' }}>
                        <AlertCircle style={{ color: '#ef4444' }} size={32} />
                        Emergency Reference
                    </h2>
                    <p style={{ color: '#78716c' }}>
                        Critical information for when things go wrong. Quick-access numbers and medical locations.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Preparing..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill Essentials</>}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

                {/* Emergency Numbers */}
                <div style={{ padding: '2.25rem', border: '1px solid #f5f5f4', borderRadius: '1.5rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', margin: 0 }}>
                            <Phone size={20} /> Emergency Contacts
                        </h3>
                        <button onClick={addNumber} style={{ fontSize: '0.75rem', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            + Add Contact
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.emergencyNumbers.map((entry, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    className="form-input"
                                    style={{ backgroundColor: '#fdfbf7', flex: 1, fontSize: '0.875rem' }}
                                    placeholder="e.g. Police"
                                    value={entry.name}
                                    onChange={(e) => updateNumber(i, "name", e.target.value)}
                                />
                                <input
                                    className="form-input"
                                    style={{ backgroundColor: '#fdfbf7', width: '120px', fontSize: '0.875rem' }}
                                    placeholder="Number"
                                    value={entry.number}
                                    onChange={(e) => updateNumber(i, "number", e.target.value)}
                                />
                                <button onClick={() => removeNumber(i)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#a8a29e', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Medical & Hospital Info */}
                <div style={{ padding: '2.25rem', border: '1px solid #f5f5f4', borderRadius: '1.5rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', margin: 0 }}>
                        <Hospital size={20} /> Hospitals (English Speaking)
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ padding: '1.25rem', borderRadius: '1rem', backgroundColor: '#fdfbf7', border: '1px solid #f5f5f4', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.925rem', fontWeight: 'bold', color: '#1c1917', margin: 0 }}>Kyoto University Hospital</h4>
                                    <p style={{ fontSize: '0.75rem', color: '#78716c', margin: '0.25rem 0 0 0' }}>Major center with English support.</p>
                                </div>
                                <MapPin size={16} style={{ color: '#3b82f6' }} />
                            </div>
                            <p style={{ fontSize: '0.825rem', color: '#1c1917', margin: 0 }}>54 Shogoin Kawaharacho, Sakyo Ward, Kyoto.</p>
                        </div>
                        <div style={{ padding: '1.25rem', borderRadius: '1rem', backgroundColor: '#fdfbf7', border: '1px solid #f5f5f4', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.925rem', fontWeight: 'bold', color: '#1c1917', margin: 0 }}>Japan Health Info (Service)</h4>
                                    <p style={{ fontSize: '0.75rem', color: '#78716c', margin: '0.25rem 0 0 0' }}>Call to find the nearest clinic.</p>
                                </div>
                                <ExternalLink size={16} style={{ color: '#3b82f6' }} />
                            </div>
                            <p style={{ fontSize: '0.825rem', color: '#1c1917', margin: 0 }}>Website: japanhealthinfo.com</p>
                        </div>
                    </div>
                </div>

                {/* Insurance Info */}
                <div style={{ gridColumn: '1 / -1', padding: '2.5rem', border: '1px solid #f5f5f4', borderRadius: '1.5rem', backgroundColor: '#fdfbf7', borderLeft: '6px solid #10b981', display: 'flex', gap: '1.5rem', alignItems: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ padding: '1rem', borderRadius: '100%', backgroundColor: 'white', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e7e5e4' }}>
                        <AlertCircle size={28} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1c1917', margin: '0 0 0.5rem 0' }}>Travel Insurance Quick-Reference</h3>
                        <p style={{ fontSize: '0.925rem', color: '#78716c', margin: 0, lineHeight: 1.5 }}>
                            This section in the final PDF will include a space for the traveler to write their policy number and the 24/7 global assistance number. Remind them to keep a physical copy in their day-pack.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
