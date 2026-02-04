"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { ItineraryContent, initialItineraryContent } from "@/types/itinerary";
import ItinerarySidebar from "@/components/itinerary-builder/ItinerarySidebar";
import ItineraryCover from "@/components/itinerary-builder/ItineraryCover";
import PreTripSection from "@/components/itinerary-builder/PreTripSection";
import LogisticsSection from "@/components/itinerary-builder/LogisticsSection";
import DailyItineraryBuilder from "@/components/itinerary-builder/DailyItineraryBuilder";
import PlaceholderSection from "@/components/itinerary-builder/PlaceholderSection";
import MobileItineraryNav from "@/components/itinerary-builder/MobileItineraryNav";
import TransportSection from "@/components/itinerary-builder/TransportSection";
import SecretsSection from "@/components/itinerary-builder/SecretsSection";
import BonusSection from "@/components/itinerary-builder/BonusSection";
import FoodSection from "@/components/itinerary-builder/FoodSection";
import SafetySection from "@/components/itinerary-builder/SafetySection";
import ArrivalSection from "@/components/itinerary-builder/ArrivalSection";
import ShoppingSection from "@/components/itinerary-builder/ShoppingSection";

export default function CreateItineraryPage() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(1);
    const [content, setContent] = useState<ItineraryContent>(initialItineraryContent);
    const [isSaving, setIsSaving] = useState(false);

    // Helper to track which sections are "started/completed" (basic check)
    const getCompletedSteps = () => {
        const steps: number[] = [];
        if (content.cover.title) steps.push(1);
        if (content.preTrip.flightGuide.bestAirports.length > 0) steps.push(2);
        if (content.logistics.currency.code) steps.push(3);
        if (content.dailyItinerary.length > 0 && content.dailyItinerary[0].title) steps.push(5);
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
                return <PlaceholderSection title="Customization Options" />;
            case 11:
                return <PlaceholderSection title="Emergency Info" />;
            case 12:
                return <ShoppingSection data={content.shopping} onChange={(d) => setContent({ ...content, shopping: d })} />;
            case 13:
                return <PlaceholderSection title="Departure Plan" />;
            case 14:
                return <PlaceholderSection title="Post-Trip Section" />;
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <div className="lg:col-span-1 hidden lg:block">
                    <ItinerarySidebar
                        activeStep={activeStep}
                        onStepChange={setActiveStep}
                        completedSteps={getCompletedSteps()}
                    />
                </div>

                <div className="lg:col-span-3">
                    {/* Mobile Navigation */}
                    <MobileItineraryNav
                        activeStep={activeStep}
                        onStepChange={setActiveStep}
                        completedSteps={getCompletedSteps()}
                    />

                    <div className="min-h-[60vh] glass rounded-2xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

                        {renderSection()}
                    </div>

                    <div className="mt-8 flex justify-between pt-6 border-t border-white/10">
                        <button
                            className={`btn btn-outline ${activeStep === 1 ? 'invisible' : ''}`}
                            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                        >
                            <ArrowLeft size={16} className="mr-2" /> Previous Step
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (activeStep < 15) setActiveStep(prev => prev + 1);
                                else handleSave();
                            }}
                        >
                            {activeStep === 15 ? "Finish & Save" : "Next Step"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
