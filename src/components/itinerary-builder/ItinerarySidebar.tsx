"use client";

import React from "react";
import {
    Book, Plane, CreditCard, MapPin, Calendar, Utensils,
    Bus, Star, Shield, Sliders, AlertTriangle, ShoppingBag,
    LogOut, Image as ImageIcon, Gift
} from "lucide-react";

interface BuilderSidebarProps {
    activeStep: number;
    onStepChange: (step: number) => void;
    completedSteps: number[];
}

const SECTIONS = [
    { id: 1, label: "Cover & Basic Info", icon: Book },
    { id: 2, label: "Before You Travel", icon: Plane },
    { id: 3, label: "Money & Connectivity", icon: CreditCard },
    { id: 4, label: "Arrival Experience", icon: MapPin },
    { id: 5, label: "Day-by-Day Itinerary", icon: Calendar },
    { id: 6, label: "Local Food Guide", icon: Utensils },
    { id: 7, label: "Transport Playbook", icon: Bus },
    { id: 8, label: "Hidden Gems", icon: Star },
    { id: 9, label: "Safety & Culture", icon: Shield },
    { id: 10, label: "Customization", icon: Sliders },
    { id: 11, label: "Emergency Info", icon: AlertTriangle },
    { id: 12, label: "Shopping Guide", icon: ShoppingBag },
    { id: 13, label: "Departure Plan", icon: LogOut },
    { id: 14, label: "Post-Trip & Reflection", icon: ImageIcon },
    { id: 15, label: "Bonus & Extras", icon: Gift },
];

export default function ItinerarySidebar({ activeStep, onStepChange, completedSteps }: BuilderSidebarProps) {
    return (
        <div className="glass p-4 rounded-2xl h-fit sticky top-24 overflow-y-auto max-h-[85vh]">
            <h3 className="text-lg font-bold mb-4 px-2 text-gradient">Itinerary Builder</h3>
            <nav className="space-y-1">
                {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeStep === section.id;
                    const isCompleted = completedSteps.includes(section.id);

                    return (
                        <button
                            key={section.id}
                            onClick={() => onStepChange(section.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                                    ? "bg-white/10 text-white shadow-lg border border-white/10"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }
              `}
                        >
                            <div className={`p-1.5 rounded-lg ${isActive ? "bg-white/20" : "bg-transparent"} ${isCompleted && !isActive ? "text-green-400" : ""}`}>
                                <Icon size={16} />
                            </div>
                            <span className="text-left flex-1">{section.label}</span>
                            {isCompleted && (
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-8 px-3">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${(completedSteps.length / SECTIONS.length) * 100}%` }}
                    />
                </div>
                <p className="text-xs text-center mt-2 text-gray-500">
                    {Math.round((completedSteps.length / SECTIONS.length) * 100)}% Complete
                </p>
            </div>
        </div>
    );
}
