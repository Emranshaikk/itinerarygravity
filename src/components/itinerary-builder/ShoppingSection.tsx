"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { ShoppingBag, Wand2, Plus, Trash2, Tag, MapPin, Info } from "lucide-react";

interface ShoppingSectionProps {
    data: ItineraryContent["shopping"];
    onChange: (data: ItineraryContent["shopping"]) => void;
}

export default function ShoppingSection({ data, onChange }: ShoppingSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateField = (field: keyof ItineraryContent["shopping"], value: any) => {
        onChange({ ...data, [field]: value });
    };

    const addMarket = () => updateField("bestMarkets", [...data.bestMarkets, ""]);
    const removeMarket = (index: number) => updateField("bestMarkets", data.bestMarkets.filter((_, i) => i !== index));

    const addBuy = () => updateField("whatToBuy", [...data.whatToBuy, ""]);
    const removeBuy = (index: number) => updateField("whatToBuy", data.whatToBuy.filter((_, i) => i !== index));

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                whatToBuy: [
                    "Japanese Ceramics (Kiyomizu-yaki) from the hillside shops of Gion.",
                    "Matcha from Uji (The highest quality in Japan).",
                    "Hand-made Tenugui (Traditional cotton towels) with modern patterns.",
                    "Stationery from Loft or Tokyu Hands (A must for art lovers)."
                ],
                bestMarkets: [
                    "Nishiki Market (Kyoto's Kitchen) for food souvenirs.",
                    "Teramachi Arcade for clothing and books.",
                    "Toji Temple Flea Market (21st of every month only!) for antiques."
                ],
                taxFreeTips: "Look for the 'Japan Tax-Free' logo. Most department stores (Daimaru, Takashimaya) have a refund counter on the top floor. Bring your physical passport - images don't work!"
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div className="prose dark:prose-invert">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <ShoppingBag className="text-pink-400" size={32} />
                        Shopping & Souvenirs
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        Help them find unique, high-quality items and avoid the "cheap plastic" tourist traps.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary bg-gradient-to-r from-pink-600 to-purple-600 border-none hover:shadow-lg hover:shadow-pink-500/20"
                >
                    {isGenerating ? "Stocking up..." : <><Wand2 size={16} className="mr-2" /> Auto-Fill Shopping</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* What to Buy */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold flex items-center gap-2 text-pink-400">
                            <Tag size={20} /> What to Buy (Unique Items)
                        </h3>
                        <button onClick={addBuy} className="text-xs text-pink-400 hover:text-pink-300">
                            + Add Item
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.whatToBuy.map((item, i) => (
                            <div key={i} className="flex gap-2">
                                <textarea
                                    className="form-input bg-black/20 text-sm flex-1 min-h-[60px]"
                                    placeholder="e.g. Local ceramics from [Shop Name]..."
                                    value={item}
                                    onChange={(e) => {
                                        const newItems = [...data.whatToBuy];
                                        newItems[i] = e.target.value;
                                        updateField("whatToBuy", newItems);
                                    }}
                                />
                                <button onClick={() => removeBuy(i)} className="text-gray-500 hover:text-red-400 p-2">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Best Markets */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold flex items-center gap-2 text-purple-400">
                            <MapPin size={20} /> Best Markets & Areas
                        </h3>
                        <button onClick={addMarket} className="text-xs text-purple-400 hover:text-purple-300">
                            + Add Market
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.bestMarkets.map((market, i) => (
                            <div key={i} className="flex gap-2">
                                <textarea
                                    className="form-input bg-black/20 text-sm flex-1 min-h-[60px]"
                                    placeholder="e.g. Sunday Flea Market at [Place]..."
                                    value={market}
                                    onChange={(e) => {
                                        const newMarkets = [...data.bestMarkets];
                                        newMarkets[i] = e.target.value;
                                        updateField("bestMarkets", newMarkets);
                                    }}
                                />
                                <button onClick={() => removeMarket(i)} className="text-gray-500 hover:text-red-400 p-2">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tax Free Tips */}
                <div className="md:col-span-2 card glass p-6 space-y-4 border-l-4 border-l-green-400 bg-green-500/5">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-green-400">
                        <Info size={20} /> Tax-Free & Savings Tips
                    </h3>
                    <textarea
                        className="form-input bg-black/20 h-24"
                        placeholder="Explain how to get the 8-10% tax back. (e.g. Bring your passport!)"
                        value={data.taxFreeTips || ""}
                        onChange={(e) => updateField("taxFreeTips", e.target.value)}
                    />
                </div>

            </div>
        </div>
    );
}
