"use client";

import React from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Upload } from "lucide-react";

interface CoverSectionProps {
    data: ItineraryContent["cover"];
    onChange: (data: ItineraryContent["cover"]) => void;
}

export default function ItineraryCover({ data, onChange }: CoverSectionProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="prose dark:prose-invert">
                <h2 className="text-2xl font-bold mb-2">Cover & Basic Info</h2>
                <p className="text-gray-400">
                    This is your first impression. Make it count! Travelers decide here if this itinerary is right for them.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div className="form-group">
                    <label className="form-label">Itinerary Title</label>
                    <input
                        name="title"
                        value={data.title}
                        onChange={handleChange}
                        className="form-input text-lg"
                        placeholder="e.g. 10 Days of Luxury in Kyoto"
                        autoFocus
                    />
                </div>

                {/* Destination & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="form-label">Destination</label>
                        <input
                            name="destination"
                            value={data.destination}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g. Kyoto, Japan"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Duration</label>
                        <input
                            name="duration"
                            value={data.duration}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g. 7 Days / 6 Nights"
                        />
                    </div>
                </div>

                {/* Trip Type & Audience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="form-label">Trip Type</label>
                        <select
                            name="tripType"
                            value={data.tripType}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="Luxury">Luxury</option>
                            <option value="Budget">Budget</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Honeymoon">Honeymoon</option>
                            <option value="Family">Family</option>
                            <option value="Solo">Solo</option>
                            <option value="Cultural">Cultural</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Target Audience / Who is this for?</label>
                        <input
                            name="targetAudience"
                            value={data.targetAudience}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g. Foodies, Couples, History Buffs"
                        />
                    </div>
                </div>

                {/* Description / Best Time */}
                <div className="form-group">
                    <label className="form-label">Best Time to Travel</label>
                    <input
                        name="bestTimeToVisit"
                        value={data.bestTimeToVisit}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g. March-May or Oct-Nov"
                    />
                </div>

                {/* Branding */}
                <div className="p-4 border border-white/10 rounded-xl bg-white/5">
                    <h3 className="text-lg font-medium mb-4">Branding</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                            <label className="form-label">Your Brand Name</label>
                            <input
                                name="brandName"
                                value={data.brandName || ""}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g. Wanderlust With Sarah"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tagline (Optional)</label>
                            <input
                                name="tagline"
                                value={data.tagline || ""}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g. Curated by a local expert"
                            />
                        </div>
                    </div>
                </div>

                {/* Listing Price */}
                <div className="p-4 border border-green-500/20 rounded-xl bg-green-500/5">
                    <h3 className="text-lg font-medium mb-4 text-green-400">Listing Price</h3>
                    <p className="text-sm text-gray-400 mb-4">Set the price for this itinerary guide.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                            <label className="form-label">Price</label>
                            <input
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.price || ""}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Currency</label>
                            <select
                                name="currency"
                                value={data.currency || "USD"}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="INR">INR (₹)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
