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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div className="prose dark:prose-invert">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Utensils className="text-orange-400" size={32} />
                        Local Food Guide
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        Travelers explore with their stomachs. Give them the flavors they'll never forget.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary bg-gradient-to-r from-orange-600 to-red-600 border-none hover:shadow-lg hover:shadow-orange-500/20"
                >
                    {isGenerating ? "Cooking..." : <><Wand2 size={16} className="mr-2" /> Auto-Fill Food</>}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">

                {/* Must Try Dishes */}
                <div className="card glass p-6 space-y-6 border border-white/5 bg-white/5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold flex items-center gap-2 text-orange-400">
                            <Heart size={20} /> Iconic Local Dishes
                        </h3>
                        <button onClick={addDish} className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1">
                            <Plus size={14} /> Add Dish
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.mustTryDishes.map((dish, i) => (
                            <div key={i} className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3 relative group">
                                <button onClick={() => removeDish(i)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400">
                                    <Trash2 size={14} />
                                </button>
                                <input
                                    className="bg-transparent border-b border-white/10 text-lg font-bold w-full focus:outline-none focus:border-orange-400 placeholder-gray-700"
                                    placeholder="Dish Name (e.g. Sushi)"
                                    value={dish.name}
                                    onChange={(e) => {
                                        const newDishes = [...data.mustTryDishes];
                                        newDishes[i].name = e.target.value;
                                        updateField("mustTryDishes", newDishes);
                                    }}
                                />
                                <textarea
                                    className="form-input bg-transparent text-sm min-h-[60px]"
                                    placeholder="Describe why they must try it..."
                                    value={dish.description}
                                    onChange={(e) => {
                                        const newDishes = [...data.mustTryDishes];
                                        newDishes[i].description = e.target.value;
                                        updateField("mustTryDishes", newDishes);
                                    }}
                                />
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <MapPin size={12} />
                                    <input
                                        className="bg-transparent border-b border-white/10 w-full focus:outline-none focus:border-orange-400"
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
                <div className="card glass p-6 space-y-6 border border-white/5 bg-white/5 text-sm">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold flex items-center gap-2 text-red-400">
                            <Coffee size={20} /> Handpicked Restaurants
                        </h3>
                        <button onClick={addRestaurant} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                            <Plus size={14} /> Add Restaurant
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="pb-4 pr-4">Name</th>
                                    <th className="pb-4 pr-4 w-24">Price</th>
                                    <th className="pb-4 pr-4 w-40">Cuisine</th>
                                    <th className="pb-4 pr-4">Expert Notes</th>
                                    <th className="pb-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="space-y-2">
                                {data.restaurantRecommendations.map((rest, i) => (
                                    <tr key={i} className="border-t border-white/5">
                                        <td className="py-3 pr-4">
                                            <input
                                                className="bg-transparent border-b border-white/10 w-full focus:outline-none focus:border-red-400 font-bold"
                                                placeholder="Restaurant Name"
                                                value={rest.name}
                                                onChange={(e) => {
                                                    const newRests = [...data.restaurantRecommendations];
                                                    newRests[i].name = e.target.value;
                                                    updateField("restaurantRecommendations", newRests);
                                                }}
                                            />
                                        </td>
                                        <td className="py-3 pr-4">
                                            <select
                                                className="bg-transparent border-b border-white/10 w-full focus:outline-none"
                                                value={rest.priceRange}
                                                onChange={(e) => {
                                                    const newRests = [...data.restaurantRecommendations];
                                                    newRests[i].priceRange = e.target.value;
                                                    updateField("restaurantRecommendations", newRests);
                                                }}
                                            >
                                                <option value="$">$ (Cheap)</option>
                                                <option value="$$">$$ (Mid-range)</option>
                                                <option value="$$$">$$$ (Fine Dining)</option>
                                                <option value="$$$$">$$$$ (Ultra Luxury)</option>
                                            </select>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <input
                                                className="bg-transparent border-b border-white/10 w-full focus:outline-none"
                                                placeholder="e.g. Italian"
                                                value={rest.cuisine}
                                                onChange={(e) => {
                                                    const newRests = [...data.restaurantRecommendations];
                                                    newRests[i].cuisine = e.target.value;
                                                    updateField("restaurantRecommendations", newRests);
                                                }}
                                            />
                                        </td>
                                        <td className="py-3 pr-4">
                                            <input
                                                className="bg-transparent border-b border-white/10 w-full focus:outline-none italic text-gray-400"
                                                placeholder="e.g. Try the Truffle Pasta..."
                                                value={rest.notes || ""}
                                                onChange={(e) => {
                                                    const newRests = [...data.restaurantRecommendations];
                                                    newRests[i].notes = e.target.value;
                                                    updateField("restaurantRecommendations", newRests);
                                                }}
                                            />
                                        </td>
                                        <td className="py-3 text-right">
                                            <button onClick={() => removeRestaurant(i)} className="text-gray-500 hover:text-red-400">
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Safety & Dietary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-400">
                            <Info size={18} /> Dietary Options (Veg/Vegan/Alergies)
                        </h3>
                        <textarea
                            className="form-input bg-black/20 h-24"
                            placeholder="How easy is it for vegetarians? Are allergies taken seriously?"
                            value={data.dietaryOptions || ""}
                            onChange={(e) => updateField("dietaryOptions", e.target.value)}
                        />
                    </div>
                    <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-yellow-500">
                            <AlertTriangle size={18} /> Food Safety & Standards
                        </h3>
                        <textarea
                            className="form-input bg-black/20 h-24"
                            placeholder="Is tap water safe? Is street food generally clean?"
                            value={data.foodSafety}
                            onChange={(e) => updateField("foodSafety", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
