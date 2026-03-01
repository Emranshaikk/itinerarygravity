"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function TestDashboard() {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkProfile() {
            if (status === 'unauthenticated') {
                setLoading(false);
                return;
            }

            if (status === 'authenticated') {
                try {
                    const response = await fetch('/api/profile/settings');
                    const data = await response.json();

                    if (response.ok) {
                        setProfile(data);
                    } else {
                        setError(JSON.stringify(data, null, 2));
                    }
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        }

        checkProfile();
    }, [status]);

    if (loading || status === 'loading') {
        return (
            <div style={{ padding: '40px', color: 'var(--foreground)' }}>
                <h1>Loading...</h1>
            </div>
        );
    }

    const user = session?.user as any;

    return (
        <div style={{ padding: '40px', color: 'var(--foreground)', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px' }}>Dashboard Diagnostic (MongoDB)</h1>

            <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h2>NextAuth Auth Status</h2>
                <p><strong>Logged In:</strong> {user ? 'Yes' : 'No'}</p>
                <p><strong>User ID:</strong> {user?.id || 'Not logged in'}</p>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
            </div>

            <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h2>Profile API Response</h2>
                {error ? (
                    <div style={{ color: '#ef4444' }}>
                        <p><strong>Error:</strong></p>
                        <pre style={{ background: '#000', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
                            {error}
                        </pre>
                    </div>
                ) : (
                    <pre style={{ background: '#000', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
                        {JSON.stringify(profile, null, 2)}
                    </pre>
                )}
            </div>

            <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '8px' }}>
                <h2>Environment Check</h2>
                <p><strong>MongoDB URI:</strong> {process.env.NEXT_PUBLIC_MONGODB_URI ? '✓ Set' : '✗ Missing'}</p>
                <p><strong>NextAuth Secret:</strong> {process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Missing'}</p>
            </div>

            <div style={{ marginTop: '20px' }}>
                <a href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    Try going to /dashboard
                </a>
                {' | '}
                <a href="/dashboard/influencer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    Try /dashboard/influencer
                </a>
                {' | '}
                <a href="/dashboard/influencer/create" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    Try /dashboard/influencer/create
                </a>
            </div>
        </div>
    );
}
