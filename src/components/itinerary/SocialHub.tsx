"use client";

import { useState } from "react";
import { Star, Clock, Compass, Share2 } from "@/components/Icons";

interface Props {
    itineraryId: string;
    currentUser: any;
}

export default function SocialHub({ itineraryId, currentUser }: Props) {
    const [tips, setTips] = useState([
        { id: 1, user: "Sarah J.", avatar: "S", text: "The ramen shop on Day 2 is closed on Mondays! Try the sushi place next door instead, it was incredible.", time: "2h ago", likes: 12 },
        { id: 2, user: "Mike T.", avatar: "M", text: "Just at the viewing platform. Best time for photos is definitely 4:30 PM just before sunset. Crowds are smaller too.", time: "5h ago", likes: 8 },
        { id: 3, user: "Elena", avatar: "E", text: "Pro tip: The bus pass mentioned in Logistics can be bought at the airport for a discount!", time: "1d ago", likes: 24 }
    ]);
    const [newTip, setNewTip] = useState("");

    const handlePostTip = () => {
        if (!newTip.trim()) return;
        const tip = {
            id: Date.now(),
            user: currentUser?.user_metadata?.full_name || "You",
            avatar: (currentUser?.user_metadata?.full_name?.[0] || "Y"),
            text: newTip,
            time: "Just now",
            likes: 0
        };
        setTips([tip, ...tips]);
        setNewTip("");
    };

    return (
        <div style={{ marginTop: '48px', borderTop: '1px solid var(--border)', paddingTop: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Compass size={32} color="var(--primary)" /> Traveler Social Hub
                    </h2>
                    <p style={{ color: 'var(--gray-400)' }}>Real-time tips and updates from fellow buyers currently on this trip.</p>
                </div>
                <div className="badge" style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', fontWeight: 700, padding: '8px 16px' }}>
                    Private Buyer Community
                </div>
            </div>

            <div className="glass card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', background: 'rgba(var(--primary-rgb), 0.02)' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'var(--primary)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            flexShrink: 0
                        }}>
                            {currentUser?.user_metadata?.full_name?.[0] || "Y"}
                        </div>
                        <div style={{ flex: 1 }}>
                            <textarea
                                value={newTip}
                                onChange={(e) => setNewTip(e.target.value)}
                                placeholder="Share a real-time tip with other travelers..."
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--surface)',
                                    color: 'var(--foreground)',
                                    outline: 'none',
                                    minHeight: '100px',
                                    resize: 'none',
                                    fontSize: '0.95rem',
                                    marginBottom: '12px'
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={handlePostTip}
                                    className="btn btn-primary"
                                    style={{ padding: '8px 24px', fontSize: '0.9rem' }}
                                >
                                    Post Tip
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {tips.map((tip, idx) => (
                        <div key={tip.id} style={{
                            padding: '24px',
                            borderBottom: idx === tips.length - 1 ? 'none' : '1px solid var(--border)',
                            transition: 'background 0.2s'
                        }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--input-bg)',
                                    border: '1px solid var(--border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    flexShrink: 0
                                }}>
                                    {tip.avatar}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{tip.user}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={12} /> {tip.time}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--foreground)', opacity: 0.9, lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '12px' }}>
                                        {tip.text}
                                    </p>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gray-400)', fontSize: '0.8rem', cursor: 'pointer' }}>
                                            <Star size={14} /> Helpful ({tip.likes})
                                        </button>
                                        <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gray-400)', fontSize: '0.8rem', cursor: 'pointer' }}>
                                            <Share2 size={14} /> Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
