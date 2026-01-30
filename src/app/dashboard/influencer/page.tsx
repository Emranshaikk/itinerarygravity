"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { PieChart, TrendingUp, Calendar, Star, DollarSign, MapPin } from "@/components/Icons";
import { supabase } from "@/lib/supabase";

export default function InfluencerDashboard() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [profile, setProfile] = useState<any>(null);
    const [itineraries, setItineraries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded && user) {
            fetchDashboardData();
        }
    }, [isLoaded, user]);

    async function fetchDashboardData() {
        try {
            setLoading(true);

            // 1. Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (profileData) setProfile(profileData);

            // 2. Fetch Itineraries
            const { data: itineraryData, error: itineraryError } = await supabase
                .from('itineraries')
                .select('*')
                .eq('creator_id', user?.id)
                .order('created_at', { ascending: false });

            if (itineraryData) setItineraries(itineraryData);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }

    if (!isLoaded || loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: profile?.avatar_url ? `url(${profile.avatar_url})` : 'linear-gradient(45deg, var(--primary), var(--secondary))',
                        backgroundSize: 'cover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: 'white'
                    }}>
                        {!profile?.avatar_url && (user?.firstName?.charAt(0) || 'U')}
                    </div>
                    <div>
                        <h1 className="text-gradient" style={{ fontSize: '2rem' }}>Welcome back, {user?.firstName || 'Creator'}</h1>
                        <p style={{ color: 'var(--gray-400)' }}>Manage your itineraries and track earnings.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link
                        href={`/creators/${user?.id}`}
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <MapPin size={16} /> View Public Profile
                    </Link>
                    <button
                        className="btn btn-outline"
                        onClick={() => router.push("/dashboard/influencer/settings")}
                    >
                        Settings
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => router.push("/dashboard/influencer/create")}
                    >
                        + Create New Itinerary
                    </button>
                </div>
            </header>

            {/* Verification Alert - Hidden if Verified */}
            {(!profile?.is_verified && profile?.verification_status !== 'pending') && (
                <div className="glass card" style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border)',
                    padding: '20px 32px',
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            !
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Account Not Verified</h3>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>You need to be verified to start selling itineraries and earn revenue.</p>
                        </div>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => router.push('/dashboard/influencer/verify')}
                        style={{ padding: '10px 24px' }}
                    >
                        Get Verified - ₹800/mo
                    </button>
                </div>
            )}

            {profile?.verification_status === 'pending' && (
                <div className="glass card" style={{
                    background: 'rgba(234, 179, 8, 0.1)',
                    border: '1px solid #eab308',
                    padding: '20px 32px',
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        ⏳
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Verification Pending</h3>
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>The admin is currently reviewing your identity proof. This usually takes 24-48 hours.</p>
                    </div>
                </div>
            )}

            {profile?.is_verified && (
                <div className="glass card" style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid #10b981',
                    padding: '16px 32px',
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>✓ VERIFIED CREATOR</span>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>You have access to all marketplace features.</span>
                </div>
            )}

            {/* Revenue Overview & Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '48px' }}>
                <div className="glass card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <PieChart size={20} color="var(--primary)" /> Revenue Trends
                        </h3>
                    </div>
                    {/* Simulated Chart */}
                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '20px' }}>
                        {[40, 65, 45, 90, 60, 75, 55, 100, 85, 70, 95, 110].map((h, i) => (
                            <div key={i} style={{
                                flex: 1,
                                height: `${h}%`,
                                background: i === 11 ? 'var(--primary)' : 'var(--border)',
                                borderRadius: '4px 4px 0 0',
                                position: 'relative'
                            }} />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-400)', fontSize: '0.75rem', marginTop: '12px' }}>
                        <span>Jan 01</span>
                        <span>Today</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                            Live Data
                        </span>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '24px' }}>
                    <div className="glass card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                ₹
                            </div>
                            <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Estimated Balance</span>
                        </div>
                        <p style={{ fontSize: '1.8rem', fontWeight: 700 }}>₹0.00</p>
                        <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>↑ 0% from last month</p>
                    </div>

                    <div className="glass card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                ★
                            </div>
                            <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Global Rating</span>
                        </div>
                        <p style={{ fontSize: '1.8rem', fontWeight: 700 }}>0.00</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px' }}>Based on 0 reviews</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <div>
                    <h2 style={{ marginBottom: '24px' }}>My Itineraries</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {itineraries.length === 0 ? (
                            <div className="glass card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                                <p style={{ color: 'var(--gray-400)', marginBottom: '20px' }}>You haven't created any itineraries yet.</p>
                                <button className="btn btn-primary" onClick={() => router.push("/dashboard/influencer/create")}>Create First Itinerary</button>
                            </div>
                        ) : (
                            itineraries.map((itinerary) => (
                                <div key={itinerary.id} className="glass card" style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <h3 style={{ fontSize: '1.2rem' }}>{itinerary.title}</h3>
                                        <span className="badge" style={{
                                            background: itinerary.is_published ? 'rgba(16, 185, 129, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                            color: itinerary.is_published ? '#10b981' : '#eab308'
                                        }}>
                                            {itinerary.is_published ? 'Live' : 'Draft'}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', fontSize: '0.9rem', color: 'var(--gray-400)' }}>
                                        <span>Price: ₹{itinerary.price}</span>
                                        <span>Sales: 0</span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button className="btn btn-outline" style={{ flex: 1, padding: '8px' }}>Edit</button>
                                        <button className="btn btn-outline" style={{ flex: 1, padding: '8px' }}>Share Link</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Recent Notifications</h2>
                    <div className="glass card" style={{ padding: '24px', display: 'grid', gap: '16px' }}>
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', textAlign: 'center' }}>No recent activity.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
