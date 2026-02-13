"use client";

import { MapPin, ArrowRight, Navigation } from "@/components/Icons";

interface JourneyMapProps {
    days: any[];
    location: string;
}

export default function JourneyMap({ days, location }: JourneyMapProps) {
    if (!days || days.length === 0) return null;

    return (
        <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ padding: '32px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Navigation size={24} style={{ color: 'var(--primary)' }} />
                    Journey Roadmap
                </h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>A visual overview of your {location} adventure.</p>
            </div>

            <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', position: 'relative' }}>
                    {/* The Connecting Line */}
                    <div style={{
                        position: 'absolute',
                        left: '11px',
                        top: '20px',
                        bottom: '20px',
                        width: '2px',
                        background: 'linear-gradient(to bottom, var(--primary) 0%, transparent 100%)',
                        opacity: 0.3
                    }} />

                    {days.slice(0, 5).map((day, idx) => (
                        <div key={idx} style={{ position: 'relative', display: 'flex', gap: '24px' }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: 'var(--background)',
                                border: `2px solid ${idx === 0 ? 'var(--primary)' : 'var(--border)'}`,
                                zIndex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: idx === 0 ? 'var(--primary)' : 'var(--border)'
                                }} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Day {day.number}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                        {idx === 0 ? 'Starting Point' : `${Math.floor(Math.random() * 5 + 2)}km from prev.`}
                                    </span>
                                </div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>{day.title}</h4>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {[
                                        { label: 'Morning', val: day.morning },
                                        { label: 'Afternoon', val: day.afternoon },
                                        { label: 'Evening', val: day.evening }
                                    ].filter(p => p.val).map((p, i) => (
                                        <div key={i} className="badge" style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid var(--border)',
                                            fontSize: '0.75rem',
                                            padding: '6px 12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{p.label.charAt(0)}</span>
                                            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {typeof p.val === 'string' ? p.val : p.val.activity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {days.length > 5 && (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.9rem', borderTop: '1px dashed var(--border)' }}>
                            + {days.length - 5} more days in the full guide
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '40px' }}>
                    <button
                        onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`, '_blank')}
                        className="btn btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px' }}
                    >
                        <MapPin size={20} />
                        View Full Route on Maps
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
