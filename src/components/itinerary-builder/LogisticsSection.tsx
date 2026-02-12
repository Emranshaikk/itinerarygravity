"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { CreditCard, Wifi, Smartphone, Wand2, DollarSign, Zap, Power, Globe } from "lucide-react";

interface LogisticsSectionProps {
    data: ItineraryContent["logistics"];
    onChange: (data: ItineraryContent["logistics"]) => void;
}

export default function LogisticsSection({ data, onChange }: LogisticsSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleCurrencyChange = (field: string, value: string) => {
        onChange({ ...data, currency: { ...data.currency, [field]: value } });
    };

    const handleConnectivityChange = (field: string, value: any) => {
        onChange({ ...data, connectivity: { ...data.connectivity, [field]: value } });
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                currency: {
                    code: "JPY (Japanese Yen)",
                    exchangeTips: "Withdraw cash from 7-Eleven (7-Bank) ATMs. They have the best rates and lowest fees.",
                    cashVsCard: "Kyoto is surprisingly cash-heavy. Use cards for hotels and big stores, but keep ¥10,000 in cash for temples and small ramen shops.",
                    dailyBudgetEstimate: "$80 - $150 per day (excluding accommodation)"
                },
                connectivity: {
                    simOptions: ["Ubigi eSIM (Best for data)", "Airalo (Easiest setup)", "Pocket WiFi (Best for groups)"],
                    wifiTips: "Free WiFi is available at Starbucks and train stations, but spotty elsewhere. A data plan is essential for Google Maps.",
                    powerAdapters: "Type A & B (Same as USA/Canada). 100V."
                },
                apps: [
                    { name: "Google Maps", purpose: "Navigation & Transit" },
                    { name: "Google Translate", purpose: "Reading menus (Camera mode)" },
                    { name: "JapanTravel by Navitime", purpose: "Train routes & JR Pass filter" },
                    { name: "Uber / Go App", purpose: "Taxis (expensive but reliable)" }
                ]
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                        <CreditCard style={{ color: '#16a34a' }} size={32} />
                        Money & Connectivity
                    </h2>
                    <p style={{ color: 'var(--gray-400)' }}>
                        Solve the two biggest traveler stresses: How to pay and how to stay online.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Setting up..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill Logistics</>}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Money Management */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                        <DollarSign style={{ color: '#16a34a' }} size={20} /> Money Strategy
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold' }}>Currency Code</label>
                                <input
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                                    placeholder="e.g. JPY"
                                    value={data.currency.code}
                                    onChange={(e) => handleCurrencyChange("code", e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold' }}>Daily Budget</label>
                                <input
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                                    placeholder="e.g. $100/day"
                                    value={data.currency.dailyBudgetEstimate}
                                    onChange={(e) => handleCurrencyChange("dailyBudgetEstimate", e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold' }}>Cash vs Card Advice</label>
                            <textarea
                                className="form-input"
                                style={{ backgroundColor: 'var(--input-bg)', minHeight: '100px', color: 'var(--foreground)' }}
                                placeholder="When should they use cash?"
                                value={data.currency.cashVsCard}
                                onChange={(e) => handleCurrencyChange("cashVsCard", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Connectivity & Tech */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                        <Zap style={{ color: '#eab308' }} size={20} /> Connectivity & Tech
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold' }}>SIM / eSIM Options</label>
                            <input
                                className="form-input"
                                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                                placeholder="e.g. Airalo, Ubigi..."
                                value={data.connectivity.simOptions.join(", ")}
                                onChange={(e) => handleConnectivityChange("simOptions", e.target.value.split(","))}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold' }}>Power Adapters</label>
                            <input
                                className="form-input"
                                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                                placeholder="e.g. Type A & B..."
                                value={data.connectivity.powerAdapters}
                                onChange={(e) => handleConnectivityChange("powerAdapters", e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold' }}>WiFi Strategy</label>
                            <textarea
                                className="form-input"
                                style={{ backgroundColor: 'var(--input-bg)', minHeight: '80px', color: 'var(--foreground)' }}
                                placeholder="Free WiFi spots vs Pocket WiFi..."
                                value={data.connectivity.wifiTips}
                                onChange={(e) => handleConnectivityChange("wifiTips", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Essential Apps */}
                <div style={{ gridColumn: '1 / -1', padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                        <Smartphone style={{ color: '#9333ea' }} size={20} /> Essential Apps
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 'bold' }}>Format: App Name (Purpose) - one per line</label>
                        <textarea
                            className="form-input"
                            style={{ backgroundColor: 'var(--input-bg)', minHeight: '120px', fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--foreground)' }}
                            placeholder="e.g. Google Maps (Navigation)"
                            value={data.apps.map(a => `${a.name} (${a.purpose})`).join("\n")}
                            onChange={(e) => {
                                const apps = e.target.value.split("\n").filter(Boolean).map(line => {
                                    const match = line.match(/^(.*)\s\((.*)\)$/);
                                    if (match) return { name: match[1].trim(), purpose: match[2].trim() };
                                    return { name: line.split('(')[0].trim(), purpose: line.split('(')[1]?.replace(')', '').trim() || "General" };
                                });
                                onChange({ ...data, apps });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
