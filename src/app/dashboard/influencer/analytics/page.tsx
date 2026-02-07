"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { TrendingUp, Eye, DollarSign, Star, MapPin, Calendar } from "@/components/Icons";

interface ItineraryAnalytics {
    id: string;
    itinerary_id: string;
    views_count: number;
    purchases_count: number;
    total_revenue: number;
    itineraries: {
        id: string;
        title: string;
        price: number;
        average_rating: number;
        review_count: number;
        is_published: boolean;
    };
}

interface AnalyticsSummary {
    total_views: number;
    total_purchases: number;
    total_revenue: number;
    itineraries: ItineraryAnalytics[];
}

export default function CreatorAnalytics() {
    const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");
    const supabase = createClient();

    useEffect(() => {
        fetchAnalytics();
    }, []);

    async function fetchAnalytics() {
        try {
            const response = await fetch('/api/analytics');
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="container" style={{ padding: '40px 0' }}>
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-400)' }}>
                    Loading analytics...
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="container" style={{ padding: '40px 0' }}>
                <div className="glass card" style={{ padding: '60px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No Analytics Available</h3>
                    <p style={{ color: 'var(--gray-400)' }}>Create your first itinerary to start tracking analytics!</p>
                </div>
            </div>
        );
    }

    const conversionRate = analytics.total_views > 0
        ? ((analytics.total_purchases / analytics.total_views) * 100).toFixed(1)
        : '0.0';

    const avgRevenuePerItinerary = analytics.itineraries.length > 0
        ? (analytics.total_revenue / analytics.itineraries.length).toFixed(2)
        : '0.00';

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
                    Analytics Dashboard
                </h1>
                <p style={{ color: 'var(--gray-400)' }}>
                    Track your itinerary performance and earnings
                </p>
            </header>

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                <div className="glass card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: '#3b82f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Eye size={20} />
                        </div>
                        <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Total Views</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>{analytics.total_views.toLocaleString()}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                        Across {analytics.itineraries.length} itineraries
                    </p>
                </div>

                <div className="glass card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TrendingUp size={20} />
                        </div>
                        <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Total Sales</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>{analytics.total_purchases}</p>
                    <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>
                        {conversionRate}% conversion rate
                    </p>
                </div>

                <div className="glass card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: 'rgba(236, 72, 153, 0.1)',
                            color: 'var(--secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <DollarSign size={20} />
                        </div>
                        <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Total Revenue</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>₹{analytics.total_revenue.toFixed(2)}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                        ₹{avgRevenuePerItinerary} avg per itinerary
                    </p>
                </div>

                <div className="glass card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: 'rgba(234, 179, 8, 0.1)',
                            color: '#eab308',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Star size={20} />
                        </div>
                        <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Avg Rating</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>
                        {analytics.itineraries.length > 0
                            ? (analytics.itineraries.reduce((sum, i) => sum + (i.itineraries.average_rating || 0), 0) / analytics.itineraries.length).toFixed(1)
                            : '0.0'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                        {analytics.itineraries.reduce((sum, i) => sum + (i.itineraries.review_count || 0), 0)} total reviews
                    </p>
                </div>
            </div>

            {/* Performance by Itinerary */}
            <div className="glass card">
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '1.4rem' }}>Performance by Itinerary</h3>
                </div>

                {analytics.itineraries.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gray-400)' }}>
                        <p>No itineraries yet. Create your first one to start earning!</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Itinerary</th>
                                <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Views</th>
                                <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Sales</th>
                                <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Revenue</th>
                                <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Rating</th>
                                <th style={{ padding: '16px 32px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.itineraries.map((item) => {
                                const itemConversion = item.views_count > 0
                                    ? ((item.purchases_count / item.views_count) * 100).toFixed(1)
                                    : '0.0';

                                return (
                                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '16px 32px' }}>
                                            <div>
                                                <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                                                    {item.itineraries.title}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                                                    ₹{item.itineraries.price}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 32px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Eye size={14} style={{ color: 'var(--gray-400)' }} />
                                                {item.views_count}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 32px' }}>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{item.purchases_count}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                                    {itemConversion}% conv.
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 32px', fontWeight: 600, color: '#10b981' }}>
                                            ₹{Number(item.total_revenue).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '16px 32px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                                                <span>{item.itineraries.average_rating > 0 ? item.itineraries.average_rating.toFixed(1) : 'N/A'}</span>
                                                {item.itineraries.review_count > 0 && (
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                                        ({item.itineraries.review_count})
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 32px' }}>
                                            <span className="badge" style={{
                                                background: item.itineraries.is_published ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                                                color: item.itineraries.is_published ? '#10b981' : '#6b7280'
                                            }}>
                                                {item.itineraries.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Insights */}
            <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="glass card" style={{ padding: '24px' }}>
                    <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                        Top Performer
                    </h4>
                    {analytics.itineraries.length > 0 ? (
                        <>
                            {(() => {
                                const topItinerary = analytics.itineraries.reduce((max, item) =>
                                    Number(item.total_revenue) > Number(max.total_revenue) ? item : max
                                );
                                return (
                                    <div>
                                        <p style={{ fontWeight: 600, marginBottom: '8px' }}>{topItinerary.itineraries.title}</p>
                                        <p style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 700 }}>
                                            ₹{Number(topItinerary.total_revenue).toFixed(2)}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                                            {topItinerary.purchases_count} sales • {topItinerary.views_count} views
                                        </p>
                                    </div>
                                );
                            })()}
                        </>
                    ) : (
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>No data yet</p>
                    )}
                </div>

                <div className="glass card" style={{ padding: '24px' }}>
                    <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Star size={18} style={{ color: '#fbbf24' }} />
                        Best Rated
                    </h4>
                    {analytics.itineraries.length > 0 ? (
                        <>
                            {(() => {
                                const bestRated = analytics.itineraries
                                    .filter(i => i.itineraries.review_count > 0)
                                    .reduce((max, item) =>
                                        item.itineraries.average_rating > (max?.itineraries.average_rating || 0) ? item : max
                                        , analytics.itineraries[0]);
                                return bestRated.itineraries.review_count > 0 ? (
                                    <div>
                                        <p style={{ fontWeight: 600, marginBottom: '8px' }}>{bestRated.itineraries.title}</p>
                                        <p style={{ color: '#fbbf24', fontSize: '1.2rem', fontWeight: 700 }}>
                                            ★ {bestRated.itineraries.average_rating.toFixed(1)}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                                            {bestRated.itineraries.review_count} reviews
                                        </p>
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>No reviews yet</p>
                                );
                            })()}
                        </>
                    ) : (
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>No data yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}
