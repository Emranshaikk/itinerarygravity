"use client";

import React from "react";
import { ItineraryContent } from "@/types/itinerary";
import { CreditCard, DollarSign, Wallet, TrendingDown, Target } from "lucide-react";

interface CostBreakdownSectionProps {
    data: ItineraryContent["costBreakdown"];
    onChange: (data: ItineraryContent["costBreakdown"]) => void;
}

export default function CostBreakdownSection({ data, onChange }: CostBreakdownSectionProps) {
    const updateField = (field: string, value: any) => {
        const currentData = data || { totalSpent: 0, flights: 0, stay: 0, food: 0, transport: 0, activities: 0 };
        onChange({ ...currentData, [field]: value } as any);
    };

    const costData = data || { totalSpent: 0, flights: 0, stay: 0, food: 0, transport: 0, activities: 0 };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                    <CreditCard style={{ color: '#10b981' }} size={32} />
                    Real Cost Breakdown
                </h2>
                <p style={{ color: 'var(--gray-400)' }}>
                    Be honest about what you spent. This is the #1 thing buyers want to know.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Amount YOU Spent</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <DollarSign size={18} style={{ color: '#10b981' }} />
                        <input
                            type="number"
                            className="form-input"
                            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', fontSize: '1.25rem', fontWeight: 'bold' }}
                            value={costData.totalSpent}
                            onChange={(e) => updateField("totalSpent", parseFloat(e.target.value))}
                        />
                    </div>
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase' }}>Flights</label>
                    <input
                        type="number"
                        className="form-input"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        value={costData.flights}
                        onChange={(e) => updateField("flights", parseFloat(e.target.value))}
                    />
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase' }}>Accommodation</label>
                    <input
                        type="number"
                        className="form-input"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        value={costData.stay}
                        onChange={(e) => updateField("stay", parseFloat(e.target.value))}
                    />
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase' }}>Food & Drink</label>
                    <input
                        type="number"
                        className="form-input"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        value={costData.food}
                        onChange={(e) => updateField("food", parseFloat(e.target.value))}
                    />
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase' }}>Transport</label>
                    <input
                        type="number"
                        className="form-input"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        value={costData.transport}
                        onChange={(e) => updateField("transport", parseFloat(e.target.value))}
                    />
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase' }}>Activities</label>
                    <input
                        type="number"
                        className="form-input"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        value={costData.activities}
                        onChange={(e) => updateField("activities", parseFloat(e.target.value))}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', margin: 0 }}>
                        <Wallet size={18} /> Where I Overspent
                    </h3>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="Mistakes in spending, or things that weren't worth the premium..."
                        value={costData.overspentComment || ""}
                        onChange={(e) => updateField("overspentComment", e.target.value)}
                    />
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', margin: 0 }}>
                        <TrendingDown size={18} /> Where I Saved
                    </h3>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="Smart ways you cut costs without losing quality..."
                        value={costData.savedMoneyComment || ""}
                        onChange={(e) => updateField("savedMoneyComment", e.target.value)}
                    />
                </div>
            </div>

            <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6', margin: 0 }}>
                    <Target size={18} /> Optimization Tips
                </h3>
                <textarea
                    className="form-input"
                    style={{ minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                    placeholder="What would you do differently to optimize the cost of this trip next time?"
                    value={costData.optimizationTips || ""}
                    onChange={(e) => updateField("optimizationTips", e.target.value)}
                />
            </div>
        </div>
    );
}
