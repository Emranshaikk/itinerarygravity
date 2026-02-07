"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DiagPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            setUser(authUser);

            if (authUser) {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();
                setProfile(profileData);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return <div className="container" style={{ padding: '40px' }}>Loading...</div>;
    }

    if (!user) {
        return (
            <div className="container" style={{ padding: '40px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '20px' }}>Not Logged In</h1>
                <p style={{ color: 'var(--gray-400)', marginBottom: '20px' }}>
                    You need to log in first. <a href="/login" style={{ color: 'var(--primary)' }}>Go to Login</a>
                </p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px' }}>
            <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '20px' }}>User Diagnostics</h1>

            <div className="glass card" style={{ padding: '32px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Auth User Info</h2>
                <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    <p style={{ marginBottom: '8px' }}><strong>User ID:</strong> {user.id}</p>
                    <p style={{ marginBottom: '8px' }}><strong>Email:</strong> {user.email}</p>
                    <p style={{ marginBottom: '8px' }}><strong>Email Confirmed:</strong> {user.email_confirmed_at ? '✅ Yes' : '❌ No'}</p>
                    <p style={{ marginBottom: '8px' }}><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
                </div>
            </div>

            <div className="glass card" style={{ padding: '32px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Profile Info</h2>
                {profile ? (
                    <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        <p style={{ marginBottom: '8px' }}><strong>Profile ID:</strong> {profile.id}</p>
                        <p style={{ marginBottom: '8px' }}><strong>Email:</strong> {profile.email || 'Not set'}</p>
                        <p style={{ marginBottom: '8px' }}><strong>Full Name:</strong> {profile.full_name || 'Not set'}</p>
                        <p style={{ marginBottom: '8px' }}><strong>Role:</strong> <span style={{
                            color: profile.role === 'admin' ? '#10b981' : profile.role === 'influencer' ? '#ec4899' : '#6b7280',
                            fontWeight: 700
                        }}>{profile.role || 'buyer'}</span></p>
                        <p style={{ marginBottom: '8px' }}><strong>Verified:</strong> {profile.is_verified ? '✅ Yes' : '❌ No'}</p>
                        <p style={{ marginBottom: '8px' }}><strong>Verification Status:</strong> {profile.verification_status || 'none'}</p>
                    </div>
                ) : (
                    <p style={{ color: '#ef4444' }}>❌ No profile found in database!</p>
                )}
            </div>

            {profile && profile.role !== 'admin' && (
                <div className="glass card" style={{ padding: '32px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid #eab308' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#eab308' }}>⚠️ Set Yourself as Admin</h2>
                    <p style={{ marginBottom: '16px', color: 'var(--gray-300)' }}>
                        To access the admin dashboard, run this SQL in your Supabase SQL Editor:
                    </p>
                    <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '16px',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        color: '#10b981',
                        marginBottom: '16px'
                    }}>
                        UPDATE profiles<br />
                        SET role = 'admin'<br />
                        WHERE id = '{user.id}';
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>
                        After running this, refresh this page to verify the change.
                    </p>
                </div>
            )}

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
