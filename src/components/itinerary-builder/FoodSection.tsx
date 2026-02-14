"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Utensils, Wand2, Plus, Trash2, Heart, Info, AlertTriangle, Coffee, MapPin } from "lucide-react";

interface FoodSectionProps {
    data: ItineraryContent["food"];
    onChange: (data: ItineraryContent["food"]) => void;
}

export default function FoodSection({ data, onChange }: FoodSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateField = (field: keyof ItineraryContent["food"], value: any) => {
        onChange({ ...data, [field]: value });
    };

    const addDish = () => {
        updateField("mustTryDishes", [...data.mustTryDishes, { name: "", description: "", bestPlace: "" }]);
    };

    const removeDish = (index: number) => {
        updateField("mustTryDishes", data.mustTryDishes.filter((_, i) => i !== index));
    };

    const addRestaurant = () => {
        updateField("restaurantRecommendations", [...data.restaurantRecommendations, { name: "", priceRange: "$$", cuisine: "", notes: "" }]);
    };

    const removeRestaurant = (index: number) => {
        updateField("restaurantRecommendations", data.restaurantRecommendations.filter((_, i) => i !== index));
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                mustTryDishes: [
                    { name: "Kaiseki Ryori", description: "The pinnacle of Japanese fine dining. Multiple small, artistic courses using seasonal ingredients.", bestPlace: "Gion Karyo or any high-end Ryokan" },
                    { name: "Kyoto Style Ramen", description: "Thick, rich soy-based broth (Kotteri) served with thin noodles.", bestPlace: "Tenkaippin (The original branch in Kyoto)" },
                    { name: "Yuba (Tofu Skin)", description: "A local delicacy made from boiling soy milk. Delicate, silky, and nutty.", bestPlace: "Izusen (inside Daitoku-ji temple)" }
                ],
                restaurantRecommendations: [
                    { name: "Chao Chao Gyoza", priceRange: "$", cuisine: "Gyoza/Dumplings", notes: "Fun, vibrant, and great for a quick dinner. Expect a queue!" },
                    { name: "Hafuu Honten", priceRange: "$$$", cuisine: "Wagyu Beef", notes: "Best Wagyu sandwich in the city. Reservation recommended." },
                    { name: "Weekenders Coffee", priceRange: "$", cuisine: "Coffee/Cafe", notes: "Hidden in a parking lot. Best specialty coffee in Kyoto." }
                ],
                dietaryOptions: "Kyoto is the best city for vegetarians (Shojin Ryori). Most places offer English menus with allergen markings.",
                foodSafety: "Tap water is safe to drink. Avoid 'tourist traps' in the main Gion street; walk into the side alleys for authentic quality."
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                        <Utensils style={{ color: '#ea580c' }} size={32} />
                        Local Food Guide
                    </h2>
                    <p style={{ color: 'var(--gray-400)' }}>
                        Travelers explore with their stomachs. Give them the flavors they'll never forget.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Cooking..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill Food</>}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Must Try Dishes */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                            <Heart style={{ color: '#ef4444' }} size={20} /> Iconic Local Dishes
                        </h3>
                        <button onClick={addDish} style={{ fontSize: '0.75rem', color: '#ea580c', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Plus size={14} /> Add Dish
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {data.mustTryDishes.map((dish, i) => (
                            <div key={i} style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                                <button onClick={() => removeDish(i)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
                                    <Trash2 size={14} />
                                </button>
                                <input
                                    className="form-input"
                                    style={{ border: 'none', borderBottom: '1px solid var(--border)', fontSize: '1.125rem', fontWeight: 'bold', width: '100%', padding: '0.25rem 0', background: 'transparent', color: 'var(--foreground)' }}
                                    placeholder="Dish Name (e.g. Sushi)"
                                    value={dish.name}
                                    onChange={(e) => {
                                        const newDishes = [...data.mustTryDishes];
                                        newDishes[i].name = e.target.value;
                                        updateField("mustTryDishes", newDishes);
                                    }}
                                />
                                <textarea
                                    className="form-input"
                                    style={{ background: 'var(--surface)', fontSize: '0.875rem', minHeight: '80px', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                                    placeholder="Describe why they must try it..."
                                    value={dish.description}
                                    onChange={(e) => {
                                        const newDishes = [...data.mustTryDishes];
                                        newDishes[i].description = e.target.value;
                                        updateField("mustTryDishes", newDishes);
                                    }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={14} style={{ color: 'var(--gray-400)' }} />
                                    <input
                                        className="form-input"
                                        style={{ border: 'none', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', width: '100%', padding: '0.25rem 0', background: 'transparent', color: 'var(--foreground)' }}
                                        placeholder="Best place to find it..."
                                        value={dish.bestPlace || ""}
                                        onChange={(e) => {
                                            const newDishes = [...data.mustTryDishes];
                                            newDishes[i].bestPlace = e.target.value;
                                            updateField("mustTryDishes", newDishes);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Restaurant Recommendations */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                            <Coffee style={{ color: '#8b4513' }} size={20} /> Handpicked Restaurants
                        </h3>
                        <button onClick={addRestaurant} style={{ fontSize: '0.75rem', color: '#ea580c', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Plus size={14} /> Add Restaurant
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                            <thead style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-400)', borderBottom: '1px solid var(--border)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', fontWeight: 'bold' }}>Name</th>
                                    <th style={{ padding: '1rem', fontWeight: 'bold', width: '120px' }}>Price</th>
                                    <th style={{ padding: '1rem', fontWeight: 'bold', width: '180px' }}>Cuisine</th>
                                    <th style={{ padding: '1rem', fontWeight: 'bold' }}>Expert Notes</th>
                                    <th style={{ padding: '1rem', width: '50px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.restaurantRecommendations.map((rest, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.75rem' }}>
                                            <input
                                                className="form-input"
                                                style={{ border: 'none', fontWeight: 'bold', width: '100%', background: 'transparent', color: 'var(--foreground)' }}
                                                placeholder="Restaurant Name"
                                                value={rest.name}
                                                onChange={(e) => {
                                                    const newRests = [...data.restaurantRecommendations];
                                                    newRests[i].name = e.target.value;
                                                    updateField("restaurantRecommendations", newRests);
                                                }}
                                            />
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <select
                                                className="form-input"
                                                style={{ border: 'none', width: '100%', background: 'transparent', cursor: 'pointer', color: 'var(--foreground)', outline: 'none' }}
                                                value={rest.priceRange || "$$"}
                                                onChange={(e) => {
                                                    const newRests = [...data.restaurantRecommendations];
                                                    newRests[i].priceRange = e.target.value;
                                                    updateField("restaurantRecommendations", newRests);
                                                }}
                                            >
                                                <option value="$" style={{ background: '#1a1a1a', color: '#ffffff' }}>$ (Economy)</option>
                                                <option value="$$" style={{ background: '#1a1a1a', color: '#ffffff' }}>$$ (Standard)</option>
                                                <option value="$$$" style={{ background: '#1a1a1a', color: '#ffffff' }}>$$$ (Premium)</option>
                                                <option value="$$$$" style={{ background: '#1a1a1a', color: '#ffffff' }}>$$$$ (Luxury)</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <input
                                                className="form-input"
                                                style={{ border: 'none', width: '100%', background: 'transparent', color: 'var(--foreground)' }}
                                                placeholder="e.g. Italian"
                                                value={rest.cuisine}
                                                onChange={(e) => {
                                                    const newRests = [...data.restaurantRecommendations];
                                                    newRests[i].cuisine = e.target.value;
                                                    updateField("restaurantRecommendations", newRests);
                                                }}
                                            />
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <input
                                                className="form-input"
                                                style={{ border: 'none', width: '100%', background: 'transparent', fontStyle: 'italic', color: 'var(--gray-400)' }}
                                                placeholder="e.g. Try the pasta..."
                                                value={rest.notes || ""}
                                                onChange={(e) => {
                                                    const newRests = [...data.restaurantRecommendations];
                                                    newRests[i].notes = e.target.value;
                                                    updateField("restaurantRecommendations", newRests);
                                                }}
                                            />
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                            <button onClick={() => removeRestaurant(i)} style={{ background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Dietary & Safety */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1d4ed8', margin: 0 }}>
                            <Info size={18} /> Dietary Options
                        </h3>
                        <textarea
                            className="form-input"
                            style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                            placeholder="How easy is it for vegetarians? Allergies?"
                            value={data.dietaryOptions || ""}
                            onChange={(e) => updateField("dietaryOptions", e.target.value)}
                        />
                    </div>
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ca8a04', margin: 0 }}>
                            <AlertTriangle size={18} /> Food Safety
                        </h3>
                        <textarea
                            className="form-input"
                            style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                            placeholder="Tap water? Street food standards?"
                            value={data.foodSafety || ""}
                            onChange={(e) => updateField("foodSafety", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
