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

import { ITINERARY_PHASES, ALL_SECTIONS } from "@/lib/itinerary-sections";

export default function ItinerarySidebar({ activeStep, onStepChange, completedSteps }: BuilderSidebarProps) {
    const progress = Math.round((completedSteps.length / ALL_SECTIONS.length) * 100);

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
            <div className="overflow-y-auto flex-1 p-4 space-y-6 custom-scrollbar pb-12">
                {ITINERARY_PHASES.map((phase, pIdx) => {
                    return (
                        <div key={pIdx} className="space-y-2">
                            <div className="px-2 mb-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phase {pIdx + 1}: {phase.title}</h4>
                            </div>
                            <div className="space-y-1">
                                {phase.sections.map((section) => {
                                    const Icon = section.icon;
                                    const isActive = activeStep === section.id;
                                    const isCompleted = completedSteps.includes(section.id);

                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => onStepChange(section.id)}
                                            className={`
                                            group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 relative
                                            ${isActive
                                                    ? "bg-accent/80 shadow-sm"
                                                    : "hover:bg-accent/40"
                                                }
                                        `}
                                        >
                                            {/* Icon Container */}
                                            <div className={`
                                            relative z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 border shrink-0
                                            ${isActive
                                                    ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                                                    : isCompleted
                                                        ? "bg-green-500/10 border-green-500/30 text-green-500"
                                                        : "bg-secondary/50 border-border text-muted-foreground group-hover:text-foreground group-hover:border-border"
                                                }
                                        `}>
                                                {isCompleted && !isActive ? (
                                                    <CheckCircle2 size={16} />
                                                ) : (
                                                    <Icon size={16} />
                                                )}
                                            </div>

                                            {/* Text Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium truncate transition-colors ${isActive ? "text-foreground" : isCompleted ? "text-foreground/80 font-semibold" : "text-muted-foreground group-hover:text-foreground/90"}`}>
                                                    {section.label}
                                                </p>
                                            </div>

                                            {/* Active Chevron */}
                                            {isActive && (
                                                <ChevronRight size={14} className="text-primary animate-pulse" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Fade Effect */}
            <div className="h-8 bg-gradient-to-t from-background to-transparent pointer-events-none absolute bottom-0 left-0 right-0 z-10" />
        </div>
    );
}
