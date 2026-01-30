"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download } from "@/components/Icons";

export default function BuyerDashboard() {
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;
        const checkRole = async () => {
            const pendingRole = typeof window !== 'undefined' ? sessionStorage.getItem('pending_role') : null;
            if (pendingRole === 'influencer') {
                try {
                    const response = await fetch('/api/profiles', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: 'influencer' })
                    });

                    if (response.ok && isMounted) {
                        sessionStorage.removeItem('pending_role');
                        window.location.href = '/dashboard';
                    } else if (isMounted) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error("Profile update failed:", errorData.error || response.statusText);
                    }
                } catch (err) {
                    console.error("Failed to update role", err);
                }
            }
        };
        checkRole();
        return () => { isMounted = false; };
    }, []);

    const handleDownload = (title: string) => {
        alert(`Preparing PDF for "${title}"... Please select "Save as PDF" in the print dialog.`);
        window.print();
    };

    const purchases = [
        {
            id: 1,
            title: "7 Days in Kyoto: The Ultimate Guide",
            creator: "@SarahTravels",
            location: "Kyoto, Japan",
            date: "Jan 24, 2026",
            image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600",
            description: "A complete guide featuring hidden tea houses, Gion secrets, and best tempura spots."
        },
        {
            id: 2,
            title: "Bali: Hidden Gems",
            creator: "@BaliExplorer",
            location: "Ubud, Bali",
            date: "Jan 12, 2026",
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600",
            description: "Discover waterfalls, swings, and organic cafes away from the crowds."
        }
    ];

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <header style={{ marginBottom: '48px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>My Library</h1>
                <p style={{ color: 'var(--gray-400)' }}>Your personal collection of world-class travel guides.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                {purchases.map((item) => (
                    <div key={item.id} className="glass card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                            height: '180px',
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }} />
                        <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.8rem' }}>
                                <span className="badge" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>{item.location}</span>
                                <span style={{ color: 'var(--gray-400)' }}>Purchased {item.date}</span>
                            </div>
                            <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--gray-400)', marginBottom: '24px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                by {item.creator} • {item.description}
                            </p>
                            <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                                <Link href={`/itinerary/${item.id === 1 ? 'kyoto-traditional' : 'bali-hidden'}`} className="btn btn-outline" style={{ flex: 1, fontSize: '0.85rem' }}>
                                    View Guide
                                </Link>
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 1, fontSize: '0.85rem', gap: '8px' }}
                                    onClick={() => handleDownload(item.title)}
                                >
                                    <Download size={14} /> Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Explore More CTA Card */}
                <Link href="/explore" className="glass card" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    borderStyle: 'dashed',
                    borderColor: 'var(--border)',
                    background: 'transparent'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--input-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                        color: 'var(--primary)'
                    }}>
                        +
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Plan your next trip</h3>
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '24px' }}>Browse new itineraries from top creators.</p>
                    <span className="btn btn-outline" style={{ padding: '10px 24px' }}>Explore Market</span>
                </Link>
            </div>
        </div>
    );
}
