"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function TestDashboard() {
    const { user, isLoaded } = useUser();
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkProfile() {
            if (!isLoaded || !user) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/profiles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: 'influencer' })
                });

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

        checkProfile();
    }, [isLoaded, user]);

    if (!isLoaded || loading) {
        return (
            <div style={{ padding: '40px', color: 'var(--foreground)' }}>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', color: 'var(--foreground)', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px' }}>Dashboard Diagnostic</h1>

            <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h2>Clerk User Status</h2>
                <p><strong>Loaded:</strong> {isLoaded ? 'Yes' : 'No'}</p>
                <p><strong>User ID:</strong> {user?.id || 'Not logged in'}</p>
                <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress || 'N/A'}</p>
                <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
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
                <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'}</p>
                <p><strong>Clerk Key:</strong> {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✓ Set' : '✗ Missing'}</p>
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
