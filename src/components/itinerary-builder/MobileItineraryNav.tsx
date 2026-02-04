"use client";
import React, { useRef, useEffect } from "react";
import {
    Book, Plane, CreditCard, MapPin, Calendar, Utensils,
    Bus, Star, Shield, Sliders, AlertTriangle, ShoppingBag,
    LogOut, Image as ImageIcon, Gift, ChevronRight, CheckCircle2
} from "lucide-react";

interface MobileNavProps {
    activeStep: number;
    onStepChange: (step: number) => void;
    completedSteps: number[];
}

const SECTIONS = [
    { id: 1, label: "Cover", icon: Book },
    { id: 2, label: "Pre-Trip", icon: Plane },
    { id: 3, label: "Logistics", icon: CreditCard },
    { id: 4, label: "Arrival", icon: MapPin },
    { id: 5, label: "Daily", icon: Calendar },
    { id: 6, label: "Food", icon: Utensils },
    { id: 7, label: "Transport", icon: Bus },
    { id: 8, label: "Secrets", icon: Star },
    { id: 9, label: "Safety", icon: Shield },
    { id: 10, label: "Customize", icon: Sliders },
    { id: 11, label: "Emergency", icon: AlertTriangle },
    { id: 12, label: "Shopping", icon: ShoppingBag },
    { id: 13, label: "Departure", icon: LogOut },
    { id: 14, label: "Post-Trip", icon: ImageIcon },
    { id: 15, label: "Bonus", icon: Gift },
];

export default function MobileItineraryNav({ activeStep, onStepChange, completedSteps }: MobileNavProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to active item
    useEffect(() => {
        if (scrollRef.current) {
            const activeEl = scrollRef.current.querySelector(`[data-step="${activeStep}"]`) as HTMLElement;
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [activeStep]);

    return (
        <div className="lg:hidden mb-6 sticky top-20 z-40">
            <div className="glass rounded-xl p-1 overflow-x-hidden border-b border-white/10 shadow-xl">
                <div
                    ref={scrollRef}
                    className="flex items-center gap-2 overflow-x-auto no-scrollbar p-2 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {SECTIONS.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeStep === section.id;
                        const isCompleted = completedSteps.includes(section.id);

                        return (
                            <button
                                key={section.id}
                                data-step={section.id}
                                onClick={() => onStepChange(section.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300
                                    flex-shrink-0 border
                                    ${isActive
                                        ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                        : isCompleted
                                            ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20"
                                            : "bg-surface text-gray-400 border-transparent hover:bg-white/5 hover:text-white"
                                    }
                                `}
                            >
                                <Icon size={14} className={isActive ? "text-black" : ""} />
                                <span>{section.label}</span>
                                {isCompleted && !isActive && <CheckCircle2 size={12} />}
                            </button>
                        );
                    })}
                </div>

                {/* Progress Bar */}
                <div className="h-0.5 w-full bg-white/5 mt-1">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${(completedSteps.length / SECTIONS.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
