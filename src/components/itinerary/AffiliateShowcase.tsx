"use client";

import { ShoppingBag, ExternalLink, Tag } from "lucide-react";

interface AffiliateProduct {
    id?: string;
    title: string;
    productUrl: string;
    imageUrl?: string;
    priceDisplay?: string;
    category?: string;
}

interface AffiliateShowcaseProps {
    products?: AffiliateProduct[];
}

export default function AffiliateShowcase({ products }: AffiliateShowcaseProps) {
    if (!products || products.length === 0) return null;

    return (
        <section style={{ marginBottom: '80px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ShoppingBag size={32} color="var(--primary)" />
                    Shop My Trip & Gear
                </h2>
                <p style={{ color: 'var(--gray-400)' }}>
                    Handpicked recommendations by the creator to enhance your experience.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {products.map((product, idx) => (
                    <div key={idx} className="glass card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {product.imageUrl && (
                            <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                {product.category && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: 'rgba(0,0,0,0.6)',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        backdropFilter: 'blur(4px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <Tag size={12} color="var(--primary)" /> {product.category}
                                    </div>
                                )}
                            </div>
                        )}
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 700 }}>{product.title}</h3>
                                {product.priceDisplay && (
                                    <div style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '16px' }}>
                                        {product.priceDisplay}
                                    </div>
                                )}
                            </div>
                            <a
                                href={product.productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                View Product <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
