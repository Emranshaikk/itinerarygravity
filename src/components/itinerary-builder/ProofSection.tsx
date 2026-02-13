"use client";

import React, { useState } from "react";
import { ItineraryContent } from "@/types/itinerary";
import { Camera, Wand2, Plus, Trash2, Image as ImageIcon, MessageSquare } from "lucide-react";

interface ProofSectionProps {
    data: ItineraryContent["proofOfVisit"];
    onChange: (data: ItineraryContent["proofOfVisit"]) => void;
}

export default function ProofSection({ data, onChange }: ProofSectionProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const updateField = (field: keyof ItineraryContent["proofOfVisit"], value: any) => {
        onChange({ ...data, [field]: value });
    };

    const addImage = () => {
        updateField("images", [...data.images, { url: "", caption: "" }]);
    };

    const removeImage = (index: number) => {
        updateField("images", data.images.filter((_, i) => i !== index));
    };

    const updateImage = (index: number, field: "url" | "caption", value: string) => {
        const newImages = [...data.images];
        newImages[index] = { ...newImages[index], [field]: value };
        updateField("images", newImages);
    };

    const generateAIContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            onChange({
                images: [
                    { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800", caption: "Sunrise at Fushimi Inari Shrine. I local tip: arrive before 7 AM to avoid the crowds!" },
                    { url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=800", caption: "The view from Kiyomizu-dera. Truly breathtaking in person." }
                ],
                notes: "I personally visited every spot in this guide. These photos were taken during my last trip in April 2024."
            });
            setIsGenerating(false);
        }, 1200);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                        <Camera style={{ color: '#10b981' }} size={32} />
                        Proof of Visit
                    </h2>
                    <p style={{ color: 'var(--gray-400)' }}>
                        Show them it's real. Upload photos of yourself or your own shots from the location to build ultimate trust.
                    </p>
                </div>
                <button
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    {isGenerating ? "Processing..." : <><Wand2 size={16} style={{ marginRight: '0.5rem' }} /> Auto-Fill Proof</>}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Image Gallery */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                            <ImageIcon style={{ color: '#10b981' }} size={20} /> Your Photos
                        </h3>
                        <button onClick={addImage} style={{ fontSize: '0.75rem', color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Plus size={14} /> Add Image
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {data.images.map((img, i) => (
                            <div key={i} style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                                <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
                                    <Trash2 size={14} />
                                </button>

                                {img.url ? (
                                    <div style={{ width: '100%', height: '150px', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                        <img src={img.url} alt={`Proof ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ) : (
                                    <div style={{ width: '100%', height: '150px', borderRadius: '0.5rem', backgroundColor: 'var(--surface)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', marginBottom: '0.5rem' }}>
                                        <ImageIcon size={32} />
                                    </div>
                                )}

                                <input
                                    className="form-input"
                                    style={{ fontSize: '0.875rem', width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                                    placeholder="Image URL (e.g. Unsplash or Supabase URL)"
                                    value={img.url}
                                    onChange={(e) => updateImage(i, "url", e.target.value)}
                                />
                                <textarea
                                    className="form-input"
                                    style={{ background: 'var(--surface)', fontSize: '0.875rem', minHeight: '60px', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                                    placeholder="Add a caption about your experience here..."
                                    value={img.caption}
                                    onChange={(e) => updateImage(i, "caption", e.target.value)}
                                />
                            </div>
                        ))}
                        {data.images.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--gray-400)', border: '1px dashed var(--border)', borderRadius: '1rem' }}>
                                <p>No proof images added yet. Add at least one to show off your expertise!</p>
                                <button onClick={addImage} className="btn btn-outline" style={{ marginTop: '1rem' }}>Add First Photo</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Personal Note */}
                <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '1.5rem', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', margin: 0 }}>
                        <MessageSquare style={{ color: '#10b981' }} size={20} /> Personal Note to Travelers
                    </h3>
                    <textarea
                        className="form-input"
                        style={{ minHeight: '120px', backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                        placeholder="Share a short story or statement about your expertise in this destination..."
                        value={data.notes || ""}
                        onChange={(e) => updateField("notes", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
