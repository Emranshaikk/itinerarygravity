"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function DiagPage() {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (status === 'authenticated') {
                try {
                    const res = await fetch('/api/profile/settings');
                    if (res.ok) {
                        const data = await res.json();
                        setProfile(data);
                    }
                } catch (e) {
                    console.error("Error fetching diagnostic data", e);
                }
            }
            if (status !== 'loading') {
                setLoading(false);
            }
        }
        fetchData();
    }, [status]);

    if (loading || status === 'loading') {
        return <div className="container" style={{ padding: '40px' }}>Loading...</div>;
    }

    if (status === 'unauthenticated' || !session?.user) {
        return (
            <div className="container" style={{ padding: '40px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '20px' }}>Not Logged In</h1>
                <p style={{ color: 'var(--gray-400)', marginBottom: '20px' }}>
                    You need to log in first. <a href="/login" style={{ color: 'var(--primary)' }}>Go to Login</a>
                </p>
            </div>
        );
    }

    const sessionUser = session.user as any;

    return (
        <div className="container" style={{ padding: '40px' }}>
            <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '20px' }}>User Diagnostics</h1>

            <div className="glass card" style={{ padding: '32px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Auth User Info (NextAuth)</h2>
                <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    <p style={{ marginBottom: '8px' }}><strong>User ID:</strong> {sessionUser.id}</p>
                    <p style={{ marginBottom: '8px' }}><strong>Email:</strong> {sessionUser.email}</p>
                    <p style={{ marginBottom: '8px' }}><strong>Name:</strong> {sessionUser.name}</p>
                </div>
            </div>

            <div className="glass card" style={{ padding: '32px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Profile Info (MongoDB)</h2>
                {profile ? (
                    <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        <p style={{ marginBottom: '8px' }}><strong>Profile ID:</strong> {profile._id}</p>
                        <p style={{ marginBottom: '8px' }}><strong>Email:</strong> {profile.email || 'Not set'}</p>
                        <p style={{ marginBottom: '8px' }}><strong>Full Name:</strong> {profile.full_name || 'Not set'}</p>
                        <p style={{ marginBottom: '8px' }}><strong>Role:</strong> <span style={{
                            color: profile.role === 'admin' ? '#10b981' : profile.role === 'influencer' ? '#ec4899' : '#6b7280',
                            fontWeight: 700
                        }}>{profile.role || 'buyer'}</span></p>
                        <p style={{ marginBottom: '8px' }}><strong>Verified:</strong> {profile.is_verified ? '✅ Yes' : '❌ No'}</p>
                    </div>
                ) : (
                    <p style={{ color: '#ef4444' }}>❌ No profile found in database!</p>
                )}
            </div>

            {profile && profile.role === 'admin' && (
                <div className="glass card" style={{ padding: '32px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#10b981' }}>✅ You're an Admin!</h2>
                    <p style={{ marginBottom: '16px', color: 'var(--gray-300)' }}>
                        You can now access the admin dashboard.
                    </p>
                    <a href="/dashboard/admin" className="btn btn-primary">Go to Admin Dashboard</a>
                </div>
            )}

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-outline"
                    style={{ marginRight: '12px' }}
                >
                    Refresh Page
                </button>
                <a href="/dashboard" className="btn btn-outline">Go to Dashboard</a>
            </div>
        </div>
    );
}
