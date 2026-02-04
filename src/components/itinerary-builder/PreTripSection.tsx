"use client";

import React from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Plus, Trash, Plane, CheckSquare } from "lucide-react";

interface PreTripSectionProps {
    data: ItineraryContent["preTrip"];
    onChange: (data: ItineraryContent["preTrip"]) => void;
}

"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Plane, CheckSquare, Wand2, Smartphone, CreditCard, AlertTriangle, Briefcase, Shirt, Zap } from "lucide-react";

interface PreTripSectionProps {
    data: ItineraryContent["preTrip"];
    onChange: (data: ItineraryContent["preTrip"]) => void;
}

export default function PreTripSection({ data, onChange }: PreTripSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleFlightChange = (field: keyof ItineraryContent["preTrip"]["flightGuide"], value: any) => {
        onChange({
            ...data,
            flightGuide: { ...data.flightGuide, [field]: value }
        });
    };

    const handleEssentialsChange = (field: keyof ItineraryContent["preTrip"]["essentials"], value: any) => {
        onChange({
            ...data,
            essentials: { ...data.essentials, [field]: value }
        });
    };

    // Helper for array inputs (comma separated)
    const handleArrayInput = (value: string) => value.split(",").map(s => s.trim());

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
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div className="prose dark:prose-invert">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Plane className="text-blue-400" size={32} />
                        Before You Travel
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        A stress-free checklist from 7 days out until boarding. Cover flights, packing, and quick prep.
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

            {/* Flight Guide */}
            <div className="card glass p-6 space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Plane className="text-blue-400" size={20} /> Flight Strategy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="form-label text-gray-300">Best Airports</label>
                        <input
                            className="form-input bg-black/20"
                            placeholder="e.g. NRT or KIX"
                            value={data.flightGuide.bestAirports.join(", ")}
                            onChange={e => handleFlightChange("bestAirports", handleArrayInput(e.target.value))}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label text-gray-300">Arrival Strategy</label>
                        <input
                            className="form-input bg-black/20"
                            placeholder="e.g. Arrive before noon to catch the train..."
                            value={data.flightGuide.arrivalDepartureStats}
                            onChange={e => handleFlightChange("arrivalDepartureStats", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label text-gray-300">Seat Selection Secret</label>
                        <textarea
                            className="form-input bg-black/20 h-24"
                            placeholder="e.g. Sit on the left for views..."
                            value={data.flightGuide.seatTips || ""}
                            onChange={e => handleFlightChange("seatTips", e.target.value)}
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="form-group">
                            <label className="form-label text-gray-300">Baggage Tips</label>
                            <input
                                className="form-input bg-black/20"
                                placeholder="e.g. Pack light, trains are small."
                                value={data.flightGuide.baggageTips || ""}
                                onChange={e => handleFlightChange("baggageTips", e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-gray-300">Jet Lag Hack</label>
                            <input
                                className="form-input bg-black/20"
                                placeholder="e.g. Stay awake until 9PM local."
                                value={data.flightGuide.jetLagTips || ""}
                                onChange={e => handleFlightChange("jetLagTips", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Prep: Connectivity & Money (Brief) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card glass p-6 space-y-4 border-l-4 border-l-purple-500">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Smartphone className="text-purple-400" size={20} /> Tech & Connectivity Prep
                    </h3>
                    <p className="text-sm text-gray-400">Quick checklist ensuring they are online immediately.</p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-500 text-purple-600 focus:ring-purple-500 bg-transparent" defaultChecked />
                            <span className="text-sm">Download eSIM App (e.g. Airalo/Ubigi)</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-500 text-purple-600 focus:ring-purple-500 bg-transparent" defaultChecked />
                            <span className="text-sm">Download Offline Maps</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-500 text-purple-600 focus:ring-purple-500 bg-transparent" defaultChecked />
                            <span className="text-sm">Pack Universal Adapter</span>
                        </div>
                    </div>
                </div>

                <div className="card glass p-6 space-y-4 border-l-4 border-l-green-500">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <CreditCard className="text-green-400" size={20} /> Money Prep
                    </h3>
                    <p className="text-sm text-gray-400">Avoid frozen cards and high fees.</p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-500 text-green-600 focus:ring-green-500 bg-transparent" defaultChecked />
                            <span className="text-sm">Notify Bank of Travel Dates</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-500 text-green-600 focus:ring-green-500 bg-transparent" defaultChecked />
                            <span className="text-sm">Carry roughly $200 in USD/EUR as backup</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-500 text-green-600 focus:ring-green-500 bg-transparent" defaultChecked />
                            <span className="text-sm">Check Exchange Rates</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Essentials */}
            <div className="card glass p-6 space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <AlertTriangle className="text-yellow-400" size={20} /> Documents & Verification
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    <div className="form-group">
                        <label className="form-label text-gray-300">Required Documents Checklist</label>
                        <textarea
                            className="form-input bg-black/20"
                            placeholder="e.g. Passport, Visa, Hotel Booking (Comma separated)"
                            value={data.essentials.documents.join(", ")}
                            onChange={e => handleEssentialsChange("documents", handleArrayInput(e.target.value))}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label text-gray-300">Health & Vaccines</label>
                            <input
                                className="form-input bg-black/20"
                                placeholder="e.g. Covid Vax, Yellow Fever"
                                value={data.essentials.health.join(", ")}
                                onChange={e => handleEssentialsChange("health", handleArrayInput(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-gray-300">Travel Insurance Advice</label>
                            <input
                                className="form-input bg-black/20"
                                placeholder="e.g. Essential. Ensure it covers cancellation."
                                value={data.essentials.insurance}
                                onChange={e => handleEssentialsChange("insurance", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Packing List */}
            <div className="card glass p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Briefcase className="text-orange-400" size={20} /> Ultimate Packing List
                    </h3>
                    <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded-full border border-orange-500/20">
                        Zero Stress
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Clothes */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 font-semibold text-gray-200">
                            <Shirt size={16} className="text-pink-400" /> Clothes & Wearables
                        </label>
                        <textarea
                            className="form-input bg-black/20 font-mono text-sm h-32"
                            placeholder="One item per line..."
                            value={data.packingList.find(p => p.category === "Clothes")?.items.join("\n") || ""}
                            onChange={(e) => {
                                const newItems = e.target.value.split("\n");
                                const newPackingList = [...data.packingList];
                                const index = newPackingList.findIndex(p => p.category === "Clothes");
                                if (index >= 0) newPackingList[index] = { ...newPackingList[index], items: newItems };
                                else newPackingList.push({ category: "Clothes", items: newItems });
                                onChange({ ...data, packingList: newPackingList });
                            }}
                        />
                    </div>

                    {/* Tech */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 font-semibold text-gray-200">
                            <Zap size={16} className="text-yellow-400" /> Tech & Gadgets
                        </label>
                        <textarea
                            className="form-input bg-black/20 font-mono text-sm h-32"
                            placeholder="One item per line..."
                            value={data.packingList.find(p => p.category === "Tech")?.items.join("\n") || ""}
                            onChange={(e) => {
                                const newItems = e.target.value.split("\n");
                                const newPackingList = [...data.packingList];
                                const index = newPackingList.findIndex(p => p.category === "Tech");
                                if (index >= 0) newPackingList[index] = { ...newPackingList[index], items: newItems };
                                else newPackingList.push({ category: "Tech", items: newItems });
                                onChange({ ...data, packingList: newPackingList });
                            }}
                        />
                    </div>

                    {/* Toiletries */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 font-semibold text-gray-200">
                            <CheckSquare size={16} className="text-cyan-400" /> Toiletries & Meds
                        </label>
                        <textarea
                            className="form-input bg-black/20 font-mono text-sm h-32"
                            placeholder="One item per line..."
                            value={data.packingList.find(p => p.category === "Toiletries")?.items.join("\n") || ""}
                            onChange={(e) => {
                                const newItems = e.target.value.split("\n");
                                const newPackingList = [...data.packingList];
                                const index = newPackingList.findIndex(p => p.category === "Toiletries");
                                if (index >= 0) newPackingList[index] = { ...newPackingList[index], items: newItems };
                                else newPackingList.push({ category: "Toiletries", items: newItems });
                                onChange({ ...data, packingList: newPackingList });
                            }}
                        />
                    </div>

                    {/* Misc */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 font-semibold text-gray-200">
                            <CheckSquare size={16} className="text-gray-400" /> Miscellaneous
                        </label>
                        <textarea
                            className="form-input bg-black/20 font-mono text-sm h-32"
                            placeholder="One item per line..."
                            value={data.packingList.find(p => p.category === "Misc")?.items.join("\n") || ""}
                            onChange={(e) => {
                                const newItems = e.target.value.split("\n");
                                const newPackingList = [...data.packingList];
                                const index = newPackingList.findIndex(p => p.category === "Misc");
                                if (index >= 0) newPackingList[index] = { ...newPackingList[index], items: newItems };
                                else newPackingList.push({ category: "Misc", items: newItems });
                                onChange({ ...data, packingList: newPackingList });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
