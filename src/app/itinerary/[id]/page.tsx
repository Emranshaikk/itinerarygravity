"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, MapPin, Star, ShieldCheck, Calendar, Clock, Info, Shield, Truck, Hotel, Coffee } from "@/components/Icons";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ReviewSection from "@/components/reviews/ReviewSection";
import ReviewForm from "@/components/reviews/ReviewForm";
import PDFGenerator from "@/components/pdf/PDFGenerator";

export default function ItineraryDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [activeDay, setActiveDay] = useState(1);
    const [mounted, setMounted] = useState(false);
    const [liveData, setLiveData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [userReview, setUserReview] = useState<any>(null);
    const supabase = createClient();

    const id = params?.id as string || "";
    const isKyoto = id === "kyoto-traditional";
    const isBali = id === "bali-hidden";

    useEffect(() => {
        setMounted(true);

        async function fetchData() {
            try {
                // Get current user
                const { data: { user: authUser } } = await supabase.auth.getUser();
                setUser(authUser);

                if (authUser) {
                    // Check if purchased
                    const { data: purchase } = await supabase
                        .from('purchases')
                        .select('id')
                        .eq('user_id', authUser.id)
                        .eq('itinerary_id', id)
                        .single();

                    if (purchase) setIsPurchased(true);

                    // Check if already reviewed
                    const { data: review } = await supabase
                        .from('reviews')
                        .select('*')
                        .eq('user_id', authUser.id)
                        .eq('itinerary_id', id)
                        .single();

                    if (review) setUserReview(review);
                }

                // Fetch itinerary data
                if (isKyoto || isBali) {
                    setIsLoading(false);
                    return;
                }

                const { data: itineraryData, error } = await supabase
                    .from('itineraries')
                    .select(`
                        *,
                        profiles:creator_id (
                            full_name,
                            avatar_url
                        )
                    `)
                    .eq('id', id)
                    .single();

                if (itineraryData) {
                    setLiveData(itineraryData);

                    // Track view (asynchronously)
                    fetch('/api/analytics', {
                        method: 'POST',
                        body: JSON.stringify({ itinerary_id: id })
                    }).catch(console.error);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [id, isKyoto, isBali]);

    // Comprehensive mock data matching the new creator fields
    let itinerary = {
        title: isKyoto ? "7 Days in Kyoto: The Ultimate Guide" : "Bali: Hidden Gems & Waterfalls",
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
        content: { days: [] },
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
        tags: isKyoto ? ["Culture", "History", "Nature"] : ["Adventure", "Nature", "Relaxation"]
    };

    // If we have live data, override the defaults
    if (liveData) {
        itinerary = {
            ...itinerary,
            title: liveData.title,
            location: liveData.location,
            price: Number(liveData.price),
            currency: liveData.currency,
            description: liveData.description,
            tags: liveData.content?.cover?.tags || [],
            creator: liveData.profiles?.full_name || "@Influencer",
            average_rating: Number(liveData.average_rating) || 0,
            review_count: liveData.review_count || 0,
            content: liveData.content || { days: [] },
            // Map JSONB content back to expected fields
            ...liveData.content,
            days: liveData.content?.days?.map((d: any, idx: number) => ({
                ...d,
                number: d.dayNumber || idx + 1,
                title: d.dayTitle || d.title || `Day ${idx + 1}`,
                morning: d.morningPlan || d.morning || "",
                afternoon: d.afternoonPlan || d.afternoon || "",
                evening: d.eveningPlan || d.evening || "",
                hotel: d.hotelName || d.hotel || "",
                transport: d.transportMode || d.transport || "",
                meals: d.meals ? (Array.isArray(d.meals) ? d.meals : Object.keys(d.meals).filter(k => d.meals[k])) : []
            })) || itinerary.days
        };
    }

    const handlePurchase = () => {
        router.push(`/checkout/${id}`);
    };

    const handleReviewSubmitted = async () => {
        // Refresh review status and itinerary stats
        const { data: review } = await supabase
            .from('reviews')
            .select('*')
            .eq('user_id', user.id)
            .eq('itinerary_id', id)
            .single();

        if (review) setUserReview(review);

        const { data: updatedItinerary } = await supabase
            .from('itineraries')
            .select('average_rating, review_count')
            .eq('id', id)
            .single();

        if (updatedItinerary) {
            setLiveData({ ...liveData, ...updatedItinerary });
        }
    };

    if (!mounted || isLoading) return <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)' }}>Loading adventure...</div>;

    const pdfData = {
        title: itinerary.title,
        location: itinerary.location,
        description: itinerary.description,
        price: itinerary.price,
        creator: itinerary.creator,
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
                    <p style={{ color: 'var(--gray-400)' }}>{text}</p>
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

    return (
        <div style={{ paddingBottom: '100px' }}>
            {/* Header Section */}
            <div style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)', padding: '60px 0' }}>
                <div className="container">
                    <button className="no-print" onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                        <ArrowLeft size={16} /> Back to Explore
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                <span className="badge" style={{ background: 'rgba(255,133,162,0.2)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>{itinerary.tripTheme}</span>
                                <span className="badge" style={{ background: 'var(--surface)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>{itinerary.duration}</span>
                                {itinerary.tags && itinerary.tags.map((tag: string, i: number) => (
                                    <span key={i} className="badge" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.3)' }}>#{tag}</span>
                                ))}
                            </div>
                            <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.1 }}>{itinerary.title}</h1>
                            <div style={{ display: 'flex', gap: '32px', color: 'var(--gray-400)', fontSize: '1.1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={20} color="var(--primary)" /> {itinerary.location}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={20} color="#fbbf24" fill="#fbbf24" /> <strong style={{ color: 'var(--foreground)' }}>{itinerary.average_rating > 0 ? itinerary.average_rating.toFixed(1) : itinerary.rating}</strong> ({itinerary.review_count > 0 ? itinerary.review_count : itinerary.reviews} reviews)</div>
                            </div>
                        </div>
                        <div className="glass card" style={{ padding: '24px' }}>
                            <div className="no-print">
                                <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '4px' }}>Price {itinerary.priceType}</p>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>₹{itinerary.price} <span style={{ fontSize: '1rem', color: 'var(--gray-400)' }}>{itinerary.currency}</span></h2>

                                {!isPurchased ? (
                                    <button className="btn btn-primary" style={{ width: '100%', padding: '14px', marginBottom: '12px' }} onClick={handlePurchase}>Buy Full Itinerary</button>
                                ) : (
                                    <div style={{ padding: '12px', border: '1px solid #10b981', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontWeight: 600 }}>
                                        ✅ You own this itinerary
                                    </div>
                                )}

                                <div style={{ marginTop: '16px' }}>
                                    <PDFGenerator itineraryData={pdfData} isPurchased={isPurchased} />
                                </div>
                            </div>
                            {/* Visual marker for print, only visible during print due to globals.css logic */}
                            <div className="print-only">
                                <p>Verified Itinerary Guide</p>
                                <p>Price: {itinerary.price} {itinerary.currency}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '60px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px' }}>

                    {/* Left Side: Rich Content */}
                    <div>
                        {/* Quick Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '60px' }}>
                            <div className="glass card" style={{ padding: '20px' }}>
                                <Calendar size={20} color="var(--primary)" style={{ marginBottom: '12px' }} />
                                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Best Time</p>
                                <p style={{ fontWeight: 600 }}>{itinerary.bestTimeToVisit}</p>
                            </div>
                            <div className="glass card" style={{ padding: '20px' }}>
                                <ShieldCheck size={20} color="var(--primary)" style={{ marginBottom: '12px' }} />
                                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Ideal For</p>
                                <p style={{ fontWeight: 600 }}>{itinerary.idealFor}</p>
                            </div>
                            <div className="glass card" style={{ padding: '20px' }}>
                                <CheckCircle size={20} color="var(--primary)" style={{ marginBottom: '12px' }} />
                                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Language</p>
                                <p style={{ fontWeight: 600 }}>{itinerary.language}</p>
                            </div>
                        </div>

                        {/* Overview Section */}
                        <section style={{ marginBottom: '60px' }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>About this Trip</h2>
                            <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', fontSize: '1.1rem' }}>{itinerary.description}</p>

                            <div style={{ marginTop: '32px', padding: '24px', border: '1px solid var(--border)', borderRadius: '16px' }}>
                                <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={16} /> What you get</h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--gray-400)' }}>{itinerary.priceIncludes}</p>
                            </div>
                        </section>

                        {/* Daily Itinerary Tabs */}
                        <section style={{ marginBottom: '60px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '32px',
                                position: 'sticky',
                                top: '0',
                                zIndex: 50,
                                background: 'var(--background)',
                                padding: '16px 0',
                                borderBottom: '1px solid var(--border)'
                            }}>
                                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Daily Schedule</h2>
                                <div className="no-print" style={{ display: 'flex', gap: '8px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '4px' }}>
                                    {itinerary.days.map(day => (
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

                            {/* Standard Interactive View (No Print) */}
                            <div className="no-print">
                                {itinerary.days.length === 0 ? (
                                    <div className="glass card" style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>
                                        Full schedule available after purchase.
                                    </div>
                                ) : (
                                    itinerary.days.filter(d => d.number === activeDay).map(day => (
                                        <div key={day.number} className="glass card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
                                            {/* Lock Overlay for Days > 1 or Unpurchased Day 1 parts */
                                                (!isPurchased && (activeDay > 1)) && (
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

                                            {/* Day Header */}
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

                                                    {/* Affiliate Hook */}
                                                    {day.hotel && (
                                                        <div style={{ marginTop: '12px' }}>
                                                            <a
                                                                href="#"
                                                                className="btn btn-outline"
                                                                style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
                                                                onClick={(e) => { e.preventDefault(); alert("This would link to Booking.com or similar affiliate."); }}
                                                            >
                                                                Make a Reservation
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gap: '32px' }}>
                                                {renderActivity(day.morning, "Morning")}

                                                {/* Partial Blur for Day 1 if not purchased */}
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
                                                    <div style={{ filter: (!isPurchased && activeDay === 1) ? 'blur(4px)' : 'none', opacity: (!isPurchased && activeDay === 1) ? 0.5 : 1, userSelect: (!isPurchased && activeDay === 1) ? 'none' : 'auto' }}>
                                                        {renderActivity(day.afternoon, "Afternoon")}
                                                        {renderActivity(day.evening, "Evening")}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer Info (Locked if not purchased) */}
                                            {(isPurchased || activeDay === 1) && (
                                                <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', filter: (!isPurchased && activeDay === 1) ? 'blur(4px)' : 'none' }}>
                                                    <div>
                                                        <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}><Coffee size={16} /> Meals & Activity</h4>
                                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                            {day.meals.map(m => <span key={m} className="badge" style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(255,133,162,0.1)', color: 'var(--primary)' }}>{m} Included</span>)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}><Shield size={16} /> Pro-Tips</h4>
                                                        <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)' }}>{day.notes}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Print-Only Sequential View */}
                            <div className="print-only-show">
                                {itinerary.days.map(day => (
                                    <div key={day.number} style={{ marginBottom: '40px', pageBreakInside: 'avoid', borderBottom: '1px solid #eee', paddingBottom: '32px' }}>
                                        <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Day {day.number}: {day.title}</h3>
                                        <p style={{ marginBottom: '8px' }}><strong>Morning:</strong> {day.morning}</p>
                                        <p style={{ marginBottom: '8px' }}><strong>Afternoon:</strong> {day.afternoon}</p>
                                        <p style={{ marginBottom: '16px' }}><strong>Evening:</strong> {day.evening}</p>
                                        <p style={{ fontSize: '0.9rem' }}>Stay: {day.hotel} • Transport: {day.transport} • Meals: {day.meals.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Review System Section */}
                        <section style={{ marginBottom: '60px' }}>
                            <div style={{ display: 'grid', gap: '40px' }}>
                                <ReviewSection
                                    itineraryId={id}
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

                                {!isPurchased && user && (
                                    <div className="glass card" style={{ padding: '32px', textAlign: 'center', border: '1px dashed var(--border)' }}>
                                        <p style={{ color: 'var(--gray-400)' }}>
                                            You must purchase this itinerary to leave a review.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Pricing Policies & Fine Print */}
                        <section style={{ marginBottom: '60px' }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '32px' }}>Fine Print</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div className="glass card" style={{ padding: '32px' }}>
                                    <h4 style={{ marginBottom: '16px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Info size={18} /> Refund Policy
                                    </h4>
                                    <p style={{ color: 'var(--gray-400)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        {itinerary.refundPolicy || "No refunds once the guide has been accessed or downloaded. We ensure the highest quality verified information."}
                                    </p>
                                </div>
                                <div className="glass card" style={{ padding: '32px' }}>
                                    <h4 style={{ marginBottom: '16px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Shield size={18} /> Cancellation Terms
                                    </h4>
                                    <p style={{ color: 'var(--gray-400)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        {itinerary.cancellationPolicy || "This is a digital product. If you encounter issues with hotel bookings or transport mentioned, please contact the provider directly."}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Side: Sidebar Details */}
                    <div style={{ position: 'sticky', top: '24px' }}>
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

                        <div className="glass card" style={{ padding: '32px' }}>
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
                    </div>

                </div>
            </div>
        </div>
    );
}
