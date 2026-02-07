"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download } from "@/components/Icons";
import { createClient } from "@/lib/supabase/client";

export default function BuyerDashboard() {
    const router = useRouter();
    const [purchases, setPurchases] = useState<any[]>([]);
    const [marketplaceItems, setMarketplaceItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login");
                    return;
                }

                // 1. Fetch Purchases
                const { data: purchaseData } = await supabase
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

                if (purchaseData) {
                    const formatted = purchaseData.map((p: any) => ({
                        id: p.id,
                        itinerary_id: p.itinerary_id,
                        title: p.itineraries?.title,
                        creator: p.itineraries?.profiles?.full_name || "@Influencer",
                        location: p.itineraries?.location,
                        date: new Date(p.created_at).toLocaleDateString(),
                        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600",
                        description: p.itineraries?.description || ""
                    }));
                    setPurchases(formatted);
                }

                // 2. Fetch Marketplace (Discovery)
                const { data: marketData } = await supabase
                    .from('itineraries')
                    .select(`
                        *,
                        profiles:creator_id (full_name)
                    `)
                    .eq('is_published', true)
                    .limit(6);

                if (marketData) {
                    setMarketplaceItems(marketData);
                }

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
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
            <header style={{ marginBottom: '48px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                    {purchases.length > 0 ? "My Library" : "Discover Your Next Adventure"}
                </h1>
                <p style={{ color: 'var(--gray-400)' }}>
                    {purchases.length > 0
                        ? "Your personal collection of world-class travel guides."
                        : "Discover curated itineraries from your favorite travel creators."}
                </p>
            </header>

            {purchases.length > 0 && (
                <div style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>My Purchases</h2>
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
                    </div>
                </div>
            )}

            {/* Marketplace / Discovery Section */}
            <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Explore Marketplace</h2>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link href="/explore" className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                            Search & Filters
                        </Link>
                        <Link href="/explore" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                            View All Itineraries →
                        </Link>
                    </div>
                </div>

                {/* Popular Categories */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }} className="no-scrollbar">
                    {['All', 'Adventure', 'Luxury', 'Budget', 'Family', 'Solo', 'Foodie'].map(cat => (
                        <Link
                            key={cat}
                            href={`/explore?tag=${cat.toLowerCase()}`}
                            className="badge"
                            style={{
                                padding: '10px 20px',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                    {marketplaceItems.map((item) => (
                        <Link
                            href={`/itinerary/${item.id}`}
                            key={item.id}
                            className="glass card card-hover"
                            style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
                        >
                            <div style={{
                                height: '180px',
                                backgroundImage: `url(${item.image_url || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800"})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '6px 14px',
                                    borderRadius: '99px',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                }}>
                                    ₹{item.price}
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {item.location}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--foreground)' }}>{item.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    by {item.profiles?.full_name || "@Influencer"}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {marketplaceItems.length === 0 && !loading && (
                    <div className="glass card" style={{ padding: '60px', textAlign: 'center', borderStyle: 'dashed' }}>
                        <p style={{ color: 'var(--gray-400)', fontSize: '1.1rem' }}>The marketplace is currently expanding. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
