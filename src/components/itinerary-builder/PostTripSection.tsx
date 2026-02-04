"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { ImageIcon, Wand2, Share2, Heart, Map, Sparkles, Camera } from "lucide-react";

interface PostTripSectionProps {
    data: ItineraryContent["postTrip"];
    onChange: (data: ItineraryContent["postTrip"]) => void;
}

export default function PostTripSection({ data, onChange }: PostTripSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateField = (field: keyof ItineraryContent["postTrip"], value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleNextDestinations = (val: string) => {
        updateField("nextDestinationIdeas", val.split(",").map(s => s.trim()));
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                jetLagRecovery: "Hydrate heavily. Take a long walk in the morning sunlight (don't sleep during the day). Melatonin can help for the first 3 nights.",
                photoTips: "Use the 'Lightroom' app with 'Analog Japan' presets to get that classic Kyoto film look. Organize your photos by Day Number immediately upon return.",
                nextDestinationIdeas: ["Hokkaido (for nature)", "Osaka (for food)", "Kanazawa (for a quiet Kyoto vibe)"]
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div className="prose dark:prose-invert">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <ImageIcon className="text-purple-400" size={32} />
                        Post-Trip & Reflection
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        Keep the adventure alive. Help them process their photos, recover from jet lag, and plan their next dream destination.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:shadow-lg hover:shadow-pink-500/20"
                >
                    {isGenerating ? "Reflecting..." : <><Wand2 size={16} className="mr-2" /> Auto-Fill Reflection</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Jet Lag & Health */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-indigo-400">
                        <Sparkles size={20} /> Jet Lag & Recovery Hacks
                    </h3>
                    <textarea
                        className="form-input bg-black/20 h-32"
                        placeholder="How to adapt back to their home timezone smoothly..."
                        value={data.jetLagRecovery || ""}
                        onChange={(e) => updateField("jetLagRecovery", e.target.value)}
                    />
                </div>

                {/* Content & Photography */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-pink-400">
                        <Camera size={20} /> Photo Editing & Sharing Tips
                    </h3>
                    <textarea
                        className="form-input bg-black/20 h-32"
                        placeholder="Presets to use, best way to organize 1000+ photos..."
                        value={data.photoTips || ""}
                        onChange={(e) => updateField("photoTips", e.target.value)}
                    />
                </div>

                {/* Where Next? */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-emerald-400">
                        <Map size={20} /> "Where to Next?" Ideas
                    </h3>
                    <div className="space-y-4">
                        <input
                            className="form-input bg-black/20"
                            placeholder="e.g. Hokkaido, Osaka, Nara (separated by commas)"
                            value={data.nextDestinationIdeas?.join(", ") || ""}
                            onChange={(e) => handleNextDestinations(e.target.value)}
                        />
                        <div className="flex flex-wrap gap-2">
                            {data.nextDestinationIdeas?.map((dest, i) => (
                                <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
                                    {dest}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Community & Reviews */}
                <div className="card glass p-6 flex flex-col justify-center items-center text-center space-y-4 border-dashed border-2 border-white/10 opacity-70">
                    <Share2 size={40} className="text-gray-500" />
                    <h4 className="text-lg font-bold">Feedback Is A Gift</h4>
                    <p className="text-xs text-gray-500 italic">
                        Encourage your travelers to tag you in their photos! This builds your brand and shows others that your itineraries work.
                    </p>
                    <div className="flex gap-2">
                        <Heart size={16} className="text-pink-500 fill-pink-500" />
                        <Heart size={16} className="text-pink-500 fill-pink-500" />
                        <Heart size={16} className="text-pink-500 fill-pink-500" />
                    </div>
                </div>

            </div>
        </div>
    );
}
