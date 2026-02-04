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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div className="prose dark:prose-invert">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Sliders className="text-purple-400" size={32} />
                        Customization Options
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        A great itinerary works for everyone. Add specific advice for different traveler profiles and budget levels.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 border-none hover:shadow-lg hover:shadow-purple-500/20"
                >
                    {isGenerating ? "Personalizing..." : <><Wand2 size={16} className="mr-2" /> Auto-Fill Options</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Profile Specific Tips */}
                <div className="card glass p-6 space-y-6 border border-white/5 bg-white/5">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-pink-400">
                        <Users size={20} /> Traveler Profiles
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><Heart size={12} className="text-pink-400" /> For Couples</label>
                            <textarea
                                className="form-input bg-black/20 h-24"
                                placeholder="Romantic spots, private dinners..."
                                value={data.coupleTips || ""}
                                onChange={(e) => updateField("coupleTips", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><Users size={12} className="text-blue-400" /> For Families</label>
                            <textarea
                                className="form-input bg-black/20 h-24"
                                placeholder="Kid-friendly activities, stroller info..."
                                value={data.familyTips || ""}
                                onChange={(e) => updateField("familyTips", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><User size={12} className="text-emerald-400" /> For Solo Travelers</label>
                            <textarea
                                className="form-input bg-black/20 h-24"
                                placeholder="Safety for solos, social spots..."
                                value={data.soloTips || ""}
                                onChange={(e) => updateField("soloTips", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Tier Specific Advice */}
                <div className="card glass p-6 space-y-6 border border-white/5 bg-white/5">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-yellow-400">
                        <ArrowUpCircle size={20} /> Budget & Luxury Tweaks
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><ArrowUpCircle size={12} className="text-amber-400" /> Luxury Upgrades</label>
                            <textarea
                                className="form-input bg-black/20 h-32"
                                placeholder="How to make this trip 'First Class'..."
                                value={data.luxuryUpgrade || ""}
                                onChange={(e) => updateField("luxuryUpgrade", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><Wallet size={12} className="text-green-400" /> Budget Saving Hacks</label>
                            <textarea
                                className="form-input bg-black/20 h-32"
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
