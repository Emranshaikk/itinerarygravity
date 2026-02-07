"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import { Download } from "@/components/Icons";

interface ItineraryData {
    title: string;
    location: string;
    description: string;
    price: number;
    creator: string;
    duration_days?: number;
    content: any;
}

interface PDFGeneratorProps {
    itineraryData: ItineraryData;
    isPurchased: boolean;
}

export default function PDFGenerator({ itineraryData, isPurchased }: PDFGeneratorProps) {
    const [generating, setGenerating] = useState(false);

    const generatePDF = (isPreview: boolean) => {
        setGenerating(true);

        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            let yPosition = margin;

            // Helper function to add text with word wrap
            const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
                doc.setFontSize(fontSize);
                doc.setFont("helvetica", isBold ? "bold" : "normal");
                const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);

                lines.forEach((line: string) => {
                    if (yPosition > pageHeight - margin) {
                        doc.addPage();
                        yPosition = margin;
                    }
                    doc.text(line, margin, yPosition);
                    yPosition += fontSize * 0.5;
                });
                yPosition += 5;
            };

            // Add watermark for preview
            if (isPreview) {
                doc.setFontSize(60);
                doc.setTextColor(200, 200, 200);
                doc.setFont("helvetica", "bold");
                doc.text("PREVIEW", pageWidth / 2, pageHeight / 2, {
                    align: "center",
                    angle: 45
                });
                doc.setTextColor(0, 0, 0);
            }

            // Title
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text(itineraryData.title, margin, yPosition);
            yPosition += 15;

            // Location and Price
            doc.setFontSize(14);
            doc.setFont("helvetica", "normal");
            doc.text(`📍 ${itineraryData.location}`, margin, yPosition);
            yPosition += 8;
            doc.text(`💰 ₹${itineraryData.price}`, margin, yPosition);
            yPosition += 8;
            if (itineraryData.duration_days) {
                doc.text(`⏱️ ${itineraryData.duration_days} Days`, margin, yPosition);
                yPosition += 8;
            }
            doc.text(`👤 By ${itineraryData.creator}`, margin, yPosition);
            yPosition += 15;

            // Separator line
            doc.setDrawColor(200, 200, 200);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;

            // Description
            addText("Description", 16, true);
            addText(itineraryData.description || "No description available.");
            yPosition += 10;

            // Itinerary Content
            if (itineraryData.content && itineraryData.content.days) {
                addText("Daily Itinerary", 16, true);

                const days = isPreview
                    ? itineraryData.content.days.slice(0, 2) // Only first 2 days for preview
                    : itineraryData.content.days;

                days.forEach((day: any, index: number) => {
                    addText(`Day ${index + 1}: ${day.title || `Day ${index + 1}`}`, 14, true);
                    addText(day.description || "No details available.");

                    if (day.activities && day.activities.length > 0) {
                        addText("Activities:", 12, true);
                        day.activities.forEach((activity: string) => {
                            addText(`• ${activity}`, 11);
                        });
                    }
                    yPosition += 5;
                });

                // Preview limitation message
                if (isPreview && itineraryData.content.days.length > 2) {
                    yPosition += 10;
                    doc.setFontSize(12);
                    doc.setTextColor(100, 100, 100);
                    doc.setFont("helvetica", "italic");
                    const previewText = `... and ${itineraryData.content.days.length - 2} more days. Purchase to view the complete itinerary.`;
                    doc.text(previewText, margin, yPosition);
                    doc.setTextColor(0, 0, 0);
                }
            }

            // Footer
            const footerY = pageHeight - 15;
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(
                isPreview ? "Preview Version - Purchase for Full Access" : "ItineraryGravity - Your Travel Companion",
                pageWidth / 2,
                footerY,
                { align: "center" }
            );

            // Save PDF
            const filename = `${itineraryData.title.replace(/[^a-z0-9]/gi, '_')}_${isPreview ? 'preview' : 'full'}.pdf`;
            doc.save(filename);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

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
        </div>
    );
}
