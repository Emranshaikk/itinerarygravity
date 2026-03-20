"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Eye, ChevronRight } from "lucide-react";
import { ItineraryContent, initialItineraryContent } from "@/types/itinerary";
import BuilderStepper from "@/components/itinerary-builder/BuilderStepper";
import { ALL_SECTIONS } from "@/lib/itinerary-sections";

const ItineraryCover = lazy(() => import("@/components/itinerary-builder/ItineraryCover"));
const PreTripSection = lazy(() => import("@/components/itinerary-builder/PreTripSection"));
const LogisticsSection = lazy(() => import("@/components/itinerary-builder/LogisticsSection"));
const DailyItineraryBuilder = lazy(() => import("@/components/itinerary-builder/DailyItineraryBuilder"));
const TransportSection = lazy(() => import("@/components/itinerary-builder/TransportSection"));
const SecretsSection = lazy(() => import("@/components/itinerary-builder/SecretsSection"));
const BonusSection = lazy(() => import("@/components/itinerary-builder/BonusSection"));
const FoodSection = lazy(() => import("@/components/itinerary-builder/FoodSection"));
const SafetySection = lazy(() => import("@/components/itinerary-builder/SafetySection"));
const ArrivalSection = lazy(() => import("@/components/itinerary-builder/ArrivalSection"));
const ShoppingSection = lazy(() => import("@/components/itinerary-builder/ShoppingSection"));
const CustomizationSection = lazy(() => import("@/components/itinerary-builder/CustomizationSection"));
const EmergencySection = lazy(() => import("@/components/itinerary-builder/EmergencySection"));
const DepartureSection = lazy(() => import("@/components/itinerary-builder/DepartureSection"));
const PostTripSection = lazy(() => import("@/components/itinerary-builder/PostTripSection"));
const ProofSection = lazy(() => import("@/components/itinerary-builder/ProofSection"));
const AffiliateSection = lazy(() => import("@/components/itinerary-builder/AffiliateSection"));
const CreatorStoreSection = lazy(() => import("@/components/itinerary-builder/CreatorStoreSection"));
const AccommodationSection = lazy(() => import("@/components/itinerary-builder/AccommodationSection"));
const CostBreakdownSection = lazy(() => import("@/components/itinerary-builder/CostBreakdownSection"));
const MistakesSection = lazy(() => import("@/components/itinerary-builder/MistakesSection"));
const ReviewSection = lazy(() => import("@/components/itinerary-builder/ReviewSection"));
const FinalNoteSection = lazy(() => import("@/components/itinerary-builder/FinalNoteSection"));

const SectionLoader = () => <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--gray-400)' }}>Loading section...</div>;

const checkSectionCompletion = (step: number, content: ItineraryContent) => {
    switch (step) {
        case 1: return !!content.cover?.title && !!content.cover?.destination;
        case 2: return (content.preTrip?.packingList?.length ?? 0) > 0 || !!content.preTrip?.flightGuide?.arrivalDepartureStats;
        case 3: return !!content.logistics?.currency?.code && (content.logistics?.apps?.length ?? 0) > 0;
        case 4: return !!content.arrival?.airportToCity;
        case 5: return (content.dailyItinerary ?? []).some(d => !!d?.title && !!d?.morning?.activity);
        case 6: return (content.food?.mustTryDishes?.length ?? 0) > 0 || (content.food?.restaurantRecommendations?.length ?? 0) > 0;
        case 7: return (content.transport?.modes?.length ?? 0) > 0;
        case 8: return (content.secrets?.places?.length ?? 0) > 0;
        case 9: return (content.safety?.commonScams?.length ?? 0) > 0 || (content.safety?.safetyTips?.length ?? 0) > 0;
        case 10: return !!content.customization?.coupleTips || !!content.customization?.familyTips;
        case 11: return (content.safety?.emergencyNumbers?.length ?? 0) > 0;
        case 12: return (content.shopping?.whatToBuy?.length ?? 0) > 0 || (content.shopping?.bestMarkets?.length ?? 0) > 0;
        case 13: return !!content.departure?.checkoutTips;
        case 14: return !!content.postTrip?.jetLagRecovery || (content.postTrip?.nextDestinationIdeas?.length ?? 0) > 0;
        case 15: return !!content.bonus?.googleMapsLink || (content.bonus?.externalLinks?.length ?? 0) > 0;
        case 16: return (content.proofOfVisit?.images?.length ?? 0) > 0;
        case 17: return (content.affiliateProducts?.length ?? 0) > 0;
        case 18: return (content.creatorProducts?.length ?? 0) > 0;
        case 19: return (content.accommodation?.bestNeighborhoods?.length ?? 0) > 0 || (content.accommodation?.hotelRecommendations?.length ?? 0) > 0;
        case 20: return !!content.costBreakdown?.totalSpent;
        case 21: return !!content.mistakes?.biggestMistake;
        case 22: return !!content.review?.recommendOverall;
        case 23: return !!content.finalNote;
        default: return false;
    }
};

export default function EditItineraryPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;

    // Read step from URL if transitioning from /create page, else default to 1
    const initialStep = parseInt(searchParams.get('step') || '1', 10);

    const [activeStep, setActiveStep] = useState(initialStep);
    const [content, setContent] = useState<ItineraryContent>(initialItineraryContent);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchItinerary();
    }, [id]);

    const fetchItinerary = async () => {
        try {
            const res = await fetch(`/api/itineraries/${id}`);
            if (res.ok) {
                const data = await res.json();
                if (data.content) {
                    // Deep merge defaults with DB content to prevent any component from
                    // crashing due to undefined sections stripped by older mongoose saves
                    setContent((prev) => {
                        const merged = { ...prev };
                        for (const key in prev) {
                            if (data.content[key] !== undefined) {
                                // If the property is an array (like dailyItinerary), replace it
                                // entirely. Deep merging an array with an object spread converts it into an object!
                                if (Array.isArray(prev[key as keyof ItineraryContent])) {
                                    const val = data.content[key];
                                    if (val && typeof val === 'object' && !Array.isArray(val)) {
                                        // Recover from previous bad saves where arrays were saved as { "0": {...} }
                                        merged[key as keyof ItineraryContent] = Object.values(val) as any;
                                    } else {
                                        merged[key as keyof ItineraryContent] = (Array.isArray(val) ? val : []) as any;
                                    }
                                } else {
                                    // Otherwise it's a section object (like cover, preTrip), so safe to merge
                                    merged[key as keyof ItineraryContent] = {
                                        ...(prev[key as keyof ItineraryContent] as object),
                                        ...(data.content[key] as object)
                                    } as any;
                                }
                            }
                        }
                        return merged;
                    });
                }
            } else {
                console.error("Failed to fetch itinerary");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getCompletedSteps = () => {
        const steps: number[] = [];
        for (let i = 1; i <= 23; i++) {
            if (checkSectionCompletion(i, content)) steps.push(i);
        }
        return steps;
    };

    const handleSave = async (isFinish: boolean = false) => {
        if (!content.cover.title?.trim() || !content.cover.destination?.trim()) {
            alert("Please fill out the Itinerary Title and Destination in the Cover section before saving.");
            setActiveStep(1); // Jump back to step 1
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                title: content.cover.title,
                location: content.cover.destination,
                price: content.cover.price || 0,
                currency: content.cover.currency || "USD",
                description: `A ${content.cover.tripType} trip to ${content.cover.destination} for ${content.cover.duration}.`,
                duration: content.cover.duration,
                seo_title: content.cover.seoTitle,
                seo_description: content.cover.seoDescription,
                content: content,
            };

            const response = await fetch(`/api/itineraries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert(isFinish ? "Itinerary published successfully!" : "Saved successfully!");
                if (isFinish) router.push('/dashboard/influencer');
            } else {
                const error = await response.text();
                throw new Error(error || "Failed to update itinerary");
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
            case 1: return <ItineraryCover data={content.cover} onChange={(d) => setContent({ ...content, cover: d })} />;
            case 2: return <PreTripSection data={content.preTrip} onChange={(d) => setContent({ ...content, preTrip: d })} />;
            case 3: return <LogisticsSection data={content.logistics} onChange={(d) => setContent({ ...content, logistics: d })} currency={content.cover.currency} />;
            case 4: return <ArrivalSection data={content.arrival} onChange={(d) => setContent({ ...content, arrival: d })} />;
            case 5: return <DailyItineraryBuilder data={content.dailyItinerary} onChange={(d) => setContent({ ...content, dailyItinerary: d })} />;
            case 6: return <FoodSection data={content.food} onChange={(d) => setContent({ ...content, food: d })} />;
            case 7: return <TransportSection data={content.transport} onChange={(d) => setContent({ ...content, transport: d })} currency={content.cover.currency} />;
            case 8: return <SecretsSection data={content.secrets} onChange={(d) => setContent({ ...content, secrets: d })} />;
            case 9: return <SafetySection data={content.safety} onChange={(d) => setContent({ ...content, safety: d })} />;
            case 10: return <CustomizationSection data={content.customization} onChange={(d) => setContent({ ...content, customization: d })} />;
            case 11: return <EmergencySection data={content.safety} onChange={(d) => setContent({ ...content, safety: d })} />;
            case 12: return <ShoppingSection data={content.shopping} onChange={(d) => setContent({ ...content, shopping: d })} />;
            case 13: return <DepartureSection data={content.departure} onChange={(d) => setContent({ ...content, departure: d })} />;
            case 14: return <PostTripSection data={content.postTrip} onChange={(d) => setContent({ ...content, postTrip: d })} />;
            case 15: return <BonusSection data={content.bonus} onChange={(d) => setContent({ ...content, bonus: d })} />;
            case 16: return <ProofSection data={content.proofOfVisit} onChange={(d) => setContent({ ...content, proofOfVisit: d })} />;
            case 17:
                return <AffiliateSection data={content.affiliateProducts || []} onChange={(d: any[]) => setContent({ ...content, affiliateProducts: d })} />;
            case 18:
                return <CreatorStoreSection data={content.creatorProducts || []} onChange={(d: any[]) => setContent({ ...content, creatorProducts: d })} />;
            case 19:
                return <AccommodationSection data={content.accommodation!} onChange={(d) => setContent({ ...content, accommodation: d })} />;
            case 20:
                return <CostBreakdownSection data={content.costBreakdown} onChange={(d) => setContent({ ...content, costBreakdown: d })} />;
            case 21:
                return <MistakesSection data={content.mistakes} onChange={(d) => setContent({ ...content, mistakes: d })} />;
            case 22:
                return <ReviewSection data={content.review} onChange={(d) => setContent({ ...content, review: d })} />;
            case 23:
                return <FinalNoteSection data={content.finalNote || ""} onChange={(d) => setContent({ ...content, finalNote: d })} />;
            default: return <ItineraryCover data={content.cover} onChange={(d) => setContent({ ...content, cover: d })} />;
        }
    };

    if (!mounted || loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
            <div className="text-gradient" style={{ fontWeight: 800 }}>Loading Itinerary Data...</div>
        </div>;
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
                            <ArrowLeft size={16} /> Back to Dashboard
                        </button>
                        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em', fontStyle: 'italic', margin: 0 }}>Edit Itinerary</h1>
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: '900px', margin: '2rem auto 0' }}>
                <BuilderStepper
                    activeStep={activeStep}
                    onStepChange={setActiveStep}
                    completedSteps={getCompletedSteps()}
                />

                <div className="card glass" style={{ minHeight: '60vh', marginTop: '2rem' }}>
                    <Suspense fallback={<SectionLoader />}>
                        {renderSection()}
                    </Suspense>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                    {ALL_SECTIONS.findIndex(s => s.id === activeStep) > 0 && (
                        <button
                            className="btn btn-outline"
                            style={{ minWidth: '140px', padding: '1rem 2rem', borderRadius: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                            onClick={() => {
                                const currentIndex = ALL_SECTIONS.findIndex(s => s.id === activeStep);
                                if (currentIndex > 0) {
                                    setActiveStep(ALL_SECTIONS[currentIndex - 1].id);
                                }
                            }}
                        >
                            <ChevronRight size={20} style={{ marginRight: '0.5rem', transform: 'rotate(180deg)' }} />
                            Back
                        </button>
                    )}

                    <button
                        onClick={() => handleSave(false)}
                        disabled={isSaving}
                        className="btn btn-outline"
                        style={{ minWidth: '140px', padding: '1rem 2rem', borderRadius: '1.5rem', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        <Save size={20} style={{ marginRight: '0.5rem' }} />
                        {isSaving ? "Updating..." : "Update & Save"}
                    </button>

                    <button
                        className="btn btn-primary"
                        style={{ minWidth: '140px', padding: '1rem 2rem', borderRadius: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => {
                            const currentIndex = ALL_SECTIONS.findIndex(s => s.id === activeStep);
                            if (currentIndex < ALL_SECTIONS.length - 1) {
                                setActiveStep(ALL_SECTIONS[currentIndex + 1].id);
                            }
                            else handleSave(true);
                        }}
                    >
                        {ALL_SECTIONS.findIndex(s => s.id === activeStep) === ALL_SECTIONS.length - 1 ? "Finish" : "Next"}
                        {ALL_SECTIONS.findIndex(s => s.id === activeStep) !== ALL_SECTIONS.length - 1 && <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
