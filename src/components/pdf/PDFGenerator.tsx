"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { Download, Printer } from "@/components/Icons";
import { generateStaticMapUrl } from "@/lib/map-utils";

interface ItineraryData {
    title: string;
    location: string;
    description: string;
    price: number;
    currency?: string;
    creator: string;
    duration: string;
    duration_days?: number;
    bestTimeToVisit?: string;
    idealFor?: string;
    language?: string;
    startingLocation?: string;
    pickup?: string;
    drop?: string;
    insurance?: string;
    advanceBooking?: string;
    refundPolicy?: string;
    cancellationPolicy?: string;
    days: any[];
    content: any;
}

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
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);
            let yPosition = margin;

            // Brand Colors
            const colorPrimary = [255, 133, 162]; // #ff85a2
            const colorSecondary = [139, 92, 246]; // #8b5cf6
            const colorDark = [26, 26, 26];

            // Helper: Add horizontal line
            const addLine = (y: number, color = [230, 230, 230]) => {
                doc.setDrawColor(color[0], color[1], color[2]);
                doc.setLineWidth(0.5);
                doc.line(margin, y, pageWidth - margin, y);
            };

            // Helper: Page Header
            const addPageHeader = (pageTitle: string) => {
                doc.setFillColor(colorDark[0], colorDark[1], colorDark[2]);
                doc.rect(0, 0, pageWidth, 15, 'F');
                doc.setFontSize(8);
                doc.setTextColor(255, 255, 255);
                doc.setFont("helvetica", "bold");
                doc.text("ITINERARY GRAVITY", margin, 10);
                doc.text(pageTitle.toUpperCase(), pageWidth - margin, 10, { align: 'right' });
                doc.setTextColor(0, 0, 0);
            };

            // Helper: Page Footer
            const addPageFooter = (pageNum: number) => {
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                const footerText = isPreview
                    ? "PREVIEW VERSION - Purchase for full access at ItineraryGravity.com"
                    : `Verified Itinerary by ${itineraryData.creator} - Powered by ItineraryGravity`;
                doc.text(footerText, margin, pageHeight - 10);
                doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
                doc.setTextColor(0, 0, 0);
            };

            // Helper: Safe Text (No Emojis)
            const safeText = (text: string) => {
                // Remove common emojis and special chars that jsPDF helvetica doesn't support
                return text?.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') || "";
            };

            // Helper: Wrap and Add Text
            const addWrappedText = (text: string, fontSize: number, style: 'normal' | 'bold' | 'italic' = 'normal', color = [0, 0, 0], align: 'left' | 'center' | 'right' = 'left') => {
                doc.setFontSize(fontSize);
                doc.setFont("helvetica", style);
                doc.setTextColor(color[0], color[1], color[2]);

                const lines = doc.splitTextToSize(safeText(text), contentWidth);

                lines.forEach((line: string) => {
                    if (yPosition > pageHeight - 30) {
                        doc.addPage();
                        yPosition = 30;
                        addPageHeader(itineraryData.title);
                        addPageFooter(doc.getNumberOfPages());
                    }
                    doc.text(line, align === 'center' ? pageWidth / 2 : (align === 'right' ? pageWidth - margin : margin), yPosition, { align });
                    yPosition += (fontSize * 0.5);
                });
                yPosition += 4;
            };

            // --- PAGE 1: COVER ---
            addPageHeader("Trip Guide");
            yPosition = 50;

            // Big Title
            doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
            doc.setFontSize(32);
            doc.setFont("helvetica", "bold");
            const titleLines = doc.splitTextToSize(safeText(itineraryData.title), contentWidth);
            titleLines.forEach((line: string) => {
                doc.text(line, margin, yPosition);
                yPosition += 15;
            });

            yPosition += 5;
            addWrappedText(itineraryData.location, 16, 'bold', colorSecondary);
            yPosition += 10;

            addLine(yPosition, colorPrimary);
            yPosition += 15;

            // Trip Summary Grid
            const stats = [
                { label: "DURATION", value: itineraryData.duration || `${itineraryData.duration_days} Days` },
                { label: "BEST TIME", value: itineraryData.bestTimeToVisit || "Year-round" },
                { label: "LANGUAGE", value: itineraryData.language || "Local" }
            ];

            stats.forEach((stat, i) => {
                doc.setFontSize(9);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(150, 150, 150);
                doc.text(stat.label, margin + (i * 60), yPosition);

                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(0, 0, 0);
                doc.text(stat.value, margin + (i * 60), yPosition + 8);
            });

            yPosition += 30;

            // Description
            addWrappedText("ABOUT THIS TRIP", 12, 'bold', colorPrimary);
            yPosition += 2;
            addWrappedText(itineraryData.description, 11, 'normal', [80, 80, 80]);

            yPosition += 15;

            // Logistics
            addWrappedText("LOGISTICS & ARRIVAL", 12, 'bold', colorPrimary);
            yPosition += 5;

            const logistics = [
                ["Starting From", itineraryData.startingLocation || "Main Station/Airport"],
                ["Pickup Spot", itineraryData.pickup || "Arrival Hall"],
                ["Drop Spot", itineraryData.drop || "Departure Main Hall"],
                ["Insurance", itineraryData.insurance || "Recommended"]
            ];

            logistics.forEach(([label, val]) => {
                doc.setFontSize(10);
                doc.setFont("helvetica", "bold");
                doc.text(`${label}:`, margin, yPosition);
                doc.setFont("helvetica", "normal");
                doc.text(val, margin + 40, yPosition);
                yPosition += 8;
            });

            addPageFooter(1);

            // --- PAGES 2+: DAILY SCHEDULE ---
            doc.addPage();
            yPosition = 30;
            addPageHeader("Daily Schedule");
            addPageFooter(2);

            const displayDays = isPreview ? itineraryData.days.slice(0, 1) : itineraryData.days;

            if (displayDays.length === 0) {
                addWrappedText("Full schedule available after download.", 12, 'italic', [150, 150, 150], 'center');
            } else {
                displayDays.forEach((day, index) => {
                    // Day Header
                    doc.setFillColor(245, 245, 245);
                    doc.rect(margin, yPosition - 5, contentWidth, 15, 'F');
                    doc.setTextColor(colorPrimary[0], colorPrimary[1], colorPrimary[2]);
                    doc.setFontSize(14);
                    doc.setFont("helvetica", "bold");
                    doc.text(`DAY ${day.number || index + 1}: ${safeText(day.title)}`, margin + 5, yPosition + 5);
                    yPosition += 25;

                    // Transport & Stay
                    doc.setFontSize(9);
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(100, 100, 100);
                    doc.text(`STAY: ${day.hotel || 'Not specified'}`, margin, yPosition);
                    doc.text(`TRANSPORT: ${day.transport || 'Local'}`, pageWidth - margin, yPosition, { align: 'right' });
                    yPosition += 12;

                    // Morning
                    addWrappedText("MORNING", 10, 'bold', colorSecondary);
                    addWrappedText(day.morning, 11, 'normal', [50, 50, 50]);
                    yPosition += 5;

                    // Afternoon
                    addWrappedText("AFTERNOON", 10, 'bold', colorSecondary);
                    addWrappedText(day.afternoon, 11, 'normal', [50, 50, 50]);
                    yPosition += 5;

                    // Evening
                    addWrappedText("EVENING", 10, 'bold', colorSecondary);
                    addWrappedText(day.evening, 11, 'normal', [50, 50, 50]);
                    yPosition += 8;

                    // Notes/Tips
                    if (day.notes) {
                        doc.setFillColor(255, 133, 162, 0.1);
                        // Note box for tips
                        addWrappedText("PRO TIP", 9, 'bold', colorPrimary);
                        addWrappedText(day.notes, 10, 'italic', [110, 110, 110]);
                    }

                    yPosition += 15;
                });

                if (isPreview && itineraryData.days.length > 1) {
                    yPosition += 20;
                    addWrappedText(`... plus ${itineraryData.days.length - 1} more days of detailed plans.`, 12, 'bold', colorPrimary, 'center');
                    addWrappedText("Purchase the full guide to see every hidden gem!", 10, 'normal', [100, 100, 100], 'center');
                }
            }

            // --- FINAL PAGE: POLICIES & MAP ---
            if (!isPreview) {
                doc.addPage();
                yPosition = 30;
                addPageHeader("Terms & Safety");
                addPageFooter(doc.getNumberOfPages());

                addWrappedText("REFUND POLICY", 12, 'bold', colorPrimary);
                addWrappedText(itineraryData.refundPolicy || "No refunds for digital products.", 10, 'normal', [100, 100, 100]);
                yPosition += 10;

                addWrappedText("CANCELLATION TERMS", 12, 'bold', colorPrimary);
                addWrappedText(itineraryData.cancellationPolicy || "Final sale once accessed.", 10, 'normal', [100, 100, 100]);
                yPosition += 20;

                // --- MAP INTEGRATION ---
                doc.addPage();
                addPageHeader("Interactive Route Map");
                yPosition = 30;

                try {
                    // Collect coordinates
                    const coords: [number, number][] = [];
                    if (itineraryData.content?.accommodation?.hotelRecommendations) {
                        itineraryData.content.accommodation.hotelRecommendations.forEach((hotel: any) => {
                            if (hotel.locationCoordinates) coords.push(hotel.locationCoordinates);
                        });
                    }
                    if (itineraryData.content?.dailyItinerary) {
                        itineraryData.content.dailyItinerary.forEach((day: any) => {
                            if (day.morning?.locationCoordinates) coords.push(day.morning.locationCoordinates);
                            if (day.afternoon?.locationCoordinates) coords.push(day.afternoon.locationCoordinates);
                            if (day.evening?.locationCoordinates) coords.push(day.evening.locationCoordinates);
                        });
                    }

                    // Handle content.days (Schema v2)
                    if (itineraryData.content?.days) {
                        itineraryData.content.days.forEach((day: any) => {
                            if (day.locationCoordinates && Array.isArray(day.locationCoordinates)) {
                                day.locationCoordinates.forEach((coord: any) => {
                                    const lng = typeof coord.longitude === 'number' ? coord.longitude : coord[0];
                                    const lat = typeof coord.latitude === 'number' ? coord.latitude : coord[1];
                                    if (typeof lng === 'number' && typeof lat === 'number') {
                                        coords.push([lng, lat]);
                                    }
                                });
                            }
                        });
                    }

                    if (coords.length > 0) {
                        const staticMapUrl = generateStaticMapUrl(coords);
                        if (!staticMapUrl) throw new Error("Could not generate map URL");
                        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(staticMapUrl)}`;

                        const res = await fetch(proxyUrl);
                        if (res.ok) {
                            const blob = await res.blob();
                            const base64Data = await new Promise((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result);
                                reader.readAsDataURL(blob);
                            });

                            doc.addImage(base64Data as string, 'PNG', margin, yPosition, contentWidth, 120);
                            yPosition += 130;
                        } else {
                            addWrappedText("Map rendering temporarily unavailable.", 12, 'italic', [150, 150, 150]);
                        }

                    } else {
                        addWrappedText("No locations pinned yet.", 12, 'italic', [150, 150, 150]);
                    }
                } catch (error) {
                    addWrappedText("Map integration failed.", 12, 'italic', [150, 150, 150]);
                }
            }

            // Save PDF
            const filename = `${itineraryData.title.replace(/[^a-z0-9]/gi, '_')}_${isPreview ? 'preview' : 'full'}.pdf`;
            doc.save(filename);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. We are working on a fix!');
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
