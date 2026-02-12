"use client";
import React from "react";
import {
    Book, Plane, CreditCard, MapPin, Calendar, Utensils,
    Bus, Star, Shield, Sliders, AlertTriangle, ShoppingBag,
    LogOut, Image as ImageIcon, Gift, CheckCircle2, ChevronRight, Circle
} from "lucide-react";

interface BuilderSidebarProps {
    activeStep: number;
    onStepChange: (step: number) => void;
    completedSteps: number[];
}

const SECTIONS = [
    { id: 1, label: "Cover & Basic Info", icon: Book, desc: "Title, Price & Look" },
    { id: 2, label: "Before You Travel", icon: Plane, desc: "Flights, Packing, Prep" },
    { id: 3, label: "Money & Connectivity", icon: CreditCard, desc: "Sims, Cash, Budget" },
    { id: 4, label: "Arrival Experience", icon: MapPin, desc: "First Impressions" },
    { id: 5, label: "Day-by-Day Itinerary", icon: Calendar, desc: "The Core Journey" },
    { id: 6, label: "Local Food Guide", icon: Utensils, desc: "Must-eats & Dining" },
    { id: 7, label: "Transport Playbook", icon: Bus, desc: "Getting Around" },
    { id: 8, label: "Hidden Gems", icon: Star, desc: "Secret Spots" },
    { id: 9, label: "Safety & Culture", icon: Shield, desc: "Stay Safe & Respectful" },
    { id: 10, label: "Customization", icon: Sliders, desc: "Couples, Families, Solos" },
    { id: 11, label: "Emergency Info", icon: AlertTriangle, desc: "Better safe than sorry" },
    { id: 12, label: "Shopping Guide", icon: ShoppingBag, desc: "Souvenirs & Markets" },
    { id: 13, label: "Departure Plan", icon: LogOut, desc: "Leaving smoothly" },
    { id: 14, label: "Post-Trip & Reflection", icon: ImageIcon, desc: "Memories & sharing" },
    { id: 15, label: "Bonus & Extras", icon: Gift, desc: "Freebies & Links" },
];

export default function ItinerarySidebar({ activeStep, onStepChange, completedSteps }: BuilderSidebarProps) {
    const progress = Math.round((completedSteps.length / SECTIONS.length) * 100);

    return (
        <div className="glass rounded-2xl h-fit sticky top-24 overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-6 border-b border-border bg-card/30 backdrop-blur-md">
                <h3 className="text-xl font-bold text-foreground">
                    Itinerary Builder
                </h3>
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Completion</span>
                        <span className="text-foreground font-medium">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable List */}
            <div className="overflow-y-auto flex-1 p-2 space-y-0.5 custom-scrollbar">
                {SECTIONS.map((section, index) => {
                    const Icon = section.icon;
                    const isActive = activeStep === section.id;
                    const isCompleted = completedSteps.includes(section.id);
                    const isNext = activeStep + 1 === section.id;

                    return (
                        <button
                            key={section.id}
                            onClick={() => onStepChange(section.id)}
                            className={`
                                group w-full flex items-center gap-4 px-4 py-3 text-left transition-all duration-200 relative
                                ${isActive
                                    ? "bg-accent"
                                    : "hover:bg-accent/50"
                                }
                            `}
                        >
                            {/* Left Highlight Line for Active State */}
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500" />
                            )}

                            {/* Icon Container */}
                            <div className={`
                                relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border
                                ${isActive
                                    ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                    : isCompleted
                                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                                        : "bg-secondary/50 border-border text-muted-foreground group-hover:text-foreground group-hover:border-border"
                                }
                            `}>
                                {isCompleted && !isActive ? (
                                    <CheckCircle2 size={18} />
                                ) : (
                                    <Icon size={18} />
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold truncate transition-colors ${isActive ? "text-foreground" : isCompleted ? "text-green-600 dark:text-green-400" : "text-muted-foreground group-hover:text-foreground"}`}>
                                    {section.label}
                                </p>
                                <p className={`text-[10px] truncate ${isActive ? "text-primary/70" : "text-muted-foreground/70 group-hover:text-muted-foreground"}`}>
                                    {section.desc}
                                </p>
                            </div>

                            {/* Active Chevron */}
                            {isActive && (
                                <ChevronRight size={14} className="text-foreground/50 animate-pulse" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Bottom Fade Effect */}
            <div className="h-6 bg-gradient-to-t from-black/50 to-transparent pointer-events-none absolute bottom-0 left-0 right-0" />
        </div>
    );
}
