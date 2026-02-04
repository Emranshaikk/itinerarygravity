"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { PlaneLanding, Wand2, MapPin, Coffee, Key, Clock, Train, Luggage } from "lucide-react";

interface ArrivalSectionProps {
    data: ItineraryContent["arrival"];
    onChange: (data: ItineraryContent["arrival"]) => void;
}

export default function ArrivalSection({ data, onChange }: ArrivalSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateField = (field: keyof ItineraryContent["arrival"], value: any) => {
        onChange({ ...data, [field]: value });
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                airportToCity: "Take the Haruka Express from KIX (Kansai Airport) directly to Kyoto Station (75 mins). Use a Suica/ICOCA card.",
                checkInProcess: "Most Ryokans allow luggage drop-off from 10 AM, even if check-in is at 3 PM. Use the 'Sagawa' delivery service if you want your bags sent ahead.",
                firstMealSuggestion: "Nishiki Market. It's a 10-min walk from most downtown hotels and has 100+ stalls for snacks.",
                orientationTips: "Kyoto is a grid. If you are lost, find the Kyoto Tower; it's always south (near the station).",
                simCardPickUp: "There is a Bic Camera at Kyoto Station (Floor 2) that sells prepaid SIMs if you didn't get an eSIM."
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div className="prose dark:prose-invert">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <PlaneLanding className="text-blue-400" size={32} />
                        Arrival Day Experience
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        The first 4 hours are the most stressful. Guide them from the airport to their first "I'm finally here" moment.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary bg-gradient-to-r from-blue-600 to-cyan-600 border-none hover:shadow-lg hover:shadow-blue-500/20"
                >
                    {isGenerating ? "Landing..." : <><Wand2 size={16} className="mr-2" /> Auto-Fill Arrival</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Getting from Airport */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Train size={80} />
                    </div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
                        <Train size={20} /> Airport to City Transfer
                    </h3>
                    <textarea
                        className="form-input bg-black/20 h-32"
                        placeholder="Step-by-step instructions. Which train? Which exit?"
                        value={data.airportToCity}
                        onChange={(e) => updateField("airportToCity", e.target.value)}
                    />
                </div>

                {/* Check-in & Luggage */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Luggage size={80} />
                    </div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-purple-400">
                        <Key size={20} /> Check-in & Luggage Info
                    </h3>
                    <textarea
                        className="form-input bg-black/20 h-32"
                        placeholder="Can they drop bags early? Any quirks about hotels here?"
                        value={data.checkInProcess}
                        onChange={(e) => updateField("checkInProcess", e.target.value)}
                    />
                </div>

                {/* First Meal */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Coffee size={80} />
                    </div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-orange-400">
                        <Coffee size={20} /> First "Welcome" Meal
                    </h3>
                    <textarea
                        className="form-input bg-black/20 h-32"
                        placeholder="Suggest somewhere easy and iconic near the main hub."
                        value={data.firstMealSuggestion}
                        onChange={(e) => updateField("firstMealSuggestion", e.target.value)}
                    />
                </div>

                {/* Orientation */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <MapPin size={80} />
                    </div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-emerald-400">
                        <MapPin size={20} /> Quick Orientation Tips
                    </h3>
                    <textarea
                        className="form-input bg-black/20 h-32"
                        placeholder="How to find their bearings? Landmark suggestions?"
                        value={data.orientationTips}
                        onChange={(e) => updateField("orientationTips", e.target.value)}
                    />
                </div>

                {/* Last-Minute Tech */}
                <div className="md:col-span-2 card glass p-6 space-y-4 border border-white/5 bg-white/5">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-amber-500">
                        <Clock size={20} /> Last-Minute Essentials (SIM/Cash)
                    </h3>
                    <input
                        className="form-input bg-black/20"
                        placeholder="e.g. Best place to pick up a physical SIM or withdraw cash at arrival."
                        value={data.simCardPickUp || ""}
                        onChange={(e) => updateField("simCardPickUp", e.target.value)}
                    />
                </div>

            </div>
        </div>
    );
}
