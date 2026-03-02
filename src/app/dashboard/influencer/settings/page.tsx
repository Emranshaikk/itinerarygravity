"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Shield, Star, Info, ShieldCheck, Camera, CreditCard, Landmark, Send } from "@/components/Icons";
import ImageUpload from "@/components/ImageUpload";

export default function CreatorSettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ id: string, email: string } | null>(null);
    const [status, setStatus] = useState<'idle' | 'saving' | 'loading'>('loading');
    const [profileImg, setProfileImg] = useState<string | null>(null);

    const [profile, setProfile] = useState({
        name: "",
        handle: "",
        bio: "",
        email: "",
        instagram: "",
        tiktok: "",
        youtube: "",
        twitter: ""
    });

    const [payment, setPayment] = useState({
        stripeConnected: false,
        razorpayAccount: "",
        paypalEmail: "",
        upiId: "",
        bankAccount: "",
        payoutFrequency: "Weekly",
        currency: "INR"
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile/settings');
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }

                if (res.ok) {
                    const data = await res.json();
                    setUser({ id: data._id, email: data.email });
                    setProfile({
                        name: data.full_name || "",
                        handle: data.username || "",
                        bio: data.bio || "",
                        email: data.email || "",
                        instagram: data.social_links?.instagram || "",
                        tiktok: data.social_links?.tiktok || "",
                        youtube: data.social_links?.youtube || "",
                        twitter: data.social_links?.twitter || ""
                    });
                    setProfileImg(data.avatar_url);
                    if (data.payment_info) {
                        setPayment(prev => ({ ...prev, ...data.payment_info }));
                    }
                    if (data.razorpay_account_id) {
                        setPayment(prev => ({ ...prev, razorpayAccount: data.razorpay_account_id, stripeConnected: true }));
                    }
                }
            } catch (err) {
                console.error("Error fetching profile", err);
            } finally {
                setStatus('idle');
            }
        };
        fetchProfile();
    }, [router]);

    const handleSave = async () => {
        if (!user) return;
        setStatus('saving');

        try {
            const updates = {
                full_name: profile.name,
                username: profile.handle,
                bio: profile.bio,
                avatar_url: profileImg,
                social_links: {
                    instagram: profile.instagram,
                    tiktok: profile.tiktok,
                    youtube: profile.youtube,
                    twitter: profile.twitter
                },
                payment_info: payment,
                razorpay_account_id: payment.razorpayAccount
            };

            const res = await fetch('/api/profile/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to save settings");
            }

            alert("Settings saved successfully!");
        } catch (error: any) {
            console.error("Error:", error);
            alert("Error saving settings: " + error.message);
        } finally {
            setStatus('idle');
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

                    <div style={{ marginBottom: '32px' }}>
                        <ImageUpload
                            value={profileImg || ""}
                            onChange={(url) => setProfileImg(url)}
                            folder="profiles"
                            label="Profile Picture"
                        />
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
                                <label className="form-label">Instagram Handle</label>
                                <input className="form-input" placeholder="@yourname" value={profile.instagram} onChange={(e) => setProfile({ ...profile, instagram: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">TikTok Handle</label>
                                <input className="form-input" placeholder="@yourname" value={profile.tiktok} onChange={(e) => setProfile({ ...profile, tiktok: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">YouTube Channel URL</label>
                                <input className="form-input" placeholder="https://youtube.com/c/yourname" value={profile.youtube} onChange={(e) => setProfile({ ...profile, youtube: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Twitter Handle</label>
                                <input className="form-input" placeholder="@yourname" value={profile.twitter} onChange={(e) => setProfile({ ...profile, twitter: e.target.value })} />
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
                                    <p style={{ fontSize: '0.8rem', color: '#10b981', opacity: 0.8 }}>Verified to receive payouts via Razorpay ({payment.razorpayAccount}).</p>
                                </div>
                            </div>
                            <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }} onClick={() => setPayment({ ...payment, stripeConnected: false })}>Edit</button>
                        </div>
                    ) : (
                        <div style={{ padding: '24px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--primary)', borderRadius: '12px', marginBottom: '24px', textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '8px' }}>Connect Razorpay</h4>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '16px' }}>Enter your Razorpay Route connected account ID to receive automated payouts.</p>

                            <div className="form-group" style={{ maxWidth: '400px', margin: '0 auto 16px auto', textAlign: 'left' }}>
                                <label className="form-label">Razorpay Account ID (acc_...)</label>
                                <input
                                    className="form-input"
                                    placeholder="e.g. acc_XXXXX"
                                    value={payment.razorpayAccount}
                                    onChange={(e) => setPayment({ ...payment, razorpayAccount: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">UPI ID (Settlement)</label>
                                <div style={{ position: 'relative' }}>
                                    <Send size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                                    <input className="form-input" style={{ paddingLeft: '36px' }} placeholder="e.g. user@upi" value={payment.upiId} onChange={(e) => setPayment({ ...payment, upiId: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">PayPal Email</label>
                                <div style={{ position: 'relative' }}>
                                    <CreditCard size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                                    <input className="form-input" style={{ paddingLeft: '36px' }} placeholder="e.g. user@paypal.com" value={payment.paypalEmail} onChange={(e) => setPayment({ ...payment, paypalEmail: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Bank Account Details (Alternate)</label>
                            <div style={{ position: 'relative' }}>
                                <Landmark size={14} style={{ position: 'absolute', left: '12px', top: '16px', color: 'var(--gray-400)' }} />
                                <textarea className="form-input" style={{ paddingLeft: '36px', minHeight: '80px' }} placeholder="Bank Name, Account Number, IFSC Code..." value={payment.bankAccount} onChange={(e) => setPayment({ ...payment, bankAccount: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Payout Frequency</label>
                                <select className="form-input" value={payment.payoutFrequency} onChange={(e) => setPayment({ ...payment, payoutFrequency: e.target.value })} style={{ outline: 'none' }}>
                                    <option style={{ background: '#1a1a1a', color: '#ffffff' }}>Daily</option>
                                    <option style={{ background: '#1a1a1a', color: '#ffffff' }}>Weekly</option>
                                    <option style={{ background: '#1a1a1a', color: '#ffffff' }}>Monthly</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Primary Currency</label>
                                <select className="form-input" value={payment.currency} onChange={(e) => setPayment({ ...payment, currency: e.target.value })} style={{ outline: 'none' }}>
                                    <option style={{ background: '#1a1a1a', color: '#ffffff' }}>INR</option>
                                    <option style={{ background: '#1a1a1a', color: '#ffffff' }}>USD</option>
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
