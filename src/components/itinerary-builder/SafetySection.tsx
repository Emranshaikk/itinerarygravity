"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Shield, Wand2, Plus, Trash2, AlertTriangle, Scale, Phone, UserX } from "lucide-react";

interface SafetySectionProps {
    data: ItineraryContent["safety"];
    onChange: (data: ItineraryContent["safety"]) => void;
}

export default function SafetySection({ data, onChange }: SafetySectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateField = (field: keyof ItineraryContent["safety"], value: any) => {
        onChange({ ...data, [field]: value });
    };

    const addScam = () => updateField("commonScams", [...data.commonScams, ""]);
    const removeScam = (index: number) => updateField("commonScams", data.commonScams.filter((_, i) => i !== index));

    const addTip = () => updateField("safetyTips", [...data.safetyTips, ""]);
    const removeTip = (index: number) => updateField("safetyTips", data.safetyTips.filter((_, i) => i !== index));

    const addDoDont = () => updateField("culturalDosAndDonts", [...data.culturalDosAndDonts, ""]);
    const removeDoDont = (index: number) => updateField("culturalDosAndDonts", data.culturalDosAndDonts.filter((_, i) => i !== index));

    const addEmergency = () => updateField("emergencyNumbers", [...data.emergencyNumbers, { name: "", number: "" }]);
    const removeEmergency = (index: number) => updateField("emergencyNumbers", data.emergencyNumbers.filter((_, i) => i !== index));

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                commonScams: [
                    "Taxi overcharging in tourist areas (Ask for the meter).",
                    "Fake monk bracelets near temples (politely refuse and walk on).",
                    "Spiked drinks at bars in Shibuya/Kabukicho (never leave drinks unattended)."
                ],
                safetyTips: [
                    "Japan is extremely safe, but stay alert in crowded stations for pickpockets.",
                    "Download the 'Safety Tips' app for official earthquake/disaster alerts.",
                    "Always keep a copy of your passport on your phone."
                ],
                culturalDosAndDonts: [
                    "DO: Bow slightly when being greeted or thanking someone.",
                    "DON'T: Tip! It's considered rude and creates confusion.",
                    "DO: Carry your own small bag for trash, as public bins are rare.",
                    "DON'T: Talk loudly on public transport."
                ],
                emergencyNumbers: [
                    { name: "Police", number: "110" },
                    { name: "Ambulance / Fire", number: "119" },
                    { name: "Japan Helpline (English)", number: "0570-000-911" }
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
                        <Shield className="text-yellow-400" size={32} />
                        Safety, Scams & Culture
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        Empower your travelers with confidence. Knowing what NOT to do is as important as knowing what to do.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary bg-gradient-to-r from-yellow-600 to-amber-600 border-none hover:shadow-lg hover:shadow-yellow-500/20 text-black font-bold"
                >
                    {isGenerating ? "Securing..." : <><Wand2 size={16} className="mr-2" /> Auto-Fill Safety</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Common Scams */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold flex items-center gap-2 text-red-400">
                            <UserX size={20} /> Common Scams & Traps
                        </h3>
                        <button onClick={addScam} className="text-xs text-red-400 hover:text-red-300">
                            + Add Scam
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.commonScams.map((scam, i) => (
                            <div key={i} className="flex gap-2">
                                <textarea
                                    className="form-input bg-black/20 text-sm flex-1 min-h-[60px]"
                                    placeholder="e.g. 'Broken' taxi meters..."
                                    value={scam}
                                    onChange={(e) => {
                                        const newScams = [...data.commonScams];
                                        newScams[i] = e.target.value;
                                        updateField("commonScams", newScams);
                                    }}
                                />
                                <button onClick={() => removeScam(i)} className="text-gray-500 hover:text-red-400 p-2">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Culture Dos & Don'ts */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
                            <Scale size={20} /> Cultural Dos & Don'ts
                        </h3>
                        <button onClick={addDoDont} className="text-xs text-blue-400 hover:text-blue-300">
                            + Add Item
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.culturalDosAndDonts.map((item, i) => (
                            <div key={i} className="flex gap-2">
                                <textarea
                                    className="form-input bg-black/20 text-sm flex-1 min-h-[60px]"
                                    placeholder="e.g. DO: Bow slightly..."
                                    value={item}
                                    onChange={(e) => {
                                        const newItems = [...data.culturalDosAndDonts];
                                        newItems[i] = e.target.value;
                                        updateField("culturalDosAndDonts", newItems);
                                    }}
                                />
                                <button onClick={() => removeDoDont(i)} className="text-gray-500 hover:text-red-400 p-2">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Safety Tips */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold flex items-center gap-2 text-yellow-500">
                            <AlertTriangle size={20} /> General Safety Tips
                        </h3>
                        <button onClick={addTip} className="text-xs text-yellow-500 hover:text-yellow-400">
                            + Add Tip
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.safetyTips.map((tip, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    className="form-input bg-black/20 text-sm flex-1"
                                    placeholder="e.g. Keep a copy of your passport..."
                                    value={tip}
                                    onChange={(e) => {
                                        const newTips = [...data.safetyTips];
                                        newTips[i] = e.target.value;
                                        updateField("safetyTips", newTips);
                                    }}
                                />
                                <button onClick={() => removeTip(i)} className="text-gray-500 hover:text-red-400 p-2">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Numbers */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold flex items-center gap-2 text-emerald-400">
                            <Phone size={20} /> Emergency Numbers
                        </h3>
                        <button onClick={addEmergency} className="text-xs text-emerald-400 hover:text-emerald-300">
                            + Add Number
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.emergencyNumbers.map((entry, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    className="form-input bg-black/20 text-sm flex-1"
                                    placeholder="Agency Name"
                                    value={entry.name}
                                    onChange={(e) => {
                                        const newNums = [...data.emergencyNumbers];
                                        newNums[i].name = e.target.value;
                                        updateField("emergencyNumbers", newNums);
                                    }}
                                />
                                <input
                                    className="form-input bg-black/20 text-sm w-32"
                                    placeholder="Number"
                                    value={entry.number}
                                    onChange={(e) => {
                                        const newNums = [...data.emergencyNumbers];
                                        newNums[i].number = e.target.value;
                                        updateField("emergencyNumbers", newNums);
                                    }}
                                />
                                <button onClick={() => removeEmergency(i)} className="text-gray-500 hover:text-red-400 p-2">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
