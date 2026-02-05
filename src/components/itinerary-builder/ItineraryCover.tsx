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
        <div suppressHydrationWarning className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                {/* Main Identity */}
                <div style={{ padding: '2rem', border: '1px solid #f5f5f4', borderRadius: '2rem', backgroundColor: '#fdfbf7' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ fontWeight: 'bold', color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Itinerary Title</label>
                        <input
                            name="title"
                            value={data.title}
                            onChange={handleChange}
                            style={{ background: 'transparent', border: 'none', fontSize: '2.5rem', fontWeight: 900, color: '#1c1917', width: '100%', padding: 0 }}
                            placeholder="e.g. The Ultimate Bali Escape"
                        />
                        <div style={{ height: '4px', width: '80px', backgroundColor: '#22d3ee', borderRadius: '9999px', marginTop: '1rem' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="form-label" style={{ fontWeight: '600', color: '#78716c' }}>Destination</label>
                            <input
                                name="destination"
                                value={data.destination}
                                onChange={handleChange}
                                className="form-input"
                                style={{ backgroundColor: 'white' }}
                                placeholder="e.g. Kyoto, Japan"
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="form-label" style={{ fontWeight: '600', color: '#78716c' }}>Duration</label>
                            <input
                                name="duration"
                                value={data.duration}
                                onChange={handleChange}
                                className="form-input"
                                style={{ backgroundColor: 'white' }}
                                placeholder="e.g. 7 Days / 6 Nights"
                            />
                        </div>
                    </div>
                </div>

                {/* Classification */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div style={{ padding: '1.5rem', border: '1px solid #f5f5f4', borderRadius: '1rem', backgroundColor: '#fdfbf7' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1c1917', marginBottom: '1rem' }}>Trip Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem', color: '#a8a29e', textTransform: 'uppercase', fontWeight: 'bold' }}>Trip Type</label>
                                <select
                                    name="tripType"
                                    value={data.tripType}
                                    onChange={handleChange}
                                    className="form-input"
                                    style={{ backgroundColor: 'white' }}
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
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem', color: '#a8a29e', textTransform: 'uppercase', fontWeight: 'bold' }}>Perfect For</label>
                                <input
                                    name="targetAudience"
                                    value={data.targetAudience}
                                    onChange={handleChange}
                                    className="form-input"
                                    style={{ backgroundColor: 'white' }}
                                    placeholder="e.g. Foodies, Couples, Solo ladies"
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem', border: '1px solid #f5f5f4', borderRadius: '1rem', backgroundColor: '#fdfbf7' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1c1917', marginBottom: '1rem' }}>Seasonal Info</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem', color: '#a8a29e', textTransform: 'uppercase', fontWeight: 'bold' }}>Best Time to Visit</label>
                                <input
                                    name="bestTimeToVisit"
                                    value={data.bestTimeToVisit}
                                    onChange={handleChange}
                                    className="form-input"
                                    style={{ backgroundColor: 'white' }}
                                    placeholder="e.g. March - May (Sakura Season)"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Branding & Pricing */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Branding */}
                    <div style={{ gridColumn: 'span 2', padding: '1.5rem', border: '1px solid #f5f5f4', borderRadius: '1rem', backgroundColor: '#fdfbf7' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1c1917', marginBottom: '1.5rem' }}>Creator Branding</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem', color: '#a8a29e', textTransform: 'uppercase', fontWeight: 'bold' }}>Brand Name</label>
                                <input
                                    name="brandName"
                                    value={data.brandName || ""}
                                    onChange={handleChange}
                                    className="form-input"
                                    style={{ backgroundColor: 'white' }}
                                    placeholder="Your Name or Brand"
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem', color: '#a8a29e', textTransform: 'uppercase', fontWeight: 'bold' }}>Tagline</label>
                                <input
                                    name="tagline"
                                    value={data.tagline || ""}
                                    onChange={handleChange}
                                    className="form-input"
                                    style={{ backgroundColor: 'white' }}
                                    placeholder="Something catchy..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div style={{ padding: '1.5rem', border: '2px solid #cffafe', borderRadius: '1rem', backgroundColor: '#ecfeff' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#164e63', marginBottom: '1rem' }}>Pricing</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem', color: '#0891b2', textTransform: 'uppercase', fontWeight: 'bold' }}>Listing Price</label>
                                <input
                                    name="price"
                                    type="number"
                                    value={data.price}
                                    onChange={handlePriceChange}
                                    className="form-input"
                                    style={{ backgroundColor: 'white', fontSize: '1.5rem', fontWeight: 900, color: '#164e63', padding: '1rem' }}
                                    placeholder="0"
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label className="form-label" style={{ fontSize: '0.75rem', color: '#0891b2', textTransform: 'uppercase', fontWeight: 'bold' }}>Currency</label>
                                <select
                                    name="currency"
                                    value={data.currency || "USD"}
                                    onChange={handleChange}
                                    className="form-input"
                                    style={{ backgroundColor: 'white', color: '#164e63' }}
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
