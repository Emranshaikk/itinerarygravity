"use client";

import { useSearchParams } from "next/navigation";

export default function AuthCodeError() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    return (
        <div className="container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        }}>
            <div className="glass card" style={{
                padding: '48px',
                maxWidth: '600px',
                textAlign: 'center'
            }}>
                <div style={{
                    fontSize: '4rem',
                    marginBottom: '24px'
                }}>⚠️</div>

                <h1 className="text-gradient" style={{
                    fontSize: '2rem',
                    marginBottom: '16px'
                }}>
                    Authentication Error
                </h1>

                <p style={{
                    color: 'var(--gray-400)',
                    marginBottom: '32px',
                    lineHeight: '1.6'
                }}>
                    {errorDescription || 'There was a problem confirming your email. This could happen if:'}
                </p>

                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    marginBottom: '32px',
                    textAlign: 'left'
                }}>
                    <ul style={{
                        color: 'var(--gray-400)',
                        fontSize: '0.9rem',
                        lineHeight: '1.8',
                        paddingLeft: '20px'
                    }}>
                        <li>The confirmation link has expired (links expire after 24 hours)</li>
                        <li>The link has already been used</li>
                        <li>There's a mismatch in your Supabase configuration</li>
                        <li>You clicked an old confirmation email</li>
                    </ul>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        color: '#ef4444'
                    }}>
                        Error: {error}
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <a href="/signup" className="btn btn-primary">
                        Try Signing Up Again
                    </a>
                    <a href="/login" className="btn btn-outline">
                        Go to Login
                    </a>
                </div>

                <p style={{
                    marginTop: '32px',
                    fontSize: '0.85rem',
                    color: 'var(--gray-500)'
                }}>
                    Need help? Check your email for the latest confirmation link or contact support.
                </p>
            </div>
        </div>
    );
}
