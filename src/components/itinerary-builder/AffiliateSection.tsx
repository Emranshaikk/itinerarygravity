"use client";

import { useState } from "react";
import { ShoppingBag, Plus, Trash2, Link as LinkIcon, Tag, DollarSign, Image as ImageIcon } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface AffiliateProduct {
    id?: string;
    title: string;
    productUrl: string;
    imageUrl?: string;
    priceDisplay?: string;
    category?: string;
}

interface AffiliateSectionProps {
    data: AffiliateProduct[];
    onChange: (data: AffiliateProduct[]) => void;
}

export default function AffiliateSection({ data, onChange }: AffiliateSectionProps) {
    const [newItem, setNewItem] = useState<AffiliateProduct>({
        title: "",
        productUrl: "",
        imageUrl: "",
        priceDisplay: "",
        category: "Gear"
    });

    const addItem = () => {
        if (!newItem.title || !newItem.productUrl) return;
        onChange([...data, newItem]);
        setNewItem({
            title: "",
            productUrl: "",
            imageUrl: "",
            priceDisplay: "",
            category: "Gear"
        });
    };

    const removeItem = (index: number) => {
        onChange(data.filter((_, i) => i !== index));
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShoppingBag size={24} color="var(--primary)" />
                    Monetize with Affiliate Products
                </h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.95rem' }}>
                    Add links to gear, hotels, insurance, or activities you recommend. You'll earn from your own affiliate links!
                </p>
            </div>

            {/* List of existing items */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                {data.map((item, idx) => (
                    <div key={idx} className="glass" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', position: 'relative' }}>
                        <button
                            onClick={() => removeItem(idx)}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                            <Trash2 size={16} />
                        </button>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Tag size={12} /> {item.category} • {item.priceDisplay || 'No price'}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add New Item Form */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Add a Product</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '4px' }}>Product Title</label>
                        <div style={{ position: 'relative' }}>
                            <ShoppingBag size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                            <input
                                type="text"
                                value={newItem.title}
                                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                placeholder="e.g. Sony A7IV Camera"
                                style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '4px' }}>Affiliate Link (URL)</label>
                        <div style={{ position: 'relative' }}>
                            <LinkIcon size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                            <input
                                type="text"
                                value={newItem.productUrl}
                                onChange={(e) => setNewItem({ ...newItem, productUrl: e.target.value })}
                                placeholder="https://amazon.com/dp/..."
                                style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '4px' }}>Product Image</label>
                        <ImageUpload
                            value={newItem.imageUrl}
                            onChange={(url) => setNewItem({ ...newItem, imageUrl: url })}
                            folder="affiliate-products"
                            label=""
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '4px' }}>Price Display</label>
                        <div style={{ position: 'relative' }}>
                            <DollarSign size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                            <input
                                type="text"
                                value={newItem.priceDisplay}
                                onChange={(e) => setNewItem({ ...newItem, priceDisplay: e.target.value })}
                                placeholder="e.g. $2,499"
                                style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '4px' }}>Category</label>
                        <select
                            value={newItem.category}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            style={{ width: '100%', padding: '10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)', outline: 'none' }}
                        >
                            <option value="Gear" style={{ background: '#1a1a1a', color: '#ffffff' }}>Travel Gear</option>
                            <option value="Hotel" style={{ background: '#1a1a1a', color: '#ffffff' }}>Accomodation</option>
                            <option value="Insurance" style={{ background: '#1a1a1a', color: '#ffffff' }}>Insurance</option>
                            <option value="Activity" style={{ background: '#1a1a1a', color: '#ffffff' }}>Tours & Activities</option>
                            <option value="Other" style={{ background: '#1a1a1a', color: '#ffffff' }}>Other</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={addItem}
                    className="btn btn-outline"
                    disabled={!newItem.title || !newItem.productUrl}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '12px' }}
                >
                    <Plus size={18} /> Add to Itinerary
                </button>
            </div>
        </div>
    );
}
