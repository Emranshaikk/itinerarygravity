"use client";

import { useState } from 'react';
import { Compass, Info, MessageSquare, Star, MapPin } from 'lucide-react';
import ItineraryCard from "@/components/ItineraryCard";
import Link from 'next/link';
import Image from 'next/image';

interface CreatorProfileClientProps {
    creator: any;
}

export default function CreatorTabs({ creator }: CreatorProfileClientProps) {
    const [activeTab, setActiveTab] = useState('guides');

    const tabs = [
        { id: 'guides', label: 'Guides', icon: Compass },
        { id: 'about', label: 'About', icon: Info },
        { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    ];

    return (
        <div style={{ width: '100%' }}>
            {/* Tabs Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '32px',
                marginBottom: '48px',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '0'
            }}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '16px 8px',
                                background: 'none',
                                border: 'none',
                                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                                color: isActive ? 'var(--primary)' : 'var(--gray-400)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontSize: '1rem',
                                position: 'relative',
                                marginBottom: '-1px'
                            }}
                        >
                            <Icon size={18} />
                            {tab.label}
                            {isActive && (
                                <span style={{
                                    position: 'absolute',
                                    bottom: '-1px',
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: 'var(--primary)',
                                    boxShadow: '0 0 10px var(--primary)'
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
                {activeTab === 'guides' && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '32px'
                    }}>
                        {creator.itineraries.map((item: any) => (
                            <div key={item.id}>
                                <ItineraryCard
                                    itinerary={{
                                        ...item,
                                        creator: creator.name,
                                        is_verified: true, // Assuming elite creators are verified
                                        image: item.image,
                                    }}
                                />
                            </div>
                        ))}
                        {creator.itineraries.length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--gray-400)' }}>
                                No guides published yet.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="glass card" style={{ padding: '48px', maxWidth: '900px', margin: '0 auto' }}>
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>About {creator.name}</h3>
                        <p style={{ color: 'var(--gray-400)', fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                            {creator.bio || "No biography provided."}
                        </p>

                        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: '8px' }}>Location</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                    <MapPin size={18} color="var(--primary)" />
                                    Digital Nomad
                                </div>
                            </div>
                            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: '8px' }}>Specialty</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                    <Star size={18} color="var(--primary)" />
                                    Premium Itineraries
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="glass card" style={{ padding: '48px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 800 }}>{creator.rating}</span>
                                <Star size={32} color="#fbbf24" fill="#fbbf24" />
                            </div>
                            <p style={{ color: 'var(--gray-400)' }}>Based on {creator.reviews} traveler reviews</p>
                        </div>
                        <p style={{ color: 'var(--gray-400)', fontSize: '1.1rem' }}>
                            Reviews for individual itineraries are available on their respective pages.
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
