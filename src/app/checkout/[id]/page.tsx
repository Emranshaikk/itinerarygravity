"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ShieldCheck, ArrowLeft, Lock, CreditCard } from "@/components/Icons";

export default function CheckoutPage() {
    const router = useRouter();
    const params = useParams();
    const [isProcessing, setIsProcessing] = useState(false);

    const id = params?.id as string || "";
    const isKyoto = id === "kyoto-traditional";

    const item = {
        title: isKyoto ? "7 Days in Kyoto: The Ultimate Guide" : "Bali: Hidden Gems",
        price: isKyoto ? 15.00 : 12.00,
        currency: "USD",
        creator: isKyoto ? "@SarahTravels" : "@BaliExplorer"
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
                    itineraryId: id,
                    price: item.price,
                    title: item.title,
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
                    handler: function (response: any) {
                        // In a real app, you would verify the payment on the backend here
                        // For now we'll just redirect to success
                        router.push(`/dashboard/buyer?success=true&payment_id=${response.razorpay_payment_id}`);
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
        <div className="container" style={{ padding: '40px 0', maxWidth: '800px' }}>
            <button
                onClick={() => router.back()}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--gray-400)', marginBottom: '40px' }}
            >
                <ArrowLeft size={16} /> Back to Itinerary
            </button>

            <div className="glass card" style={{ padding: '48px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Ready to Explore?</h1>
                <p style={{ color: 'var(--gray-400)', fontSize: '1.1rem', marginBottom: '40px' }}>
                    You're about to purchase <strong>{item.title}</strong> by {item.creator}.
                </p>

                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '32px', marginBottom: '40px', maxWidth: '400px', margin: '0 auto 40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: 'var(--gray-400)' }}>Price</span>
                        <span>₹{item.price.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.5rem', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                        <span>Total</span>
                        <span className="text-gradient">₹{item.price.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={handleCheckout}
                    className="btn btn-primary"
                    style={{ padding: '20px 60px', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '12px' }}
                    disabled={isProcessing}
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
    );
}
