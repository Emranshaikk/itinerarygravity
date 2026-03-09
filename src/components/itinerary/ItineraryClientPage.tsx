"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, MapPin, Star, ShieldCheck, Calendar, Clock, Info, Shield, Truck, Hotel, Coffee, MessageCircle, Share2, Compass, Navigation, ListChecks, Smartphone, Layout } from "@/components/Icons";
import { Plane, BedDouble, Gift, Map, AlertTriangle, ExternalLink, Utensils, Train, Sparkles, ShieldAlert, ShoppingBag, ArrowRightLeft, Users, SunMedium } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import ReviewSection from "@/components/reviews/ReviewSection";
import ReviewForm from "@/components/reviews/ReviewForm";
import PDFGenerator from "@/components/pdf/PDFGenerator";
import VerifiedBadge from "@/components/VerifiedBadge";
import TravelerGallery from "@/components/itinerary/TravelerGallery";
import BudgetTracker from "@/components/itinerary/BudgetTracker";
import AffiliateShowcase from "@/components/itinerary/AffiliateShowcase";
import Breadcrumbs from "@/components/itinerary/Breadcrumbs";
import RelatedItineraries from "@/components/itinerary/RelatedItineraries";
import ShareModal from "@/components/itinerary/ShareModal";
import ItineraryMap from "@/components/itinerary/ItineraryMap";
import CreatorStore from "@/components/itinerary/CreatorStore";
import SocialHub from "@/components/itinerary/SocialHub";


interface Props {
    id: string;
    initialData?: any;
    initialIsPurchased?: boolean;
    initialUser?: any;
    initialUserReview?: any;
}

export default function ItineraryClientPage({ id, initialData, initialIsPurchased, initialUser, initialUserReview }: Props) {
    const router = useRouter();
    const [activeDay, setActiveDay] = useState(1);
    const [mounted, setMounted] = useState(false);
    const [liveData, setLiveData] = useState<any>(initialData);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [user, setUser] = useState<any>(initialUser);
    const [isPurchased, setIsPurchased] = useState(initialIsPurchased || false);
    const [userReview, setUserReview] = useState<any>(initialUserReview || null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [socialProofIndex, setSocialProofIndex] = useState(0);

    const isKyoto = id === "kyoto-traditional";
    const isBali = id === "bali-hidden";

    // Comprehensive mock data matching the new creator fields
    let itinerary: any = initialData || {
        id: "kyoto-traditional",
        title: isKyoto ? "7 Days in Kyoto: The Ultimate Guide" : isBali ? "Bali: Hidden Gems & Waterfalls" : "",
        image_url: isKyoto
            ? "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop"
            : isBali
                ? "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2076&auto=format&fit=crop"
                : "",
        creator: isKyoto ? "@SarahTravels" : "@BaliExplorer",
        location: isKyoto ? "Kyoto, Japan" : "Ubud, Bali",
        duration: isKyoto ? "7 Days & 6 Nights" : "5 Days & 4 Nights",
        price: isKyoto ? 15.00 : 12.00,
        currency: "USD",
        priceType: "Per Person",
        rating: isKyoto ? 4.9 : 4.8,
        reviews: isKyoto ? 124 : 89,
        average_rating: isKyoto ? 4.9 : 4.8,
        review_count: isKyoto ? 124 : 89,
        description: "Experience the magic of Kyoto with this carefully curated 7-day itinerary.",
        startingLocation: "Kansai International Airport (KIX)",
        endingLocation: "Kyoto Central Station",
        bestTimeToVisit: "March to May",
        idealFor: "Couples & Cultural Explorers",
        tripTheme: "Cultural & Photography",
        language: "English & Japanese",
        minAge: "No restriction",
        priceIncludes: "Professional PDF Guide, Interactive Map links...",
        customization: "No",
        groupSize: "1 - 4 recommended",
        advanceBooking: "None required",
        refundPolicy: "100% refund within 24 hours.",
        cancellationPolicy: "Digital product. Final sale once accessed.",
        content: {
            days: [] as any[],
            proofOfVisit: { images: [] as any[], notes: "" },
            affiliateProducts: [] as any[],
            creatorProducts: [] as any[]
        },
        days: [
            {
                number: 1,
                title: "Arrival & The Gion District",
                morning: "Arrive at KIX. Take the Haruka Express to Kyoto.",
                afternoon: "Wander the preserved streets of Sannenzaka.",
                evening: "Traditional Kaiseki dinner in Gion.",
                hotel: "The Screen (Design Hotel)",
                transport: "Train & Walking",
                meals: ["Dinner"],
                notes: "Make dinner reservations early."
            }
        ],
        pickup: "Airport Terminal 1 Arrival Hall",
        drop: "Kyoto Station Main Entrance",
        insurance: "Strongly Recommended",
        advanceBookingText: "None required",
        tags: isKyoto ? ["Culture", "History", "Nature"] : ["Adventure", "Nature", "Relaxation"],
        is_verified: false,
        logistics: {
            currency: { dailyBudgetEstimate: "$50-$100" }
        },
        preTrip: {
            essentials: { insurance: "Strongly Recommended" }
        }
    } as any;

    if (liveData) {
        itinerary = {
            ...itinerary,
            title: liveData.title || itinerary.title,
            location: liveData.location || itinerary.location,
            price: liveData.price ? Number(liveData.price) : itinerary.price,
            currency: liveData.currency || itinerary.currency,
            description: liveData.description || itinerary.description,
            tags: liveData.content?.cover?.tags || itinerary.tags,
            creator: liveData.profiles?.full_name || itinerary.creator,
            average_rating: liveData.average_rating ? Number(liveData.average_rating) : itinerary.average_rating,
            review_count: liveData.review_count !== undefined ? liveData.review_count : itinerary.review_count,
            id: liveData.id || id,
            image_url: liveData.image_url || itinerary.image_url,
            content: liveData.content || { days: [], proofOfVisit: { images: [], notes: "" }, affiliateProducts: [], creatorProducts: [] },
            ...liveData.content,
            days: (
                Array.isArray(liveData.content?.dailyItinerary) ? liveData.content.dailyItinerary :
                    Array.isArray(liveData.content?.days) ? liveData.content.days :
                        []
            ).map((d: any, idx: number) => ({
                ...d,
                number: d.dayNumber || d.number || idx + 1,
                title: d.dayTitle || d.title || `Day ${idx + 1}`,
                morning: d.morningPlan || (typeof d.morning === 'object' ? d.morning?.activity : d.morning) || "",
                afternoon: d.afternoonPlan || (typeof d.afternoon === 'object' ? d.afternoon?.activity : d.afternoon) || "",
                evening: d.eveningPlan || (typeof d.evening === 'object' ? d.evening?.activity : d.evening) || "",
                hotel: d.hotelName || d.hotel || "",
                transport: d.transportMode || d.transport || "",
                meals: d.meals ? (Array.isArray(d.meals) ? d.meals : Object.keys(d.meals).filter(k => d.meals[k])) : []
            })),
            is_verified: liveData.profiles?.is_verified || false
        };
    }

    const purchaseCount = itinerary.purchases?.length || 0;
    const socialProofs = [
        ...(purchaseCount > 0 ? [{ id: 'sales', text: `${purchaseCount} people purchased since launch.`, type: 'sales' }] : []),
        { id: 'views', text: "Popular! 5 people are viewing this right now", type: 'views' }
    ];

    useEffect(() => {
        setMounted(true);

        const trackView = async () => {
            const viewedKey = `viewed_${id}`;
            const lastViewed = localStorage.getItem(viewedKey);

            // Only track view if never viewed before, or if it has been more than 1 hour
            if (!lastViewed || (Date.now() - parseInt(lastViewed)) > 3600000) {
                try {
                    await fetch('/api/analytics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ itinerary_id: id })
                    });
                    localStorage.setItem(viewedKey, Date.now().toString());
                } catch (e) {
                    console.error("Failed to track view", e);
                }
            }
        };

        if (id !== "kyoto-traditional" && id !== "bali-hidden") {
            // Don't track views on the fallback / mock trips
            trackView();
        }

        const interval = setInterval(() => {
            setSocialProofIndex((prev) => (prev + 1) % socialProofs.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [id, socialProofs.length]);

    const handlePurchase = () => {
        router.push(`/checkout/${id}`);
    };

    const handleShare = () => {
        setIsShareModalOpen(true);
    };

    const handleReviewSubmitted = async () => {
        try {
            // Re-fetch all reviews and find the user's review
            const reviewsRes = await fetch(`/api/reviews?itinerary_id=${id}`);
            const reviews = await reviewsRes.json();
            const myReview = reviews.find((r: any) => r.user_id === user.id);
            if (myReview) {
                setUserReview(myReview);
            }

            // Re-fetch itinerary stats
            const itineraryRes = await fetch(`/api/itineraries/${id}`);
            const updatedItinerary = await itineraryRes.json();

            if (updatedItinerary) {
                setLiveData({ ...liveData, average_rating: updatedItinerary.average_rating, review_count: updatedItinerary.review_count });
            }
        } catch (error) {
            console.error("Failed to refresh review data", error);
        }
    };

    if (!mounted || isLoading) return <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)' }}>Loading adventure...</div>;

    const pdfData = {
        ...itinerary,
        duration_days: liveData?.duration_days,
        content: liveData?.content || itinerary.content
    };

    const renderActivity = (activityData: any, timeOfDay: string) => {
        if (!activityData) return null;
        const isRich = typeof activityData === 'object';
        const text = isRich ? activityData.activity : activityData;
        const location = isRich ? activityData.location : null;

        return (
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '24px' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{timeOfDay}</span>
                <div>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{text}</p>
                    {location && (
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gradient"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', marginTop: '8px', fontWeight: 600 }}
                        >
                            <MapPin size={14} /> Open in Maps
                        </a>
                    )}
                </div>
            </div>
        );
    };

    const exportToGoogleMaps = () => {
        const locations: string[] = [];
        if (itinerary.location) locations.push(itinerary.location);
        itinerary.days?.forEach((day: any) => {
            if (day.morning && typeof day.morning === 'string') locations.push(day.morning);
            if (day.afternoon && typeof day.afternoon === 'string') locations.push(day.afternoon);
            if (day.evening && typeof day.evening === 'string') locations.push(day.evening);
        });
        if (locations.length === 0) {
            alert("No locations found in this itinerary to export.");
            return;
        }
        const origin = encodeURIComponent(locations[0]);
        const destination = encodeURIComponent(locations[locations.length - 1]);
        const waypoints = locations.length > 2
            ? `&waypoints=${encodeURIComponent(locations.slice(1, -1).slice(0, 10).join('|'))}`
            : '';
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints}&travelmode=driving`;
        window.open(url, '_blank');
    };

    return (
        <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '100px' }}>
            {/* Animated Mesh Gradient Background (Matches Explore Page) */}
            <div className="mesh-gradient-animate" style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '120%',
                height: '800px',
                zIndex: -1,
                opacity: 0.2, // Slightly more subtle for the detail page
                filter: 'blur(100px)',
                background: `
                    radial-gradient(at 0% 0%, rgba(255, 133, 162, 0.3) 0px, transparent 50%),
                    radial-gradient(at 50% 0%, rgba(139, 92, 246, 0.3) 0px, transparent 50%),
                    radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.3) 0px, transparent 50%)
                `
            }}></div>

            {/* Header Section */}
            <div style={{ background: 'transparent', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Explore', href: '/explore' },
                            { label: itinerary.title }
                        ]}
                    />
                    <div className="no-print" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ArrowLeft size={16} /> Back to Explore
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.9rem', fontWeight: 600 }}>
                            <Star size={16} fill="#fbbf24" /> Top Rated Experience
                        </div>
                    </div>

                    {itinerary.image_url && (
                        <div style={{ marginBottom: '32px', borderRadius: '24px', overflow: 'hidden', height: '400px', position: 'relative', border: '1px solid var(--border)' }}>
                            <Image
                                src={itinerary.image_url || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34"}
                                alt={itinerary.title}
                                fill
                                sizes="100vw"
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                            <div style={{ position: 'absolute', bottom: '24px', left: '24px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={16} color="var(--primary)" /> {itinerary.location}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <span className="badge" style={{ background: 'rgba(255,133,162,0.2)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>{itinerary.tripTheme}</span>
                                <span className="badge" style={{ background: 'var(--surface)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>{itinerary.duration}</span>
                            </div>
                            <h1 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.1 }}>
                                {itinerary.title}
                            </h1>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', color: 'var(--gray-400)', fontSize: '1rem', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>by {itinerary.creator}</span>
                                    {itinerary.is_verified && <VerifiedBadge size={18} />}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} color="var(--primary)" /> {itinerary.location}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={18} color="#fbbf24" fill="#fbbf24" /> <strong style={{ color: 'var(--foreground)' }}>{itinerary.average_rating > 0 ? itinerary.average_rating.toFixed(1) : itinerary.rating}</strong> ({itinerary.review_count > 0 ? itinerary.review_count : itinerary.reviews} reviews)</div>
                            </div>
                            {itinerary.tags && (
                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                    {itinerary.tags.map((tag: string, i: number) => (
                                        <span key={i} style={{ fontSize: '0.8rem', color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 10px', borderRadius: '99px' }}>#{tag}</span>
                                    ))}
                                </div>
                            )}

                            {/* Moved content to fill space */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '32px', marginBottom: '32px' }}>
                                <div className="glass card" style={{ padding: '16px' }}>
                                    <Calendar size={18} color="var(--primary)" style={{ marginBottom: '8px' }} />
                                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Best Time</p>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{itinerary.bestTimeToVisit}</p>
                                </div>
                                <div className="glass card" style={{ padding: '16px' }}>
                                    <ShieldCheck size={18} color="var(--primary)" style={{ marginBottom: '8px' }} />
                                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Ideal For</p>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{itinerary.idealFor}</p>
                                </div>
                                <div className="glass card" style={{ padding: '16px' }}>
                                    <CheckCircle size={18} color="var(--primary)" style={{ marginBottom: '8px' }} />
                                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Language</p>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{itinerary.language}</p>
                                </div>
                            </div>

                            <div style={{ padding: '20px', background: 'rgba(var(--primary-rgb), 0.03)', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '32px' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={16} color="var(--primary)" /> About this Trip</h4>
                                <p style={{ color: 'var(--gray-400)', lineHeight: '1.6', fontSize: '0.95rem' }}>{itinerary.description}</p>
                            </div>

                            <TravelerGallery itineraryId={itinerary.id || id} isPurchased={isPurchased} />

                            {/* Actionable Travel Tools (Premium Section) */}
                            {isPurchased && (
                                <div style={{ marginTop: '48px', borderTop: '1px solid var(--border)', paddingTop: '48px' }}>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Layout size={32} color="var(--primary)" /> Expert Travel Tools
                                    </h2>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                        {/* Checklist Tool */}
                                        <div className="glass card" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <ListChecks size={20} color="var(--primary)" /> Pre-Trip Checklist
                                            </h3>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
                                                {['Verify Visa Requirements', 'Book Airport Transfer', 'Download Offline Maps', 'Notify Bank of Travel'].map((item, i) => (
                                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--gray-400)' }}>
                                                        <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '2px solid var(--border)' }}></div>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Mobile App Sync Tool */}
                                        <div className="glass card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.1), transparent)' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <Smartphone size={20} color="var(--primary)" /> Mobile Sync (PWA)
                                            </h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginBottom: '16px' }}>
                                                Sync this guide to your phone for 100% offline access in areas without signal.
                                            </p>
                                            <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem' }}>Generate Offline Key</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isPurchased && <SocialHub itineraryId={itinerary.id || id} currentUser={user} />}
                        </div>
                        <div className="glass card" style={{ padding: '24px' }}>
                            <div className="no-print">
                                <div style={{
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    background: 'var(--surface)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    height: '50px'
                                }}>
                                    <div style={{ position: 'relative', width: '8px', height: '8px', borderRadius: '50%', background: socialProofs[socialProofIndex].type === 'views' ? '#f43f5e' : '#10b981', flexShrink: 0 }}>
                                        <div style={{
                                            position: 'absolute',
                                            inset: -4,
                                            borderRadius: '50%',
                                            background: socialProofs[socialProofIndex].type === 'views' ? '#f43f5e' : '#10b981',
                                            opacity: 0.4,
                                            animation: 'pulse 2s infinite'
                                        }}></div>
                                    </div>
                                    <div key={socialProofIndex} style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        color: 'var(--foreground)',
                                        animation: 'slideUp 0.3s ease-out'
                                    }}>
                                        {socialProofs[socialProofIndex].text}
                                    </div>
                                </div>

                                <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                                    {itinerary.currency === 'INR' || !itinerary.currency ? '₹' : itinerary.currency === 'USD' ? '$' : itinerary.currency === 'EUR' ? '€' : itinerary.currency + ' '}
                                    {itinerary.price}
                                    <span style={{ fontSize: '1rem', color: 'var(--gray-400)', marginLeft: '8px', fontWeight: 500 }}>{itinerary.priceType}</span>
                                </h2>

                                <div style={{ background: 'rgba(255,133,162,0.1)', border: '1px solid var(--primary)', borderRadius: '8px', padding: '8px 12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>Limited Time Price</div>
                                    <div style={{ background: 'var(--primary)', height: '14px', width: '1px' }}></div>
                                    <div style={{ color: 'var(--foreground)', fontSize: '0.8rem', fontWeight: 500 }}>Saves 20+ hours of prep</div>
                                </div>

                                {!isPurchased ? (
                                    <button className="btn btn-primary" style={{ width: '100%', padding: '14px', marginBottom: '12px' }} onClick={handlePurchase}>Buy Full Itinerary</button>
                                ) : (
                                    <div style={{ padding: '12px', border: '1px solid #10b981', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontWeight: 600 }}>
                                        ✅ You own this itinerary
                                    </div>
                                )}

                                {isPurchased && !userReview && (
                                    <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '12px' }}>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--foreground)', marginBottom: '8px', fontWeight: 600 }}>Love the trip?</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '12px' }}>Help others by leaving a quick review! It helps the creator immensely.</p>
                                        <button
                                            onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                                            style={{ width: '100%', padding: '8px', fontSize: '0.8rem', borderRadius: '8px', border: 'none', background: '#fbbf24', color: '#000', fontWeight: 700, cursor: 'pointer' }}
                                        >
                                            Write a Review
                                        </button>
                                    </div>
                                )}

                                <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                                    <button
                                        onClick={exportToGoogleMaps}
                                        title="Open in Google Maps"
                                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                    >
                                        <MapPin size={22} />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        title="Share Itinerary"
                                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                    >
                                        <Share2 size={22} />
                                    </button>
                                    <div style={{ width: '50px', height: '50px' }}>
                                        <PDFGenerator itineraryData={pdfData} isPurchased={isPurchased} iconOnly={true} />
                                    </div>
                                </div>
                                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                                        <ShieldCheck size={14} /> Secure Checkout
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                        •
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600 }}>
                                        Instant Delivery
                                    </div>
                                </div>

                                <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(16,185,129,0.05)', borderRadius: '16px', border: '1px dashed #10b981' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
                                        <VerifiedBadge size={18} /> Verified & Accurate
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', lineHeight: '1.5', margin: 0 }}>
                                        We independently verify every itinerary. If any major recommendation (Hotel/Transport) is wildly inaccurate, we'll credit your account. **100% Peace of Mind.**
                                    </p>
                                </div>
                            </div>
                            <div className="print-only">
                                <p>Verified Itinerary Guide</p>
                                <p>Price: {itinerary.currency === 'INR' ? '₹' : itinerary.currency === 'USD' ? '$' : itinerary.currency} {itinerary.price}</p>
                            </div>

                            <div style={{ marginTop: '24px' }}>
                                <ItineraryMap content={liveData?.content || itinerary.content || itinerary} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px' }}>

                    {/* Left Side: Rich Content */}
                    <div>
                        {/* Daily Schedule Tabs */}
                        <section style={{ marginBottom: '60px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '32px',
                                position: 'sticky',
                                top: '80px',
                                zIndex: 50,
                                background: 'rgba(var(--background-rgb), 0.8)',
                                backdropFilter: 'blur(12px)',
                                padding: '20px 0',
                                borderBottom: '1px solid var(--border)',
                                margin: '0 -20px',
                                paddingLeft: '20px',
                                paddingRight: '20px'
                            }}>
                                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Daily Schedule</h2>
                                <div className="no-print" style={{ display: 'flex', gap: '8px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '4px' }}>
                                    {itinerary.days.map((day: any) => (
                                        <button
                                            key={day.number}
                                            onClick={() => setActiveDay(day.number)}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                flexShrink: 0,
                                                border: '1px solid var(--border)',
                                                background: activeDay === day.number ? 'var(--primary)' : 'var(--surface)',
                                                color: activeDay === day.number ? 'var(--background)' : 'var(--gray-400)',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {day.number}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="no-print">
                                {itinerary.days.length === 0 ? (
                                    <div className="glass card" style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>
                                        Full schedule available after purchase.
                                    </div>
                                ) : (
                                    itinerary.days.filter((d: any) => d.number === activeDay).map((day: any) => (
                                        <div key={day.number} className="glass card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
                                            {(!isPurchased && (activeDay > 1)) && (
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'rgba(0,0,0,0.6)',
                                                    backdropFilter: 'blur(8px)',
                                                    zIndex: 10,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    textAlign: 'center'
                                                }}>
                                                    <ShieldCheck size={48} style={{ marginBottom: '16px', color: '#fbbf24' }} />
                                                    <h3 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Unlock Day {day.number}</h3>
                                                    <p style={{ maxWidth: '400px', marginBottom: '24px', color: '#e5e7eb' }}>Purchase the full itinerary to access detailed plans, maps, and local secrets for this day.</p>
                                                    <button className="btn btn-primary" onClick={handlePurchase}>Buy Full Access</button>
                                                </div>
                                            )}

                                            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', alignItems: 'flex-start' }}>
                                                <div style={{ fontSize: '3rem', fontWeight: 800, opacity: 0.1 }}>0{day.number}</div>
                                                <div>
                                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{day.title}</h3>
                                                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', color: 'var(--gray-400)' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Hotel size={14} />
                                                            {day.hotel}
                                                        </span>
                                                        <span><Truck size={14} /> {day.transport}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gap: '32px' }}>
                                                {renderActivity(day.morning, "Morning")}

                                                <div style={{ position: 'relative' }}>
                                                    {(!isPurchased && activeDay === 1) && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            inset: '-20px -20px -20px -20px',
                                                            background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.95))',
                                                            zIndex: 10,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'flex-end',
                                                            paddingBottom: '40px'
                                                        }}>
                                                            <p style={{ color: 'white', fontWeight: 600, marginBottom: '16px' }}>Curious about the rest of the day?</p>
                                                            <button className="btn btn-primary" onClick={handlePurchase}>Unlock Full Itinerary</button>
                                                        </div>
                                                    )}
                                                    <div style={{
                                                        display: 'grid',
                                                        gap: '32px',
                                                        filter: (!isPurchased && activeDay === 1) ? 'blur(4px)' : 'none',
                                                        opacity: (!isPurchased && activeDay === 1) ? 0.5 : 1,
                                                        userSelect: (!isPurchased && activeDay === 1) ? 'none' : 'auto'
                                                    }}>
                                                        {renderActivity(day.afternoon, "Afternoon")}
                                                        {renderActivity(day.evening, "Evening")}
                                                    </div>
                                                </div>
                                            </div>

                                            {(isPurchased || activeDay === 1) && (
                                                <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', filter: (!isPurchased && activeDay === 1) ? 'blur(4px)' : 'none' }}>
                                                    <div>
                                                        <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}><Coffee size={16} /> Meals & Activity</h4>
                                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                            {day.meals.map((m: any) => <span key={m} className="badge" style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(255,133,162,0.1)', color: 'var(--primary)' }}>{m} Included</span>)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}><Shield size={16} /> Pro-Tips</h4>
                                                        <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)' }}>{day.notes}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Daily Route Map */}
                                            {(isPurchased || activeDay === 1) && (
                                                <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border)', filter: (!isPurchased && activeDay === 1) ? 'blur(4px)' : 'none' }}>
                                                    <h4 style={{ marginBottom: '24px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <MapPin size={24} color="var(--primary)" /> Route Map
                                                    </h4>
                                                    <ItineraryMap content={{ days: [day] } as any} />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="print-only-show">
                                {itinerary.days.map((day: any) => (
                                    <div key={day.number} style={{ marginBottom: '40px', pageBreakInside: 'avoid', borderBottom: '1px solid #eee', paddingBottom: '32px' }}>
                                        <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Day {day.number}: {day.title}</h3>
                                        <p style={{ marginBottom: '8px' }}><strong>Morning:</strong> {typeof day.morning === 'object' ? day.morning?.activity : day.morning}</p>
                                        <p style={{ marginBottom: '8px' }}><strong>Afternoon:</strong> {typeof day.afternoon === 'object' ? day.afternoon?.activity : day.afternoon}</p>
                                        <p style={{ marginBottom: '16px' }}><strong>Evening:</strong> {typeof day.evening === 'object' ? day.evening?.activity : day.evening}</p>
                                        <p style={{ fontSize: '0.9rem' }}>Stay: {day.hotel} • Transport: {day.transport} • Meals: {day.meals.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Proof of Visit Section */}
                        {itinerary.content?.proofOfVisit?.images?.length > 0 && (
                            <section style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <ShieldCheck size={28} color="#10b981" />
                                    Proof of Visit
                                </h2>
                                <p style={{ color: 'var(--gray-400)', marginBottom: '32px' }}>
                                    {itinerary.content.proofOfVisit.notes || "I personally visited these locations to ensure this guide is accurate and high-quality."}
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                    {itinerary.content.proofOfVisit.images.map((img: any, i: number) => (
                                        <div key={i} className="glass card" style={{ overflow: 'hidden', padding: 0 }}>
                                            <div style={{ height: '250px', width: '100%', position: 'relative' }}>
                                                <Image
                                                    src={img.url}
                                                    alt={`Proof ${i}`}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div style={{ padding: '20px' }}>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--gray-400)', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                                                    "{img.caption}"
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* --- NEW SECTIONS --- */}
                        {isPurchased && itinerary.content?.preTrip && (
                            <section style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Plane size={28} color="#2563eb" /> Pre-Trip & Packing
                                </h2>
                                <div style={{ display: 'grid', gap: '24px' }}>
                                    {itinerary.content.preTrip.flightGuide && (
                                        <div className="glass card" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--primary)' }}>Flight & Arrival Strategy</h3>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
                                                {itinerary.content.preTrip.flightGuide.bestAirports?.length > 0 && <li><strong>Best Airports:</strong> {itinerary.content.preTrip.flightGuide.bestAirports.join(', ')}</li>}
                                                {itinerary.content.preTrip.flightGuide.arrivalDepartureStats && <li><strong>Arrival Info:</strong> {itinerary.content.preTrip.flightGuide.arrivalDepartureStats}</li>}
                                                {itinerary.content.preTrip.flightGuide.baggageTips && <li><strong>Baggage Tips:</strong> {itinerary.content.preTrip.flightGuide.baggageTips}</li>}
                                                {itinerary.content.preTrip.flightGuide.seatTips && <li><strong>Seat Secret:</strong> {itinerary.content.preTrip.flightGuide.seatTips}</li>}
                                                {itinerary.content.preTrip.flightGuide.jetLagTips && <li><strong>Jet Lag Hack:</strong> {itinerary.content.preTrip.flightGuide.jetLagTips}</li>}
                                            </ul>
                                        </div>
                                    )}
                                    {itinerary.content.preTrip.packingList?.length > 0 && (
                                        <div className="glass card" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#ea580c' }}>Packing List</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                                {itinerary.content.preTrip.packingList.map((category: any, i: number) => (
                                                    <div key={i}>
                                                        <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--gray-400)' }}>{category.category}</h4>
                                                        <ul style={{ paddingLeft: '20px', fontSize: '0.85rem' }}>
                                                            {category.items?.map((item: string, j: number) => (
                                                                <li key={j}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {isPurchased && itinerary.content?.accommodation && (
                            <section style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <BedDouble size={28} color="#0ea5e9" /> Accommodations
                                </h2>
                                <div style={{ display: 'grid', gap: '24px' }}>
                                    {itinerary.content.accommodation.bestNeighborhoods?.length > 0 && (
                                        <div className="glass card" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#ec4899' }}>Best Neighborhoods</h3>
                                            <div style={{ display: 'grid', gap: '16px' }}>
                                                {itinerary.content.accommodation.bestNeighborhoods.map((hood: any, i: number) => (
                                                    <div key={i} style={{ borderBottom: i !== itinerary.content.accommodation.bestNeighborhoods.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: i !== itinerary.content.accommodation.bestNeighborhoods.length - 1 ? '16px' : '0' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <strong style={{ fontSize: '1.05rem' }}>{hood.name}</strong>
                                                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'var(--surface)', borderRadius: '12px' }}>{hood.vibe}</span>
                                                        </div>
                                                        <p style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--gray-400)' }}>{hood.whyStayHere}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {itinerary.content.accommodation.hotelRecommendations?.length > 0 && (
                                        <div className="glass card" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#10b981' }}>Handpicked Hotels</h3>
                                            <div style={{ display: 'grid', gap: '16px' }}>
                                                {itinerary.content.accommodation.hotelRecommendations.map((hotel: any, i: number) => (
                                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <div>
                                                                <strong style={{ fontSize: '1.05rem' }}>{hotel.name}</strong>
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '2px' }}>{hotel.neighborhood}</div>
                                                            </div>
                                                            <div style={{ fontWeight: 'bold', color: '#10b981' }}>{hotel.priceRange}</div>
                                                        </div>
                                                        <p style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>{hotel.whyWeLoveIt}</p>
                                                        {hotel.bookingLink && (
                                                            <a href={hotel.bookingLink} target="_blank" rel="noopener noreferrer" style={{ alignSelf: 'flex-start', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: '4px' }}>View & Book Booking Platform →</a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {isPurchased && itinerary.content?.food && (
                            <section style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Utensils size={28} color="#f97316" /> Local Food Guide
                                </h2>
                                <div style={{ display: 'grid', gap: '24px' }}>
                                    {itinerary.content.food.mustTryDishes?.length > 0 && (
                                        <div className="glass card" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#f97316' }}>Must-Try Local Dishes</h3>
                                            <div style={{ display: 'grid', gap: '16px' }}>
                                                {itinerary.content.food.mustTryDishes.map((dish: any, i: number) => (
                                                    <div key={i} style={{ borderBottom: i !== itinerary.content.food.mustTryDishes.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: i !== itinerary.content.food.mustTryDishes.length - 1 ? '16px' : '0' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <strong style={{ fontSize: '1.05rem' }}>{dish.name}</strong>
                                                            {dish.bestPlace && <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'var(--surface)', borderRadius: '12px' }}>Best at: {dish.bestPlace}</span>}
                                                        </div>
                                                        <p style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--gray-400)' }}>{dish.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {itinerary.content.food.restaurantRecommendations?.length > 0 && (
                                        <div className="glass card" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#84cc16' }}>Restaurant Recommendations</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                                                {itinerary.content.food.restaurantRecommendations.map((rest: any, i: number) => (
                                                    <div key={i} style={{ background: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <strong>{rest.name}</strong>
                                                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>{rest.priceRange}</span>
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '4px' }}>{rest.cuisine}</div>
                                                        {rest.notes && <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginTop: '8px', fontStyle: 'italic' }}>{rest.notes}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {isPurchased && itinerary.content?.transport && (
                            <section style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Train size={28} color="#6366f1" /> Getting Around
                                </h2>
                                <div className="glass card" style={{ padding: '24px', display: 'grid', gap: '20px' }}>
                                    {itinerary.content.transport.modes?.length > 0 && (
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#6366f1' }}>Best Transport Modes</h3>
                                            <div style={{ display: 'grid', gap: '12px' }}>
                                                {itinerary.content.transport.modes.map((m: any, i: number) => (
                                                    <div key={i} style={{ padding: '12px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                            <strong>{m.type}</strong>
                                                            {m.cost && <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{m.cost}</span>}
                                                        </div>
                                                        <div style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>{m.tips}</div>
                                                        {m.bestFor && <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '4px' }}>Best for: {m.bestFor}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {itinerary.content.transport.passes && (
                                        <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', borderLeft: '4px solid #6366f1' }}>
                                            <h4 style={{ fontSize: '0.9rem', margin: '0 0 4px 0', color: '#6366f1' }}>Travel Passes</h4>
                                            <p style={{ fontSize: '0.9rem', margin: 0 }}>{itinerary.content.transport.passes}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {isPurchased && itinerary.content?.secrets?.places?.length > 0 && (
                            <section style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Sparkles size={28} color="#d946ef" /> Hidden Gems (Secrets)
                                </h2>
                                <div className="glass card" style={{ padding: '24px' }}>
                                    <p style={{ color: 'var(--gray-400)', marginBottom: '24px' }}>Off-the-beaten-path locations most tourists miss.</p>
                                    <div style={{ display: 'grid', gap: '20px' }}>
                                        {itinerary.content.secrets.places.map((place: any, i: number) => (
                                            <div key={i} style={{ borderBottom: i !== itinerary.content.secrets.places.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: i !== itinerary.content.secrets.places.length - 1 ? '20px' : '0' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{place.name}</h3>
                                                    <span style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(217, 70, 239, 0.1)', color: '#d946ef', borderRadius: '99px', fontWeight: 'bold' }}>{place.type}</span>
                                                </div>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--foreground)', marginBottom: '8px' }}>{place.description}</p>
                                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                                                    {place.bestTime && <span>🕒 Time: {place.bestTime}</span>}
                                                    {place.idealFor && <span>✨ Idea: {place.idealFor}</span>}
                                                </div>
                                                {place.tips && <div style={{ marginTop: '8px', fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--primary)' }}>Tip: {place.tips}</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {isPurchased && itinerary.content?.shopping && (
                            <section style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <ShoppingBag size={28} color="#f43f5e" /> Shopping & Markets
                                </h2>
                                <div style={{ display: 'grid', gap: '24px' }}>
                                    {itinerary.content.shopping.whatToBuy?.length > 0 && (
                                        <div className="glass card" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#f43f5e' }}>What to Buy</h3>
                                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                {itinerary.content.shopping.whatToBuy.map((item: string, i: number) => <li key={i} style={{ marginBottom: '8px' }}>{item}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {itinerary.content.shopping.bestMarkets?.length > 0 && (
                                        <div className="glass card" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#f43f5e' }}>Best Markets</h3>
                                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                {itinerary.content.shopping.bestMarkets.map((market: string, i: number) => <li key={i} style={{ marginBottom: '8px' }}>{market}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {isPurchased && itinerary.content?.safety && (
                            <section style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <ShieldAlert size={28} color="#ef4444" /> Safety & Local Culture
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                                    {itinerary.content.safety.commonScams?.length > 0 && (
                                        <div className="glass card" style={{ padding: '24px', borderTop: '4px solid #ef4444' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#ef4444' }}>Common Scams</h3>
                                            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem' }}>
                                                {itinerary.content.safety.commonScams.map((scam: string, i: number) => <li key={i} style={{ marginBottom: '8px' }}>{scam}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {itinerary.content.safety.safetyTips?.length > 0 && (
                                        <div className="glass card" style={{ padding: '24px', borderTop: '4px solid #10b981' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#10b981' }}>Safety Tips</h3>
                                            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem' }}>
                                                {itinerary.content.safety.safetyTips.map((tip: string, i: number) => <li key={i} style={{ marginBottom: '8px' }}>{tip}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {itinerary.content.safety.emergencyNumbers?.length > 0 && (
                                        <div className="glass card" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--primary)' }}>Emergency Contacts</h3>
                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                {itinerary.content.safety.emergencyNumbers.map((num: any, i: number) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'var(--surface)', borderRadius: '6px' }}>
                                                        <span>{num.name}</span>
                                                        <strong style={{ color: '#ef4444' }}>{num.number}</strong>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {isPurchased && (itinerary.content?.arrival || itinerary.content?.departure) && (
                            <section style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <ArrowRightLeft size={28} color="#06b6d4" /> Arrival & Departure
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                                    {itinerary.content.arrival && (
                                        <div className="glass card" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#06b6d4' }}>Arrival Logistics</h3>
                                            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', display: 'grid', gap: '10px' }}>
                                                {itinerary.content.arrival.airportToCity && <li><strong>Airport Transfer:</strong> {itinerary.content.arrival.airportToCity}</li>}
                                                {itinerary.content.arrival.simCardPickUp && <li><strong>SIM Card:</strong> {itinerary.content.arrival.simCardPickUp}</li>}
                                            </ul>
                                        </div>
                                    )}
                                    {itinerary.content.departure && (
                                        <div className="glass card" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#06b6d4' }}>Departure Day</h3>
                                            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', display: 'grid', gap: '10px' }}>
                                                {itinerary.content.departure.checkoutTips && <li><strong>Checkout Tips:</strong> {itinerary.content.departure.checkoutTips}</li>}
                                                {itinerary.content.departure.airportBuffer && <li><strong>Airport Buffer:</strong> {itinerary.content.departure.airportBuffer}</li>}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {isPurchased && itinerary.content?.customization && (
                            <section style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Users size={28} color="#8b5cf6" /> Trip Customization
                                </h2>
                                <div className="glass card" style={{ padding: '24px', display: 'grid', gap: '16px' }}>
                                    {itinerary.content.customization.coupleTips && (
                                        <div>
                                            <h4 style={{ color: '#8b5cf6', fontSize: '1rem', marginBottom: '4px' }}>Couples</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray-400)' }}>{itinerary.content.customization.coupleTips}</p>
                                        </div>
                                    )}
                                    {itinerary.content.customization.familyTips && (
                                        <div>
                                            <h4 style={{ color: '#8b5cf6', fontSize: '1rem', marginBottom: '4px' }}>Families</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray-400)' }}>{itinerary.content.customization.familyTips}</p>
                                        </div>
                                    )}
                                    {itinerary.content.customization.soloTips && (
                                        <div>
                                            <h4 style={{ color: '#8b5cf6', fontSize: '1rem', marginBottom: '4px' }}>Solo Travelers</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray-400)' }}>{itinerary.content.customization.soloTips}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {isPurchased && itinerary.content?.postTrip && (
                            <section style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <SunMedium size={28} color="#f59e0b" /> Post-Trip
                                </h2>
                                <div className="glass card" style={{ padding: '24px', display: 'grid', gap: '16px' }}>
                                    {itinerary.content.postTrip.jetLagRecovery && (
                                        <div>
                                            <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '4px' }}>Jet Lag Recovery</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray-400)' }}>{itinerary.content.postTrip.jetLagRecovery}</p>
                                        </div>
                                    )}
                                    {itinerary.content.postTrip.nextDestinationIdeas?.length > 0 && (
                                        <div>
                                            <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '4px' }}>Where to next?</h4>
                                            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', color: 'var(--gray-400)' }}>
                                                {itinerary.content.postTrip.nextDestinationIdeas.map((dest: string, i: number) => <li key={i}>{dest}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {isPurchased && itinerary.content?.bonus && (
                            <section style={{ marginBottom: '60px' }}>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Gift size={28} color="#ec4899" /> Bonus Resources
                                </h2>
                                <div style={{ display: 'grid', gap: '24px' }}>
                                    {itinerary.content.bonus.googleMapsLink && (
                                        <a href={itinerary.content.bonus.googleMapsLink} target="_blank" rel="noopener noreferrer" className="glass card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}><Map size={18} /> Google Maps Master List</h3>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)', margin: 0 }}>Open saved locations directly in your Maps app.</p>
                                            </div>
                                            <ExternalLink size={20} color="var(--primary)" />
                                        </a>
                                    )}
                                    {itinerary.content.bonus.commonMistakes && (
                                        <div className="glass card" style={{ padding: '24px', borderLeft: '4px solid #ef4444' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={18} /> Common Mistakes</h3>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--gray-400)', margin: 0, whiteSpace: 'pre-wrap' }}>{itinerary.content.bonus.commonMistakes}</p>
                                        </div>
                                    )}
                                    {itinerary.content.bonus.externalLinks?.length > 0 && (
                                        <div className="glass card" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#3b82f6' }}>External Links</h3>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                                {itinerary.content.bonus.externalLinks.map((link: any, i: number) => (
                                                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'var(--surface)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--foreground)', textDecoration: 'none', border: '1px solid var(--border)' }}>
                                                        {link.label} <ExternalLink size={14} color="var(--gray-400)" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        <AffiliateShowcase
                            products={itinerary.content.affiliateProducts}
                            showAll={isPurchased}
                        />

                        <CreatorStore
                            products={itinerary.content.creatorProducts}
                            creatorName={itinerary.creator}
                        />

                        {isPurchased && (
                            <BudgetTracker
                                itineraryId={id}
                                dailyBudgetEstimate={itinerary.logistics?.currency?.dailyBudgetEstimate || "$50-$100"}
                                totalDays={itinerary.days?.length || 0}
                                currency={itinerary.currency || "USD"}
                            />
                        )}

                        <section style={{ marginBottom: '60px' }}>
                            <div id="review-form" style={{ display: 'grid', gap: '40px' }}>
                                <ReviewSection
                                    itineraryId={itinerary.id || id}
                                    averageRating={itinerary.average_rating}
                                    reviewCount={itinerary.review_count}
                                />

                                {isPurchased && (
                                    <ReviewForm
                                        itineraryId={id}
                                        onReviewSubmitted={handleReviewSubmitted}
                                        existingReview={userReview}
                                    />
                                )}
                            </div>
                        </section>

                        <RelatedItineraries
                            itineraryId={id}
                            location={itinerary.location}
                            creatorId={liveData?.creator_id || ""}
                        />

                    </div>

                    <div style={{ position: 'sticky', top: '104px' }}>
                        <div className="glass card" style={{ padding: '32px', marginBottom: '24px' }}>
                            <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>Logistics & Transfers</h3>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Starting From</p>
                                    <p style={{ fontWeight: 600 }}>{itinerary.startingLocation}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Pickup Spot</p>
                                    <p style={{ fontWeight: 600 }}>{itinerary.pickup}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Drop Spot</p>
                                    <p style={{ fontWeight: 600 }}>{itinerary.drop}</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass card" style={{ padding: '32px', marginBottom: '24px' }}>
                            <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>Safety & Policy</h3>
                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Shield size={20} color="var(--accent)" />
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Insurance</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{itinerary.insurance}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Clock size={20} color="var(--accent)" />
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Advance Booking</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{itinerary.advanceBooking}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass card" style={{ padding: '32px', marginBottom: '24px' }}>
                            <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>Fine Print</h3>
                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Info size={16} /> Refund Policy
                                    </h4>
                                    <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                        {itinerary.refundPolicy || "No refunds once the guide has been accessed or downloaded."}
                                    </p>
                                </div>
                                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Shield size={16} /> Cancellation Terms
                                    </h4>
                                    <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                        {itinerary.cancellationPolicy || "Digital product. Final sale once accessed."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <ShareModal
                itinerary={{
                    id,
                    title: itinerary.title,
                    location: itinerary.location
                }}
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
            />
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.5); opacity: 0.1; }
                    100% { transform: scale(1); opacity: 0.4; }
                }
                @keyframes slideUp {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @media (max-width: 768px) {
                    .mobile-buy-bar {
                        display: flex !important;
                    }
                }
            `}</style>

            {/* Sticky Mobile Buy Bar */}
            {!isPurchased && (
                <div className="mobile-buy-bar" style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(12px)',
                    borderTop: '1px solid var(--border)',
                    padding: '16px 20px',
                    display: 'none',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 1000,
                    boxShadow: '0 -10px 25px rgba(0,0,0,0.3)',
                    animation: 'slideUp 0.5s ease'
                }}>
                    <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>Total Price</p>
                        <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
                            {itinerary.currency === 'INR' ? '₹' : itinerary.currency === 'USD' ? '$' : '₹'}
                            {itinerary.price}
                        </p>
                    </div>
                    <button
                        onClick={handlePurchase}
                        className="btn btn-primary"
                        style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 700, boxShadow: '0 4px 15px rgba(255, 133, 162, 0.4)' }}
                    >
                        Unlock Guide
                    </button>
                </div>
            )}
        </div>
    );
}
