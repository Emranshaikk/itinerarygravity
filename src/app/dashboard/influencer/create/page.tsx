"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Plus, Trash2, Save, ArrowLeft, Calendar, MapPin, ShieldCheck, CheckCircle, Info } from "@/components/Icons";

export default function CreateItineraryPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(1);

    const [formData, setFormData] = useState({
        // General Details
        title: "",
        destination: "",
        duration: "",
        startingLocation: "",
        endingLocation: "",
        bestTimeToVisit: "",
        idealFor: "Couple",
        tripTheme: "Luxury",
        language: "English",
        minAge: "",

        // Pricing
        price: "",
        priceType: "Per Person",
        currency: "USD",
        priceIncludes: "",
        customizationAvailable: "No",
        groupSizeMin: "1",
        groupSizeMax: "10",
        advanceBooking: "",
        refundPolicy: "",
        cancellationPolicy: "",

        // Daily Schedule
        days: [
            {
                dayNumber: 1,
                dayTitle: "",
                morningPlan: "",
                afternoonPlan: "",
                eveningPlan: "",
                overnightLocation: "",
                hotelName: "",
                meals: { breakfast: false, lunch: false, dinner: false },
                transportMode: "Cab",
                travelTime: "",
                activitiesIncluded: "",
                entryTickets: "No",
                freeTime: "Yes",
                thingsToCarry: "",
                dressCode: "",
                importantNotes: ""
            }
        ],

        // Logistics & Transfers
        pickupLocation: "",
        pickupTime: "",
        dropLocation: "",
        dropTime: "",
        airportTransfer: "No",

        // Safety
        safetyGuidelines: "",
        emergencyContact: "",
        insuranceRequired: "No",
        medicalRestrictions: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDayChange = (index: number, field: string, value: any) => {
        const newDays = [...formData.days];
        (newDays[index] as any)[field] = value;
        setFormData({ ...formData, days: newDays });
    };

    const handleMealChange = (dayIndex: number, meal: 'breakfast' | 'lunch' | 'dinner') => {
        const newDays = [...formData.days];
        newDays[dayIndex].meals[meal] = !newDays[dayIndex].meals[meal];
        setFormData({ ...formData, days: newDays });
    };

    const addDay = () => {
        setFormData({
            ...formData,
            days: [
                ...formData.days,
                {
                    dayNumber: formData.days.length + 1,
                    dayTitle: "",
                    morningPlan: "",
                    afternoonPlan: "",
                    eveningPlan: "",
                    overnightLocation: "",
                    hotelName: "",
                    meals: { breakfast: false, lunch: false, dinner: false },
                    transportMode: "Cab",
                    travelTime: "",
                    activitiesIncluded: "",
                    entryTickets: "No",
                    freeTime: "Yes",
                    thingsToCarry: "",
                    dressCode: "",
                    importantNotes: ""
                }
            ]
        });
    };

    const removeDay = (index: number) => {
        if (formData.days.length > 1) {
            const newDays = formData.days.filter((_, i) => i !== index).map((day, i) => ({ ...day, dayNumber: i + 1 }));
            setFormData({ ...formData, days: newDays });
        }
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch('/api/itineraries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Itinerary Saved Successfully!");
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

    const tabs = [
        { id: 1, label: "Basic Info" },
        { id: 2, label: "Pricing & Policies" },
        { id: 3, label: "Daily Itinerary" },
        { id: 4, label: "Logistics & Safety" }
    ];

    return (
        <div className="container" style={{ maxWidth: '1000px', paddingBottom: '100px' }}>
            <button
                onClick={() => router.back()}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--gray-400)', marginBottom: '24px' }}
            >
                <ArrowLeft size={16} /> Back
            </button>

            <header style={{ marginBottom: '40px' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Detailed Itinerary Builder</h1>
                <p style={{ color: 'var(--gray-400)' }}>Fill in the details to provide a trustworthy experience for your followers.</p>
            </header>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: 'var(--surface)', padding: '6px', borderRadius: '16px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '12px',
                            border: 'none',
                            background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                            color: activeTab === tab.id ? 'var(--background)' : 'var(--gray-400)',
                            fontWeight: 600,
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="glass card" style={{ padding: '40px' }}>

                {/* TAB 1: BASIC INFO */}
                {activeTab === 1 && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        <div className="form-group">
                            <label className="form-label">Itinerary Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="e.g. 7 Days in Kyoto: The Ultimate Guide" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Destination / City / Country</label>
                            <input name="destination" value={formData.destination} onChange={handleChange} className="form-input" placeholder="e.g. Kyoto, Japan" required />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Duration (Days & Nights)</label>
                                <input name="duration" value={formData.duration} onChange={handleChange} className="form-input" placeholder="e.g. 7 Days, 6 Nights" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Best Time to Visit</label>
                                <input name="bestTimeToVisit" value={formData.bestTimeToVisit} onChange={handleChange} className="form-input" placeholder="e.g. March to May (Cherry Blossom)" />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Starting Location</label>
                                <input name="startingLocation" value={formData.startingLocation} onChange={handleChange} className="form-input" placeholder="e.g. Kansai Airport" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Ending Location</label>
                                <input name="endingLocation" value={formData.endingLocation} onChange={handleChange} className="form-input" placeholder="e.g. Kyoto Station" />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Ideal For</label>
                                <select name="idealFor" value={formData.idealFor} onChange={handleChange} className="form-input">
                                    <option>Family</option>
                                    <option>Couple</option>
                                    <option>Solo</option>
                                    <option>Group</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Trip Theme</label>
                                <select name="tripTheme" value={formData.tripTheme} onChange={handleChange} className="form-input">
                                    <option>Luxury</option>
                                    <option>Budget</option>
                                    <option>Adventure</option>
                                    <option>Cultural</option>
                                    <option>Honeymoon</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Language Supported</label>
                                <input name="language" value={formData.language} onChange={handleChange} className="form-input" placeholder="e.g. English, Japanese" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Minimum Age (if any)</label>
                            <input name="minAge" type="number" value={formData.minAge} onChange={handleChange} className="form-input" placeholder="e.g. 18" />
                        </div>
                    </div>
                )}

                {/* TAB 2: PRICING & POLICIES */}
                {activeTab === 2 && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        <div style={{ padding: '16px', background: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '12px' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Info size={16} /> Why fill this out?
                            </p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                                Clear pricing and transparent policies (like refunds) significantly increase buyer trust and reduce support requests.
                                Followers are more likely to purchase when they know exactly what they are getting and what happens if their plans change.
                            </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Price</label>
                                <input name="price" type="number" value={formData.price} onChange={handleChange} className="form-input" placeholder="0.00" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Currency</label>
                                <select name="currency" value={formData.currency} onChange={handleChange} className="form-input">
                                    <option>USD</option>
                                    <option>EUR</option>
                                    <option>INR</option>
                                    <option>GBP</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Price Type</label>
                                <select name="priceType" value={formData.priceType} onChange={handleChange} className="form-input">
                                    <option>Per Person</option>
                                    <option>Per Group</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">What Price Includes (Short summary)</label>
                            <textarea name="priceIncludes" value={formData.priceIncludes} onChange={handleChange} className="form-input" style={{ minHeight: '80px' }} placeholder="e.g. Accommodation, Breakfast, Private Cab..." />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Customization Available</label>
                                <select name="customizationAvailable" value={formData.customizationAvailable} onChange={handleChange} className="form-input">
                                    <option>No</option>
                                    <option>Yes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Min Group Size</label>
                                <input name="groupSizeMin" type="number" value={formData.groupSizeMin} onChange={handleChange} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Max Group Size</label>
                                <input name="groupSizeMax" type="number" value={formData.groupSizeMax} onChange={handleChange} className="form-input" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Advance Booking Required (Days)</label>
                            <input name="advanceBooking" type="number" value={formData.advanceBooking} onChange={handleChange} className="form-input" placeholder="e.g. 15" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Refund Policy</label>
                                <textarea name="refundPolicy" value={formData.refundPolicy} onChange={handleChange} className="form-input" placeholder="Details about refunds..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Cancellation Policy</label>
                                <textarea name="cancellationPolicy" value={formData.cancellationPolicy} onChange={handleChange} className="form-input" placeholder="Details about cancellation fees..." />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: DAILY ITINERARY */}
                {activeTab === 3 && (
                    <div>
                        {formData.days.map((day, index) => (
                            <div key={index} className="glass" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>Day {day.dayNumber}</h3>
                                    {formData.days.length > 1 && (
                                        <button type="button" onClick={() => removeDay(index)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Day Title</label>
                                    <input value={day.dayTitle} onChange={(e) => handleDayChange(index, 'dayTitle', e.target.value)} className="form-input" placeholder="e.g. Exploring Fushimi Inari" />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Morning Plan</label>
                                        <textarea value={day.morningPlan} onChange={(e) => handleDayChange(index, 'morningPlan', e.target.value)} className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Afternoon Plan</label>
                                        <textarea value={day.afternoonPlan} onChange={(e) => handleDayChange(index, 'afternoonPlan', e.target.value)} className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Evening Plan</label>
                                        <textarea value={day.eveningPlan} onChange={(e) => handleDayChange(index, 'eveningPlan', e.target.value)} className="form-input" />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Overnight Stay Location</label>
                                        <input value={day.overnightLocation} onChange={(e) => handleDayChange(index, 'overnightLocation', e.target.value)} className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Hotel Name / Category (Optional)</label>
                                        <input value={day.hotelName} onChange={(e) => handleDayChange(index, 'hotelName', e.target.value)} className="form-input" />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label className="form-label">Meals Included</label>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        {(['breakfast', 'lunch', 'dinner'] as const).map(meal => (
                                            <label key={meal} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={day.meals[meal]} onChange={() => handleMealChange(index, meal)} />
                                                <span style={{ textTransform: 'capitalize' }}>{meal}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Transport Mode</label>
                                        <select value={day.transportMode} onChange={(e) => handleDayChange(index, 'transportMode', e.target.value)} className="form-input">
                                            <option>Cab</option>
                                            <option>Train</option>
                                            <option>Flight</option>
                                            <option>Self Drive</option>
                                            <option>Walking</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Estimated Travel Time</label>
                                        <input value={day.travelTime} onChange={(e) => handleDayChange(index, 'travelTime', e.target.value)} className="form-input" placeholder="e.g. 2 hours" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Activities Included</label>
                                    <textarea value={day.activitiesIncluded} onChange={(e) => handleDayChange(index, 'activitiesIncluded', e.target.value)} className="form-input" placeholder="List the main attractions..." />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Entry Tickets Included?</label>
                                        <select value={day.entryTickets} onChange={(e) => handleDayChange(index, 'entryTickets', e.target.value)} className="form-input">
                                            <option>No</option>
                                            <option>Yes</option>
                                            <option>Some</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Free Time Available?</label>
                                        <select value={day.freeTime} onChange={(e) => handleDayChange(index, 'freeTime', e.target.value)} className="form-input">
                                            <option>Yes</option>
                                            <option>No</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Things to Carry</label>
                                        <input value={day.thingsToCarry} onChange={(e) => handleDayChange(index, 'thingsToCarry', e.target.value)} className="form-input" placeholder="e.g. Camera, Walking shoes" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Dress Code</label>
                                        <input value={day.dressCode} onChange={(e) => handleDayChange(index, 'dressCode', e.target.value)} className="form-input" placeholder="e.g. Modest for temples" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button type="button" onClick={addDay} className="btn btn-outline" style={{ width: '100%', borderStyle: 'dashed', padding: '16px' }}>
                            <Plus size={18} style={{ marginRight: '8px' }} /> Add Day {formData.days.length + 1}
                        </button>
                    </div>
                )}

                {/* TAB 4: LOGISTICS & SAFETY */}
                {activeTab === 4 && (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        <h3 style={{ fontSize: '1.4rem' }}>Transfers & Timing</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Pickup Location</label>
                                <input name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Pickup Time</label>
                                <input name="pickupTime" value={formData.pickupTime} onChange={handleChange} className="form-input" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Drop Location</label>
                                <input name="dropLocation" value={formData.dropLocation} onChange={handleChange} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Drop Time</label>
                                <input name="dropTime" value={formData.dropTime} onChange={handleChange} className="form-input" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Airport / Railway Transfer Included?</label>
                            <select name="airportTransfer" value={formData.airportTransfer} onChange={handleChange} className="form-input">
                                <option>No</option>
                                <option>Yes</option>
                            </select>
                        </div>

                        <div style={{ height: '1px', background: 'var(--border)', margin: '20px 0' }} />

                        <h3 style={{ fontSize: '1.4rem' }}>Safety & Guidelines</h3>
                        <div className="form-group">
                            <label className="form-label">Safety Guidelines</label>
                            <textarea name="safetyGuidelines" value={formData.safetyGuidelines} onChange={handleChange} className="form-input" placeholder="Local safety tips..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Emergency Contact Info</label>
                            <input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="form-input" placeholder="Local emergency numbers..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Travel Insurance Required?</label>
                            <select name="insuranceRequired" value={formData.insuranceRequired} onChange={handleChange} className="form-input">
                                <option>No</option>
                                <option>Yes</option>
                                <option>Strongly Recommended</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Medical Restrictions (if any)</label>
                            <textarea name="medicalRestrictions" value={formData.medicalRestrictions} onChange={handleChange} className="form-input" placeholder="e.g. High altitude, long walks..." />
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
                    <button type="button" className="btn btn-outline" onClick={() => router.back()}>Cancel</button>
                    {activeTab < 4 ? (
                        <button type="button" className="btn btn-primary" onClick={() => setActiveTab(activeTab + 1)}>Next Step</button>
                    ) : (
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            <Save size={20} style={{ marginRight: '8px' }} />
                            {isSaving ? "Saving..." : "Save Finished Itinerary"}
                        </button>
                    )}
                </div>

            </form>
        </div>
    );
}
