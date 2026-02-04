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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Bus className="text-blue-400" size={32} />
                        Transport Playbook
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        Help your travelers navigate like a local. Clear, confident advice prevents stress and scams.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-lg hover:shadow-blue-500/20"
                >
                    {isGenerating ? "Generating..." : <><Wand2 size={16} className="mr-2" /> Auto-Fill with AI</>}
                </button>
            </div>

            {/* City Layout & Strategy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl border border-white/5 bg-white/5 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Map className="text-green-400" size={20} /> City Layout & Movement
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">City Layout Overview</label>
                            <textarea
                                className="form-input w-full min-h-[100px] bg-black/20"
                                placeholder="e.g. The city is concentric with 3 main zones. Most sights are in Zone 1..."
                                value={data.cityLayout}
                                onChange={(e) => onChange({ ...data, cityLayout: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Daily Transport Strategy</label>
                            <textarea
                                className="form-input w-full min-h-[80px] bg-black/20"
                                placeholder="e.g. Walk in the morning, Metro for dinner. Avoid buses during rush hour."
                                value={data.dailyStrategy}
                                onChange={(e) => onChange({ ...data, dailyStrategy: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="glass p-6 rounded-xl border border-white/5 bg-white/5 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Shield className="text-yellow-400" size={20} /> Safety & Tricks
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Common Scams to Avoid</label>
                            <textarea
                                className="form-input w-full min-h-[80px] bg-black/20"
                                placeholder="e.g. Taxis claiming the meter is broken..."
                                value={data.scams}
                                onChange={(e) => onChange({ ...data, scams: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Walking Advice</label>
                            <input
                                type="text"
                                className="form-input w-full bg-black/20"
                                placeholder="e.g. Very walkable, but hilly. Bring sneakers."
                                value={data.walkingAdvice}
                                onChange={(e) => onChange({ ...data, walkingAdvice: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Travel Passes / Cards</label>
                            <input
                                type="text"
                                className="form-input w-full bg-black/20"
                                placeholder="e.g. 3-Day Metro Pass (Zone 1-3) is best value."
                                value={data.passes}
                                onChange={(e) => onChange({ ...data, passes: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transport Modes */}
            <div className="glass p-6 rounded-xl border border-white/5 bg-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Transport Modes (Metro, Taxi, etc.)</h3>
                    <button onClick={addMode} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <Plus size={16} /> Add Mode
                    </button>
                </div>
                <div className="space-y-4">
                    {data.modes.map((mode, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4 bg-black/20 rounded-lg border border-white/5">
                            <div className="md:col-span-3 space-y-2">
                                <input
                                    type="text"
                                    className="form-input w-full text-sm"
                                    placeholder="Mode (e.g. Metro)"
                                    value={mode.type}
                                    onChange={(e) => handleModeChange(index, "type", e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-input w-full text-sm"
                                    placeholder="Avg Cost"
                                    value={mode.cost}
                                    onChange={(e) => handleModeChange(index, "cost", e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-5">
                                <textarea
                                    className="form-input w-full text-sm h-[88px]"
                                    placeholder="Tips & how to use..."
                                    value={mode.tips}
                                    onChange={(e) => handleModeChange(index, "tips", e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-3">
                                <input
                                    type="text"
                                    className="form-input w-full text-sm mb-2"
                                    placeholder="Best For..."
                                    value={mode.bestFor}
                                    onChange={(e) => handleModeChange(index, "bestFor", e.target.value)}
                                />
                                <p className="text-xs text-gray-500">e.g. 'Night travel', 'Budget'</p>
                            </div>
                            <div className="md:col-span-1 flex justify-center">
                                <button
                                    onClick={() => removeMode(index)}
                                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {data.modes.length === 0 && (
                        <div className="text-center py-8 text-gray-500 bg-white/5 rounded-lg border border-dashed border-white/10">
                            No transport modes added yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Apps & Logistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl border border-white/5 bg-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Smartphone className="text-purple-400" size={20} /> Essential Apps
                        </h3>
                        <button onClick={addApp} className="text-xs text-purple-400 hover:text-purple-300">
                            + Add App
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.apps.map((app, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    className="form-input w-full"
                                    placeholder="App Name (e.g. CityMapper)"
                                    value={app}
                                    onChange={(e) => handleAppChange(index, e.target.value)}
                                />
                                <button
                                    onClick={() => removeApp(index)}
                                    className="text-gray-500 hover:text-red-400 px-2"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass p-6 rounded-xl border border-white/5 bg-white/5 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Plane className="text-blue-400" size={20} /> Airport Transfer
                    </h3>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Best way to get to/from Hotel</label>
                        <textarea
                            className="form-input w-full min-h-[120px] bg-black/20"
                            placeholder="e.g. Express Train (20m, $15) is best. Avoid station taxis..."
                            value={data.airportTransfer}
                            onChange={(e) => onChange({ ...data, airportTransfer: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
