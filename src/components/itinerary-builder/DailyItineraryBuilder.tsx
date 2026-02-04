"use client";

import React from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Plus, Trash2, Sun, Moon, Coffee, MapPin, Clock, Calendar } from "lucide-react";

interface DailyItineraryBuilderProps {
    data: ItineraryContent["dailyItinerary"];
    onChange: (data: ItineraryContent["dailyItinerary"]) => void;
}

export default function DailyItineraryBuilder({ data, onChange }: DailyItineraryBuilderProps) {

    const addDay = () => {
        onChange([
            ...data,
            {
                dayNumber: data.length + 1,
                title: "",
                description: "",
                morning: { time: "09:00", activity: "" },
                afternoon: { time: "13:00", activity: "" },
                evening: { time: "18:00", activity: "" },
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
        // Deep merge for nested fields like "morning.activity"
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            (newData[index] as any)[parent][child] = value;
        } else {
            (newData[index] as any)[field] = value;
        }
        onChange(newData);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="prose dark:prose-invert">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="text-purple-400" />
                    Day-by-Day Itinerary
                </h2>
                <p className="text-gray-400">
                    This is the core value. Detail exactly what they should do each day.
                </p>
            </div>

            <div className="space-y-6">
                {data.map((day, index) => (
                    <div key={index} className="card glass p-6 border border-white/5 relative">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-white">Day {day.dayNumber}</h3>
                            {data.length > 1 && (
                                <button onClick={() => removeDay(index)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>

                        <div className="form-group mb-6">
                            <label className="form-label">Day Title</label>
                            <input
                                className="form-input text-lg font-medium"
                                placeholder="e.g. Exploring the Ancient Temples"
                                value={day.title}
                                onChange={(e) => updateDay(index, 'title', e.target.value)}
                            />
                        </div>

                        {/* Morning / Afternoon / Evening Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Morning */}
                            <div className="space-y-3 bg-white/5 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-yellow-300 font-semibold">
                                    <Sun size={18} /> Morning
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Time</label>
                                    <input
                                        type="time"
                                        className="form-input py-1 px-2 text-sm"
                                        value={day.morning.time}
                                        onChange={(e) => updateDay(index, 'morning.time', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Activity</label>
                                    <textarea
                                        className="form-input text-sm"
                                        rows={3}
                                        placeholder="What to do..."
                                        value={day.morning.activity}
                                        onChange={(e) => updateDay(index, 'morning.activity', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Breakfast Spot</label>
                                    <input
                                        className="form-input py-1 px-2 text-sm"
                                        placeholder="Famous cafe..."
                                        value={day.morning.food || ""}
                                        onChange={(e) => updateDay(index, 'morning.food', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Afternoon */}
                            <div className="space-y-3 bg-white/5 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-orange-400 font-semibold">
                                    <Sun size={18} /> Afternoon
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Time</label>
                                    <input
                                        type="time"
                                        className="form-input py-1 px-2 text-sm"
                                        value={day.afternoon.time}
                                        onChange={(e) => updateDay(index, 'afternoon.time', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Activity</label>
                                    <textarea
                                        className="form-input text-sm"
                                        rows={3}
                                        placeholder="Secondary attractions..."
                                        value={day.afternoon.activity}
                                        onChange={(e) => updateDay(index, 'afternoon.activity', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Lunch Spot</label>
                                    <input
                                        className="form-input py-1 px-2 text-sm"
                                        placeholder="Local restaurant..."
                                        value={day.afternoon.food || ""}
                                        onChange={(e) => updateDay(index, 'afternoon.food', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Evening */}
                            <div className="space-y-3 bg-white/5 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                                    <Moon size={18} /> Evening
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Time</label>
                                    <input
                                        type="time"
                                        className="form-input py-1 px-2 text-sm"
                                        value={day.evening.time}
                                        onChange={(e) => updateDay(index, 'evening.time', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Activity</label>
                                    <textarea
                                        className="form-input text-sm"
                                        rows={3}
                                        placeholder="Sunset / Nightlife..."
                                        value={day.evening.activity}
                                        onChange={(e) => updateDay(index, 'evening.activity', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Dinner Spot</label>
                                    <input
                                        className="form-input py-1 px-2 text-sm"
                                        placeholder="Suggested dinner..."
                                        value={day.evening.food || ""}
                                        onChange={(e) => updateDay(index, 'evening.food', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Logistics */}
                        <div className="mt-6 p-4 bg-white/5 rounded-xl flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2 text-gray-400">
                                <MapPin size={16} /> <span className="text-sm font-semibold">Logistics:</span>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <input
                                    className="form-input py-1 px-3 text-sm"
                                    placeholder="Transport Mode (e.g. Cab, Train)"
                                    value={day.logistics.transport}
                                    onChange={(e) => updateDay(index, 'logistics.transport', e.target.value)}
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <input
                                    className="form-input py-1 px-3 text-sm"
                                    placeholder="Travel Time (e.g. 1 hour)"
                                    value={day.logistics.travelTime}
                                    onChange={(e) => updateDay(index, 'logistics.travelTime', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button onClick={addDay} className="w-full btn btn-outline border-dashed py-8 hover:bg-white/5">
                    <Plus size={20} className="mr-2" />
                    Add Day {data.length + 1}
                </button>
            </div>
        </div>
    );
}
