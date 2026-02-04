"use client";

import React from "react";
import { ItineraryContent } from "@/types/itinerary";
import { CreditCard, Wifi, Smartphone } from "lucide-react";

interface LogisticsSectionProps {
    data: ItineraryContent["logistics"];
    onChange: (data: ItineraryContent["logistics"]) => void;
}

export default function LogisticsSection({ data, onChange }: LogisticsSectionProps) {

    const handleCurrencyChange = (field: string, value: string) => {
        onChange({ ...data, currency: { ...data.currency, [field]: value } });
    };

    const handleConnectivityChange = (field: string, value: any) => {
        onChange({ ...data, connectivity: { ...data.connectivity, [field]: value } });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="prose dark:prose-invert">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <CreditCard className="text-green-400" />
                    Money & Connectivity
                </h2>
                <p className="text-gray-400">
                    Practical advice on money, internet, and local apps.
                </p>
            </div>

            {/* Currency */}
            <div className="card glass p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gradient">💰 Currency & Budget</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="form-label">Local Currency Code</label>
                        <input
                            className="form-input"
                            placeholder="e.g. JPY, EUR"
                            value={data.currency.code}
                            onChange={(e) => handleCurrencyChange("code", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Daily Budget Estimate</label>
                        <input
                            className="form-input"
                            placeholder="e.g. $50 - $100 per day"
                            value={data.currency.dailyBudgetEstimate}
                            onChange={(e) => handleCurrencyChange("dailyBudgetEstimate", e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Cash vs Card Advice</label>
                    <textarea
                        className="form-input"
                        rows={2}
                        placeholder="e.g. Cards widely accepted but keep cash for temples..."
                        value={data.currency.cashVsCard}
                        onChange={(e) => handleCurrencyChange("cashVsCard", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Exchange Tips</label>
                    <input
                        className="form-input"
                        placeholder="e.g. Withdraw from 7-Eleven ATMs for best rates"
                        value={data.currency.exchangeTips}
                        onChange={(e) => handleCurrencyChange("exchangeTips", e.target.value)}
                    />
                </div>
            </div>

            {/* Connectivity */}
            <div className="card glass p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gradient">📶 Internet & Power</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="form-label">SIM / eSIM Recommendations</label>
                        <input
                            className="form-input"
                            placeholder="e.g. Ubigi, Airalo, Pocket WiFi"
                            value={data.connectivity.simOptions.join(", ")}
                            onChange={(e) => handleConnectivityChange("simOptions", e.target.value.split(",").map((s: string) => s.trim()))}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Power Adapters</label>
                        <input
                            className="form-input"
                            placeholder="e.g. Type A (2 flat pins)"
                            value={data.connectivity.powerAdapters}
                            onChange={(e) => handleConnectivityChange("powerAdapters", e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">WiFi Tips</label>
                    <input
                        className="form-input"
                        placeholder="e.g. Free WiFi at most stations and conbini"
                        value={data.connectivity.wifiTips}
                        onChange={(e) => handleConnectivityChange("wifiTips", e.target.value)}
                    />
                </div>
            </div>

            {/* Apps */}
            <div className="card glass p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gradient">📱 Useful Apps</h3>
                <p className="text-sm text-gray-500">List apps like Google Maps, Uber, etc.</p>
                {/* Simplified app list for now */}
                <textarea
                    className="form-input"
                    rows={3}
                    placeholder="e.g. Google Maps (Navigation), Uber (Transport), Translate (Language)"
                    value={data.apps.map(a => `${a.name} (${a.purpose})`).join("\n")}
                    onChange={(e) => {
                        // Parse simple format: Name (Purpose)
                        const apps = e.target.value.split("\n").filter(Boolean).map(line => {
                            const match = line.match(/^(.*)\s\((.*)\)$/);
                            if (match) return { name: match[1], purpose: match[2] };
                            return { name: line, purpose: "General" };
                        });
                        onChange({ ...data, apps });
                    }}
                />
                <p className="text-xs text-gray-400">Format: App Name (Purpose) - one per line</p>
            </div>
        </div>
    );
}
