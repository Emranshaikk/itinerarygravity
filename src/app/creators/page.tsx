"use client";

import Link from "next/link";
import { ShieldCheck, Download, Star, Plus } from "@/components/Icons";

export default function CreatorsPage() {
    const handleCreatorSignup = (e: React.MouseEvent) => {
        // We'll use a sessionStorage flag to tell the dashboard to set the role after signup
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('pending_role', 'influencer');
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                padding: '100px 0',
                background: 'radial-gradient(circle at top right, var(--border), transparent)',
                textAlign: 'center'
            }}>
                <div className="container">
                    <span className="badge" style={{ background: 'var(--surface)', border: '1px solid var(--border)', marginBottom: '24px' }}>
                        Now Open for Beta
                    </span>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                        fontWeight: 800,
                        marginBottom: '24px',
                        lineHeight: 1.1
                    }}>
                        Turn Your Travels into <br />
                        <span className="text-gradient">Passive Income</span>
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                        color: 'var(--gray-400)',
                        maxWidth: '700px',
                        margin: '0 auto 48px',
                        lineHeight: '1.8',
                        padding: '0 20px'
                    }}>
                        Your followers want to know how you travel. Stop sending free recommendations and start selling verified, high-quality itineraries.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        padding: '0 20px'
                    }}>
                        <Link
                            href="/signup"
                            onClick={handleCreatorSignup}
                            className="btn btn-primary"
                            style={{ padding: '16px 40px', fontSize: '1.1rem', minWidth: '200px' }}
                        >
                            Start Creating Now
                        </Link>
                        <Link href="#how-it-works" className="btn btn-outline" style={{ padding: '16px 40px', fontSize: '1.1rem', minWidth: '200px' }}>
                            How it Works
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Join Section */}
            <section style={{ padding: '100px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Why ItineraryGravity?</h2>
                        <p style={{ color: 'var(--gray-400)' }}>The only platform built specifically for high-end travel creators.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
                        {[
                            {
                                icon: <Plus color="var(--primary)" />,
                                title: "Easy Creation",
                                desc: "Our intuitive builder lets you create detailed PDF-ready itineraries in minutes."
                            },
                            {
                                icon: <ShieldCheck color="var(--primary)" />,
                                title: "Verification Badge",
                                desc: "Get verified to build trust. Followers know your itineraries are the real deal."
                            },
                            {
                                icon: <Star color="var(--primary)" />,
                                title: "70% Revenue Share",
                                desc: "Keep the majority of your sales. We only take a 30% commission."
                            },
                            {
                                icon: <Download color="var(--primary)" />,
                                title: "Auto-PDF Generation",
                                desc: "We handle the design and PDF generation. Your followers get a premium guide."
                            }
                        ].map((item, i) => (
                            <div key={i} className="glass card" style={{ padding: '40px' }}>
                                <div style={{ marginBottom: '24px' }}>{item.icon}</div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{item.title}</h3>
                                <p style={{ color: 'var(--gray-400)', lineHeight: '1.6' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing / Verification Preview */}
            <section style={{ padding: '100px 0', background: 'var(--surface)' }}>
                <div className="container">
                    <div className="glass card" style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '60px',
                        padding: 'clamp(30px, 5vw, 60px)',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', marginBottom: '24px' }}>The Verified Creator</h2>
                            <p style={{ color: 'var(--gray-400)', marginBottom: '32px', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', lineHeight: '1.6' }}>
                                For just $9.99/mo, unlock the ability to sell itineraries and get a verified badge on your profile.
                            </p>
                            <Link href="/signup" onClick={handleCreatorSignup} className="btn btn-primary" style={{ width: '100%' }}>
                                Get Started Today
                            </Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            {/* Mock UI element */}
                            <div className="glass" style={{ borderRadius: '20px', padding: '24px', border: '1px solid var(--primary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>J</div>
                                    <div>
                                        <p style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            JourneyWithJane <ShieldCheck size={16} color="var(--primary)" />
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Verified Creator</p>
                                    </div>
                                </div>
                                <div style={{ height: '8px', width: '100%', background: 'var(--border)', borderRadius: '4px', marginBottom: '12px' }} />
                                <div style={{ height: '8px', width: '80%', background: 'var(--border)', borderRadius: '4px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
