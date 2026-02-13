"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, ChevronRight } from "lucide-react";
import { ItineraryContent, initialItineraryContent } from "@/types/itinerary";
import BuilderStepper from "@/components/itinerary-builder/BuilderStepper";
import ItineraryCover from "@/components/itinerary-builder/ItineraryCover";
import PreTripSection from "@/components/itinerary-builder/PreTripSection";
import LogisticsSection from "@/components/itinerary-builder/LogisticsSection";
import DailyItineraryBuilder from "@/components/itinerary-builder/DailyItineraryBuilder";
import PlaceholderSection from "@/components/itinerary-builder/PlaceholderSection";
import TransportSection from "@/components/itinerary-builder/TransportSection";
import SecretsSection from "@/components/itinerary-builder/SecretsSection";
import BonusSection from "@/components/itinerary-builder/BonusSection";
import FoodSection from "@/components/itinerary-builder/FoodSection";
import SafetySection from "@/components/itinerary-builder/SafetySection";
import ArrivalSection from "@/components/itinerary-builder/ArrivalSection";
import ShoppingSection from "@/components/itinerary-builder/ShoppingSection";
import CustomizationSection from "@/components/itinerary-builder/CustomizationSection";
import EmergencySection from "@/components/itinerary-builder/EmergencySection";
import DepartureSection from "@/components/itinerary-builder/DepartureSection";
import PostTripSection from "@/components/itinerary-builder/PostTripSection";
import ProofSection from "@/components/itinerary-builder/ProofSection";
import AffiliateSection from "@/components/itinerary-builder/AffiliateSection";

// To make percentage more alive, we check more fields
const checkSectionCompletion = (step: number, content: ItineraryContent) => {
    switch (step) {
        case 1: return !!content.cover.title && !!content.cover.destination;
        case 2: return content.preTrip.packingList.length > 0 || !!content.preTrip.flightGuide.arrivalDepartureStats;
        case 3: return !!content.logistics.currency.code && content.logistics.apps.length > 0;
        case 4: return !!content.arrival.airportToCity;
        case 5: return content.dailyItinerary.some(d => !!d.title && !!d.morning.activity);
        case 6: return content.food.mustTryDishes.length > 0 || content.food.restaurantRecommendations.length > 0;
        case 7: return content.transport.modes.length > 0;
        case 8: return content.secrets.places.length > 0;
        case 9: return content.safety.commonScams.length > 0 || content.safety.safetyTips.length > 0;
        case 10: return !!content.customization.coupleTips || !!content.customization.familyTips;
        case 11: return content.safety.emergencyNumbers.length > 0;
        case 12: return content.shopping.whatToBuy.length > 0 || content.shopping.bestMarkets.length > 0;
        case 13: return !!content.departure.checkoutTips;
        case 14: return !!content.postTrip.jetLagRecovery || (content.postTrip.nextDestinationIdeas?.length ?? 0) > 0;
        case 15: return !!content.bonus.googleMapsLink || content.bonus.externalLinks.length > 0;
        case 16: return content.proofOfVisit.images.length > 0;
        case 17: return (content.affiliateProducts?.length ?? 0) > 0;
        default: return false;
    }
};

export default function CreateItineraryPage() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(1);
    const [content, setContent] = useState<ItineraryContent>(initialItineraryContent);
    const [isSaving, setIsSaving] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getCompletedSteps = () => {
        const steps: number[] = [];
        for (let i = 1; i <= 17; i++) {
            if (checkSectionCompletion(i, content)) steps.push(i);
        }
        return steps;
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                title: content.cover.title,
                location: content.cover.destination,
                price: content.cover.price || 0,
                currency: content.cover.currency || "USD",
                description: `A ${content.cover.tripType} trip to ${content.cover.destination} for ${content.cover.duration}.`,
                duration: content.cover.duration,
                content: content,
            };

            const response = await fetch('/api/itineraries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                router.push("/dashboard/influencer");
            } else {
                const error = await response.text();
                throw new Error(error || "Failed to save itinerary");
            }
        } catch (error: any) {
            console.error(error);
            alert("Error: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const renderSection = () => {
        switch (activeStep) {
            case 1:
                return <ItineraryCover data={content.cover} onChange={(d) => setContent({ ...content, cover: d })} />;
            case 2:
                return <PreTripSection data={content.preTrip} onChange={(d) => setContent({ ...content, preTrip: d })} />;
            case 3:
                return <LogisticsSection data={content.logistics} onChange={(d) => setContent({ ...content, logistics: d })} />;
            case 4:
                return <ArrivalSection data={content.arrival} onChange={(d) => setContent({ ...content, arrival: d })} />;
            case 5:
                return <DailyItineraryBuilder data={content.dailyItinerary} onChange={(d) => setContent({ ...content, dailyItinerary: d })} />;
            case 6:
                return <FoodSection data={content.food} onChange={(d) => setContent({ ...content, food: d })} />;
            case 7:
                return <TransportSection data={content.transport} onChange={(d) => setContent({ ...content, transport: d })} />;
            case 8:
                return <SecretsSection data={content.secrets} onChange={(d) => setContent({ ...content, secrets: d })} />;
            case 9:
                return <SafetySection data={content.safety} onChange={(d) => setContent({ ...content, safety: d })} />;
            case 10:
                return <CustomizationSection data={content.customization} onChange={(d) => setContent({ ...content, customization: d })} />;
            case 11:
                return <EmergencySection data={content.safety} onChange={(d) => setContent({ ...content, safety: d })} />;
            case 12:
                return <ShoppingSection data={content.shopping} onChange={(d) => setContent({ ...content, shopping: d })} />;
            case 13:
                return <DepartureSection data={content.departure} onChange={(d) => setContent({ ...content, departure: d })} />;
            case 14:
                return <PostTripSection data={content.postTrip} onChange={(d) => setContent({ ...content, postTrip: d })} />;
            case 15:
                return <BonusSection data={content.bonus} onChange={(d) => setContent({ ...content, bonus: d })} />;
            case 16:
                return <ProofSection data={content.proofOfVisit} onChange={(d) => setContent({ ...content, proofOfVisit: d })} />;
            case 17:
                return <AffiliateSection data={content.affiliateProducts || []} onChange={(d: any[]) => setContent({ ...content, affiliateProducts: d })} />;
            default:
                return <ItineraryCover data={content.cover} onChange={(d) => setContent({ ...content, cover: d })} />;
        }
    };

    if (!mounted) {
        return <div style={{ minHeight: '100vh', backgroundColor: '#fafaf9' }} />;
    }

    return (
        <div suppressHydrationWarning style={{ minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--foreground)', paddingBottom: '6rem', paddingLeft: '1rem', paddingRight: '1rem', fontFamily: 'sans-serif' }}>
            <header className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '2rem', paddingBottom: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <button
                            onClick={() => router.back()}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '0.5rem', fontSize: '0.875rem' }}
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em', fontStyle: 'italic', margin: 0 }}>Plan Your Trip</h1>
                    </div>
                    <button className="btn btn-outline" style={{ borderRadius: '0.75rem', padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
                        <Eye size={16} style={{ marginRight: '0.5rem' }} /> Preview
                    </button>
                </div>
            </header>

            <div style={{ maxWidth: '900px', margin: '2rem auto 0' }}>
                <BuilderStepper
                    activeStep={activeStep}
                    onStepChange={setActiveStep}
                    completedSteps={getCompletedSteps()}
                />

                <div className="card glass" style={{ minHeight: '60vh', marginTop: '2rem' }}>
                    {renderSection()}
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                    {activeStep > 1 && (
                        <button
                            className="btn btn-outline"
                            style={{ minWidth: '140px', padding: '1rem 2rem', borderRadius: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                        >
                            <ChevronRight size={20} style={{ marginRight: '0.5rem', transform: 'rotate(180deg)' }} />
                            Back
                        </button>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn btn-outline"
                        style={{ minWidth: '140px', padding: '1rem 2rem', borderRadius: '1.5rem', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        <Save size={20} style={{ marginRight: '0.5rem' }} />
                        {isSaving ? "Saving..." : "Save"}
                    </button>

                    <button
                        className="btn btn-primary"
                        style={{ minWidth: '140px', padding: '1rem 2rem', borderRadius: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => {
                            if (activeStep < 17) {
                                setActiveStep(prev => prev + 1);
                            }
                            else handleSave();
                        }}
                    >
                        {activeStep === 17 ? "Finish" : "Next"}
                        {activeStep !== 17 && <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
