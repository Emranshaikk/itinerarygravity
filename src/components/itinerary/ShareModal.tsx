"use client";

import { useState } from "react";
import { X, Send, MessageCircle, Mail, ArrowRight } from "@/components/Icons";

interface ShareModalProps {
    itinerary: {
        id: string;
        title: string;
        location: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

export default function ShareModal({ itinerary, isOpen, onClose }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const shareUrl = `${window.location.origin}/itinerary/${itinerary.id}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareTargets = [
        { name: 'WhatsApp', icon: <MessageCircle size={24} />, color: '#25D366', url: `https://wa.me/?text=${encodeURIComponent(`Check out this amazing itinerary for ${itinerary.location}: ${shareUrl}`)}` },
        { name: 'Email', icon: <Mail size={24} />, color: '#EA4335', url: `mailto:?subject=Amazing Trip Idea: ${itinerary.location}&body=Check this out: ${shareUrl}` },
        { name: 'Twitter/X', icon: <Send size={24} />, color: '#000000', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just found this epic trip plan for ${itinerary.location}! #Travel`)}&url=${encodeURIComponent(shareUrl)}` }
    ];

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
            onClick={onClose}
        >
            <div
                className="glass card"
                style={{
                    maxWidth: '450px',
                    width: '100%',
                    padding: '32px',
                    position: 'relative'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}
                >
                    <X size={20} />
                </button>

                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Share this Adventure</h3>
                <p style={{ color: 'var(--gray-400)', marginBottom: '24px' }}>Let others join your journey to {itinerary.location}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                    {shareTargets.map(target => (
                        <a
                            key={target.name}
                            href={target.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: target.color,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                padding: '16px'
                            }}>
                                {target.icon}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{target.name}</span>
                        </a>
                    ))}
                </div>

                <div style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--gray-400)',
                            fontSize: '0.9rem',
                            flex: 1,
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={copyToClipboard}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
        </div>
    );
}
