"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Shield, Star, Info, ShieldCheck, Camera } from "@/components/Icons";

export default function InfluencerSettingsPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<'idle' | 'saving'>('idle');
    const [profileImg, setProfileImg] = useState<string | null>(null);

    const [profile, setProfile] = useState({
        name: "Sarah Travels",
        handle: "sarah_travels",
        bio: "Full-time traveler and photographer. I've been to 45 countries and counting.",
        email: "influencer@test.com",
        instagram: "sarah_travels",
        tiktok: "sarah_daily"
    });

    const [payment, setPayment] = useState({
        stripeConnected: true,
        paypalEmail: "sarah.pay@example.com",
        payoutFrequency: "Weekly",
        currency: "USD"
    });

    const handleSave = () => {
        setStatus('saving');
        setTimeout(() => {
            setStatus('idle');
            alert("Settings saved successfully!");
        }, 1500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImg(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container" style={{ padding: '40px 0', maxWidth: '900px' }}>
            <button
                onClick={() => router.back()}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--gray-400)', marginBottom: '24px' }}
            >
                <ArrowLeft size={16} /> Dashboard
            </button>

            <header style={{ marginBottom: '40px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Creator Settings</h1>
                <p style={{ color: 'var(--gray-400)' }}>Manage your public profile and payment preferences.</p>
            </header>

            <div style={{ display: 'grid', gap: '32px' }}>
                {/* Profile Section */}
                <section className="glass card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Public Profile
                        <span className="badge" style={{ background: 'var(--primary)', fontSize: '0.7rem' }}>Verified</span>
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: profileImg ? `url(${profileImg})` : 'var(--surface)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                color: 'var(--gray-400)',
                                border: '2px solid var(--border)',
                                overflow: 'hidden'
                            }}>
                                {!profileImg && profile.name.charAt(0)}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                }}
                            >
                                <Camera size={16} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '4px' }}>Profile Picture</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>JPG, GIF or PNG. Max size 2MB.</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Display Name</label>
                                <input className="form-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Handle (URL)</label>
                                <input className="form-input" value={profile.handle} onChange={(e) => setProfile({ ...profile, handle: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Bio (Max 200 chars)</label>
                            <textarea className="form-input" style={{ minHeight: '100px' }} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Instagram Link</label>
                                <input className="form-input" value={profile.instagram} onChange={(e) => setProfile({ ...profile, instagram: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">TikTok Link</label>
                                <input className="form-input" value={profile.tiktok} onChange={(e) => setProfile({ ...profile, tiktok: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Payment & Payouts Section */}
                <section className="glass card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Payments & Payouts</h3>

                    {payment.stripeConnected ? (
                        <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', background: '#10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>R</div>
                                <div>
                                    <p style={{ fontWeight: 600 }}>Razorpay Connected</p>
                                    <p style={{ fontSize: '0.8rem', color: '#10b981 opacity 0.8' }}>Verified to receive payouts via Razorpay.</p>
                                </div>
                            </div>
                            <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Manage</button>
                        </div>
                    ) : (
                        <div style={{ padding: '24px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--primary)', borderRadius: '12px', marginBottom: '24px', textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '8px' }}>Connect Razorpay</h4>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '16px' }}>We use Razorpay for secure payments to our creators.</p>
                            <button className="btn btn-primary">Setup Razorpay</button>
                        </div>
                    )}

                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label">UPI ID / Bank Account (Settlement)</label>
                            <input className="form-input" placeholder="e.g. user@upi" value={payment.paypalEmail} onChange={(e) => setPayment({ ...payment, paypalEmail: e.target.value })} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Payout Frequency</label>
                                <select className="form-input" value={payment.payoutFrequency} onChange={(e) => setPayment({ ...payment, payoutFrequency: e.target.value })}>
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Primary Currency</label>
                                <select className="form-input" value={payment.currency} onChange={(e) => setPayment({ ...payment, currency: e.target.value })}>
                                    <option>INR</option>
                                    <option>USD</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Account Settings Section */}
                <section className="glass card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Account Access</h3>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input className="form-input" type="email" value={profile.email} disabled />
                        <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '8px' }}>Contact support to change your email.</p>
                    </div>
                </section>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '20px' }}>
                    <button className="btn btn-outline" onClick={() => router.back()}>Cancel</button>
                    <button className="btn btn-primary" style={{ padding: '12px 32px' }} onClick={handleSave} disabled={status === 'saving'}>
                        {status === 'saving' ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
