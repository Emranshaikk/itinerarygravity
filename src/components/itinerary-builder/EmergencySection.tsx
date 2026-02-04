"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { AlertCircle, Wand2, Plus, Trash2, Phone, Hospital, MapPin, ExternalLink } from "lucide-react";

interface EmergencySectionProps {
    data: ItineraryContent["safety"];
    onChange: (data: ItineraryContent["safety"]) => void;
}

export default function EmergencySection({ data, onChange }: EmergencySectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateEmergencyNumbers = (newNums: { name: string; number: string }[]) => {
        onChange({ ...data, emergencyNumbers: newNums });
    };

    const addNumber = () => {
        updateEmergencyNumbers([...data.emergencyNumbers, { name: "", number: "" }]);
    };

    const removeNumber = (index: number) => {
        updateEmergencyNumbers(data.emergencyNumbers.filter((_, i) => i !== index));
    };

    const updateNumber = (index: number, field: "name" | "number", value: string) => {
        const newNums = [...data.emergencyNumbers];
        newNums[index] = { ...newNums[index], [field]: value };
        updateEmergencyNumbers(newNums);
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                ...data,
                emergencyNumbers: [
                    { name: "Police", number: "110" },
                    { name: "Ambulance / Fire", number: "119" },
                    { name: "Japan Helpline (English)", number: "0570-000-911" },
                    { name: "AMDA International Medical Information Center", number: "03-5285-8088" }
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
                        <AlertCircle className="text-red-500" size={32} />
                        Emergency Reference
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        Critical information for when things go wrong. Quick-access numbers and medical locations.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary bg-gradient-to-r from-red-600 to-orange-600 border-none hover:shadow-lg hover:shadow-red-500/20"
                >
                    {isGenerating ? "Preparing..." : <><Wand2 size={16} className="mr-2" /> Auto-Fill Essentials</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Emergency Numbers */}
                <div className="card glass p-6 space-y-4 border border-white/5 bg-white/5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold flex items-center gap-2 text-red-500">
                            <Phone size={20} /> Emergency Contacts
                        </h3>
                        <button onClick={addNumber} className="text-xs text-red-400 hover:text-red-300">
                            + Add Contact
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.emergencyNumbers.map((entry, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    className="form-input bg-black/20 text-sm flex-1"
                                    placeholder="e.g. Police"
                                    value={entry.name}
                                    onChange={(e) => updateNumber(i, "name", e.target.value)}
                                />
                                <input
                                    className="form-input bg-black/20 text-sm w-40"
                                    placeholder="Number"
                                    value={entry.number}
                                    onChange={(e) => updateNumber(i, "number", e.target.value)}
                                />
                                <button onClick={() => removeNumber(i)} className="text-gray-500 hover:text-red-400 p-2">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Medical & Hospital Info */}
                <div className="card glass p-6 space-y-6 border border-white/5 bg-white/5">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
                        <Hospital size={20} /> Hospitals (English Speaking)
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-blue-300">Kyoto University Hospital</h4>
                                    <p className="text-xs text-gray-500">Major center with English support.</p>
                                </div>
                                <MapPin size={16} className="text-blue-400" />
                            </div>
                            <p className="text-sm text-gray-400">54 Shogoin Kawaharacho, Sakyo Ward, Kyoto.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-blue-300">Japan Health Info (Service)</h4>
                                    <p className="text-xs text-gray-500">Call to find the nearest clinic.</p>
                                </div>
                                <ExternalLink size={16} className="text-blue-400" />
                            </div>
                            <p className="text-sm text-gray-400">Website: japanhealthinfo.com</p>
                        </div>
                    </div>
                </div>

                {/* Insurance Info */}
                <div className="md:col-span-2 card glass p-6 border-l-4 border-l-emerald-500 bg-emerald-500/5">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-emerald-400 mb-1">Travel Insurance Quick-Reference</h3>
                            <p className="text-sm text-gray-400">
                                This section in the final PDF will include a space for the traveler to write their policy number and the 24/7 global assistance number. Remind them to keep a physical copy in their day-pack.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
