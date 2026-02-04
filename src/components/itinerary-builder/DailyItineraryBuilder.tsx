"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Plus, Trash2, Sun, Moon, Coffee, MapPin, Clock, Calendar, Wand2, Users, Utensils, Info } from "lucide-react";

interface DailyItineraryBuilderProps {
    data: ItineraryContent["dailyItinerary"];
    onChange: (data: ItineraryContent["dailyItinerary"]) => void;
}

export default function DailyItineraryBuilder({ data, onChange }: DailyItineraryBuilderProps) {
    const [generatingDay, setGeneratingDay] = useState<number | null>(null);

    const addDay = () => {
        onChange([
            ...data,
            {
                dayNumber: data.length + 1,
                title: "",
                description: "",
                wakeUpTime: "08:00",
                crowdTips: "",
                morning: { time: "09:00", activity: "", travelTime: "15m" },
                afternoon: { time: "13:00", activity: "", travelTime: "20m" },
                evening: { time: "18:00", activity: "", travelTime: "10m" },
                logistics: { transport: "", travelTime: "" }
            }
        ]);
    };

    const removeDay = (index: number) => {
        const newData = data.filter((_, i) => i !== index).map((day, i) => ({ ...day, dayNumber: i + 1 }));
        onChange(newData);
    };

    const updateDay = (index: number, field: string, value: any) => {
        const newData = [...data];
        if (field.includes('.')) {
            const parts = field.split('.');
            if (parts.length === 2) {
                (newData[index] as any)[parts[0]][parts[1]] = value;
            }
        } else {
            (newData[index] as any)[field] = value;
        }
        onChange(newData);
    };

    const autoFillDay = (index: number) => {
        setGeneratingDay(index);
        setTimeout(() => {
            const newData = [...data];
            newData[index] = {
                ...newData[index],
                title: "Cultural Immersion & Hidden Alleys",
                wakeUpTime: "07:30",
                crowdTips: "Arrive at the temple gate by 8:15 AM to beat tour buses.",
                morning: {
                    time: "08:30",
                    activity: "Visit the Golden Pavilion followed by a serene walk in the zen rock gardens.",
                    location: "Kinkaku-ji",
                    travelTime: "20 min via Taxi",
                    food: "Matcha Latte at Garden Teahouse",
                    tips: "Silence phones. Respect the meditation spaces."
                },
                afternoon: {
                    time: "13:00",
                    activity: "Stroll through the Bamboo Grove and visit the Tenryu-ji temple.",
                    location: "Arashiyama",
                    travelTime: "30 min Train ride (JR Line)",
                    food: "Arashiyama Yoshimura",
                    foodType: "Soba Noodles (Local Speciality)",
                    tips: "Rent a bike to explore the outer paths easily."
                },
                evening: {
                    time: "18:30",
                    activity: "Pontocho Alley food tour and riverside walk.",
                    location: "Pontocho",
                    travelTime: "20 min Metro",
                    foodBudget: "Yakitori at Toraya ($20/pp)",
                    foodPremium: "Kaiseki at Misoguigawa ($150/pp)",
                    tips: "Reservations essential for reliable spots."
                },
                logistics: {
                    transport: "Metro & Walking",
                    travelTime: "Total ~1.5h transit"
                }
            };
            onChange(newData);
            setGeneratingDay(null);
        }, 1200);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div className="prose dark:prose-invert">
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                        <Calendar className="text-purple-400" size={32} />
                        Day-by-Day Itinerary
                    </h2>
                    <p className="text-gray-400">
                        Design a time-optimized, stress-free flow. Detail is the difference between a good trip and a great one.
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                {data.map((day, index) => (
                    <div key={index} className="card glass p-0 border border-white/5 relative overflow-hidden">
                        {/* Day Header */}
                        <div className="p-6 border-b border-white/5 bg-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-black text-white/10">0{day.dayNumber}</div>
                                <div className="flex-1">
                                    <input
                                        className="bg-transparent border-none text-xl font-bold placeholder-gray-500 focus:ring-0 w-full md:w-[400px]"
                                        placeholder={`Day ${day.dayNumber} Title (e.g. Temples & Tea)`}
                                        value={day.title}
                                        onChange={(e) => updateDay(index, 'title', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => autoFillDay(index)}
                                    disabled={generatingDay === index}
                                    className="btn btn-outline text-xs py-2 h-9"
                                >
                                    {generatingDay === index ? "Building..." : <><Wand2 size={12} className="mr-2" /> Auto-Fill Day</>}
                                </button>
                                {data.length > 1 && (
                                    <button onClick={() => removeDay(index)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Top Logistics Bar */}
                        <div className="bg-black/20 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm border-b border-white/5">
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 flex items-center gap-1"><Sun size={12} /> Ideal Wake Up</label>
                                <input
                                    type="time"
                                    className="bg-transparent border-b border-white/10 focus:border-purple-400 focus:outline-none w-full"
                                    value={day.wakeUpTime || "08:00"}
                                    onChange={(e) => updateDay(index, 'wakeUpTime', e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-2">
                                <label className="text-gray-500 flex items-center gap-1"><Users size={12} /> Crowd Avoidance / Insider Tip</label>
                                <input
                                    className="bg-transparent border-b border-white/10 focus:border-purple-400 focus:outline-none w-full placeholder-gray-600"
                                    placeholder="e.g. Arrive before 8am to avoid tour buses..."
                                    value={day.crowdTips || ""}
                                    onChange={(e) => updateDay(index, 'crowdTips', e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 flex items-center gap-1"><Clock size={12} /> Total Transit</label>
                                <input
                                    className="bg-transparent border-b border-white/10 focus:border-purple-400 focus:outline-none w-full placeholder-gray-600"
                                    placeholder="e.g. 1.5h"
                                    value={day.logistics.travelTime}
                                    onChange={(e) => updateDay(index, 'logistics.travelTime', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Morning Block */}
                            <div className="space-y-4 relative">
                                <div className="absolute left-[-11px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-yellow-300 via-yellow-500/20 to-transparent"></div>
                                <div className="flex items-center justify-between text-yellow-300 mb-2 pl-4">
                                    <h4 className="font-bold flex items-center gap-2"><Sun size={18} /> Morning</h4>
                                    <input
                                        type="time"
                                        className="bg-transparent text-sm w-20 text-right focus:outline-none"
                                        value={day.morning.time}
                                        onChange={(e) => updateDay(index, 'morning.time', e.target.value)}
                                    />
                                </div>
                                <div className="pl-4 space-y-3">
                                    <textarea
                                        className="form-input text-sm bg-white/5 min-h-[100px]"
                                        placeholder="Morning activity..."
                                        value={day.morning.activity}
                                        onChange={(e) => updateDay(index, 'morning.activity', e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            className="form-input text-xs py-1 flex-1 bg-white/5"
                                            placeholder="Location..."
                                            value={day.morning.location || ""}
                                            onChange={(e) => updateDay(index, 'morning.location', e.target.value)}
                                        />
                                        <input
                                            className="form-input text-xs py-1 w-24 bg-white/5"
                                            placeholder="Transit..."
                                            value={day.morning.travelTime || ""}
                                            onChange={(e) => updateDay(index, 'morning.travelTime', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Coffee size={14} className="text-gray-400" />
                                        <input
                                            className="bg-transparent border-b border-white/10 text-xs w-full focus:outline-none placeholder-gray-600"
                                            placeholder="Breakfast spot..."
                                            value={day.morning.food || ""}
                                            onChange={(e) => updateDay(index, 'morning.food', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Afternoon Block */}
                            <div className="space-y-4 relative">
                                <div className="absolute left-[-11px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-400 via-orange-500/20 to-transparent"></div>
                                <div className="flex items-center justify-between text-orange-400 mb-2 pl-4">
                                    <h4 className="font-bold flex items-center gap-2"><Sun size={18} /> Afternoon</h4>
                                    <input
                                        type="time"
                                        className="bg-transparent text-sm w-20 text-right focus:outline-none"
                                        value={day.afternoon.time}
                                        onChange={(e) => updateDay(index, 'afternoon.time', e.target.value)}
                                    />
                                </div>
                                <div className="pl-4 space-y-3">
                                    <textarea
                                        className="form-input text-sm bg-white/5 min-h-[100px]"
                                        placeholder="Afternoon activity..."
                                        value={day.afternoon.activity}
                                        onChange={(e) => updateDay(index, 'afternoon.activity', e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            className="form-input text-xs py-1 flex-1 bg-white/5"
                                            placeholder="Location..."
                                            value={day.afternoon.location || ""}
                                            onChange={(e) => updateDay(index, 'afternoon.location', e.target.value)}
                                        />
                                        <input
                                            className="form-input text-xs py-1 w-24 bg-white/5"
                                            placeholder="Transit..."
                                            value={day.afternoon.travelTime || ""}
                                            onChange={(e) => updateDay(index, 'afternoon.travelTime', e.target.value)}
                                        />
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold uppercase">
                                            <Utensils size={12} /> Lunch Recommendation
                                        </div>
                                        <input
                                            className="bg-transparent border-b border-white/10 text-sm w-full focus:outline-none mb-1 placeholder-gray-600"
                                            placeholder="Restaurant Name..."
                                            value={day.afternoon.food || ""}
                                            onChange={(e) => updateDay(index, 'afternoon.food', e.target.value)}
                                        />
                                        <input
                                            className="bg-transparent text-xs text-gray-400 w-full focus:outline-none placeholder-gray-600"
                                            placeholder="Cuisine Type (e.g. Italian, Sushi)"
                                            value={day.afternoon.foodType || ""}
                                            onChange={(e) => updateDay(index, 'afternoon.foodType', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Evening Block */}
                            <div className="space-y-4 relative">
                                <div className="absolute left-[-11px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-400 via-indigo-500/20 to-transparent"></div>
                                <div className="flex items-center justify-between text-indigo-400 mb-2 pl-4">
                                    <h4 className="font-bold flex items-center gap-2"><Moon size={18} /> Evening</h4>
                                    <input
                                        type="time"
                                        className="bg-transparent text-sm w-20 text-right focus:outline-none"
                                        value={day.evening.time}
                                        onChange={(e) => updateDay(index, 'evening.time', e.target.value)}
                                    />
                                </div>
                                <div className="pl-4 space-y-3">
                                    <textarea
                                        className="form-input text-sm bg-white/5 min-h-[100px]"
                                        placeholder="Nightlife, Shows, Sunset..."
                                        value={day.evening.activity}
                                        onChange={(e) => updateDay(index, 'evening.activity', e.target.value)}
                                    />
                                    <div className="bg-white/5 p-3 rounded-lg space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold uppercase">
                                            <Utensils size={12} /> Dinner Options
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] text-green-400 block">BUDGET SAVER</label>
                                                <input
                                                    className="bg-transparent border-b border-white/10 text-xs w-full focus:outline-none"
                                                    placeholder="Name & Price"
                                                    value={day.evening.foodBudget || ""}
                                                    onChange={(e) => updateDay(index, 'evening.foodBudget', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-amber-400 block">PREMIUM SPLURGE</label>
                                                <input
                                                    className="bg-transparent border-b border-white/10 text-xs w-full focus:outline-none"
                                                    placeholder="Name & Price"
                                                    value={day.evening.foodPremium || ""}
                                                    onChange={(e) => updateDay(index, 'evening.foodPremium', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}

                <button onClick={addDay} className="w-full btn btn-outline border-dashed py-8 hover:bg-white/5 hover:border-white/20 hover:text-white transition-all">
                    <Plus size={20} className="mr-2" />
                    Add Day {data.length + 1} to Itinerary
                </button>
            </div>
        </div>
    );
}
