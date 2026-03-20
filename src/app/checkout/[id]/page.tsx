"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ShieldCheck, ArrowLeft, Lock, CreditCard } from "@/components/Icons";
import { formatCurrency, convertToINR } from "@/lib/currency";

export default function CheckoutPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string || "";
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [internalId, setInternalId] = useState<string>("");
    const [couponCode, setCouponCode] = useState("");
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [discount, setDiscount] = useState<{ type: 'percentage' | 'fixed', value: number, code: string } | null>(null);
    const [item, setItem] = useState({
        title: "Loading...",
        price: 0,
        currency: "USD",
        creator: "Loading..."
    });

    useEffect(() => {
        if (!id) return;
        const fetchItinerary = async () => {
            try {
                const response = await fetch(`/api/itineraries/${id}`);
                const data = await response.json();
                if (data) {
                    setInternalId(data.id || data._id);
                    setItem({
                        title: data.title,
                        price: data.price,
                        currency: data.currency || "USD",
                        creator: data.profiles?.full_name || "Creator"
                    });
                }
            } catch (err) {
                console.error("Error fetching itinerary:", err);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchItinerary();
    }, [id]);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsValidatingCoupon(true);
        setCouponError("");
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, itineraryId: internalId || id })
            });
            const data = await res.json();
            if (data.valid) {
                setDiscount({ type: data.discountType, value: data.value, code: data.code });
                setCouponCode("");
            } else {
                setCouponError(data.error || "Invalid coupon");
            }
        } catch (err) {
            setCouponError("Failed to validate coupon");
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const calculateTotal = () => {
        let total = item.price;
        if (discount) {
            if (discount.type === 'percentage') {
                total = total * (1 - discount.value / 100);
            } else {
                total = Math.max(0, total - discount.value);
            }
        }
        return total;
    };

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itineraryId: internalId || id,
                    price: item.price,
                    title: item.title,
                    couponCode: discount?.code
                }),
            });

            const data = await response.json();

            if (data.id) {
                const options = {
                    key: data.key,
                    amount: data.amount,
                    currency: data.currency,
                    name: "ItineraryGravity",
                    description: `Purchase ${item.title}`,
                    order_id: data.id,
                    handler: async function (rzpResponse: any) {
                        try {
                            const verifyResponse = await fetch('/api/checkout/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: rzpResponse.razorpay_order_id,
                                    razorpay_payment_id: rzpResponse.razorpay_payment_id,
                                    razorpay_signature: rzpResponse.razorpay_signature,
                                    itineraryId: internalId || id,
                                    amount: data.amount
                                })
                            });

                            if (verifyResponse.ok) {
                                router.push(`/dashboard/buyer?success=true&payment_id=${rzpResponse.razorpay_payment_id}`);
                            } else {
                                alert("Failed to verify payment. Please contact support.");
                            }
                        } catch (error) {
                            console.error("Verification error:", error);
                            alert("Payment verification failed.");
                        }
                    },
                    prefill: {
                        name: "",
                        email: "",
                    },
                    theme: {
                        color: "#ff00e5",
                    },
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            } else {
                throw new Error("Failed to create checkout session");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', padding: '40px 0' }}>
            {/* Animated Mesh Gradient Background (Matches Explore Page) */}
            <div className="mesh-gradient-animate" style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '120%',
                height: '600px',
                zIndex: -1,
                opacity: 0.3,
                filter: 'blur(100px)',
                background: `
                    radial-gradient(at 0% 0%, rgba(255, 133, 162, 0.4) 0px, transparent 50%),
                    radial-gradient(at 50% 0%, rgba(139, 92, 246, 0.4) 0px, transparent 50%),
                    radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.4) 0px, transparent 50%)
                `
            }}></div>

            <div className="container" style={{ maxWidth: '800px', position: 'relative' }}>
                <button
                    onClick={() => router.back()}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--gray-400)', marginBottom: '40px' }}
                >
                    <ArrowLeft size={16} /> Back to Itinerary
                </button>

                <div className="glass card" style={{ padding: '48px', textAlign: 'center' }}>
                    {isLoadingData ? (
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Loading...</h1>
                    ) : (
                        <>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Ready to Explore?</h1>
                            <p style={{ color: 'var(--gray-400)', fontSize: '1.1rem', marginBottom: '40px' }}>
                                You're about to purchase <strong>{item.title}</strong> by {item.creator}.
                            </p>
                        </>
                    )}

                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '32px', marginBottom: '40px', maxWidth: '400px', margin: '0 auto 40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--gray-400)' }}>Original Price</span>
                            <span>{formatCurrency(item.price, item.currency)}</span>
                        </div>

                        {discount && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#10b981' }}>
                                <span>Discount ({discount.code})</span>
                                <span>-{discount.type === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value, item.currency)}</span>
                            </div>
                        )}

                        <div className="form-group" style={{ marginBottom: '24px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    className="form-input"
                                    placeholder="Coupon Code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    disabled={isValidatingCoupon || !!discount}
                                />
                                <button
                                    className="btn btn-outline"
                                    style={{ padding: '0 20px', whiteSpace: 'nowrap' }}
                                    onClick={handleApplyCoupon}
                                    disabled={isValidatingCoupon || !couponCode || !!discount}
                                >
                                    {isValidatingCoupon ? "..." : "Apply"}
                                </button>
                            </div>
                            {couponError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{couponError}</p>}
                            {discount && (
                                <button
                                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', cursor: 'pointer', padding: 0 }}
                                    onClick={() => setDiscount(null)}
                                >
                                    Remove Coupon
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.5rem', paddingTop: '12px', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
                            <span>Total</span>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <span className="text-gradient">
                                    {item.currency === 'INR' ? formatCurrency(calculateTotal(), 'INR') : `≈ ₹${convertToINR(calculateTotal(), item.currency).toFixed(2)}`}
                                </span>
                                {item.currency !== 'INR' && (
                                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 400, marginTop: '4px' }}>
                                        Original: {formatCurrency(item.price, item.currency)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="btn btn-primary"
                        style={{ padding: '20px 60px', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '12px' }}
                        disabled={isProcessing || isLoadingData}
                    >
                        {isProcessing ? (
                            "Processing..."
                        ) : (
                            <>
                                <CreditCard size={24} /> Pay with Razorpay
                            </>
                        )}
                    </button>

                    <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Lock size={16} /> SSL Secured
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={16} /> Instant Access
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
