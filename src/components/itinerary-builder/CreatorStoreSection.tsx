"use client";

import { useState } from "react";
import { Store, Plus, Trash2, Link as LinkIcon, DollarSign, Type, Info } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface Product {
    title: string;
    url: string;
    imageUrl?: string;
    description?: string;
    price?: string;
}

interface CreatorStoreSectionProps {
    data: Product[];
    onChange: (data: Product[]) => void;
}

export default function CreatorStoreSection({ data = [], onChange }: CreatorStoreSectionProps) {
    const [newItem, setNewItem] = useState<Product>({
        title: "",
        url: "",
        imageUrl: "",
        description: "",
        price: ""
    });

    const addItem = () => {
        if (!newItem.title || !newItem.url) return;
        onChange([...data, newItem]);
        setNewItem({
            title: "",
            url: "",
            imageUrl: "",
            description: "",
            price: ""
        });
    };

    const removeItem = (index: number) => {
        onChange(data.filter((_, i) => i !== index));
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Store size={24} color="var(--primary)" />
                    Your Personal Storefront
                </h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.95rem' }}>
                    Sell your own digital products, merchandise, or presets directly at the end of your itinerary.
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
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                            {item.price || 'Free'} • {item.description?.substring(0, 30)}...
                        </div>
                    </div>
                ))}
            </div>

            {/* Add New Item Form */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Add a Personal Product</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '4px' }}>Product Title</label>
                        <div style={{ position: 'relative' }}>
                            <Type size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                            <input
                                type="text"
                                value={newItem.title}
                                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                placeholder="e.g. Lightroom Preset Pack"
                                style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '4px' }}>Shop Link (URL)</label>
                        <div style={{ position: 'relative' }}>
                            <LinkIcon size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                            <input
                                type="text"
                                value={newItem.url}
                                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                                placeholder="https://yourshop.com/product"
                                style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '4px' }}>Short Description</label>
                    <div style={{ position: 'relative' }}>
                        <Info size={14} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--gray-400)' }} />
                        <textarea
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Briefly describe what buyer will get..."
                            rows={2}
                            style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)', resize: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '4px' }}>Product Image</label>
                        <ImageUpload
                            value={newItem.imageUrl}
                            onChange={(url) => setNewItem({ ...newItem, imageUrl: url })}
                            folder="creator-store"
                            label=""
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '4px' }}>Price Display</label>
                        <div style={{ position: 'relative' }}>
                            <DollarSign size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                            <input
                                type="text"
                                value={newItem.price}
                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                placeholder="e.g. $19.99"
                                style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={addItem}
                    className="btn btn-outline"
                    disabled={!newItem.title || !newItem.url}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '12px' }}
                >
                    <Plus size={18} /> Add Product to Storefront
                </button>
            </div>
        </div>
    );
}
