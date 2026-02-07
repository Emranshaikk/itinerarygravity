"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    if (!mounted) return (
        <nav className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '80px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <div className="text-gradient" style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                    ItineraryGravity
                </div>
            </div>
        </nav>
    );

    return (
        <nav className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
                <Link href="/" className="text-gradient" style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                    ItineraryGravity
                </Link>

                {/* Desktop Menu */}
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }} className="hidden-mobile">
                    <Link href="/explore" style={{ fontWeight: 500, color: 'var(--gray-400)', transition: 'color 0.2s' }}>Explore</Link>
                    <Link href="/creators" style={{ fontWeight: 500, color: 'var(--gray-400)', transition: 'color 0.2s' }}>Creators</Link>
                    <Link href="/#how-it-works" style={{ fontWeight: 500, color: 'var(--gray-400)', transition: 'color 0.2s' }}>How it Works</Link>

                    <div style={{ marginLeft: '12px', borderLeft: '1px solid var(--border)', paddingLeft: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <ThemeToggle />

                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <Link href="/dashboard" style={{ fontWeight: 600, color: 'var(--primary)' }}>Dashboard</Link>
                                <button
                                    onClick={handleSignOut}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--border)',
                                        color: 'white',
                                        padding: '6px 14px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" style={{ fontWeight: 500 }}>Login</Link>
                                <Link href="/signup" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{ background: 'none', border: 'none', color: 'var(--foreground)', fontSize: '1.5rem', cursor: 'pointer', display: 'none' }}
                    aria-label="Toggle menu"
                >
                    ☰
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="glass" style={{ position: 'absolute', top: '80px', left: 0, right: 0, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Theme</span>
                        <ThemeToggle />
                    </div>
                    <Link href="/explore" onClick={() => setIsMenuOpen(false)}>Explore</Link>
                    <Link href="/creators" onClick={() => setIsMenuOpen(false)}>Creators</Link>

                    {user ? (
                        <>
                            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--primary)', fontWeight: 600 }}>Dashboard</Link>
                            <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                            <Link href="/signup" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
