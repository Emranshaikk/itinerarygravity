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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div className="prose dark:prose-invert">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <CreditCard className="text-green-400" size={32} />
                        Money & Connectivity
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        Solve the two biggest traveler stresses: How to pay and how to stay online.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary bg-gradient-to-r from-emerald-600 to-teal-600 border-none hover:shadow-lg hover:shadow-emerald-500/20"
                >
                    {isGenerating ? "Setting up..." : <><Wand2 size={16} className="mr-2" /> Auto-Fill Logistics</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Money Management */}
                <div className="card glass p-6 space-y-6 border border-white/5 bg-white/5 relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 opacity-5">
                        <DollarSign size={120} />
                    </div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-emerald-400">
                        <DollarSign size={20} /> Money Strategy
                    </h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-bold uppercase">Currency Code</label>
                                <input
                                    className="form-input bg-black/20"
                                    placeholder="e.g. JPY"
                                    value={data.currency.code}
                                    onChange={(e) => handleCurrencyChange("code", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-bold uppercase">Daily Budget</label>
                                <input
                                    className="form-input bg-black/20"
                                    placeholder="e.g. $100/day"
                                    value={data.currency.dailyBudgetEstimate}
                                    onChange={(e) => handleCurrencyChange("dailyBudgetEstimate", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase">Cash vs Card Advice</label>
                            <textarea
                                className="form-input bg-black/20 h-24"
                                placeholder="When should they use cash? Is tapping common?"
                                value={data.currency.cashVsCard}
                                onChange={(e) => handleCurrencyChange("cashVsCard", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase">Withdrawal / ATM Tips</label>
                            <input
                                className="form-input bg-black/20"
                                placeholder="e.g. Use 7-Eleven ATMs..."
                                value={data.currency.exchangeTips}
                                onChange={(e) => handleCurrencyChange("exchangeTips", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Connectivity & Power */}
                <div className="card glass p-6 space-y-6 border border-white/5 bg-white/5 relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 opacity-5">
                        <Wifi size={120} />
                    </div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
                        <Wifi size={20} /> Connectivity & Tech
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><Smartphone size={12} /> SIM / eSIM Options</label>
                            <input
                                className="form-input bg-black/20"
                                placeholder="e.g. Airalo, Local SIM at Arrivals"
                                value={data.connectivity.simOptions.join(", ")}
                                onChange={(e) => handleConnectivityChange("simOptions", e.target.value.split(","))}
                            />
                            <p className="text-[10px] text-gray-500">Separate by commas</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><Power size={12} /> Power Adapters</label>
                            <input
                                className="form-input bg-black/20"
                                placeholder="e.g. Type C / G required"
                                value={data.connectivity.powerAdapters}
                                onChange={(e) => handleConnectivityChange("powerAdapters", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><Globe size={12} /> WiFi Tips</label>
                            <textarea
                                className="form-input bg-black/20 h-24"
                                placeholder="How is public WiFi? Should they rent a router?"
                                value={data.connectivity.wifiTips}
                                onChange={(e) => handleConnectivityChange("wifiTips", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Essential Apps */}
                <div className="md:col-span-2 card glass p-6 space-y-4 border border-white/5 bg-white/5">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-purple-400">
                        <Zap size={20} /> Essential Apps to Download
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <textarea
                            className="form-input bg-black/20 h-32 font-mono text-sm"
                            placeholder="App Name (Purpose) - one per line"
                            value={data.apps.map(a => `${a.name} (${a.purpose})`).join("\n")}
                            onChange={(e) => {
                                const apps = e.target.value.split("\n").filter(Boolean).map(line => {
                                    const match = line.match(/^(.*)\s\((.*)\)$/);
                                    if (match) return { name: match[1], purpose: match[2] };
                                    return { name: line.split('(')[0].trim(), purpose: line.split('(')[1]?.replace(')', '').trim() || "General" };
                                });
                                onChange({ ...data, apps });
                            }}
                        />
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-sm space-y-2">
                                <p className="font-bold text-purple-300">Why this matters?</p>
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    Travelers often forget to download apps like local ride-sharing or translation tools until they are stuck without data. Giving them a list before they fly is a huge value-add.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.apps.map((app, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] border border-white/10 uppercase font-bold text-gray-400">
                                        {app.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
