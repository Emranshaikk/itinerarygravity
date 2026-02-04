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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div className="prose dark:prose-invert">
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                        <Gift className="text-pink-400" size={32} />
                        Bonus & Value Adds
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        This is where you over-deliver. Add resources, maps, and insider warnings to increase the itinerary's perceived value.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary bg-gradient-to-r from-pink-500 to-rose-500 border-none hover:shadow-lg hover:shadow-rose-500/20"
                >
                    {isGenerating ? "Adding Value..." : <><Wand2 size={16} className="mr-2" /> Auto-Fill Bonus</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Master Map & Downloads */}
                <div className="card glass p-6 space-y-6 border-l-4 border-l-green-400">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Map className="text-green-400" size={20} /> Master Resources
                    </h3>

                    <div className="space-y-4">
                        <div className="form-group">
                            <label className="form-label text-gray-300">Google Maps Master List URL</label>
                            <div className="flex gap-2">
                                <input
                                    className="form-input bg-black/20 flex-1"
                                    placeholder="https://goo.gl/maps/..."
                                    value={data.googleMapsLink}
                                    onChange={(e) => updateField("googleMapsLink", e.target.value)}
                                />
                                <a
                                    href={data.googleMapsLink || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`p-3 rounded-lg border border-white/10 flex items-center justify-center transition-colors ${data.googleMapsLink ? "hover:bg-green-500/20 text-green-400" : "text-gray-600 cursor-not-allowed"}`}
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Create a saved list in Google Maps and share the link here.</p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 space-y-3">
                            <label className="text-sm font-semibold text-gray-300">Include Auto-Generated Resources?</label>
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <FileCheck className="text-blue-400" size={20} />
                                    <span className="text-sm">Printable Packing Checklist PDF</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-success toggle-sm"
                                    checked={data.includePackingChecklist}
                                    onChange={(e) => updateField("includePackingChecklist", e.target.checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="text-yellow-400" size={20} />
                                    <span className="text-sm">Editable Budget Planner Template</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-success toggle-sm"
                                    checked={data.includeBudgetPlanner}
                                    onChange={(e) => updateField("includeBudgetPlanner", e.target.checked)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reservation & Upgrades */}
                <div className="card glass p-6 space-y-6 border-l-4 border-l-purple-400">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Crown className="text-purple-400" size={20} /> Expert Advice
                    </h3>

                    <div className="space-y-4">
                        <div className="form-group">
                            <label className="form-label text-gray-300">Reservation & Booking Tips</label>
                            <textarea
                                className="form-input bg-black/20 h-24"
                                placeholder="e.g. Book X restaurant 2 months ahead..."
                                value={data.reservationTips}
                                onChange={(e) => updateField("reservationTips", e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-gray-300">Suggested Trip Upgrades</label>
                            <textarea
                                className="form-input bg-black/20 h-24"
                                placeholder="e.g. Upgrade to Green Car on Shinkansen ($50)..."
                                value={data.tripUpgrades}
                                onChange={(e) => updateField("tripUpgrades", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Common Mistakes */}
                <div className="card glass p-6 space-y-6 md:col-span-2 border-l-4 border-l-red-400">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <AlertTriangle className="text-red-400" size={20} /> "Don't Do This" - Common Mistakes
                    </h3>
                    <textarea
                        className="form-input bg-black/20 h-24 text-lg"
                        placeholder="e.g. Do not tip in Japan. Avoid visiting Kyoto on weekends..."
                        value={data.commonMistakes}
                        onChange={(e) => updateField("commonMistakes", e.target.value)}
                    />
                </div>

                {/* External Links */}
                <div className="card glass p-6 space-y-6 md:col-span-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            <ExternalLink className="text-blue-400" size={20} /> Helpful External Links
                        </h3>
                        <button onClick={addLink} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            <Plus size={16} /> Add Link
                        </button>
                    </div>

                    <div className="space-y-3">
                        {data.externalLinks.map((link, index) => (
                            <div key={index} className="flex gap-4 items-center">
                                <input
                                    className="form-input bg-black/20 flex-1"
                                    placeholder="Label (e.g. Official Train Site)"
                                    value={link.label}
                                    onChange={(e) => updateLink(index, "label", e.target.value)}
                                />
                                <input
                                    className="form-input bg-black/20 flex-[2]"
                                    placeholder="URL (https://...)"
                                    value={link.url}
                                    onChange={(e) => updateLink(index, "url", e.target.value)}
                                />
                                <button onClick={() => removeLink(index)} className="text-gray-500 hover:text-red-400 p-2">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {data.externalLinks.length === 0 && (
                            <div className="text-center py-6 text-gray-500 bg-white/5 rounded-lg border border-dashed border-white/10">
                                No external resources added.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
