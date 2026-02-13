"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, Check, X, Eye, ExternalLink, Filter } from "lucide-react";
import Link from "next/link";

export default function AdminItinerariesPage() {
    const [itineraries, setItineraries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

    useEffect(() => {
        fetchItineraries();
    }, []);

    const fetchItineraries = async () => {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
            .from('itineraries')
            .select(`
                *,
                profiles:creator_id (
                    full_name,
                    email
                )
            `)
            .order('created_at', { ascending: false });

        if (data) setItineraries(data);
        setLoading(false);
    };

    const handleApproval = async (id: string, approved: boolean) => {
        try {
            const response = await fetch('/api/itineraries/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itineraryId: id, approved })
            });

            if (response.ok) {
                setItineraries(itineraries.map(it =>
                    it.id === id ? { ...it, is_approved: approved } : it
                ));
            }
        } catch (error) {
            console.error("Approval error:", error);
            alert("Failed to update status.");
        }
    };

    const filteredItineraries = itineraries.filter(it => {
        if (filter === 'pending') return !it.is_approved;
        if (filter === 'approved') return it.is_approved;
        return true;
    });

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <ShieldCheck size={40} color="var(--primary)" />
                        Itinerary Moderation
                    </h1>
                    <p style={{ color: 'var(--gray-400)' }}>Review and approve community-submitted itineraries.</p>
                </div>

                <div style={{ display: 'flex', gap: '8px', background: 'var(--surface)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <button
                        onClick={() => setFilter('all')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: filter === 'all' ? 'var(--primary)' : 'transparent', color: filter === 'all' ? 'var(--background)' : 'var(--gray-400)', cursor: 'pointer', fontWeight: 600 }}
                    >All</button>
                    <button
                        onClick={() => setFilter('pending')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: filter === 'pending' ? 'var(--primary)' : 'transparent', color: filter === 'pending' ? 'var(--background)' : 'var(--gray-400)', cursor: 'pointer', fontWeight: 600 }}
                    >Pending</button>
                    <button
                        onClick={() => setFilter('approved')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: filter === 'approved' ? 'var(--primary)' : 'transparent', color: filter === 'approved' ? 'var(--background)' : 'var(--gray-400)', cursor: 'pointer', fontWeight: 600 }}
                    >Approved</button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: 'var(--gray-400)' }}>Loading queue...</div>
            ) : filteredItineraries.length === 0 ? (
                <div className="glass card" style={{ padding: '100px', textAlign: 'center', color: 'var(--gray-400)' }}>
                    No itineraries found in this queue.
                </div>
            ) : (
                <div className="glass card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '20px', textAlign: 'left', color: 'var(--gray-400)' }}>Itinerary</th>
                                <th style={{ padding: '20px', textAlign: 'left', color: 'var(--gray-400)' }}>Creator</th>
                                <th style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-400)' }}>Status</th>
                                <th style={{ padding: '20px', textAlign: 'right', color: 'var(--gray-400)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItineraries.map((it) => (
                                <tr key={it.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{it.title}</div>
                                        <div style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>{it.location} • ₹{it.price}</div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: 600 }}>{it.profiles?.full_name}</div>
                                        <div style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>{it.profiles?.email}</div>
                                    </td>
                                    <td style={{ padding: '20px', textAlign: 'center' }}>
                                        {it.is_approved ? (
                                            <span style={{ padding: '6px 14px', borderRadius: '20px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '0.75rem', fontWeight: 800 }}>APPROVED</span>
                                        ) : (
                                            <span style={{ padding: '6px 14px', borderRadius: '20px', background: 'rgba(234,179,8,0.1)', color: '#eab308', fontSize: '0.75rem', fontWeight: 800 }}>PENDING</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '20px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <Link href={`/itinerary/${it.id}`} target="_blank" className="btn btn-outline" style={{ padding: '8px 12px' }}>
                                                <Eye size={18} />
                                            </Link>
                                            {!it.is_approved ? (
                                                <button
                                                    onClick={() => handleApproval(it.id, true)}
                                                    className="btn btn-primary"
                                                    style={{ background: '#10b981', borderColor: '#10b981', padding: '8px 12px' }}
                                                >
                                                    <Check size={18} /> Approve
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleApproval(it.id, false)}
                                                    className="btn btn-outline"
                                                    style={{ color: '#ef4444', borderColor: '#ef4444', padding: '8px 12px' }}
                                                >
                                                    <X size={18} /> Revoke
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
