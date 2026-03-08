"use client";

import { useState } from "react";
import { Download, Printer } from "@/components/Icons";
import { generateItineraryPDF, ItineraryData } from "@/lib/pdf-generator";

interface PDFGeneratorProps {
    itineraryData: ItineraryData;
    isPurchased: boolean;
    iconOnly?: boolean;
}

export default function PDFGenerator({ itineraryData, isPurchased, iconOnly = false }: PDFGeneratorProps) {
    const [generating, setGenerating] = useState(false);

    const generatePDF = async (isPreview: boolean) => {
        setGenerating(true);
        try {
            const success = await generateItineraryPDF(itineraryData, isPurchased, isPreview);
            if (!success) {
                alert('Failed to generate PDF. We are working on a fix!');
            }
        } finally {
            setGenerating(false);
        }
    };

    if (iconOnly) {
        return (
            <button
                onClick={() => generatePDF(!isPurchased)}
                disabled={generating}
                title={isPurchased ? "Download Full PDF" : "Download Preview PDF"}
                style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: generating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: generating ? 0.7 : 1
                }}
                onMouseOver={(e) => !generating && (e.currentTarget.style.borderColor = 'var(--primary)')}
                onMouseOut={(e) => !generating && (e.currentTarget.style.borderColor = 'var(--border)')}
            >
                <Download size={22} />
            </button>
        );
    }

    return (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Preview PDF Button - Always visible */}
            <button
                onClick={() => generatePDF(true)}
                disabled={generating}
                className="btn btn-outline"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: generating ? 0.5 : 1,
                    cursor: generating ? 'not-allowed' : 'pointer'
                }}
            >
                <Download size={18} />
                {generating ? 'Generating...' : 'Download Preview PDF'}
            </button>

            {/* Full PDF Button - Only for purchasers */}
            {isPurchased && (
                <button
                    onClick={() => generatePDF(false)}
                    disabled={generating}
                    className="btn btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: generating ? 0.5 : 1,
                        cursor: generating ? 'not-allowed' : 'pointer'
                    }}
                >
                    <Download size={18} />
                    {generating ? 'Generating...' : 'Download Full PDF'}
                </button>
            )}

            {!isPurchased && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: 'var(--primary)',
                    fontSize: '0.9rem'
                }}>
                    💡 Purchase this itinerary to download the complete PDF
                </div>
            )}

            <button
                onClick={() => window.print()}
                className="btn btn-outline"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                }}
            >
                <Printer size={18} /> Print / Save as PDF
            </button>
        </div>
    );
}
