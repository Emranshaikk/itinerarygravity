"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Star, Wand2, Plus, Trash2, MapPin, Clock, Users, AlertCircle } from "lucide-react";

interface SecretsSectionProps {
    data: ItineraryContent["secrets"];
    onChange: (data: ItineraryContent["secrets"]) => void;
}

export default function SecretsSection({ data, onChange }: SecretsSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const addPlace = () => {
        onChange({
            ...data,
            places: [
                ...data.places,
                { name: "", description: "", type: "", bestTime: "", idealFor: "", tips: "" }
            ]
        });
    };

    const removePlace = (index: number) => {
        const newPlaces = data.places.filter((_, i) => i !== index);
        onChange({ ...data, places: newPlaces });
    };

    const updatePlace = (index: number, field: string, value: string) => {
        const newPlaces = [...data.places];
        (newPlaces[index] as any)[field] = value;
        onChange({ ...data, places: newPlaces });
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                places: [
                    {
                        name: "Omoide Yokocho (Piss Alley)",
                        type: "Experience",
                        description: "A narrow, smoky alleyway packed with tiny yakitori stalls. It feels like stepping back into the Showa era. Authentic, gritty, and delicious.",
                        bestTime: "After 7 PM for the full atmosphere.",
                        idealFor: "Photographers & Foodies",
                        tips: "Most stalls have a cover charge. Bring cash. Not for claustrophobics.",
                        locationUrl: "https://goo.gl/maps/..."
                    },
                    {
                        name: "Gotokuji Temple",
                        type: "Viewpoint",
                        description: "The birthplace of the 'Maneki-neko' (beckoning cat). Hundreds of white cat statues are tucked into a quiet corner of the temple grounds.",
                        bestTime: "Morning (9-10 AM) for quiet photos.",
                        idealFor: "Cat lovers & Instagrammers",
                        tips: "It's a residential area, so be respectful. The shop selling cat figurines closes at 4 PM."
                    },
                    {
                        name: "Nakameguro Under the Tracks",
                        type: "Shopping/Art",
                        description: "A trendy collection of bookstores, cafes, and galleries under the train tracks. Very local vibe, far from the chaotic Shibuya crowds.",
                        bestTime: "Afternoon for coffee and browsing.",
                        idealFor: "Hipsters & Design lovers",
                        tips: "Check out the Tsutaya Books nearby for a great lounge spot."
                    }
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
                        <Star className="text-yellow-400" size={32} />
                        Hidden Gems & Secrets
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        Reveal the spots that make this trip special. Not over-touristy, loved by locals, and authentic.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary bg-gradient-to-r from-yellow-500 to-orange-500 border-none hover:shadow-lg hover:shadow-orange-500/20 text-black font-bold"
                >
                    {isGenerating ? "Revealing Gems..." : <><Wand2 size={16} className="mr-2" /> Auto-Fill Gems</>}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {data.places.map((place, index) => (
                    <div key={index} className="card glass p-0 border border-white/5 overflow-hidden group hover:border-yellow-500/30 transition-all">
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 space-y-4">
                                    <div className="flex gap-4">
                                        <input
                                            className="bg-transparent border-0 border-b border-white/10 text-2xl font-bold placeholder-gray-600 focus:ring-0 w-full focus:border-yellow-400"
                                            placeholder="Name of Hidden Gem"
                                            value={place.name}
                                            onChange={(e) => updatePlace(index, "name", e.target.value)}
                                        />
                                        <input
                                            className="bg-white/5 rounded-lg px-3 py-1 text-sm text-yellow-200 w-40 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                                            placeholder="Type (e.g. Viewpoint)"
                                            value={place.type}
                                            onChange={(e) => updatePlace(index, "type", e.target.value)}
                                        />
                                    </div>
                                    <textarea
                                        className="form-input bg-black/20 text-gray-300 min-h-[80px]"
                                        placeholder="Why is it special? What's the vibe?"
                                        value={place.description}
                                        onChange={(e) => updatePlace(index, "description", e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => removePlace(index)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                                        <Clock size={12} className="text-blue-400" /> BEST TIME TO VISIT
                                    </label>
                                    <input
                                        className="form-input text-sm bg-black/20"
                                        placeholder="e.g. Sunset or Early Morning"
                                        value={place.bestTime || ""}
                                        onChange={(e) => updatePlace(index, "bestTime", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                                        <Users size={12} className="text-purple-400" /> PERFECT FOR
                                    </label>
                                    <input
                                        className="form-input text-sm bg-black/20"
                                        placeholder="e.g. Photographers, Couples"
                                        value={place.idealFor || ""}
                                        onChange={(e) => updatePlace(index, "idealFor", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                                        <AlertCircle size={12} className="text-red-400" /> CAUTIONS / TIPS
                                    </label>
                                    <input
                                        className="form-input text-sm bg-black/20"
                                        placeholder="e.g. Cash only, hard to find"
                                        value={place.tips || ""}
                                        onChange={(e) => updatePlace(index, "tips", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {data.places.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                        <Star size={40} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No Secrets Revealed Yet</h3>
                        <p className="text-gray-500 max-w-md mx-auto mt-2">
                            This is often the most valuable part of the itinerary. Share local spots that aren't in generic guidebooks.
                        </p>
                        <button onClick={addPlace} className="mt-6 btn btn-outline border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                            Add First Hidden Gem
                        </button>
                    </div>
                )}

                {data.places.length > 0 && (
                    <button onClick={addPlace} className="w-full btn btn-outline border-dashed py-4 hover:bg-white/5 hover:border-white/20 hover:text-white transition-all">
                        <Plus size={20} className="mr-2" />
                        Add Another Hidden Gem
                    </button>
                )}
            </div>
        </div>
    );
}
