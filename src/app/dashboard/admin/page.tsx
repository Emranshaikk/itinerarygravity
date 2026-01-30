"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
    const [verifications, setVerifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVerifications();
    }, []);

    async function fetchVerifications() {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('verification_status', 'pending');

        if (data) setVerifications(data);
        setLoading(false);
    }

    const handleAction = async (userId: string, action: 'Approve' | 'Deny') => {
        try {
            const isApproved = action === 'Approve';
            const { error } = await supabase
                .from('profiles')
                .update({
                    is_verified: isApproved,
                    verification_status: isApproved ? 'verified' : 'none'
                })
                .eq('id', userId);

            if (error) throw error;

            alert(`Successfully ${action}d verification`);
            fetchVerifications(); // Refresh list
        } catch (err) {
            console.error(err);
            alert("Action failed. Try again.");
        }
    };

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
                <p style={{ color: 'var(--gray-400)' }}>Manage verification requests and platform content.</p>
            </header>

            <div style={{ display: 'grid', gridGap: '32px' }}>
                {/* Pending Verifications */}
                <div className="glass card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '1.4rem' }}>Pending Verifications</h3>
                        <button className="btn btn-outline" onClick={fetchVerifications}>Refresh List</button>
                    </div>

                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '40px' }}>Loading requests...</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '16px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Full Name</th>
                                    <th style={{ padding: '16px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Proof / Social Link</th>
                                    <th style={{ padding: '16px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Status</th>
                                    <th style={{ padding: '16px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {verifications.length > 0 ? verifications.map((v, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '16px', fontWeight: 500 }}>{v.full_name || 'Anonymous Creator'}</td>
                                        <td style={{ padding: '16px' }}>
                                            <a href={v.identity_proof?.startsWith('http') ? v.identity_proof : `https://${v.identity_proof}`}
                                                target="_blank"
                                                style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                                                {v.identity_proof}
                                            </a>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span className="badge" style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#eab308' }}>Pending Review</span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', gap: '16px' }}>
                                                <button
                                                    onClick={() => handleAction(v.id, 'Approve')}
                                                    style={{ color: '#10b981', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(v.id, 'Deny')}
                                                    style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                                                >
                                                    Deny
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--gray-400)' }}>
                                            No pending verification requests.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
