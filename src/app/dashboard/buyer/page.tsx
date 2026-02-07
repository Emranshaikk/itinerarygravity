"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download } from "@/components/Icons";
import { createClient } from "@/lib/supabase/client";

export default function BuyerDashboard() {
    const router = useRouter();
    const [purchases, setPurchases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login");
                    return;
                }

                const { data, error } = await supabase
                    .from('purchases')
                    .select(`
                        id,
                        itinerary_id,
                        created_at,
                        itineraries (
                            id,
                            title,
                            location,
                            description,
                            creator_id,
                            profiles:creator_id (
                                full_name
                            )
                        )
                    `)
                    .eq('user_id', user.id);

                if (data) {
                    const formatted = data.map((p: any) => ({
                        id: p.id,
                        itinerary_id: p.itinerary_id,
                        title: p.itineraries?.title,
                        creator: p.itineraries?.profiles?.full_name || "@Influencer",
                        location: p.itineraries?.location,
                        date: new Date(p.created_at).toLocaleDateString(),
                        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600", // Fallback image
                        description: p.itineraries?.description || ""
                    }));
                    setPurchases(formatted);
                }
            } catch (err) {
                console.error("Error fetching purchases:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading Library...</div>
            </div>
        );
    }

    const handleDownload = (title: string) => {
        alert(`Preparing PDF for "${title}"... Please select "Save as PDF" in the print dialog.`);
        window.print();
    };

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>My Library</h1>
                    <p style={{ color: 'var(--gray-400)' }}>Your personal collection of world-class travel guides.</p>
                </div>
                <button
                    onClick={async () => {
                        if (!confirm("Switch to Creator Mode?")) return;
                        try {
                            const response = await fetch('/api/profiles', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ role: 'influencer' })
                            });
                            if (response.ok) window.location.href = '/dashboard/influencer';
                        } catch (e) { alert("Failed to switch role"); }
                    }}
                    className="btn btn-outline text-xs py-2 px-3"
                >
                    Switch to Creator View
                </button>
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
                                <Link href={`/itinerary/${item.itinerary_id}`} className="btn btn-outline" style={{ flex: 1, fontSize: '0.85rem' }}>
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
                    background: 'transparent',
                    minHeight: '300px'
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
                        color: 'var(--primary)',
                        fontSize: '1.5rem'
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
