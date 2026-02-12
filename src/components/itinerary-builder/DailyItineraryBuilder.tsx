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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                    <Calendar style={{ color: '#9333ea' }} size={32} />
                    Day-by-Day Itinerary
                </h2>
                <p style={{ color: 'var(--gray-400)' }}>
                    Design a time-optimized, stress-free flow. Detail is the difference between a good trip and a great one.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {data.map((day, index) => (
                    <div key={index} style={{ border: '1px solid var(--border)', borderRadius: '2rem', backgroundColor: 'var(--surface)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
                        {/* Day Header */}
                        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--border)', lineHeight: 1 }}>{day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}</div>
                                <input
                                    style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--foreground)', width: '100%', outline: 'none' }}
                                    placeholder={`Day ${day.dayNumber} Title`}
                                    value={day.title}
                                    onChange={(e) => updateDay(index, 'title', e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <button
                                    onClick={() => autoFillDay(index)}
                                    disabled={generatingDay === index}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--gray-400)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    <Wand2 size={14} /> {generatingDay === index ? "Generating..." : "Auto-Fill Day"}
                                </button>
                                {data.length > 1 && (
                                    <button onClick={() => removeDay(index)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Top Logistics Bar */}
                        <div style={{ backgroundColor: 'var(--input-bg)', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Clock size={14} /> Wake Up
                                </label>
                                <input
                                    type="time"
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}
                                    value={day.wakeUpTime || "08:00"}
                                    onChange={(e) => updateDay(index, 'wakeUpTime', e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Info size={14} /> Insider Tip
                                </label>
                                <input
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}
                                    placeholder="e.g. Arrive before 8am..."
                                    value={day.crowdTips || ""}
                                    onChange={(e) => updateDay(index, 'crowdTips', e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--gray-400)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <MapPin size={14} /> Transit Plan
                                </label>
                                <input
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}
                                    placeholder="e.g. Metro + Walking"
                                    value={day.logistics.transport}
                                    onChange={(e) => updateDay(index, 'logistics.transport', e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {/* Morning Block */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ fontWeight: 'bold', color: '#ca8a04', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Sun size={18} /> Morning
                                    </h4>
                                    <input
                                        type="time"
                                        style={{ background: 'transparent', border: 'none', fontSize: '0.875rem', color: 'var(--gray-400)', textAlign: 'right', fontWeight: '600' }}
                                        value={day.morning.time}
                                        onChange={(e) => updateDay(index, 'morning.time', e.target.value)}
                                    />
                                </div>
                                <textarea
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', fontSize: '0.875rem', minHeight: '140px', color: 'var(--foreground)' }}
                                    placeholder="Morning activity details..."
                                    value={day.morning.activity}
                                    onChange={(e) => updateDay(index, 'morning.activity', e.target.value)}
                                />
                            </div>

                            {/* Afternoon Block */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ fontWeight: 'bold', color: '#ea580c', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Utensils size={18} /> Afternoon
                                    </h4>
                                    <input
                                        type="time"
                                        style={{ background: 'transparent', border: 'none', fontSize: '0.875rem', color: 'var(--gray-400)', textAlign: 'right', fontWeight: '600' }}
                                        value={day.afternoon.time}
                                        onChange={(e) => updateDay(index, 'afternoon.time', e.target.value)}
                                    />
                                </div>
                                <textarea
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', fontSize: '0.875rem', minHeight: '140px', color: 'var(--foreground)' }}
                                    placeholder="Afternoon activity details..."
                                    value={day.afternoon.activity}
                                    onChange={(e) => updateDay(index, 'afternoon.activity', e.target.value)}
                                />
                            </div>

                            {/* Evening Block */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ fontWeight: 'bold', color: '#4f46e5', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Moon size={18} /> Evening
                                    </h4>
                                    <input
                                        type="time"
                                        style={{ background: 'transparent', border: 'none', fontSize: '0.875rem', color: 'var(--gray-400)', textAlign: 'right', fontWeight: '600' }}
                                        value={day.evening.time}
                                        onChange={(e) => updateDay(index, 'evening.time', e.target.value)}
                                    />
                                </div>
                                <textarea
                                    className="form-input"
                                    style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border)', fontSize: '0.875rem', minHeight: '140px', color: 'var(--foreground)' }}
                                    placeholder="Evening activity details..."
                                    value={day.evening.activity}
                                    onChange={(e) => updateDay(index, 'evening.activity', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={addDay}
                    className="btn"
                    style={{ width: '100%', padding: '2.5rem', borderRadius: '2rem', border: '2px dashed var(--border)', color: 'var(--gray-400)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', backgroundColor: 'var(--surface)', cursor: 'pointer', fontSize: '1.25rem', transition: 'all 0.2s ease' }}
                >
                    <div style={{ backgroundColor: 'var(--input-bg)', padding: '0.5rem', borderRadius: '50%' }}>
                        <Plus size={24} />
                    </div>
                    Add Day {data.length + 1}
                </button>
            </div>
        </div>
    );
}
