"use client";

import React, { useRef, useEffect } from "react";
import {
    Book, Plane, CreditCard, MapPin, Calendar, Utensils,
    Bus, Star, Shield, Sliders, AlertTriangle, ShoppingBag,
    LogOut, Image as ImageIcon, Gift, ChevronLeft, ChevronRight, CheckCircle2
} from "lucide-react";

interface BuilderStepperProps {
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
    { id: 6, label: "Food Guide", icon: Utensils },
    { id: 7, label: "Transport", icon: Bus },
    { id: 8, label: "Hidden Gems", icon: Star },
    { id: 9, label: "Safety", icon: Shield },
    { id: 10, label: "Customize", icon: Sliders },
    { id: 11, label: "Emergency", icon: AlertTriangle },
    { id: 12, label: "Shopping", icon: ShoppingBag },
    { id: 13, label: "Departure", icon: LogOut },
    { id: 14, label: "Post-Trip", icon: ImageIcon },
    { id: 15, label: "Bonus", icon: Gift },
];

export default function BuilderStepper({ activeStep, onStepChange, completedSteps }: BuilderStepperProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Calculate completion percentage
    const progress = Math.round((completedSteps.length / SECTIONS.length) * 100);

    // Determine the window of 3 items to show
    // We want to show the current one and its neighbors if possible
    let startIndex = Math.max(0, activeStep - 2);
    if (startIndex + 3 > SECTIONS.length) {
        startIndex = Math.max(0, SECTIONS.length - 3);
    }
    const visibleSections = SECTIONS.slice(startIndex, startIndex + 3);

    return (
        <div className="w-full space-y-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Completion Header */}
            <div className="flex justify-between items-end px-2">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Overall Progress</h3>
                    <div className="flex items-center gap-3">
                        <span className="text-4xl font-black text-white italic">{progress}%</span>
                        <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden border border-white/10 hidden sm:block">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-gray-500 block">Current Step</span>
                    <span className="text-lg font-bold text-blue-400">0{activeStep} <span className="text-gray-600">/</span> 15</span>
                </div>
            </div>

            {/* Stepper Window */}
            <div className="relative group">
                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Progress Bar background across the whole container */}
                    <div className="absolute top-0 left-0 h-[2px] w-full bg-white/5 z-0" />
                    <div
                        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 z-10"
                        style={{ width: `${(activeStep / SECTIONS.length) * 100}%` }}
                    />

                    {/* Left Arrow */}
                    <button
                        onClick={() => onStepChange(Math.max(1, activeStep - 1))}
                        disabled={activeStep === 1}
                        className={`p-3 rounded-2xl transition-all ${activeStep === 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 text-white active:scale-95'}`}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Window Items */}
                    <div className="flex-1 flex justify-around items-center gap-4 py-2">
                        {visibleSections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeStep === section.id;
                            const isCompleted = completedSteps.includes(section.id);

                            return (
                                <button
                                    key={section.id}
                                    onClick={() => onStepChange(section.id)}
                                    className={`
                                        flex flex-col items-center gap-3 transition-all duration-500 relative
                                        ${isActive ? 'scale-110' : 'opacity-40 hover:opacity-100 scale-90'}
                                    `}
                                >
                                    <div className={`
                                        w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500
                                        ${isActive
                                            ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                                            : isCompleted
                                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                                : 'bg-black/20 border-white/10 text-gray-400'
                                        }
                                    `}>
                                        {isCompleted && !isActive ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                                    </div>
                                    <div className="text-center">
                                        <span className={`text-xs font-black uppercase tracking-tighter block ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                            {section.label}
                                        </span>
                                        {isActive && (
                                            <span className="text-[10px] text-blue-400 font-bold animate-pulse">ACTIVE</span>
                                        )}
                                    </div>

                                    {/* Small indicator dot */}
                                    {isActive && (
                                        <div className="absolute -top-1 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-black" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => onStepChange(Math.min(SECTIONS.length, activeStep + 1))}
                        disabled={activeStep === SECTIONS.length}
                        className={`p-3 rounded-2xl transition-all ${activeStep === SECTIONS.length ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 text-white active:scale-95'}`}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
