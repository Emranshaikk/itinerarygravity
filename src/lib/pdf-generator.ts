import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
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
        const c = itineraryData.content;

        // --- LUXURY DESIGN TOKENS ---
        const colors = {
            black: [0, 0, 0] as [number, number, number],
            white: [255, 255, 255] as [number, number, number],
            beige: [248, 245, 240] as [number, number, number], // Soft beige
            gold: [197, 160, 82] as [number, number, number],  // Premium gold
            gray: [107, 114, 128] as [number, number, number], // Text gray
            lightGray: [243, 244, 246] as [number, number, number]
        };

        const fonts = {
            serif: "times",
            sans: "helvetica"
        };

        // --- HELPER FUNCTIONS ---

        // --- HELPER FUNCTIONS ---

        function safeText(text: any) {
            if (!text) return "";
            if (typeof text !== 'string') return String(text);
            return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "").trim();
        }

        function addPageFooter(pageNum: number) {
            doc.setFont(fonts.sans, "normal");
            doc.setFontSize(8);
            doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
            const footerText = isPreview
                ? "PREVIEW VERSION - Purchase full blueprint at ItineraryGravity.com"
                : `Luxury Blueprint by ${itineraryData.creator} | Updated 2026`;
            doc.text(footerText, margin, pageHeight - 10);
            doc.text(`${pageNum}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }

        function addPageHeader(headerText: string) {
            doc.setFont(fonts.serif, "bold");
            doc.setFontSize(10);
            doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
            doc.text(headerText.toUpperCase(), margin, margin - 5);
            doc.setDrawColor(colors.gold[0], colors.gold[1], colors.gold[2]);
            doc.setLineWidth(0.2);
            doc.line(margin, margin - 2, pageWidth - margin, margin - 2);
        }

        const colorPrimary = colors.black;
        const colorSecondary = colors.gold;

        function checkPageBreak(neededHeight: number, header?: string) {
            if (yPosition + neededHeight > pageHeight - margin - 10) {
                doc.addPage();
                yPosition = margin + 10;
                if (header) addPageHeader(header);
                addPageFooter(doc.getNumberOfPages());
                return true;
            }
            return false;
        }

        function addWrappedText(text: string, fontSize: number, style: "bold" | "normal" | "italic", color: [number, number, number], align: 'left' | 'center' = 'left') {
            doc.setFont(fonts.sans, style);
            doc.setFontSize(fontSize);
            doc.setTextColor(color[0], color[1], color[2]);
            const lines = doc.splitTextToSize(safeText(text), contentWidth);
            if (align === 'center') {
                doc.text(lines, pageWidth / 2, yPosition, { align: 'center' });
            } else {
                doc.text(lines, margin, yPosition);
            }
            yPosition += (lines.length * (fontSize * 0.5)) + 5;
        }

        function addExpertBox(title: string, content: string, type: 'TIP' | 'WARNING' | 'SECRET') {
            const boxColor = type === 'WARNING' ? [254, 242, 242] : type === 'SECRET' ? colors.beige : [240, 253, 244];
            const textColor = type === 'WARNING' ? [185, 28, 28] : type === 'SECRET' ? colors.gold : [22, 101, 52];
            
            const wrapped = doc.splitTextToSize(safeText(content), contentWidth - 20);
            const boxHeight = (wrapped.length * 5) + 20;
            
            checkPageBreak(boxHeight + 10);
            doc.setFillColor(boxColor[0], boxColor[1], boxColor[2]);
            doc.rect(margin, yPosition, contentWidth, boxHeight, 'F');
            
            doc.setFont(fonts.sans, "bold");
            doc.setFontSize(8);
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.text(title.toUpperCase(), margin + 10, yPosition + 10);
            
            doc.setFont(fonts.sans, "normal");
            doc.setFontSize(10);
            doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
            doc.text(wrapped, margin + 10, yPosition + 17);
            yPosition += boxHeight + 10;
        }

        function drawSectionTitle(title: string, subtitle?: string) {
            checkPageBreak(40);
            doc.setFont(fonts.serif, "bold");
            doc.setFontSize(24);
            doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
            doc.text(safeText(title), margin, yPosition);
            yPosition += 10;

            if (subtitle) {
                doc.setFont(fonts.sans, "normal");
                doc.setFontSize(10);
                doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
                doc.text(safeText(subtitle), margin, yPosition);
                yPosition += 8;
            }

            doc.setDrawColor(colors.gold[0], colors.gold[1], colors.gold[2]);
            doc.setLineWidth(1);
            doc.line(margin, yPosition, margin + 30, yPosition);
            yPosition += 15;
        }

        function drawCard(x: number, y: number, w: number, h: number, title: string, value: string) {
            doc.setFillColor(colors.beige[0], colors.beige[1], colors.beige[2]);
            doc.roundedRect(x, y, w, h, 3, 3, 'F');
            
            doc.setFont(fonts.sans, "bold");
            doc.setFontSize(8);
            doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
            doc.text(safeText(title.toUpperCase()), x + 5, y + 8);
            
            doc.setFont(fonts.sans, "bold");
            doc.setFontSize(11);
            doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
            const wrappedValue = doc.splitTextToSize(safeText(value), w - 10);
            doc.text(wrappedValue, x + 5, y + 15);
        }

        function calculateDistance(c1: [number, number], c2: [number, number]) {
            const R = 6371; // km
            const dLat = (c2[1] - c1[1]) * Math.PI / 180;
            const dLon = (c2[0] - c1[0]) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(c1[1] * Math.PI / 180) * Math.cos(c2[1] * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }

        function estimateTravelTime(dist: number, mode: string) {
            const speed = mode.toLowerCase().includes('walk') ? 5 : 
                          mode.toLowerCase().includes('metro') ? 30 : 20; // km/h
            const mins = (dist / speed) * 60;
            return Math.max(5, Math.round(mins));
        }

        function addLink(text: string, url: string, x: number, y: number, fontSize = 10, color = colors.gold) {
            if (!url) return;
            doc.setFontSize(fontSize);
            doc.setTextColor(color[0], color[1], color[2]);
            doc.text(text, x, y);
            
            const textWidth = doc.getTextWidth(text);
            // Add native PDF link
            doc.link(x, y - fontSize + 2, textWidth, fontSize, { url: url });
            
            // Add visible underline
            doc.setDrawColor(color[0], color[1], color[2]);
            doc.setLineWidth(0.1);
            doc.line(x, y + 1, x + textWidth, y + 1);
        }

        async function addRemoteImage(imageUrl: string, x: number, y: number, w: number, h: number) {
            if (!imageUrl) return;
            try {
                const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
                const res = await fetch(proxyUrl);
                if (res.ok) {
                    const blob = await res.blob();
                    const base64Data = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                    doc.addImage(base64Data as string, blob.type === 'image/jpeg' ? 'JPEG' : 'PNG', x, y, w, h);
                }
            } catch (e) {
                console.error("Failed to load image", imageUrl);
            }
        }

        // --- 1. COVER PAGE ---
        if (itineraryData.content?.cover?.coverImage) {
            await addRemoteImage(itineraryData.content.cover.coverImage, 0, 0, pageWidth, pageHeight * 0.6);
        }
        
        // Dark gradient overlay placeholder (rect with transparency)
        doc.setFillColor(0, 0, 0);
        doc.setGState(new (doc as any).GState({ opacity: 0.4 }));
        doc.rect(0, 0, pageWidth, pageHeight * 0.6, 'F');
        doc.setGState(new (doc as any).GState({ opacity: 1.0 }));

        yPosition = pageHeight * 0.6 + 20;

        doc.setFont(fonts.serif, "bold");
        doc.setFontSize(36);
        doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
        const titleText = `${itineraryData.duration_days || 'X'}-Day Travel Blueprint for ${itineraryData.location}`;
        const wrappedTitle = doc.splitTextToSize(safeText(titleText), contentWidth);
        doc.text(wrappedTitle, margin, yPosition);
        yPosition += (wrappedTitle.length * 12);

        doc.setFont(fonts.sans, "normal");
        doc.setFontSize(14);
        doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
        doc.text("A Complete Done-For-You Itinerary to Save 20+ Hours", margin, yPosition);
        yPosition += 15;

        doc.setFont(fonts.sans, "bold");
        doc.setFontSize(12);
        doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
        doc.text(`BY ${itineraryData.creator.toUpperCase()}`, margin, yPosition);
        yPosition += 20;

        // Trust Badges
        doc.setFontSize(9);
        doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
        doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
        doc.roundedRect(margin, yPosition, 45, 10, 2, 2, 'D');
        doc.text("Real Experience", margin + 5, yPosition + 6.5);
        
        doc.roundedRect(margin + 55, yPosition, 45, 10, 2, 2, 'D');
        doc.text("Updated for 2026", margin + 60, yPosition + 6.5);

        addPageFooter(1);

        // --- 1.1 PRE-TRIP STRATEGY (NEW) ---
        if (c?.preTrip || c?.essentials) {
            doc.addPage();
            yPosition = margin + 10;
            drawSectionTitle("Pre-Trip Strategy", "Everything you need to do before you fly.");

            if (c.preTrip?.flightGuide) {
                const fg = c.preTrip.flightGuide;
                doc.setFont(fonts.sans, "bold");
                doc.setFontSize(12);
                doc.text("✈️ FLIGHT GUIDE", margin, yPosition);
                yPosition += 8;
                doc.setFont(fonts.sans, "normal");
                doc.setFontSize(10);
                const flightInfo = `Best Airports: ${fg.bestAirports?.join(", ") || "Main City Airport"}\nTiming: ${fg.arrivalDepartureStats || "Check local flights"}\nTip: ${fg.timingInsight || "Arrive early"}`;
                const wrappedFG = doc.splitTextToSize(safeText(flightInfo), contentWidth);
                doc.text(wrappedFG, margin + 5, yPosition);
                yPosition += (wrappedFG.length * 5) + 10;
            }

            if (c.preTrip?.packingList?.length > 0) {
                doc.setFont(fonts.sans, "bold");
                doc.setFontSize(12);
                doc.text("🎒 PACKING ESSENTIALS", margin, yPosition);
                yPosition += 8;
                c.preTrip.packingList.forEach((cat: any) => {
                    checkPageBreak(20);
                    doc.setFont(fonts.sans, "bold");
                    doc.setFontSize(10);
                    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
                    doc.text(safeText(cat.category), margin + 5, yPosition);
                    yPosition += 5;
                    doc.setFont(fonts.sans, "normal");
                    doc.setFontSize(9);
                    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                    doc.text(`• ${cat.items?.join(", ") || "General gear"}`, margin + 10, yPosition);
                    yPosition += 7;
                });
                yPosition += 5;
            }

            if (c.preTrip?.essentials) {
                const ess = c.preTrip.essentials;
                doc.setFont(fonts.sans, "bold");
                doc.setFontSize(12);
                doc.text("📋 MANDATORY DOCUMENTS", margin, yPosition);
                yPosition += 8;
                doc.setFont(fonts.sans, "normal");
                doc.setFontSize(10);
                const essText = `Docs: ${ess.documents?.join(", ") || "Passport, Visa"}\nInsurance: ${ess.insurance || "Travel Insurance Recommended"}\nHealth: ${ess.health?.join(", ") || "Standard vaccines"}`;
                const wrappedEss = doc.splitTextToSize(safeText(essText), contentWidth);
                doc.text(wrappedEss, margin + 5, yPosition);
                yPosition += (wrappedEss.length * 5) + 15;
            }

            addPageFooter(doc.getNumberOfPages());
        }

        // --- 2. TRIP SNAPSHOT ---
        doc.addPage();
        yPosition = margin + 10;
        drawSectionTitle("Trip Snapshot", "The essential blueprint of your journey.");

        const cardWidth = (contentWidth - 10) / 3;
        const row1Y = yPosition;
        drawCard(margin, row1Y, cardWidth, 25, "Duration", itineraryData.duration || `${itineraryData.duration_days} Days`);
        drawCard(margin + cardWidth + 5, row1Y, cardWidth, 25, "Budget", itineraryData.content?.costBreakdown?.total || "Custom");
        drawCard(margin + (cardWidth + 5) * 2, row1Y, cardWidth, 25, "Best Time", itineraryData.bestTimeToVisit || "Seasonal");
        
        yPosition += 35;
        const row2Y = yPosition;
        drawCard(margin, row2Y, cardWidth, 25, "Trip Type", itineraryData.idealFor || "Leisure");
        drawCard(margin + cardWidth + 5, row2Y, cardWidth, 25, "Ideal For", "Travel Enthusiasts");
        drawCard(margin + (cardWidth + 5) * 2, row2Y, cardWidth, 25, "Vibe", "Luxury & Adventure");

        yPosition += 45;

        // Perfect For / Avoid Section
        const splitWidth = (contentWidth - 10) / 2;
        
        doc.setFont(fonts.serif, "bold");
        doc.setFontSize(14);
        doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
        doc.text("Who This Trip Is Perfect For", margin, yPosition);
        doc.text("Who Should Avoid This Trip", margin + splitWidth + 10, yPosition);
        
        yPosition += 8;
        doc.setFont(fonts.sans, "normal");
        doc.setFontSize(10);
        doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
        
        const perfectText = itineraryData.content?.cover?.idealFor || "Travelers looking for a blend of luxury and authentic local culture, with a pre-planned efficient route.";
        const avoidText = itineraryData.content?.cover?.avoidReason || "Those who prefer entirely spontaneous travel without any fixed schedule or pre-booked experiences.";
        
        const wrappedPerfect = doc.splitTextToSize(safeText(perfectText), splitWidth);
        const wrappedAvoid = doc.splitTextToSize(safeText(avoidText), splitWidth);
        
        doc.text(wrappedPerfect, margin, yPosition);
        doc.text(wrappedAvoid, margin + splitWidth + 10, yPosition);
        
        yPosition += Math.max(wrappedPerfect.length, wrappedAvoid.length) * 5 + 20;

        addPageFooter(doc.getNumberOfPages());

        if (isPreview) {
            // Save Preview PDF
            const filename = `${itineraryData.title ? itineraryData.title.replace(/[^a-z0-9]/gi, '_') : 'itinerary'}_preview.pdf`;

            const pdfBlob = doc.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 100);

            return true;
        }

        // --- NEW SECTION: COST BREAKDOWN ---
        if (!isPreview && itineraryData.content?.costBreakdown) {
            const cb = itineraryData.content.costBreakdown;
            checkPageBreak(100, "Real Cost Breakdown");
            doc.addPage();
            yPosition = 30;
            addPageHeader("Real Cost Breakdown");
            
            addWrappedText("THE REAL COST OF THIS TRIP", 16, 'bold', [16, 185, 129]); // Green
            addWrappedText("Based on my personal spending during this exact trip.", 10, 'italic', [100, 100, 100]);
            yPosition += 10;

            doc.setFillColor(240, 253, 244); // Light green bg
            doc.rect(margin, yPosition, contentWidth, 25, 'F');
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(5, 150, 105);
            doc.text(`TOTAL SPENT: ${itineraryData.currency || '$'}${cb.totalSpent}`, margin + 10, yPosition + 15);
            yPosition += 35;

            const costItems = [
                ["Flights", cb.flights],
                ["Stay", cb.stay],
                ["Food", cb.food],
                ["Transport", cb.transport],
                ["Activities", cb.activities]
            ];

            costItems.forEach(([label, val]) => {
                doc.setFontSize(11);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(50, 50, 50);
                doc.text(`${label}:`, margin + 10, yPosition);
                doc.setFont("helvetica", "normal");
                doc.text(`${itineraryData.currency || '$'}${val}`, margin + 60, yPosition);
                yPosition += 8;
            });

            if (cb.overspentComment) {
                yPosition += 5;
                addExpertBox("WHERE I OVERSPENT", cb.overspentComment, "WARNING");
            }
            if (cb.savedMoneyComment) {
                addExpertBox("WHERE I SAVED", cb.savedMoneyComment, "TIP");
            }
            if (cb.optimizationTips) {
                addExpertBox("COST OPTIMIZATION TIPS", cb.optimizationTips, "SECRET");
            }
            
            addPageFooter(doc.getNumberOfPages());
        }

        // --- 3. THE BOOKING BLUEPRINT (AFFILIATE LINKS) ---
        if (!isPreview) {
            doc.addPage();
            yPosition = margin + 10;
            drawSectionTitle("The Booking Blueprint", "One-click access to all my trusted recommendations.");

            // 1. Accommodation
            if (c?.accommodation?.hotelRecommendations?.length > 0) {
                doc.setFont(fonts.sans, "bold");
                doc.setFontSize(12);
                doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                doc.text("HOTEL & STAYS", margin, yPosition);
                yPosition += 10;

                c.accommodation.hotelRecommendations.forEach((hotel: any) => {
                    checkPageBreak(30);
                    doc.setFont(fonts.sans, "bold");
                    doc.setFontSize(10);
                    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                    doc.text(safeText(hotel.name), margin + 5, yPosition);
                    
                    if (hotel.bookingLink) {
                        addLink("Book this Stay", hotel.bookingLink, margin + contentWidth - 30, yPosition, 9);
                    }
                    yPosition += 5;
                    doc.setFont(fonts.sans, "normal");
                    doc.setFontSize(9);
                    doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
                    doc.text(safeText(hotel.neighborhood || "Premium Location"), margin + 5, yPosition);
                    yPosition += 5;
                    const wrappedWhy = doc.splitTextToSize(`"Why I love it: ${safeText(hotel.whyWeLoveIt)}"`, contentWidth - 10);
                    doc.text(wrappedWhy, margin + 5, yPosition);
                    yPosition += (wrappedWhy.length * 5) + 8;
                });
            }

            // 2. Affiliate Products
            if (c?.affiliateProducts?.length > 0) {
                checkPageBreak(50);
                yPosition += 10;
                doc.setFont(fonts.sans, "bold");
                doc.setFontSize(12);
                doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                doc.text("RECOMMENDED GEAR & PRODUCTS", margin, yPosition);
                yPosition += 10;

                c.affiliateProducts.forEach((prod: any) => {
                    checkPageBreak(15);
                    doc.setFont(fonts.sans, "normal");
                    doc.setFontSize(10);
                    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                    doc.text(`• ${safeText(prod.title)}`, margin + 5, yPosition);
                    addLink("View Product", prod.productUrl, margin + contentWidth - 30, yPosition, 9);
                    yPosition += 8;
                });
            }

            // 3. Creator Store
            if (c?.creatorProducts?.length > 0) {
                checkPageBreak(50);
                yPosition += 10;
                doc.setFont(fonts.sans, "bold");
                doc.setFontSize(12);
                doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                doc.text("MY SHOP / CREATOR PRODUCTS", margin, yPosition);
                yPosition += 10;

                c.creatorProducts.forEach((prod: any) => {
                    checkPageBreak(15);
                    doc.setFont(fonts.sans, "normal");
                    doc.setFontSize(10);
                    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                    doc.text(`• ${safeText(prod.title)}`, margin + 5, yPosition);
                    addLink("Get It Now", prod.url, margin + contentWidth - 30, yPosition, 9);
                    yPosition += 8;
                });
            }

            addPageFooter(doc.getNumberOfPages());
        }

        const days = isPreview ? itineraryData.days.slice(0, 1) : itineraryData.days;

        for (const day of days) {
            yPosition = margin + 20;
            doc.addPage();
            addPageHeader(`Day ${day.number || day.dayNumber}: ${safeText(day.title)}`);

            // --- 6.2 DAY ROUTE PLAN (NEW) ---
            checkPageBreak(150, `Day ${day.number || day.dayNumber} Navigation`);
            doc.setFont(fonts.serif, "bold");
            doc.setFontSize(20);
            doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
            doc.text(`🗺️ Day ${day.number || day.dayNumber} Route Plan`, margin, yPosition);
            yPosition += 15;

            const routePoints = [
                { name: "Start Location", loc: day.hotel || itineraryData.startingLocation, coord: null },
                { name: "Morning", loc: (typeof day.morning === 'object' ? day.morning.activity : day.morning) || day.morningPlan, coord: day.morning?.locationCoordinates },
                { name: "Afternoon", loc: (typeof day.afternoon === 'object' ? day.afternoon.activity : day.afternoon) || day.afternoonPlan, coord: day.afternoon?.locationCoordinates },
                { name: "Evening", loc: (typeof day.evening === 'object' ? day.evening.activity : day.evening) || day.eveningPlan, coord: day.evening?.locationCoordinates }
            ].filter(p => p.loc);

            // 1. Ordered Location Pins
            doc.setFont(fonts.sans, "bold");
            doc.setFontSize(10);
            doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
            doc.text("1. ORDERED LOCATION PINS", margin, yPosition);
            yPosition += 8;

            routePoints.forEach((p, idx) => {
                doc.setFont(fonts.sans, "normal");
                doc.setFontSize(10);
                doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                doc.text(`${idx + 1}. ${safeText(p.name)}: ${safeText(p.loc).substring(0, 50)}...`, margin + 5, yPosition);
                yPosition += 6;
            });
            yPosition += 10;

            // 2 & 3. Route Optimization & Segment Breakdown
            doc.setFont(fonts.sans, "bold");
            doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
            doc.text("2. SEGMENT BREAKDOWN", margin, yPosition);
            yPosition += 8;

            let totalDist = 0;
            let totalTime = 0;

            for (let i = 0; i < routePoints.length - 1; i++) {
                const start = routePoints[i];
                const end = routePoints[i+1];
                let dist = 2; // Default 2km if no coords
                if (start.coord && end.coord) {
                    const c1: [number, number] = [start.coord.longitude || start.coord[0], start.coord.latitude || start.coord[1]];
                    const c2: [number, number] = [end.coord.longitude || end.coord[0], end.coord.latitude || end.coord[1]];
                    dist = calculateDistance(c1, c2);
                }
                const mode = day.transport || "Taxi/Metro";
                const time = estimateTravelTime(dist, mode);
                totalDist += dist;
                totalTime += time;

                doc.setFont(fonts.sans, "bold");
                doc.setFontSize(9);
                doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                doc.text(`From: ${safeText(start.name)} → ${safeText(end.name)}`, margin + 5, yPosition);
                yPosition += 5;
                doc.setFont(fonts.sans, "normal");
                doc.setFontSize(8);
                doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
                doc.text(`Distance: ${dist.toFixed(1)} km | Time: ${time} mins | Mode: ${mode}`, margin + 10, yPosition);
                yPosition += 8;
                
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = margin + 20;
                }
            }
            yPosition += 5;

            // 5. Map Summary Box
            doc.setFillColor(colors.beige[0], colors.beige[1], colors.beige[2]);
            doc.rect(margin, yPosition, contentWidth, 35, 'F');
            doc.setFont(fonts.sans, "bold");
            doc.setFontSize(10);
            doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
            doc.text("MAP SUMMARY BOX", margin + 10, yPosition + 10);
            
            doc.setFont(fonts.sans, "normal");
            doc.setFontSize(9);
            doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
            doc.text(`Start: ${safeText(routePoints[0].name)} | End: ${safeText(routePoints[routePoints.length - 1].name)}`, margin + 10, yPosition + 18);
            doc.text(`Total Stops: ${routePoints.length} | Distance: ${totalDist.toFixed(1)} km | Time: ${totalTime + (routePoints.length * 45)} mins (incl. stay)`, margin + 10, yPosition + 25);
            yPosition += 50;

            const googleMapsDayUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(routePoints[0].loc)}&destination=${encodeURIComponent(routePoints[routePoints.length-1].loc)}&waypoints=${encodeURIComponent(routePoints.slice(1, -1).map(p => p.loc).join('|'))}&travelmode=driving`;
            const qrDayUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(googleMapsDayUrl)}`;
            
            try {
                await doc.addImage(qrDayUrl, 'PNG', margin + contentWidth - 40, yPosition - 85, 30, 30);
                doc.setFontSize(7);
                doc.text("Scan for Day Route", margin + contentWidth - 40, yPosition - 52);
            } catch (e) {
                console.warn("Day QR failed");
            }

            yPosition += 20;

            // --- 6.3 DAILY TIMELINE ---
            checkPageBreak(120, `Day ${day.number || day.dayNumber} Timeline`);
            doc.setFont(fonts.serif, "bold");
            doc.setFontSize(22);
            doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
            doc.text("🕒 Daily Timeline & Details", margin, yPosition);
            yPosition += 15;
            
            // Day Header (Simplified)
            doc.setFont(fonts.serif, "bold");
            doc.setFontSize(28);
            doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
            doc.text(`Day ${day.number || day.dayNumber}`, margin, yPosition);
            yPosition += 10;
            
            doc.setFont(fonts.sans, "bold");
            doc.setFontSize(16);
            doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
            const wrappedDayTitle = doc.splitTextToSize(safeText(day.title || "Exploring the unknown"), contentWidth);
            doc.text(wrappedDayTitle, margin, yPosition);
            yPosition += (wrappedDayTitle.length * 8) + 5;

            // Day Stats Bar
            doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
            doc.rect(margin, yPosition, contentWidth, 12, 'F');
            doc.setFont(fonts.sans, "bold");
            doc.setFontSize(8);
            doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
            doc.text(`TRANSPORT: ${safeText(day.transport || "Local")}`, margin + 5, yPosition + 7.5);
            doc.text(`STAY: ${safeText(day.hotel || "Same as Day 1")}`, margin + 80, yPosition + 7.5);
            
            // Check for hotel link
            const hotelName = day.hotel;
            const hotelRec = c?.accommodation?.hotelRecommendations?.find((h: any) => h.name === hotelName);
            if (hotelRec?.bookingLink) {
                addLink("Book this Hotel", hotelRec.bookingLink, margin + contentWidth - 35, yPosition + 7.5, 8, colors.gold);
            }
            
            yPosition += 22;

            // Vertical Timeline
            const timelineItems = [
                { label: "Morning", title: day.morning?.activity || day.morningPlan, time: day.morning?.time || "09:00 AM", details: day.morning },
                { label: "Afternoon", title: day.afternoon?.activity || day.afternoonPlan, time: day.afternoon?.time || "01:00 PM", details: day.afternoon },
                { label: "Evening", title: day.evening?.activity || day.eveningPlan, time: day.evening?.time || "07:00 PM", details: day.evening }
            ].filter(item => item.title);

            const timelineX = margin + 5;
            const contentX = margin + 20;

            timelineItems.forEach((item, i) => {
                // Timeline Connector
                if (i < timelineItems.length - 1) {
                    doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
                    doc.setLineWidth(1);
                    doc.line(timelineX, yPosition, timelineX, yPosition + 40);
                }

                // Timeline Dot
                doc.setFillColor(colors.gold[0], colors.gold[1], colors.gold[2]);
                doc.circle(timelineX, yPosition, 2, 'F');

                // Time Label
                doc.setFont(fonts.sans, "bold");
                doc.setFontSize(8);
                doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
                doc.text(item.time, contentX, yPosition + 1);

                // Activity Title
                doc.setFont(fonts.sans, "bold");
                doc.setFontSize(12);
                doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                const wrappedAct = doc.splitTextToSize(safeText(item.title), contentWidth - 30);
                doc.text(wrappedAct, contentX, yPosition + 7);
                yPosition += (wrappedAct.length * 6) + 4;

                // Activity Meta (Why Visit, Cost, Duration)
                if (typeof item.details === 'object' && item.details !== null) {
                    doc.setFont(fonts.sans, "normal");
                    doc.setFontSize(9);
                    doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
                    
                    const meta = [];
                    if (item.details.whyVisit) meta.push(`Why: ${item.details.whyVisit}`);
                    if (item.details.duration) meta.push(`Duration: ${item.details.duration}`);
                    if (item.details.cost) meta.push(`Cost: ${item.details.cost}`);
                    
                    const wrappedMeta = doc.splitTextToSize(safeText(meta.join(" | ")), contentWidth - 30);
                    doc.text(wrappedMeta, contentX, yPosition);
                    yPosition += (wrappedMeta.length * 5) + 3;

                    if (item.details.notes) {
                        doc.setFont(fonts.sans, "italic");
                        const wrappedNotes = doc.splitTextToSize(`"Insider Tip: ${safeText(item.details.notes)}"`, contentWidth - 30);
                        doc.text(wrappedNotes, contentX, yPosition);
                        yPosition += (wrappedNotes.length * 5) + 5;
                    }
                }
                yPosition += 10;
            });

            // Expert Insight Box for the Day
            if (day.notes || day.morning?.localSecret) {
                const insight = day.notes || day.morning?.localSecret;
                doc.setFillColor(colors.beige[0], colors.beige[1], colors.beige[2]);
                const insightLines = doc.splitTextToSize(safeText(insight), contentWidth - 20);
                const boxHeight = (insightLines.length * 5) + 20;
                
                doc.rect(margin, yPosition, contentWidth, boxHeight, 'F');
                doc.setFont(fonts.sans, "bold");
                doc.setFontSize(9);
                doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
                doc.text("EXPERT INSIGHT", margin + 10, yPosition + 10);
                
                doc.setFont(fonts.sans, "normal");
                doc.setFontSize(10);
                doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                doc.text(insightLines, margin + 10, yPosition + 18);
                yPosition += boxHeight + 15;
            }

            // Day Images (if any)
            if (day.images?.length > 0) {
                const imgHeight = 60;
                const imgWidth = (contentWidth - 5) / 2;
                for (let i = 0; i < Math.min(day.images.length, 2); i++) {
                    await addRemoteImage(day.images[i], margin + (i * (imgWidth + 5)), yPosition, imgWidth, imgHeight);
                }
                yPosition += imgHeight + 15;
            }

            addPageFooter(doc.getNumberOfPages());
        }

        // --- 7. MAPS & ROUTES ---
        doc.addPage();
        yPosition = margin + 10;
        drawSectionTitle("Maps & Routes", "Visual guides for your seamless journey.");

        const allCoords: [number, number][] = [];
        for (const d of itineraryData.days) {
            if (d.locationCoordinates) {
                d.locationCoordinates.forEach((c: any) => {
                    const lng = typeof c.longitude === 'number' ? c.longitude : c[0];
                    const lat = typeof c.latitude === 'number' ? c.latitude : c[1];
                    if (typeof lng === 'number' && typeof lat === 'number') allCoords.push([lng, lat]);
                });
            }
        }

        if (allCoords.length > 0) {
            try {
                const staticMapUrl = generateStaticMapUrl(allCoords);
                if (staticMapUrl) {
                    doc.setFillColor(colors.beige[0], colors.beige[1], colors.beige[2]);
                    doc.rect(margin, yPosition, contentWidth, 130, 'F');
                    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(staticMapUrl)}`;
                    const res = await fetch(proxyUrl);
                    if (res.ok) {
                        const blob = await res.blob();
                        const base64Data = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsDataURL(blob);
                        });
                        doc.addImage(base64Data as string, 'JPEG', margin + 5, yPosition + 5, contentWidth - 10, 120);
                        yPosition += 135;
                    }
                }
            } catch (e) {
                console.error("Map failed", e);
            }
        }

        // QR Code for Live Route
        doc.setFillColor(colors.black[0], colors.black[1], colors.black[2]);
        doc.rect(margin, yPosition, contentWidth, 30, 'F');
        doc.setFont(fonts.sans, "bold");
        doc.setFontSize(10);
        doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
        doc.text("SYNC TO GOOGLE MAPS", margin + 10, yPosition + 12);
        doc.setFont(fonts.sans, "normal");
        doc.setFontSize(8);
        doc.text("Scan to open the full interactive route on your mobile device.", margin + 10, yPosition + 20);
        
        // Placeholder for QR (Real one would use same logic as before)
        doc.setDrawColor(colors.gold[0], colors.gold[1], colors.gold[2]);
        doc.rect(pageWidth - margin - 25, yPosition + 4, 22, 22);
        yPosition += 45;

        addPageFooter(doc.getNumberOfPages());

        // --- 8. THE FOOD PLAN ---
        if (c?.food) {
            doc.addPage();
            yPosition = margin + 10;
            drawSectionTitle("The Food Plan", "Must-try flavors and handpicked dining spots.");

            if (c.food.mustTryDishes?.length > 0) {
                doc.setFont(fonts.serif, "bold");
                doc.setFontSize(16);
                doc.text("Local Delicacies", margin, yPosition);
                yPosition += 8;

                c.food.mustTryDishes.forEach((dish: any) => {
                    doc.setFont(fonts.sans, "bold");
                    doc.setFontSize(10);
                    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
                    doc.text(safeText(dish.name), margin, yPosition);
                    yPosition += 5;
                    doc.setFont(fonts.sans, "normal");
                    doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
                    const wrapped = doc.splitTextToSize(safeText(dish.description), contentWidth);
                    doc.text(wrapped, margin, yPosition);
                    yPosition += (wrapped.length * 5) + 5;
                });
            }

            if (c.food.restaurantRecommendations?.length > 0) {
                yPosition += 5;
                doc.setFont(fonts.serif, "bold");
                doc.setFontSize(16);
                doc.text("Handpicked Dining Spots", margin, yPosition);
                yPosition += 8;

                c.food.restaurantRecommendations.forEach((rest: any) => {
                    checkPageBreak(30);
                    doc.setFont(fonts.sans, "bold");
                    doc.setFontSize(11);
                    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                    doc.text(safeText(rest.name), margin + 5, yPosition);
                    doc.setFont(fonts.sans, "normal");
                    doc.setFontSize(9);
                    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
                    doc.text(`${rest.cuisine} | ${rest.priceRange}`, margin + 5, yPosition + 5);
                    yPosition += 10;
                    if (rest.bestDish) {
                        doc.setFont(fonts.sans, "italic");
                        doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
                        doc.text(`"Must Try: ${safeText(rest.bestDish)}"`, margin + 5, yPosition);
                        yPosition += 6;
                    }
                    if (rest.notes) {
                        const wrappedNotes = doc.splitTextToSize(safeText(rest.notes), contentWidth - 10);
                        doc.text(wrappedNotes, margin + 5, yPosition);
                        yPosition += (wrappedNotes.length * 5) + 5;
                    }
                    yPosition += 5;
                });
            }
            addPageFooter(doc.getNumberOfPages());
        }

        // --- 9. THE HIDDEN GEMS ---
        if (c?.secrets?.places?.length > 0) {
            doc.addPage();
            yPosition = margin + 10;
            drawSectionTitle("Hidden Gems", "Places you won't find in typical guidebooks.");

            c.secrets.places.forEach((p: any) => {
                doc.setFont(fonts.sans, "bold");
                doc.setFontSize(12);
                doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                doc.text(safeText(p.name), margin, yPosition);
                yPosition += 5;
                doc.setFont(fonts.sans, "normal");
                doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
                const wrapped = doc.splitTextToSize(safeText(p.description), contentWidth);
                doc.text(wrapped, margin, yPosition);
                yPosition += (wrapped.length * 5) + 8;
            });
            addPageFooter(doc.getNumberOfPages());
        }

        // --- 10. MISTAKES TO AVOID ---
        doc.addPage();
        yPosition = margin + 10;
        drawSectionTitle("Avoid These Mistakes", "Save money and time by learning from my experience.");

        const mistakes = [
            { t: "Biggest Mistake", v: c?.mistakes?.biggestMistake || "Not booking popular attractions at least 2 weeks in advance." },
            { t: "Massive Time Waster", v: c?.mistakes?.timeWasters || "Waiting in line for 'famous' spots that are tourist traps." },
            { t: "Money Waster", v: c?.mistakes?.moneyWasters || "Using airport currency exchange or standard taxis." }
        ];

        mistakes.forEach(m => {
            doc.setFillColor(colors.beige[0], colors.beige[1], colors.beige[2]);
            const wrapped = doc.splitTextToSize(safeText(m.v), contentWidth - 20);
            const h = (wrapped.length * 5) + 20;
            doc.rect(margin, yPosition, contentWidth, h, 'F');
            doc.setFont(fonts.sans, "bold");
            doc.setFontSize(10);
            doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
            doc.text(m.t.toUpperCase(), margin + 10, yPosition + 10);
            doc.setFont(fonts.sans, "normal");
            doc.text(wrapped, margin + 10, yPosition + 17);
            yPosition += h + 10;
        });
        addPageFooter(doc.getNumberOfPages());

        // --- 11-14. RAPID FIRE GUIDES ---
        doc.addPage();
        yPosition = margin + 10;
        drawSectionTitle("Expert Logistics", "The final details for a perfect trip.");

        const sections = [
            { title: "Transport Guide", val: c?.transport?.recommendedTransport || "Use the local metro system; it's clean, safe, and 5x cheaper than Uber." },
            { title: "Customization", val: c?.customization?.soloTips || "Stay in neighborhoods like [X] for the best community vibe." },
            { title: "Bonus Value", val: "Check the master Google Maps list in your dashboard for real-time updates." }
        ];

        sections.forEach(s => {
            doc.setFont(fonts.serif, "bold");
            doc.setFontSize(16);
            doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
            doc.text(s.title, margin, yPosition);
            yPosition += 8;
            doc.setFont(fonts.sans, "normal");
            doc.setFontSize(10);
            doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
            const wrapped = doc.splitTextToSize(safeText(s.val), contentWidth);
            doc.text(wrapped, margin, yPosition);
            yPosition += (wrapped.length * 5) + 15;
        });
        addPageFooter(doc.getNumberOfPages());

        // --- 15. FINAL PAGE ---
        doc.addPage();
        doc.setFillColor(colors.black[0], colors.black[1], colors.black[2]);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        yPosition = pageHeight / 2 - 20;
        doc.setFont(fonts.serif, "bold");
        doc.setFontSize(36);
        doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
        doc.text("Safe Travels!", pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 20;
        doc.setFont(fonts.sans, "normal");
        doc.setFontSize(12);
        doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
        doc.text(`Created by ${itineraryData.creator || "Influencer"}`, pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 10;
        doc.setFontSize(10);
        doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
        doc.text("Thank you for purchasing this luxury blueprint.", pageWidth / 2, yPosition, { align: 'center' });

        // Save PDF
        const filename = `${itineraryData.title ? itineraryData.title.replace(/[^a-z0-9]/gi, '_') : 'itinerary'}_${isPreview ? 'premium_preview' : 'premium_full'}.pdf`;
        doc.save(filename);

        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return false;
    }
};
