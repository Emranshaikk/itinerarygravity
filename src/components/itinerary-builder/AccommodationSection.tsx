"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { BedDouble, Wand2, MapPin, DollarSign, Plus, Trash2, Home, Star } from "lucide-react";

interface AccommodationSectionProps {
    data: ItineraryContent["accommodation"];
    onChange: (data: ItineraryContent["accommodation"]) => void;
}

export default function AccommodationSection({ data, onChange }: AccommodationSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    // Provide default safe values if data is undefined (handles older itineraries)
    const safeData = data || {
        bestNeighborhoods: [],
        hotelRecommendations: [],
        bookingTips: ""
    };

    const updateField = (field: keyof NonNullable<ItineraryContent["accommodation"]>, value: any) => {
        onChange({ ...safeData, [field]: value } as NonNullable<ItineraryContent["accommodation"]>);
    };

    const handleGeocode = async (index: number, query: string, type: 'neighborhood' | 'hotel') => {
        if (!query.trim()) return;

        try {
            const res = await fetch('/api/geocode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ location: query })
            });
            const data = await res.json();

            if (data.success && data.coordinates) {
                if (type === 'neighborhood') {
                    const newHoods = [...safeData.bestNeighborhoods];
                    newHoods[index].locationCoordinates = data.coordinates;
                    updateField("bestNeighborhoods", newHoods);
                } else if (type === 'hotel') {
                    const newHotels = [...safeData.hotelRecommendations];
                    newHotels[index].locationCoordinates = data.coordinates;
                    updateField("hotelRecommendations", newHotels);
                }
            }
        } catch (error) {
            console.error("Failed to geocode:", error);
        }
    };

    const addNeighborhood = () => {
        updateField("bestNeighborhoods", [...safeData.bestNeighborhoods, { name: "", vibe: "", whyStayHere: "" }]);
    };

    const removeNeighborhood = (index: number) => {
        updateField("bestNeighborhoods", safeData.bestNeighborhoods.filter((_, i) => i !== index));
    };

    const addHotel = () => {
        updateField("hotelRecommendations", [...safeData.hotelRecommendations, { name: "", priceRange: "$$", neighborhood: "", whyWeLoveIt: "", bookingLink: "" }]);
    };

    const removeHotel = (index: number) => {
        updateField("hotelRecommendations", safeData.hotelRecommendations.filter((_, i) => i !== index));
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                bestNeighborhoods: [
                    { name: "Downtown / City Center", vibe: "Bustling, Walkable, Touristy", whyStayHere: "Best for first-timers. Close to major transit hubs and top attractions." },
                    { name: "The Arts District", vibe: "Hip, Bohemian, Nightlife", whyStayHere: "Great for young travelers, amazing street food, and trendy cocktail bars." }
                ],
                hotelRecommendations: [
                    { name: "The Grand Plaza", priceRange: "$$$", neighborhood: "City Center", whyWeLoveIt: "Incredible rooftop pool and amazing breakfast buffet.", bookingLink: "" },
                    { name: "Boutique Art Hostel", priceRange: "$", neighborhood: "Arts District", whyWeLoveIt: "Very social, clean pods, and they offer free local walking tours.", bookingLink: "" }
                ],
                bookingTips: "Book at least 3 months in advance for the summer season. Check if the hotel includes city taxes in the final price, as it acts as an extra nightly fee."
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                        <BedDouble style={{ color: '#0ea5e9' }} size={32} />
                        Accommodation Guide
                    </h2>
                    <p style={{ color: 'var(--gray-400)' }}>
                        Tell them exactly WHICH neighborhoods to stay in, and which hotels are actually worth the money.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Finding Rooms..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill Hotels</>}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* 1. Feature: Neighborhood Breakdowns */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                            <MapPin style={{ color: '#ec4899' }} size={20} /> Where to Base Yourself
                        </h3>
                        <button onClick={addNeighborhood} style={{ fontSize: '0.75rem', color: '#0ea5e9', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Plus size={14} /> Add Neighborhood
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {safeData.bestNeighborhoods.map((hood, i) => (
                            <div key={i} style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                                <button onClick={() => removeNeighborhood(i)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingRight: '2rem' }}>
                                    <input
                                        className="form-input"
                                        style={{ border: 'none', borderBottom: '1px solid var(--border)', fontSize: '1.125rem', fontWeight: 'bold', width: '100%', padding: '0.25rem 0', background: 'transparent', color: 'var(--foreground)' }}
                                        placeholder="Neighborhood Name (e.g. Shinjuku)"
                                        value={hood.name}
                                        onChange={(e) => {
                                            const newHoods = [...safeData.bestNeighborhoods];
                                            newHoods[i].name = e.target.value;
                                            updateField("bestNeighborhoods", newHoods);
                                        }}
                                        onBlur={(e) => handleGeocode(i, e.target.value, 'neighborhood')}
                                    />
                                    <input
                                        className="form-input"
                                        style={{ border: 'none', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', width: '100%', padding: '0.25rem 0', background: 'transparent', color: 'var(--foreground)' }}
                                        placeholder="The Vibe (e.g. Nightlife & Food)"
                                        value={hood.vibe}
                                        onChange={(e) => {
                                            const newHoods = [...safeData.bestNeighborhoods];
                                            newHoods[i].vibe = e.target.value;
                                            updateField("bestNeighborhoods", newHoods);
                                        }}
                                    />
                                </div>
                                <textarea
                                    className="form-input"
                                    style={{ background: 'var(--surface)', fontSize: '0.875rem', minHeight: '60px', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                                    placeholder="Why should someone stay here? (e.g. Best for top transit connections...)"
                                    value={hood.whyStayHere}
                                    onChange={(e) => {
                                        const newHoods = [...safeData.bestNeighborhoods];
                                        newHoods[i].whyStayHere = e.target.value;
                                        updateField("bestNeighborhoods", newHoods);
                                    }}
                                />
                            </div>
                        ))}
                        {safeData.bestNeighborhoods.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)', border: '1px dashed var(--border)', borderRadius: '1rem' }}>
                                Start by breaking down the best areas to stay in.
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Feature: Handpicked Hotels */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                            <Home style={{ color: '#10b981' }} size={20} /> Handpicked Hotels
                        </h3>
                        <button onClick={addHotel} style={{ fontSize: '0.75rem', color: '#0ea5e9', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Plus size={14} /> Add Hotel
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {safeData.hotelRecommendations.map((hotel, i) => (
                            <div key={i} style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', position: 'relative' }}>
                                <button onClick={() => removeHotel(i)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', paddingRight: '2rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <label style={{ fontSize: '0.7rem', color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase' }}>Hotel Name</label>
                                        <input
                                            className="form-input"
                                            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                                            placeholder="The Ritz Carlton"
                                            value={hotel.name}
                                            onChange={(e) => {
                                                const newHotels = [...safeData.hotelRecommendations];
                                                newHotels[i].name = e.target.value;
                                                updateField("hotelRecommendations", newHotels);
                                            }}
                                            onBlur={(e) => handleGeocode(i, e.target.value, 'hotel')}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <label style={{ fontSize: '0.7rem', color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase' }}>Price Bracket</label>
                                        <select
                                            className="form-input"
                                            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                                            value={hotel.priceRange || "$$"}
                                            onChange={(e) => {
                                                const newHotels = [...safeData.hotelRecommendations];
                                                newHotels[i].priceRange = e.target.value;
                                                updateField("hotelRecommendations", newHotels);
                                            }}
                                        >
                                            <option value="$">$ (Budget/Hostel)</option>
                                            <option value="$$">$$ (Mid-Range)</option>
                                            <option value="$$$">$$$ (Boutique/Premium)</option>
                                            <option value="$$$$">$$$$ (Ultra Luxury)</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <label style={{ fontSize: '0.7rem', color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase' }}>Neighborhood Location</label>
                                        <input
                                            className="form-input"
                                            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                                            placeholder="e.g. City Center"
                                            value={hotel.neighborhood}
                                            onChange={(e) => {
                                                const newHotels = [...safeData.hotelRecommendations];
                                                newHotels[i].neighborhood = e.target.value;
                                                updateField("hotelRecommendations", newHotels);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase' }}>Why you recommend it</label>
                                    <input
                                        className="form-input"
                                        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                                        placeholder="Amazing breakfast, right next to the metro station..."
                                        value={hotel.whyWeLoveIt}
                                        onChange={(e) => {
                                            const newHotels = [...safeData.hotelRecommendations];
                                            newHotels[i].whyWeLoveIt = e.target.value;
                                            updateField("hotelRecommendations", newHotels);
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase' }}>Affiliate / Booking Link (Optional)</label>
                                    <input
                                        className="form-input"
                                        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: '#3b82f6' }}
                                        placeholder="https://booking.com/your-affiliate-link"
                                        value={hotel.bookingLink || ""}
                                        onChange={(e) => {
                                            const newHotels = [...safeData.hotelRecommendations];
                                            newHotels[i].bookingLink = e.target.value;
                                            updateField("hotelRecommendations", newHotels);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Feature: Booking Logistics */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0, marginBottom: '1rem' }}>
                        <Star style={{ color: '#eab308' }} size={20} /> Important Booking Tips
                    </h3>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="e.g. You MUST book 6 months ahead for cherry blossom season. Be aware of hidden 'resort fees' in this city."
                        value={safeData.bookingTips}
                        onChange={(e) => updateField("bookingTips", e.target.value)}
                    />
                </div>

            </div>
        </div>
    );
}
