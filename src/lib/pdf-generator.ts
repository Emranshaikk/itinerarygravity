import { jsPDF } from "jspdf";
import { generateStaticMapUrl } from "@/lib/map-utils";

export interface ItineraryData {
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

export const generateItineraryPDF = async (itineraryData: ItineraryData, isPurchased: boolean, isPreview: boolean) => {
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
        const safeText = (text: any) => {
            if (!text) return "";
            if (typeof text !== 'string') {
                if (typeof text === 'object' && text.description) return safeText(text.description);
                if (typeof text === 'object' && text.name) return safeText(text.name);
                return String(text);
            }
            // Remove common emojis and special chars that jsPDF helvetica doesn't support
            return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
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

        if (isPreview) {
            // Save Preview PDF
            const filename = `${itineraryData.title.replace(/[^a-z0-9]/gi, '_')}_preview.pdf`;
            doc.save(filename);
            return true;
        }

        const c = itineraryData.content;

        // --- PRE-TRIP & ACCOMMODATIONS ---
        if (c?.preTrip || c?.accommodation) {
            doc.addPage();
            yPosition = 30;
            addPageHeader("Pre-Trip & Accommodations");

            if (c.preTrip?.flightGuide) {
                addWrappedText("FLIGHT & ARRIVAL STRATEGY", 12, 'bold', colorPrimary);
                if (c.preTrip.flightGuide.bestAirports?.length > 0) addWrappedText(`Best Airports: ${c.preTrip.flightGuide.bestAirports.join(', ')}`, 10, 'normal', [80, 80, 80]);
                if (c.preTrip.flightGuide.arrivalDepartureStats) addWrappedText(`Arrival Info: ${c.preTrip.flightGuide.arrivalDepartureStats}`, 10, 'normal', [80, 80, 80]);
                if (c.preTrip.flightGuide.baggageTips) addWrappedText(`Baggage Tips: ${c.preTrip.flightGuide.baggageTips}`, 10, 'normal', [80, 80, 80]);
                if (c.preTrip.flightGuide.seatTips) addWrappedText(`Seat Secret: ${c.preTrip.flightGuide.seatTips}`, 10, 'normal', [80, 80, 80]);
                if (c.preTrip.flightGuide.jetLagTips) addWrappedText(`Jet Lag Hack: ${c.preTrip.flightGuide.jetLagTips}`, 10, 'normal', [80, 80, 80]);
                yPosition += 8;
            }

            if (c.preTrip?.packingList?.length > 0) {
                addWrappedText("PACKING LIST", 12, 'bold', colorPrimary);
                c.preTrip.packingList.forEach((cat: any) => {
                    if (cat.items?.length > 0) {
                        addWrappedText(cat.category, 10, 'bold', [50, 50, 50]);
                        addWrappedText(cat.items.join(', '), 10, 'normal', [80, 80, 80]);
                        yPosition += 3;
                    }
                });
                yPosition += 5;
            }

            if (c.accommodation?.bestNeighborhoods?.length > 0) {
                addWrappedText("BEST NEIGHBORHOODS", 12, 'bold', colorPrimary);
                c.accommodation.bestNeighborhoods.forEach((hood: any) => {
                    addWrappedText(`${hood.name} (${hood.vibe})`, 10, 'bold', [50, 50, 50]);
                    addWrappedText(hood.whyStayHere, 10, 'normal', [80, 80, 80]);
                    yPosition += 3;
                });
                yPosition += 5;
            }

            if (c.accommodation?.hotelRecommendations?.length > 0) {
                addWrappedText("HANDPICKED HOTELS", 12, 'bold', colorPrimary);
                c.accommodation.hotelRecommendations.forEach((hotel: any) => {
                    addWrappedText(`${hotel.name} - ${hotel.priceRange} (${hotel.neighborhood})`, 10, 'bold', [50, 50, 50]);
                    addWrappedText(hotel.whyWeLoveIt, 10, 'normal', [80, 80, 80]);
                    if (hotel.bookingLink) addWrappedText(`Booking Link: ${hotel.bookingLink}`, 9, 'italic', colorSecondary);
                    yPosition += 3;
                });
            }

            addPageFooter(doc.getNumberOfPages());
        }

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

                // Time Block Helper
                const renderTimeBlock = (blockName: string, blockData: any) => {
                    if (!blockData) return;
                    addWrappedText(blockName, 10, 'bold', colorSecondary);
                    if (typeof blockData === 'string') {
                        addWrappedText(blockData, 11, 'normal', [50, 50, 50]);
                    } else {
                        if (blockData.time) addWrappedText(`Time: ${blockData.time}`, 10, 'italic', [100, 100, 100]);
                        if (blockData.activity) addWrappedText(String(blockData.activity), 11, 'normal', [50, 50, 50]);
                        if (blockData.location) addWrappedText(`📍 ${blockData.location}`, 10, 'normal', colorPrimary);
                        if (blockData.travelTime) addWrappedText(`Commute: ${blockData.travelTime}`, 9, 'italic', [120, 120, 120]);
                        if (blockData.food) addWrappedText(`Food Check: ${blockData.food}`, 10, 'normal', [80, 80, 80]);
                        if (blockData.foodType) addWrappedText(`Food Check: ${blockData.foodType}`, 10, 'normal', [80, 80, 80]);
                        if (blockData.foodBudget) addWrappedText(`Budget Food: ${blockData.foodBudget}`, 10, 'normal', [80, 80, 80]);
                        if (blockData.foodPremium) addWrappedText(`Premium Food: ${blockData.foodPremium}`, 10, 'normal', [80, 80, 80]);
                        if (blockData.notes || blockData.tips) addWrappedText(`Tip: ${blockData.notes || blockData.tips}`, 10, 'italic', [100, 100, 100]);
                    }
                    yPosition += 5;
                };

                // Morning
                renderTimeBlock("MORNING", day.morning);
                // Afternoon
                renderTimeBlock("AFTERNOON", day.afternoon);
                // Evening
                renderTimeBlock("EVENING", day.evening);

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

        // --- EXPERT GUIDES & SECRETS ---
        if (!isPreview && (c?.food || c?.transport || c?.secrets || c?.shopping || c?.safety || c?.arrival || c?.customization)) {
            doc.addPage();
            yPosition = 30;
            addPageHeader("Expert Travel Guide");

            if (c.food?.mustTryDishes?.length > 0) {
                addWrappedText("MUST-TRY LOCAL FOOD", 12, 'bold', colorPrimary);
                c.food.mustTryDishes.forEach((dish: any) => {
                    addWrappedText(`${dish.name} ${dish.bestPlace ? `(Best at: ${dish.bestPlace})` : ''}`, 10, 'bold', [50, 50, 50]);
                    addWrappedText(dish.description, 10, 'normal', [80, 80, 80]);
                    yPosition += 3;
                });
                yPosition += 5;
            }

            if (c.transport?.modes?.length > 0) {
                addWrappedText("GETTING AROUND", 12, 'bold', colorPrimary);
                c.transport.modes.forEach((m: any) => {
                    addWrappedText(`${m.type} ${m.cost ? `(${m.cost})` : ''}`, 10, 'bold', [50, 50, 50]);
                    addWrappedText(m.tips, 10, 'normal', [80, 80, 80]);
                    yPosition += 3;
                });
                yPosition += 5;
            }

            if (c.secrets?.places?.length > 0) {
                addWrappedText("HIDDEN GEMS", 12, 'bold', colorPrimary);
                c.secrets.places.forEach((p: any) => {
                    addWrappedText(`${p.name} [${p.type}]`, 10, 'bold', [50, 50, 50]);
                    addWrappedText(p.description, 10, 'normal', [80, 80, 80]);
                    yPosition += 3;
                });
                yPosition += 5;
            }

            if (c.safety) {
                if (c.safety.commonScams?.length > 0) {
                    addWrappedText("COMMON SCAMS TO AVOID", 12, 'bold', [239, 68, 68]);
                    c.safety.commonScams.forEach((s: string) => addWrappedText(`• ${s}`, 10, 'normal', [80, 80, 80]));
                    yPosition += 3;
                }
                if (c.safety.emergencyNumbers?.length > 0) {
                    addWrappedText("EMERGENCY CONTACTS", 12, 'bold', colorPrimary);
                    c.safety.emergencyNumbers.forEach((n: any) => addWrappedText(`${n.name}: ${n.number}`, 10, 'bold', [50, 50, 50]));
                    yPosition += 5;
                }
            }
            addPageFooter(doc.getNumberOfPages());
        }

        // --- ARRIVAL & MORE ---
        if (!isPreview && (c?.arrival || c?.departure || c?.shopping || c?.customization || c?.postTrip)) {
            doc.addPage();
            yPosition = 30;
            addPageHeader("Logistics & Extras");

            if (c.arrival) {
                addWrappedText("ARRIVAL LOGISTICS", 12, 'bold', colorPrimary);
                if (c.arrival.airportToCity) addWrappedText(`Transfer: ${c.arrival.airportToCity}`, 10, 'normal', [80, 80, 80]);
                if (c.arrival.simCardPickUp) addWrappedText(`SIM Card: ${c.arrival.simCardPickUp}`, 10, 'normal', [80, 80, 80]);
                yPosition += 5;
            }

            if (c.shopping) {
                if (c.shopping.whatToBuy?.length > 0) {
                    addWrappedText("WHAT TO BUY", 12, 'bold', colorPrimary);
                    c.shopping.whatToBuy.forEach((s: string) => addWrappedText(`• ${s}`, 10, 'normal', [80, 80, 80]));
                    yPosition += 3;
                }
                if (c.shopping.bestMarkets?.length > 0) {
                    addWrappedText("BEST MARKETS", 12, 'bold', colorPrimary);
                    c.shopping.bestMarkets.forEach((s: string) => addWrappedText(`• ${s}`, 10, 'normal', [80, 80, 80]));
                    yPosition += 5;
                }
            }

            if (c.customization) {
                addWrappedText("TRIP CUSTOMIZATION", 12, 'bold', colorPrimary);
                if (c.customization.coupleTips) { addWrappedText("Couples:", 10, 'bold', [50, 50, 50]); addWrappedText(c.customization.coupleTips, 10, 'normal', [80, 80, 80]); }
                if (c.customization.familyTips) { addWrappedText("Families:", 10, 'bold', [50, 50, 50]); addWrappedText(c.customization.familyTips, 10, 'normal', [80, 80, 80]); }
                if (c.customization.soloTips) { addWrappedText("Solo Travelers:", 10, 'bold', [50, 50, 50]); addWrappedText(c.customization.soloTips, 10, 'normal', [80, 80, 80]); }
                yPosition += 5;
            }

            if (c.postTrip) {
                addWrappedText("POST-TRIP GUIDE", 12, 'bold', colorPrimary);
                if (c.postTrip.jetLagRecovery) { addWrappedText("Jet Lag Recovery:", 10, 'bold', [50, 50, 50]); addWrappedText(c.postTrip.jetLagRecovery, 10, 'normal', [80, 80, 80]); }
                if (c.postTrip.nextDestinationIdeas?.length > 0) {
                    addWrappedText("Where to Next?", 10, 'bold', [50, 50, 50]);
                    c.postTrip.nextDestinationIdeas.forEach((s: string) => addWrappedText(`• ${s}`, 10, 'normal', [80, 80, 80]));
                }
                yPosition += 5;
            }

            addPageFooter(doc.getNumberOfPages());
        }

        if (!isPreview) {
            doc.addPage();
            yPosition = 30;

            if (c?.bonus) {
                addPageHeader("Bonus Resources");

                if (c.bonus.googleMapsLink) {
                    addWrappedText("GOOGLE MAPS MASTER LIST", 12, 'bold', colorPrimary);
                    addWrappedText(c.bonus.googleMapsLink, 10, 'normal', [80, 80, 80]);
                    yPosition += 8;
                }

                if (c.bonus.commonMistakes) {
                    addWrappedText("COMMON MISTAKES", 12, 'bold', colorPrimary);
                    addWrappedText(c.bonus.commonMistakes, 10, 'normal', [80, 80, 80]);
                    yPosition += 8;
                }

                if (c.bonus.externalLinks?.length > 0) {
                    addWrappedText("HELPFUL EXTERNAL LINKS", 12, 'bold', colorPrimary);
                    c.bonus.externalLinks.forEach((link: any) => {
                        addWrappedText(`${link.label}: ${link.url}`, 10, 'normal', [80, 80, 80]);
                    });
                    yPosition += 8;
                }

                addPageFooter(doc.getNumberOfPages());
                doc.addPage();
                yPosition = 30;
            }

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

                const addCoord = async (locationStr?: string, locationCoords?: any) => {
                    if (locationCoords && Array.isArray(locationCoords) && locationCoords.length === 2 && typeof locationCoords[0] === 'number') {
                        coords.push([locationCoords[0], locationCoords[1]]);
                    } else if (locationStr && typeof locationStr === 'string' && locationStr.trim().length > 0) {
                        try {
                            const res = await fetch('/api/geocode', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ location: locationStr })
                            });
                            if (res.ok) {
                                const geoData = await res.json();
                                if (geoData.success && geoData.coordinates) {
                                    coords.push(geoData.coordinates);
                                }
                            }
                        } catch (e) {
                            console.error("Geocoding failed for", locationStr);
                        }
                    }
                };

                if (itineraryData.content?.accommodation?.hotelRecommendations) {
                    for (const hotel of itineraryData.content.accommodation.hotelRecommendations) {
                        await addCoord(hotel.neighborhood, hotel.locationCoordinates);
                        await addCoord(hotel.name, hotel.locationCoordinates);
                    }
                }

                if (itineraryData.content?.dailyItinerary) {
                    for (const day of itineraryData.content.dailyItinerary) {
                        await addCoord(day.morning?.location, day.morning?.locationCoordinates);
                        await addCoord(day.afternoon?.location, day.afternoon?.locationCoordinates);
                        await addCoord(day.evening?.location, day.evening?.locationCoordinates);
                    }
                }

                // Handle content.days (Schema v2)
                if (itineraryData.content?.days) {
                    for (const day of itineraryData.content.days) {
                        if (day.locationCoordinates && Array.isArray(day.locationCoordinates)) {
                            day.locationCoordinates.forEach((coord: any) => {
                                const lng = typeof coord.longitude === 'number' ? coord.longitude : coord[0];
                                const lat = typeof coord.latitude === 'number' ? coord.latitude : coord[1];
                                if (typeof lng === 'number' && typeof lat === 'number') {
                                    coords.push([lng, lat]);
                                }
                            });
                        }
                    }
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
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return false;
    }
};
