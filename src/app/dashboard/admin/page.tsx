"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, DollarSign, MapPin, TrendingUp, Eye, Trash2, XCircle } from "@/components/Icons";

interface Stats {
    totalUsers: number;
    totalCreators: number;
    totalItineraries: number;
    publishedItineraries: number;
    totalRevenue: number;
    pendingVerifications: number;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"overview" | "verifications" | "itineraries">("overview");
    const [verifications, setVerifications] = useState<any[]>([]);
    const [itineraries, setItineraries] = useState<any[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalCreators: 0,
        totalItineraries: 0,
        publishedItineraries: 0,
        totalRevenue: 0,
        pendingVerifications: 0
    });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchAllData();
    }, []);

    async function fetchAllData() {
        setLoading(true);
        await Promise.all([
            fetchStats(),
            fetchVerifications(),
            fetchItineraries()
        ]);
        setLoading(false);
    }

    async function fetchStats() {
        try {
            // Fetch user counts
            const { count: totalUsers } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            const { count: totalCreators } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'influencer');

            const { count: pendingVerifications } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('verification_status', 'pending');

            // Fetch itinerary counts
            const { count: totalItineraries } = await supabase
                .from('itineraries')
                .select('*', { count: 'exact', head: true });

            const { count: publishedItineraries } = await supabase
                .from('itineraries')
                .select('*', { count: 'exact', head: true })
                .eq('is_published', true);

            // Fetch revenue
            const { data: purchases } = await supabase
                .from('purchases')
                .select('amount');

            const totalRevenue = purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

            setStats({
                totalUsers: totalUsers || 0,
                totalCreators: totalCreators || 0,
                totalItineraries: totalItineraries || 0,
                publishedItineraries: publishedItineraries || 0,
                totalRevenue,
                pendingVerifications: pendingVerifications || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }

    async function fetchVerifications() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('verification_status', 'pending')
            .order('created_at', { ascending: false });

        if (data) setVerifications(data);
    }

    async function fetchItineraries() {
        const { data, error } = await supabase
            .from('itineraries')
            .select(`
                *,
                profiles:creator_id (
                    full_name,
                    email
                )
            `)
            .order('created_at', { ascending: false });

        if (data) setItineraries(data);
    }

    const handleVerificationAction = async (userId: string, action: 'Approve' | 'Deny') => {
        try {
            const isApproved = action === 'Approve';
            const { error } = await supabase
                .from('profiles')
                .update({
                    is_verified: isApproved,
                    verification_status: isApproved ? 'verified' : 'none'
                })
                .eq('id', userId);

            if (error) throw error;

            alert(`Successfully ${action}d verification`);
            fetchAllData();
        } catch (err) {
            console.error(err);
            alert("Action failed. Try again.");
        }
    };

    const handleUnpublishItinerary = async (itineraryId: string) => {
        if (!confirm("Unpublish this itinerary? It will be hidden from the marketplace.")) return;

        try {
            const { error } = await supabase
                .from('itineraries')
                .update({ is_published: false })
                .eq('id', itineraryId);

            if (error) throw error;
            alert("Itinerary unpublished successfully");
            fetchAllData();
        } catch (err) {
            console.error(err);
            alert("Failed to unpublish itinerary");
        }
    };

    const handleDeleteItinerary = async (itineraryId: string) => {
        if (!confirm("⚠️ DELETE this itinerary permanently? This cannot be undone!")) return;

        try {
            const { error } = await supabase
                .from('itineraries')
                .delete()
                .eq('id', itineraryId);

            if (error) throw error;
            alert("Itinerary deleted successfully");
            fetchAllData();
        } catch (err) {
            console.error(err);
            alert("Failed to delete itinerary");
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading Admin Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
                <p style={{ color: 'var(--gray-400)' }}>Platform management and content moderation</p>
            </header>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                <div className="glass card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={20} />
                        </div>
                        <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Total Users</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalUsers}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px' }}>{stats.totalCreators} creators</p>
                </div>

                <div className="glass card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MapPin size={20} />
                        </div>
                        <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Itineraries</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalItineraries}</p>
                    <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>{stats.publishedItineraries} published</p>
                </div>

                <div className="glass card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DollarSign size={20} />
                        </div>
                        <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Total Revenue</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>₹{stats.totalRevenue.toFixed(2)}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px' }}>Platform earnings</p>
                </div>

                <div className="glass card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp size={20} />
                        </div>
                        <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Pending Reviews</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.pendingVerifications}</p>
                    <p style={{ fontSize: '0.75rem', color: '#eab308', marginTop: '4px' }}>Verification requests</p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border)' }}>
                <button
                    onClick={() => setActiveTab("overview")}
                    style={{
                        padding: '12px 24px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === "overview" ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === "overview" ? 'var(--primary)' : 'var(--gray-400)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab("verifications")}
                    style={{
                        padding: '12px 24px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === "verifications" ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === "verifications" ? 'var(--primary)' : 'var(--gray-400)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative'
                    }}
                >
                    Verifications
                    {stats.pendingVerifications > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#eab308',
                            color: 'black',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 700
                        }}>
                            {stats.pendingVerifications}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("itineraries")}
                    style={{
                        padding: '12px 24px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === "itineraries" ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === "itineraries" ? 'var(--primary)' : 'var(--gray-400)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Itinerary Management
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
                <div className="glass card" style={{ padding: '40px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Platform Overview</h2>
                    <p style={{ color: 'var(--gray-400)', marginBottom: '32px' }}>
                        Your platform has {stats.totalUsers} users, {stats.totalItineraries} itineraries, and ₹{stats.totalRevenue.toFixed(2)} in total revenue.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', textAlign: 'left' }}>
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h4 style={{ marginBottom: '8px' }}>User Growth</h4>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                                {((stats.totalCreators / stats.totalUsers) * 100).toFixed(1)}% of users are creators
                            </p>
                        </div>
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h4 style={{ marginBottom: '8px' }}>Content Quality</h4>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                                {((stats.publishedItineraries / stats.totalItineraries) * 100).toFixed(1)}% itineraries are published
                            </p>
                        </div>
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h4 style={{ marginBottom: '8px' }}>Avg Revenue per Itinerary</h4>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                                ₹{stats.totalItineraries > 0 ? (stats.totalRevenue / stats.totalItineraries).toFixed(2) : '0.00'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "verifications" && (
                <div className="glass card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '1.4rem' }}>Pending Verifications</h3>
                        <button className="btn btn-outline" onClick={fetchAllData}>Refresh</button>
                    </div>

                    {verifications.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gray-400)' }}>
                            <p>No pending verification requests.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Creator</th>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Email</th>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Identity Proof</th>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {verifications.map((v) => (
                                    <tr key={v.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '16px 32px', fontWeight: 500 }}>{v.full_name || 'Anonymous'}</td>
                                        <td style={{ padding: '16px 32px', color: 'var(--gray-400)' }}>{v.email}</td>
                                        <td style={{ padding: '16px 32px' }}>
                                            {v.identity_proof ? (
                                                <a href={v.identity_proof?.startsWith('http') ? v.identity_proof : `https://${v.identity_proof}`}
                                                    target="_blank"
                                                    style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                                                    View Proof
                                                </a>
                                            ) : (
                                                <span style={{ color: 'var(--gray-500)' }}>No proof provided</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 32px' }}>
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <button
                                                    onClick={() => handleVerificationAction(v.id, 'Approve')}
                                                    className="btn btn-outline"
                                                    style={{ padding: '6px 16px', fontSize: '0.85rem', color: '#10b981', borderColor: '#10b981' }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleVerificationAction(v.id, 'Deny')}
                                                    className="btn btn-outline"
                                                    style={{ padding: '6px 16px', fontSize: '0.85rem', color: '#ef4444', borderColor: '#ef4444' }}
                                                >
                                                    Deny
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {activeTab === "itineraries" && (
                <div className="glass card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '1.4rem' }}>All Itineraries</h3>
                        <button className="btn btn-outline" onClick={fetchAllData}>Refresh</button>
                    </div>

                    {itineraries.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gray-400)' }}>
                            <p>No itineraries found.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Title</th>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Creator</th>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Price</th>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Status</th>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itineraries.map((itinerary) => (
                                    <tr key={itinerary.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '16px 32px', fontWeight: 500 }}>{itinerary.title}</td>
                                        <td style={{ padding: '16px 32px', color: 'var(--gray-400)' }}>
                                            {itinerary.profiles?.full_name || itinerary.profiles?.email || 'Unknown'}
                                        </td>
                                        <td style={{ padding: '16px 32px' }}>₹{itinerary.price}</td>
                                        <td style={{ padding: '16px 32px' }}>
                                            <span className="badge" style={{
                                                background: itinerary.is_published ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                                                color: itinerary.is_published ? '#10b981' : '#6b7280'
                                            }}>
                                                {itinerary.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 32px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => window.open(`/itinerary/${itinerary.id}`, '_blank')}
                                                    className="btn btn-outline"
                                                    style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                    title="View Itinerary"
                                                >
                                                    <Eye size={14} /> View
                                                </button>
                                                {itinerary.is_published && (
                                                    <button
                                                        onClick={() => handleUnpublishItinerary(itinerary.id)}
                                                        className="btn btn-outline"
                                                        style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#eab308', borderColor: '#eab308', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                        title="Unpublish"
                                                    >
                                                        <XCircle size={14} /> Unpublish
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteItinerary(itinerary.id)}
                                                    className="btn btn-outline"
                                                    style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                    title="Delete Permanently"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
