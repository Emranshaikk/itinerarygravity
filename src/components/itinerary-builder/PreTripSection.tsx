"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Plane, CheckSquare, Wand2, Smartphone, CreditCard, AlertTriangle, Briefcase, Shirt, Zap, Plus, X } from "lucide-react";

interface PreTripSectionProps {
    data: ItineraryContent["preTrip"];
    onChange: (data: ItineraryContent["preTrip"]) => void;
}

export default function PreTripSection({ data, onChange }: PreTripSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [newDoc, setNewDoc] = useState("");

    const handleFlightChange = (field: keyof ItineraryContent["preTrip"]["flightGuide"], value: any) => {
        onChange({ ...data, flightGuide: { ...data.flightGuide, [field]: value } });
    };

    const handleEssentialsChange = (field: keyof ItineraryContent["preTrip"]["essentials"], value: any) => {
        onChange({ ...data, essentials: { ...data.essentials, [field]: value } });
    };

    const addDocument = () => {
        const trimmed = newDoc.trim();
        if (!trimmed) return;
        handleEssentialsChange("documents", [...data.essentials.documents, trimmed]);
        setNewDoc("");
    };

    const removeDocument = (idx: number) => {
        handleEssentialsChange("documents", data.essentials.documents.filter((_, i) => i !== idx));
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                ...data,
                flightGuide: {
                    bestAirports: ["NRT (Narita)", "HND (Haneda)"],
                    arrivalDepartureStats: "Aim to arrive by 3 PM to catch the express train before rush hour.",
                    seatTips: "Sit on the LEFT side (Window A) for Mt. Fuji views when flying into Tokyo.",
                    baggageTips: "Pack light! Trains have limited luggage space. Forward large bags via 'Takkyubin'.",
                    jetLagTips: "Force yourself to stay awake until 9 PM local time. No naps longer than 20 mins."
                },
                essentials: {
                    documents: ["Passport (6 months validity)", "Visit Japan Web QRCode", "Hotel Booking Confirmation"],
                    insurance: "Mandatory. Ensure it covers medical evacuation.",
                    health: ["Bring personal meds (Japan has strict drug laws)", "Walk-in clinics accept cash only"]
                },
                packingList: [
                    { category: "Clothes", items: ["Comfortable walking shoes (Critical)", "Layers for changing weather", "Rain jacket (compact)", "Smart casual outfit for dinners"] },
                    { category: "Tech", items: ["Power Bank (20000mAh)", "Universal Travel Adapter", "Noise-cancelling headphones", "eSIM pre-installed"] },
                    { category: "Toiletries", items: ["Deodorant (Hard to find in Japan)", "Personal skincare", "Hand sanitizer"] },
                    { category: "Misc", items: ["Small coin purse (Cash is king)", "Plastic bag for trash (No public bins)", "Passport copy"] },
                ]
            });
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                        <Plane style={{ color: '#2563eb' }} size={32} />
                        Before You Travel
                    </h2>
                    <p style={{ color: 'var(--gray-400)' }}>
                        A stress-free checklist from 7 days out until boarding. Cover flights, packing, and quick prep.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Generating..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill with AI</>}
                </button>
            </div>

            {/* Flight Guide */}
            <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                    <Plane style={{ color: '#2563eb' }} size={20} /> Flight Strategy
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)' }}>Best Airports (comma separated)</label>
                        <input className="form-input" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                            placeholder="e.g. NRT, KIX"
                            value={data.flightGuide.bestAirports.join(", ")}
                            onChange={e => handleFlightChange("bestAirports", e.target.value.split(",").map(s => s.trim()))}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)' }}>Arrival Strategy</label>
                        <input className="form-input" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                            placeholder="e.g. Arrive before noon..."
                            value={data.flightGuide.arrivalDepartureStats}
                            onChange={e => handleFlightChange("arrivalDepartureStats", e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)' }}>Seat Selection Secret</label>
                        <textarea className="form-input" style={{ backgroundColor: 'var(--input-bg)', minHeight: '90px', color: 'var(--foreground)' }}
                            placeholder="e.g. Sit on the left for views..."
                            value={data.flightGuide.seatTips || ""}
                            onChange={e => handleFlightChange("seatTips", e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)' }}>Baggage Tips</label>
                            <input className="form-input" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                                placeholder="e.g. Pack light..."
                                value={data.flightGuide.baggageTips || ""}
                                onChange={e => handleFlightChange("baggageTips", e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)' }}>Jet Lag Hack</label>
                            <input className="form-input" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                                placeholder="e.g. Stay awake until 9PM..."
                                value={data.flightGuide.jetLagTips || ""}
                                onChange={e => handleFlightChange("jetLagTips", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Prep Cards — checkboxes wrapped in labels so space-bar works */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderLeft: '4px solid #9333ea', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                        <Smartphone style={{ color: '#9333ea' }} size={20} /> Tech &amp; Connectivity Prep
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)', margin: 0 }}>Quick checklist ensuring they are online immediately.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {["Download eSIM App (e.g. Airalo/Ubigi)", "Download Offline Maps", "Pack Universal Adapter"].map((item, idx) => (
                            <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', cursor: 'pointer', userSelect: 'none' }}>
                                <input type="checkbox" style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer', accentColor: '#9333ea' }} />
                                <span style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>{item}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderLeft: '4px solid #16a34a', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                        <CreditCard style={{ color: '#16a34a' }} size={20} /> Money Prep
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)', margin: 0 }}>Avoid frozen cards and high fees.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {["Notify Bank of Travel Dates", "Carry roughly $200 in USD/EUR as backup", "Check Exchange Rates"].map((item, idx) => (
                            <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', cursor: 'pointer', userSelect: 'none' }}>
                                <input type="checkbox" style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer', accentColor: '#16a34a' }} />
                                <span style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>{item}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Documents Checklist — now a proper add/remove list */}
            <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                    <AlertTriangle style={{ color: '#ca8a04' }} size={20} /> Documents &amp; Verification
                </h3>

                {/* Add row */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                        className="form-input"
                        style={{ flex: 1, backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="e.g. Passport, Visa, Hotel Confirmation..."
                        value={newDoc}
                        onChange={e => setNewDoc(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDocument(); } }}
                    />
                    <button
                        onClick={addDocument}
                        style={{ padding: '0.75rem 1.25rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {data.essentials.documents.length === 0 ? (
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>
                            No documents added yet. Type above and press Add or Enter.
                        </p>
                    ) : (
                        data.essentials.documents.map((doc, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '0.75rem', backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)' }}>
                                <CheckSquare size={16} style={{ color: '#ca8a04', flexShrink: 0 }} />
                                <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--foreground)' }}>{doc}</span>
                                <button
                                    onClick={() => removeDocument(idx)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px', display: 'flex', alignItems: 'center' }}
                                    title="Remove"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Health & Insurance */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)' }}>Health &amp; Vaccines (comma separated)</label>
                        <input className="form-input" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                            placeholder="e.g. Covid Vax, Typhoid..."
                            value={data.essentials.health.join(", ")}
                            onChange={e => handleEssentialsChange("health", e.target.value.split(",").map(s => s.trim()))}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)' }}>Travel Insurance Advice</label>
                        <input className="form-input" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                            placeholder="e.g. Essential. Ensure medical coverage."
                            value={data.essentials.insurance}
                            onChange={e => handleEssentialsChange("insurance", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Packing List */}
            <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                        <Briefcase style={{ color: '#ea580c' }} size={20} /> Ultimate Packing List
                    </h3>
                    <span style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--input-bg)', color: '#0891b2', fontSize: '0.75rem', borderRadius: '1rem', border: '1px solid var(--border)', fontWeight: 'bold' }}>
                        Zero Stress
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    {[
                        { title: "Clothes & Wearables", icon: Shirt, color: '#ec4899', category: "Clothes" },
                        { title: "Tech & Gadgets", icon: Zap, color: '#eab308', category: "Tech" },
                        { title: "Toiletries & Meds", icon: CheckSquare, color: '#06b6d4', category: "Toiletries" },
                        { title: "Miscellaneous", icon: CheckSquare, color: 'var(--gray-400)', category: "Misc" }
                    ].map((sec, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-400)' }}>
                                <sec.icon size={16} style={{ color: sec.color }} /> {sec.title}
                            </label>
                            <textarea
                                className="form-input"
                                style={{ minHeight: '120px', backgroundColor: 'var(--input-bg)', fontSize: '0.875rem', color: 'var(--foreground)' }}
                                placeholder="One item per line..."
                                value={data.packingList.find(p => p.category === sec.category)?.items.join("\n") || ""}
                                onChange={(e) => {
                                    const newItems = e.target.value.split("\n");
                                    const newPackingList = [...data.packingList];
                                    const index = newPackingList.findIndex(p => p.category === sec.category);
                                    if (index >= 0) newPackingList[index] = { ...newPackingList[index], items: newItems };
                                    else newPackingList.push({ category: sec.category, items: newItems });
                                    onChange({ ...data, packingList: newPackingList });
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
