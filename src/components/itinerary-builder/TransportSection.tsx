"use client";

import React, { useState } from "react";
import { Bus, Map, Shield, Smartphone, AlertTriangle, Plus, Trash2, Wand2, Plane } from "lucide-react";

interface TransportMode {
    type: string;
    tips: string;
    cost?: string;
    bestFor?: string;
}

interface TransportSectionProps {
    data: {
        cityLayout: string;
        modes: TransportMode[];
        passes: string;
        walkingAdvice: string;
        apps: string[];
        scams: string;
        airportTransfer: string;
        dailyStrategy: string;
    };
    onChange: (data: any) => void;
}

export default function TransportSection({ data, onChange }: TransportSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleModeChange = (index: number, field: keyof TransportMode, value: string) => {
        const newModes = [...data.modes];
        newModes[index] = { ...newModes[index], [field]: value };
        onChange({ ...data, modes: newModes });
    };

    const addMode = () => {
        onChange({
            ...data,
            modes: [...data.modes, { type: "", tips: "", cost: "", bestFor: "" }]
        });
    };

    const removeMode = (index: number) => {
        const newModes = data.modes.filter((_, i) => i !== index);
        onChange({ ...data, modes: newModes });
    };

    const handleAppChange = (index: number, value: string) => {
        const newApps = [...data.apps];
        newApps[index] = value;
        onChange({ ...data, apps: newApps });
    };

    const addApp = () => {
        onChange({ ...data, apps: [...data.apps, ""] });
    };

    const removeApp = (index: number) => {
        const newApps = data.apps.filter((_, i) => i !== index);
        onChange({ ...data, apps: newApps });
    };

    const generateAIContent = async () => {
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            onChange({
                ...data,
                cityLayout: "The city is divided into 5 main districts, with the historic center (Old Town) being very walkable. The metro system connects the outer rings efficiently.",
                walkingAdvice: "Walking is the best way to explore the Old Town. Wear comfortable shoes as cobblestones are common.",
                passes: "Get the 'City Card' for unlimited metro/bus access and museum entry. Available for 24h, 48h, or 72h.",
                airportTransfer: "The Express Train is the fastest (20 mins). Taxis have a flat rate but can get stuck in traffic.",
                dailyStrategy: "Use the metro for long distances between districts, then walk within each neighborhood. Avoid rush hour (5-7 PM).",
                scams: "Ignore 'free' bracelets offered by street vendors. Always ensure the taxi meter is running.",
                apps: ["CityMapper", "Uber/Bolt", "Google Maps Offline"],
                modes: [
                    { type: "Metro", tips: "Clean, fast, and safe. Runs until midnight.", cost: "$2 per ride", bestFor: "Long distances" },
                    { type: "Taxi/Rideshare", tips: "Use apps instead of hailing. Reliable at night.", cost: "$10-20 avg", bestFor: "Night travel & groups" }
                ]
            });
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                        <Bus style={{ color: '#2563eb' }} size={32} />
                        Transport Playbook
                    </h2>
                    <p style={{ color: 'var(--gray-400)' }}>
                        Help your travelers navigate like a local. Clear, confident advice prevents stress and scams.
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

            {/* City Layout & Strategy */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                        <Map style={{ color: '#16a34a' }} size={20} /> City Layout & Movement
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)' }}>City Layout Overview</label>
                            <textarea
                                className="form-input"
                                style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                                placeholder="e.g. The city is concentric with 3 main zones..."
                                value={data.cityLayout}
                                onChange={(e) => onChange({ ...data, cityLayout: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)' }}>Daily Transport Strategy</label>
                            <textarea
                                className="form-input"
                                style={{ minHeight: '80px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                                placeholder="e.g. Walk in the morning, Metro for dinner."
                                value={data.dailyStrategy}
                                onChange={(e) => onChange({ ...data, dailyStrategy: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                        <Shield style={{ color: '#ca8a04' }} size={20} /> Safety & Tricks
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)' }}>Common Scams to Avoid</label>
                            <textarea
                                className="form-input"
                                style={{ minHeight: '80px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                                placeholder="e.g. Taxis claiming the meter is broken..."
                                value={data.scams}
                                onChange={(e) => onChange({ ...data, scams: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)' }}>Walking Advice</label>
                            <input
                                type="text"
                                className="form-input"
                                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                                placeholder="e.g. Very walkable, but hilly."
                                value={data.walkingAdvice}
                                onChange={(e) => onChange({ ...data, walkingAdvice: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)' }}>Travel Passes / Cards</label>
                            <input
                                type="text"
                                className="form-input"
                                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                                placeholder="e.g. 3-Day Metro Pass is best value."
                                value={data.passes}
                                onChange={(e) => onChange({ ...data, passes: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transport Modes */}
            <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--foreground)', margin: 0 }}>Transport Modes (Metro, Taxi, etc.)</h3>
                    <button onClick={addMode} style={{ fontSize: '0.75rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Plus size={16} /> Add Mode
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {data.modes.map((mode, index) => (
                        <div key={index} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1.5rem', backgroundColor: 'var(--input-bg)', borderRadius: '1rem', border: '1px solid var(--border)', position: 'relative' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ background: 'var(--surface)', color: 'var(--foreground)' }}
                                    placeholder="Mode (e.g. Metro)"
                                    value={mode.type}
                                    onChange={(e) => handleModeChange(index, "type", e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ background: 'var(--surface)', color: 'var(--foreground)' }}
                                    placeholder="Avg Cost"
                                    value={mode.cost}
                                    onChange={(e) => handleModeChange(index, "cost", e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <textarea
                                    className="form-input"
                                    style={{ background: 'var(--surface)', minHeight: '88px', color: 'var(--foreground)' }}
                                    placeholder="Tips & how to use..."
                                    value={mode.tips}
                                    onChange={(e) => handleModeChange(index, "tips", e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ background: 'var(--surface)', color: 'var(--foreground)' }}
                                    placeholder="Best For..."
                                    value={mode.bestFor}
                                    onChange={(e) => handleModeChange(index, "bestFor", e.target.value)}
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', margin: 0 }}>e.g. 'Night travel', 'Budget'</p>
                            </div>
                            <button
                                onClick={() => removeMode(index)}
                                style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {data.modes.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)', border: '2px dashed var(--border)', borderRadius: '1rem' }}>
                            No transport modes added yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Apps & Logistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                            <Smartphone style={{ color: '#9333ea' }} size={20} /> Essential Apps
                        </h3>
                        <button onClick={addApp} style={{ fontSize: '0.75rem', color: '#9333ea', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                            + Add App
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {data.apps.map((app, index) => (
                            <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                                    placeholder="App Name (e.g. CityMapper)"
                                    value={app}
                                    onChange={(e) => handleAppChange(index, e.target.value)}
                                />
                                <button
                                    onClick={() => removeApp(index)}
                                    style={{ background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                        <Plane style={{ color: '#2563eb' }} size={20} /> Airport Transfer
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-400)' }}>Best way to get to/from Hotel</label>
                        <textarea
                            className="form-input"
                            style={{ minHeight: '120px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                            placeholder="e.g. Express Train (20m, $15) is best."
                            value={data.airportTransfer}
                            onChange={(e) => onChange({ ...data, airportTransfer: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
