"use client";

import { useState, useEffect } from "react";
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
    const [activeTab, setActiveTab] = useState<"overview" | "verifications" | "itineraries" | "users">("overview");
    const [verifications, setVerifications] = useState<any[]>([]);
    const [itineraries, setItineraries] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalCreators: 0,
        totalItineraries: 0,
        publishedItineraries: 0,
        totalRevenue: 0,
        pendingVerifications: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    async function fetchAllData() {
        setLoading(true);
        await Promise.all([
            fetchStats(),
            fetchVerifications(),
            fetchItineraries(),
            fetchUsers()
        ]);
        setLoading(false);
    }

    async function fetchStats() {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setStats({
                    totalUsers: data.totalUsers || 0,
                    totalCreators: data.totalCreators || 0,
                    totalItineraries: data.totalItineraries || 0,
                    publishedItineraries: data.publishedItineraries || 0,
                    totalRevenue: data.totalRevenue || 0,
                    pendingVerifications: data.pendingVerifications || 0
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }

    async function fetchVerifications() {
        try {
            const res = await fetch('/api/admin/verifications');
            if (res.ok) {
                const data = await res.json();
                setVerifications(data);
            }
        } catch (error) {
            console.error('Error fetching verifs:', error);
        }
    }

    async function fetchItineraries() {
        try {
            const res = await fetch('/api/admin/itineraries');
            if (res.ok) {
                const data = await res.json();
                setItineraries(data);
            }
        } catch (error) {
            console.error('Error fetching itineraries:', error);
        }
    }

    async function fetchUsers() {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const handleVerificationAction = async (userId: string, action: 'Approve' | 'Deny') => {
        try {
            const isApproved = action === 'Approve';
            const response = await fetch('/api/admin/verifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, isApproved })
            });

            if (!response.ok) throw new Error("Update failed");

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
            const response = await fetch('/api/admin/itineraries', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itineraryId, unpublish: true })
            });

            if (!response.ok) throw new Error("Update failed");
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
            const response = await fetch(`/api/admin/itineraries?id=${itineraryId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error("Delete failed");
            alert("Itinerary deleted successfully");
            fetchAllData();
        } catch (err) {
            console.error(err);
            alert("Failed to delete itinerary");
        }
    };

    const handleBanUser = async (userId: string, isBanned: boolean) => {
        const action = isBanned ? "BAN" : "UNBAN";
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            const response = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, isBanned })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Update failed");
            }
            alert(`User successfully ${action.toLowerCase()}ned`);
            fetchAllData();
        } catch (err: any) {
            console.error(err);
            alert(`Action failed: ${err.message}`);
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
                <button
                    onClick={() => setActiveTab("users")}
                    style={{
                        padding: '12px 24px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === "users" ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === "users" ? 'var(--primary)' : 'var(--gray-400)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    User Management
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
                                        <td style={{ padding: '16px 32px' }}>
                                            {(itinerary as any).currency === 'INR' ? '₹' : (itinerary as any).currency === 'USD' ? '$' : (itinerary as any).currency === 'EUR' ? '€' : (itinerary as any).currency || '₹'}
                                            {itinerary.price}
                                        </td>
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

            {activeTab === "users" && (
                <div className="glass card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '1.4rem' }}>User Management</h3>
                        <button className="btn btn-outline" onClick={fetchAllData}>Refresh</button>
                    </div>

                    {users.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gray-400)' }}>
                            <p>No users found on the platform.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Name</th>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Email</th>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Role</th>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Status</th>
                                    <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '16px 32px', fontWeight: 500 }}>{u.full_name}</td>
                                        <td style={{ padding: '16px 32px', color: 'var(--gray-400)' }}>{u.email}</td>
                                        <td style={{ padding: '16px 32px' }}>
                                            <span style={{
                                                textTransform: 'capitalize',
                                                fontSize: '0.85rem',
                                                color: u.role === 'admin' ? '#3b82f6' : u.role === 'influencer' ? 'var(--primary)' : 'var(--foreground)'
                                            }}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 32px' }}>
                                            <span className="badge" style={{
                                                background: u.is_banned ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                                color: u.is_banned ? '#ef4444' : '#10b981'
                                            }}>
                                                {u.is_banned ? 'Banned' : 'Active'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 32px' }}>
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleBanUser(u.id, !u.is_banned)}
                                                    className="btn btn-outline"
                                                    style={{
                                                        padding: '6px 12px',
                                                        fontSize: '0.8rem',
                                                        color: u.is_banned ? '#10b981' : '#ef4444',
                                                        borderColor: u.is_banned ? '#10b981' : 'rgba(239, 68, 68, 0.3)'
                                                    }}
                                                >
                                                    {u.is_banned ? 'Unban User' : <><XCircle size={14} style={{ display: 'inline', marginRight: '4px' }} /> Ban User</>}
                                                </button>
                                            )}
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
