"use client";

import { Store, ExternalLink, ArrowRight } from "lucide-react";

interface Product {
    title: string;
    url: string;
    imageUrl?: string;
    description?: string;
    price?: string;
}

interface CreatorStoreProps {
    products?: Product[];
    creatorName: string;
}

export default function CreatorStore({ products, creatorName }: CreatorStoreProps) {
    if (!products || products.length === 0) return null;

    return (
        <section style={{ marginBottom: '80px', marginTop: '40px' }}>
            <div style={{
                background: 'linear-gradient(135deg, rgba(255,133,162,0.05), rgba(139, 92, 246, 0.05))',
                padding: '40px',
                borderRadius: '24px',
                border: '1px solid var(--border)'
            }}>
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(255,133,162,0.1)',
                        padding: '8px 16px',
                        borderRadius: '24px',
                        color: 'var(--primary)',
                        marginBottom: '16px',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                    }}>
                        <Store size={16} /> More from {creatorName}
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>The Creator Collection</h2>
                    <p style={{ color: 'var(--gray-400)', maxWidth: '600px', margin: '0 auto' }}>
                        Support the creator by checking out their own digital products, guides, and merchandise.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {products.map((product, idx) => (
                        <a
                            key={idx}
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass card"
                            style={{
                                padding: '24px',
                                display: 'flex',
                                gap: '20px',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {product.imageUrl ? (
                                <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={product.imageUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ) : (
                                <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <ShoppingBag size={32} color="var(--gray-400)" />
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{product.title}</h3>
                                {product.description && <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginBottom: '8px', lineHeight: '1.4' }}>{product.description}</p>}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {product.price && <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{product.price}</span>}
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.6 }}>
                                        View <ArrowRight size={12} />
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ShoppingBag({ size, color }: { size: number, color: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    );
}
