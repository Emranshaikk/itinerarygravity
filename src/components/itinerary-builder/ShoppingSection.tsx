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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1c1917', marginBottom: '0.5rem' }}>
                        <ShoppingBag style={{ color: '#ec4899' }} size={32} />
                        Shopping & Souvenirs
                    </h2>
                    <p style={{ color: '#78716c' }}>
                        Help them find unique, high-quality items and avoid the "cheap plastic" tourist traps.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#ec4899', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Stocking up..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill Shopping</>}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

                {/* What to Buy */}
                <div style={{ padding: '2rem', border: '1px solid #f5f5f4', borderRadius: '1.5rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ec4899', margin: 0 }}>
                            <Tag size={20} /> What to Buy (Unique Items)
                        </h3>
                        <button onClick={addBuy} style={{ fontSize: '0.75rem', color: '#ec4899', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            + Add Item
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.whatToBuy.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                                <textarea
                                    className="form-input"
                                    style={{ backgroundColor: '#fdfbf7', fontSize: '0.875rem', flex: 1, minHeight: '60px' }}
                                    placeholder="e.g. Local ceramics from [Shop Name]..."
                                    value={item}
                                    onChange={(e) => {
                                        const newItems = [...data.whatToBuy];
                                        newItems[i] = e.target.value;
                                        updateField("whatToBuy", newItems);
                                    }}
                                />
                                <button onClick={() => removeBuy(i)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#a8a29e', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Best Markets */}
                <div style={{ padding: '2rem', border: '1px solid #f5f5f4', borderRadius: '1.5rem', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9333ea', margin: 0 }}>
                            <MapPin size={20} /> Best Markets & Areas
                        </h3>
                        <button onClick={addMarket} style={{ fontSize: '0.75rem', color: '#9333ea', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            + Add Market
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.bestMarkets.map((market, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                                <textarea
                                    className="form-input"
                                    style={{ backgroundColor: '#fdfbf7', fontSize: '0.875rem', flex: 1, minHeight: '60px' }}
                                    placeholder="e.g. Sunday Flea Market at [Place]..."
                                    value={market}
                                    onChange={(e) => {
                                        const newMarkets = [...data.bestMarkets];
                                        newMarkets[i] = e.target.value;
                                        updateField("bestMarkets", newMarkets);
                                    }}
                                />
                                <button onClick={() => removeMarket(i)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#a8a29e', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tax Free Tips */}
                <div style={{ gridColumn: '1 / -1', padding: '2rem', border: '1px solid #f5f5f4', borderRadius: '1.5rem', backgroundColor: 'white', borderLeft: '4px solid #10b981', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', margin: 0 }}>
                        <Info size={20} /> Tax-Free & Savings Tips
                    </h3>
                    <textarea
                        className="form-input"
                        style={{ backgroundColor: '#fdfbf7', minHeight: '100px' }}
                        placeholder="Explain how to get the 8-10% tax back. (e.g. Bring your passport!)"
                        value={data.taxFreeTips || ""}
                        onChange={(e) => updateField("taxFreeTips", e.target.value)}
                    />
                </div>

            </div>
        </div>
    );
}
