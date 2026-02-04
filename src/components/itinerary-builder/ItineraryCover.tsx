"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Upload, ImageIcon, MapPin, Clock, Tag, User, DollarSign, Wand2, Star } from "lucide-react";

interface CoverSectionProps {
    data: ItineraryContent["cover"];
    onChange: (data: ItineraryContent["cover"]) => void;
}

export default function ItineraryCover({ data, onChange }: CoverSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value) || 0;
        onChange({ ...data, price: val });
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                ...data,
                title: "Cherry Blossoms & Ancient Paths: A 10-Day Kyoto Journey",
                destination: "Kyoto, Japan",
                duration: "10 Days / 9 Nights",
                tripType: "Cultural",
                bestTimeToVisit: "Late March to Early April (Sakura Season)",
                targetAudience: "Aesthetic seekers, history lovers, and culinary explorers",
                brandName: "Curated Trails",
                tagline: "Experience the soul of Japan beyond the crowds.",
                price: 29,
                currency: "USD"
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div className="prose dark:prose-invert">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <ImageIcon className="text-blue-400" size={32} />
                        Cover & First Impression
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        Capture attention instantly. Your title and tagline are what travelers see before they buy.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 border-none hover:shadow-lg hover:shadow-blue-500/20"
                >
                    {isGenerating ? "Creating Cover..." : <><Wand2 size={16} className="mr-2" /> Auto-Fill Cover</>}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Main Identity */}
                <div className="card glass p-8 space-y-6 border border-white/5 bg-white/5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400">Itinerary Title</label>
                        <input
                            name="title"
                            value={data.title}
                            onChange={handleChange}
                            className="bg-transparent border-none text-3xl font-black placeholder-gray-700 focus:ring-0 w-full p-0"
                            placeholder="e.g. The Ultimate Bali Escape"
                        />
                        <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-transparent opacity-30" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                                <MapPin size={14} /> Destination
                            </label>
                            <input
                                name="destination"
                                value={data.destination}
                                onChange={handleChange}
                                className="form-input bg-black/20"
                                placeholder="e.g. Kyoto, Japan"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                                <Clock size={14} /> Duration
                            </label>
                            <input
                                name="duration"
                                value={data.duration}
                                onChange={handleChange}
                                className="form-input bg-black/20"
                                placeholder="e.g. 7 Days / 6 Nights"
                            />
                        </div>
                    </div>
                </div>

                {/* Classification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="card glass p-6 space-y-4 border border-white/5">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Tag className="text-purple-400" size={18} /> Trip Details
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Trip Type</label>
                                <select
                                    name="tripType"
                                    value={data.tripType}
                                    onChange={handleChange}
                                    className="form-input bg-black/20"
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
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Perfect For</label>
                                <input
                                    name="targetAudience"
                                    value={data.targetAudience}
                                    onChange={handleChange}
                                    className="form-input bg-black/20"
                                    placeholder="e.g. Foodies, Couples, Solo ladies"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card glass p-6 space-y-4 border border-white/5">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Star className="text-yellow-400" size={18} /> Seasonal Info
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Best Time to Visit</label>
                                <input
                                    name="bestTimeToVisit"
                                    value={data.bestTimeToVisit}
                                    onChange={handleChange}
                                    className="form-input bg-black/20"
                                    placeholder="e.g. March - May (Sakura Season)"
                                />
                            </div>
                            <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10 text-xs text-yellow-200/60 leading-relaxed">
                                Tip: Be specific about the "why". Instead of "Summer", try "Late June for the Lavender bloom".
                            </div>
                        </div>
                    </div>
                </div>

                {/* Branding & Pricing */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Branding */}
                    <div className="lg:col-span-2 card glass p-6 space-y-6 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <User size={100} />
                        </div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <User className="text-blue-400" size={18} /> Creator Branding
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Brand Name</label>
                                <input
                                    name="brandName"
                                    value={data.brandName || ""}
                                    onChange={handleChange}
                                    className="form-input bg-black/20"
                                    placeholder="Your Name or Brand"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Tagline</label>
                                <input
                                    name="tagline"
                                    value={data.tagline || ""}
                                    onChange={handleChange}
                                    className="form-input bg-black/20"
                                    placeholder="Something catchy..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="card glass p-6 space-y-4 border-l-4 border-l-green-500 bg-green-500/5">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-green-400">
                            <DollarSign size={18} /> Monetization
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Listing Price</label>
                                <input
                                    name="price"
                                    type="number"
                                    value={data.price}
                                    onChange={handlePriceChange}
                                    className="form-input bg-black/20 text-xl font-bold text-white"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Currency</label>
                                <select
                                    name="currency"
                                    value={data.currency || "USD"}
                                    onChange={handleChange}
                                    className="form-input bg-black/20"
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
        </div>
    );
}
