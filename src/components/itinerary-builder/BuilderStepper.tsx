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
    // Determine the window of 3 items to show
    let startIndex = Math.max(0, activeStep - 1);
    // Adjust to show current and next 2 if possible
    if (startIndex + 3 > SECTIONS.length) {
        startIndex = Math.max(0, SECTIONS.length - 3);
    }
    const visibleSections = SECTIONS.slice(startIndex, startIndex + 3);

    return (
        <div suppressHydrationWarning style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {visibleSections.map((section, idx) => {
                    const isActive = activeStep === section.id;

                    return (
                        <div key={section.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={() => onStepChange(section.id)}
                                style={{
                                    minWidth: '120px',
                                    padding: '1rem 1.5rem',
                                    borderRadius: '1.25rem',
                                    border: '2px solid',
                                    borderColor: isActive ? '#a5f3fc' : 'var(--border)',
                                    backgroundColor: isActive ? '#cffafe' : 'var(--surface)',
                                    color: isActive ? '#164e63' : 'var(--gray-400)',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    letterSpacing: '-0.025em',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                {section.label}
                            </button>
                            {idx < visibleSections.length - 1 && (
                                <span style={{ color: 'var(--border)', fontSize: '1.5rem', fontWeight: 'bold' }}>·</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
