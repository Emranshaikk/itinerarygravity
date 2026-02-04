"use client";

import { useState } from "react";
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
        default: return false;
    }
};

export default function CreateItineraryPage() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(1);
    const [content, setContent] = useState<ItineraryContent>(initialItineraryContent);
    const [isSaving, setIsSaving] = useState(false);

    const getCompletedSteps = () => {
        const steps: number[] = [];
        for (let i = 1; i <= 15; i++) {
            if (checkSectionCompletion(i, content)) steps.push(i);
        }
        return steps;
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Map the complex content to the DB schema
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
                // alert("Itinerary Saved Successfully!"); // Use toast if available
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
            default:
                return <ItineraryCover data={content.cover} onChange={(d) => setContent({ ...content, cover: d })} />;
        }
    };

    return (
        <div className="container mx-auto max-w-7xl pb-24 px-4 sm:px-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2"
                    >
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gradient">Itinerary Builder</h1>
                    <p className="text-gray-400 text-sm">Create a premium guide that sells.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn btn-outline gap-2 hidden sm:flex">
                        <Eye size={18} /> Preview
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn btn-primary gap-2"
                    >
                        <Save size={18} />
                        {isSaving ? "Saving..." : "Save Itinerary"}
                    </button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto">
                <BuilderStepper
                    activeStep={activeStep}
                    onStepChange={setActiveStep}
                    completedSteps={getCompletedSteps()}
                />

                <div className="min-h-[60vh] glass rounded-3xl p-6 md:p-10 border border-white/10 relative overflow-hidden shadow-2xl">
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

                    {renderSection()}
                </div>

                <div className="mt-8 flex justify-between items-center px-4">
                    <button
                        className={`btn btn-ghost hover:bg-white/5 text-gray-400 hover:text-white transition-all ${activeStep === 1 ? 'invisible' : ''}`}
                        onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        <span className="hidden sm:inline">Previous Section</span>
                        <span className="sm:hidden">Back</span>
                    </button>

                    <div className="flex items-center gap-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${Math.ceil(activeStep / 5) === i ? 'w-8 bg-blue-500' : 'w-2 bg-white/10'}`} />
                        ))}
                    </div>

                    <button
                        className="btn btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 border-none px-8 py-6 h-auto text-lg hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all"
                        onClick={() => {
                            if (activeStep < 15) setActiveStep(prev => prev + 1);
                            else handleSave();
                        }}
                    >
                        {activeStep === 15 ? "Complete & Save" : "Next Section"}
                        {activeStep !== 15 && <ChevronRight size={20} className="ml-2" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
