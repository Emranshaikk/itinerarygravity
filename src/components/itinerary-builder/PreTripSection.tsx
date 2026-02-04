"use client";

import React from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Plus, Trash, Plane, CheckSquare } from "lucide-react";

interface PreTripSectionProps {
    data: ItineraryContent["preTrip"];
    onChange: (data: ItineraryContent["preTrip"]) => void;
}

export default function PreTripSection({ data, onChange }: PreTripSectionProps) {

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
    const handleArrayInput = (value: string) => value.split(",").map(s => s.trim()).filter(Boolean);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="prose dark:prose-invert">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Plane className="text-blue-400" />
                    Before You Travel
                </h2>
                <p className="text-gray-400">
                    Help your followers prepare for the trip. Flight tips, packing lists, and essentials.
                </p>
            </div>

            {/* Flight Guide */}
            <div className="card glass p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gradient">✈️ Flight Planning Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="form-label">Best Airports to Land</label>
                        <input
                            className="form-input"
                            placeholder="e.g. NRT or KIX"
                            value={data.flightGuide.bestAirports.join(", ")}
                            onChange={e => handleFlightChange("bestAirports", handleArrayInput(e.target.value))}
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate by commas</p>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Ideal Arrival/Departure Times</label>
                        <input
                            className="form-input"
                            placeholder="e.g. Arrive before noon to catch the train"
                            value={data.flightGuide.arrivalDepartureStats}
                            onChange={e => handleFlightChange("arrivalDepartureStats", e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="form-label">Seat Selection Tips</label>
                        <input
                            className="form-input"
                            placeholder="e.g. Left side for Mt Fuji view"
                            value={data.flightGuide.seatTips || ""}
                            onChange={e => handleFlightChange("seatTips", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Jet Lag Tips</label>
                        <input
                            className="form-input"
                            placeholder="e.g. Sleep on the flight"
                            value={data.flightGuide.jetLagTips || ""}
                            onChange={e => handleFlightChange("jetLagTips", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Essentials */}
            <div className="card glass p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gradient">🛡️ Essentials & Documents</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div className="form-group">
                        <label className="form-label">Required Documents</label>
                        <textarea
                            className="form-input"
                            placeholder="e.g. Passport, Visa, Hotel Booking (Comma separated)"
                            value={data.essentials.documents.join(", ")}
                            onChange={e => handleEssentialsChange("documents", handleArrayInput(e.target.value))}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Health & Vaccines</label>
                            <input
                                className="form-input"
                                placeholder="e.g. Covid Vax, Yellow Fever"
                                value={data.essentials.health.join(", ")}
                                onChange={e => handleEssentialsChange("health", handleArrayInput(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Travel Insurance</label>
                            <input
                                className="form-input"
                                placeholder="e.g. Mandatory / Recommended"
                                value={data.essentials.insurance}
                                onChange={e => handleEssentialsChange("insurance", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Packing List - Simplified as text areas for now per category */}
            <div className="card glass p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gradient">🧳 Packing Checklist</h3>
                <p className="text-sm text-gray-400">We've pre-categorized these for you. Just list items.</p>

                {["Clothes", "Electronics", "Toiletries", "Misc"].map((category, idx) => {
                    const existing = data.packingList.find(p => p.category === category);
                    const items = existing ? existing.items.join("\n") : "";

                    return (
                        <div key={category} className="form-group border-b border-white/5 pb-4 last:border-0">
                            <label className="form-label font-bold text-white mb-2">{category}</label>
                            <textarea
                                className="form-input font-mono text-sm"
                                rows={3}
                                placeholder={`List ${category} items (one per line)`}
                                value={items}
                                onChange={(e) => {
                                    const newItems = e.target.value.split("\n").filter(Boolean);
                                    const newPackingList = [...data.packingList];
                                    const index = newPackingList.findIndex(p => p.category === category);
                                    if (index >= 0) {
                                        newPackingList[index] = { ...newPackingList[index], items: newItems };
                                    } else {
                                        newPackingList.push({ category, items: newItems });
                                    }
                                    onChange({ ...data, packingList: newPackingList });
                                }}
                            />
                        </div>
                    )
                })}
            </div>

        </div>
    );
}
