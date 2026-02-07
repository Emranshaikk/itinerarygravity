"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AuthFormProps {
    mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === "signup") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setMessage("Check your email for the confirmation link!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during authentication");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass" style={{ padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px' }}>
            <h2 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
                {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p style={{ color: 'var(--gray-400)', textAlign: 'center', marginBottom: '32px' }}>
                {mode === "login" ? "Enter your details to sign in" : "Sign up to start selling itineraries"}
            </p>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--gray-300)' }}>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        suppressHydrationWarning
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--gray-300)' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        suppressHydrationWarning
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                </div>

                {error && (
                    <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', color: '#ff4d4d', fontSize: '0.85rem' }}>
                        {error}
                    </div>
                )}

                {message && (
                    <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,255,0,0.1)', border: '1px solid rgba(0,255,0,0.2)', color: '#4dff4d', fontSize: '0.85rem' }}>
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ padding: '14px', fontSize: '1rem', fontWeight: 600, marginTop: '10px' }}
                >
                    {loading ? "Processing..." : mode === "login" ? "Sign In" : "Sign Up"}
                </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--gray-400)' }}>
                {mode === "login" ? (
                    <>
                        Don't have an account? <span onClick={() => router.push('/signup')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Sign up</span>
                    </>
                ) : (
                    <>
                        Already have an account? <span onClick={() => router.push('/login')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Sign in</span>
                    </>
                )}
            </div>
        </div>
    );
}
