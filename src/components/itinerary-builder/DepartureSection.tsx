"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { LogOut, Wand2, Clock, Luggage, Coffee, Train, HandMetal } from "lucide-react";

interface DepartureSectionProps {
    data: ItineraryContent["departure"];
    onChange: (data: ItineraryContent["departure"]) => void;
}

export default function DepartureSection({ data, onChange }: DepartureSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateField = (field: keyof ItineraryContent["departure"], value: any) => {
        onChange({ ...data, [field]: value });
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                checkoutTips: "Most hotels in Kyoto have an 11 AM checkout. You can leave your bags at the front desk for free for the day. If you have extra junk, use the 'Mottainai' donation bins at some stations.",
                airportBuffer: "Allow 3.5 hours for Kyoto Station to KIX (Kansai Airport) travel and check-in. The Haruka Express can occasionally be delayed by wind, so don't risk the last possible train."
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div className="prose dark:prose-invert">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <LogOut className="text-orange-400" size={32} />
                        Departure Plan
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        Make the last day as smooth as the first. Help them leave without the "Airport Panic."
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary bg-gradient-to-r from-orange-600 to-rose-600 border-none hover:shadow-lg hover:shadow-orange-500/20"
                >
                    {isGenerating ? "Packing up..." : <><Wand2 size={16} className="mr-2" /> Auto-Fill Departure</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Checkout Experience */}
                <div className="card glass p-6 space-y-6 border border-white/5 bg-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Clock size={100} />
                    </div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
                        <Luggage size={20} /> Checkout & Bags
                    </h3>
                    <textarea
                        className="form-input bg-black/20 h-40"
                        placeholder="Checkout times, bag storage, early morning taxi booking..."
                        value={data.checkoutTips}
                        onChange={(e) => updateField("checkoutTips", e.target.value)}
                    />
                </div>

                {/* Getting Out */}
                <div className="card glass p-6 space-y-6 border border-white/5 bg-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Train size={100} />
                    </div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-rose-400">
                        <Train size={20} /> Getting to the Airport
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase">Buffer Time Suggestion</label>
                            <input
                                className="form-input bg-black/20"
                                placeholder="e.g. 3-4 Hours"
                                value={data.airportBuffer}
                                onChange={(e) => updateField("airportBuffer", e.target.value)}
                            />
                        </div>
                        <div className="p-4 bg-black/20 rounded-xl space-y-3">
                            <h4 className="text-sm font-bold flex items-center gap-2 text-gray-300">
                                <Coffee size={16} /> The "Last Meal" Tradition
                            </h4>
                            <p className="text-xs text-gray-500 italic">
                                Suggest one last spot for their final meal before heading to the airport.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final Goodbye */}
                <div className="md:col-span-2 card glass p-8 border-l-4 border-l-orange-500 flex flex-col items-center text-center space-y-4">
                    <HandMetal size={40} className="text-orange-400 animate-bounce" />
                    <h3 className="text-2xl font-black text-white italic">"Arigato Gozaimasu"</h3>
                    <p className="text-gray-400 max-w-xl">
                        Encourage them to leave a review for the hotels/restaurants they loved, or suggest a final scenic spot to sit and reflect on the journey.
                    </p>
                </div>

            </div>
        </div>
    );
}
