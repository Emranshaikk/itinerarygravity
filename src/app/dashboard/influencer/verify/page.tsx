"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CheckCircle2, ArrowLeft, Camera } from "@/components/Icons";
import { createClient } from "@/lib/supabase/client";

export default function VerificationPage() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
    const [proof, setProof] = useState("");
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
            } else {
                router.push("/login");
            }
        };
        getUser();
    }, []);

    const handleSubscribe = async () => {
        if (!proof.trim()) {
            alert("Please provide some proof of your travel presence (e.g., Instagram handle or blog URL).");
            return;
        }

        setStatus('processing');
        try {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    identity_proof: proof,
                    verification_status: 'pending'
                })
                .eq('id', user?.id);

            if (profileError) throw profileError;

            const response = await fetch('/api/verify', {
                method: 'POST',
            });

            const data = await response.json();

            if (data.id) {
                const options = {
                    key: data.key,
                    amount: data.amount,
                    currency: data.currency,
                    name: "ItineraryGravity",
                    description: "Influencer Verification Fee",
                    order_id: data.id,
                    handler: async function (response: any) {
                        setStatus('success');
                    },
                    prefill: {
                        name: user?.user_metadata?.full_name || "",
                        email: user?.email || "",
                    },
                    theme: {
                        color: "#ff00e5",
                    },
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();
                rzp.on('payment.failed', function (response: any) {
                    setStatus('idle');
                    alert("Payment failed. Please try again.");
                });
            } else {
                throw new Error("Failed to create verification order");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please check your connection and try again.");
            setStatus('idle');
        }
    };

    if (status === 'success') {
        return (
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
                <div className="glass card" style={{ maxWidth: '500px', textAlign: 'center', padding: '60px 40px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(234, 179, 8, 0.1)',
                        color: '#eab308',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px'
                    }}>
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Application Submitted!</h1>
                    <p style={{ color: 'var(--gray-400)', marginBottom: '32px', lineHeight: '1.6' }}>
                        Your payment was successful and your identity proof has been submitted. Our team will review your application within 24-48 hours.
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => router.push('/dashboard/influencer')}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <button
                onClick={() => router.back()}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--gray-400)',
                    marginBottom: '24px',
                    cursor: 'pointer'
                }}
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '24px' }}>
                        Join the Elite 1%. <br />
                        <span className="text-gradient">Get Verified.</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--gray-400)', marginBottom: '40px', lineHeight: '1.8' }}>
                        Followers buy from creators they trust. A verified badge increases your conversion by up to 40% and shows the world you're the real deal.
                    </p>

                    <div className="glass card" style={{ padding: '0', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                                    <th style={{ textAlign: 'left', padding: '20px', color: 'var(--gray-400)', fontWeight: 500 }}>Feature</th>
                                    <th style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)', fontWeight: 500 }}>Free Creator</th>
                                    <th style={{ textAlign: 'center', padding: '20px', color: 'var(--primary)', fontWeight: 700 }}>Verified Creator</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: "Itinerary Publishing", free: "Limited (1)", verified: "Unlimited" },
                                    { name: "Blue Verification Badge", free: <span style={{ opacity: 0.3 }}>✕</span>, verified: <CheckCircle2 size={18} color="var(--primary)" /> },
                                    { name: "Sales Analytics", free: "Basic", verified: "Advanced" },
                                    { name: "Trust Factor & Reach", free: "Standard", verified: "High Priority" },
                                    { name: "Platform Fee", free: "30%", verified: "30%" }
                                ].map((row, i) => (
                                    <tr key={i} style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                                        <td style={{ padding: '20px', fontWeight: 500 }}>{row.name}</td>
                                        <td style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-400)' }}>{row.free}</td>
                                        <td style={{ padding: '20px', textAlign: 'center', fontWeight: 600, color: 'var(--foreground)' }}>{row.verified}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="glass card" style={{ padding: '32px' }}>
                        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Camera size={20} color="var(--primary)" /> Step 1: Proof of Presence
                        </h3>
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '16px' }}>
                            Please provide a link to your Instagram, TikTok, or personal travel blog. This helps us verify you are a genuine travel creator.
                        </p>
                        <textarea
                            className="glass"
                            placeholder="e.g. instagram.com/sarah_travels or @sarah_travels"
                            value={proof}
                            onChange={(e) => setProof(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                color: 'white',
                                fontSize: '1rem',
                                resize: 'none'
                            }}
                        />
                    </div>
                </div>

                <div className="glass card" style={{ padding: '48px', border: '1px solid var(--primary)', position: 'sticky', top: '120px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <p style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', fontWeight: 700, marginBottom: '8px' }}>One-Time Fee</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>₹</span>
                            <span style={{ fontSize: '4rem', fontWeight: 800 }}>800</span>
                        </div>
                        <p style={{ color: 'var(--gray-400)', marginTop: '8px' }}>Processing & Verification Fee</p>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
                        disabled={status === 'processing'}
                        onClick={handleSubscribe}
                    >
                        {status === 'processing' ? 'Submitting...' : 'Submit & Pay Review Fee'}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '24px' }}>
                        Fees are non-refundable after review begins. Admin approval is required for badge activation.
                    </p>
                </div>
            </div>
        </div>
    );
}
