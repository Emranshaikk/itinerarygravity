"use client";

import React, { useRef, useEffect } from "react";
import {
    Book, Plane, CreditCard, MapPin, Calendar, Utensils,
    Bus, Star, Shield, Sliders, AlertTriangle, ShoppingBag,
    LogOut, Image as ImageIcon, Gift, ChevronLeft, ChevronRight, CheckCircle2,
    Camera
} from "lucide-react";

interface BuilderStepperProps {
    activeStep: number;
    onStepChange: (step: number) => void;
    completedSteps: number[];
}

import { ITINERARY_PHASES } from "@/lib/itinerary-sections";

interface BuilderStepperProps {
    activeStep: number;
    onStepChange: (step: number) => void;
    completedSteps: number[];
}

export default function BuilderStepper({ activeStep, onStepChange, completedSteps }: BuilderStepperProps) {
    return (
        <div suppressHydrationWarning style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="custom-scrollbar">
                {ITINERARY_PHASES.map((phase, idx) => {
                    // Check if current active step belongs to this phase
                    const sectionIds = phase.sections.map(s => s.id);
                    const isActive = sectionIds.includes(activeStep);
                    const isCompleted = sectionIds.every(id => completedSteps.includes(id));

                    return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={() => onStepChange(sectionIds[0])}
                                style={{
                                    minWidth: '120px',
                                    padding: '1rem 1.5rem',
                                    borderRadius: '1.25rem',
                                    border: '2px solid',
                                    borderColor: isActive ? 'var(--primary)' : isCompleted ? '#22c55e' : 'var(--border)',
                                    backgroundColor: isActive ? 'var(--primary-light, rgba(139, 92, 246, 0.1))' : 'var(--surface)',
                                    color: isActive ? 'var(--primary)' : isCompleted ? '#22c55e' : 'var(--gray-400)',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    letterSpacing: '-0.025em',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                {idx + 1}. {phase.title}
                            </button>
                            {idx < ITINERARY_PHASES.length - 1 && (
                                <span style={{ color: 'var(--border)', fontSize: '1.5rem', fontWeight: 'bold' }}>·</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
