"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer style={{
            marginTop: '80px',
            padding: '80px 0 40px',
            background: 'var(--background)',
            borderTop: '1px solid var(--border)'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '48px',
                    marginBottom: '60px'
                }}>
                    <div>
                        <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>
                            ItineraryGravity
                        </h3>
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                            Experience the world through the eyes of the most influential travelers.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Platform</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link href="/explore" style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Explore Guides</Link>
                            <Link href="/creators" style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>For Creators</Link>
                            <Link href="/#how-it-works" style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>How it Works</Link>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Support</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link href="/faq" style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>FAQ</Link>
                            <Link href="/contact" style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Contact Us</Link>
                            <Link href="/terms" style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Terms of Service</Link>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Admin</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link href="/login" style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Admin Login</Link>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                Use admin@test.com to access the panel.
                            </p>
                        </div>
                    </div>
                </div>
                <div style={{
                    paddingTop: '32px',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'var(--gray-400)',
                    fontSize: '0.85rem'
                }}>
                    <p>© 2026 ItineraryGravity. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
