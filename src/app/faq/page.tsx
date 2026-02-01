"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "@/components/Icons";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const faqs: FAQItem[] = [
        // General Questions
        {
            category: "general",
            question: "What is ItineraryGravity?",
            answer: "ItineraryGravity is a marketplace where travel influencers and creators can sell their detailed travel itineraries to followers. Buyers get access to verified, high-quality travel guides with insider tips, recommended hotels, restaurants, and hidden gems."
        },
        {
            category: "general",
            question: "How does ItineraryGravity work?",
            answer: "Creators upload detailed itineraries with photos, daily schedules, and recommendations. Buyers browse the marketplace, purchase itineraries they're interested in, and download them as PDFs or view them interactively on our platform."
        },
        {
            category: "general",
            question: "Is my payment information secure?",
            answer: "Yes! We use industry-standard encryption and secure payment processors (Stripe and Razorpay) to protect your payment information. We never store your full credit card details on our servers."
        },

        // For Buyers
        {
            category: "buyers",
            question: "How do I purchase an itinerary?",
            answer: "Simply browse our Explore page, click on an itinerary you like, and click 'Purchase'. You'll be redirected to a secure checkout page. After payment, you'll have instant access to download the PDF and view it online."
        },
        {
            category: "buyers",
            question: "Can I get a refund?",
            answer: "Digital products are generally non-refundable. However, if there's a technical issue, duplicate purchase, or the content significantly differs from its description, please contact our support team within 7 days of purchase."
        },
        {
            category: "buyers",
            question: "What format are the itineraries in?",
            answer: "Itineraries are available as downloadable PDFs and can also be viewed interactively on our website. PDFs are optimized for both digital viewing and printing."
        },
        {
            category: "buyers",
            question: "Can I share purchased itineraries with others?",
            answer: "Itineraries are for personal use only. Sharing, reselling, or distributing purchased content violates our Terms of Service and the creator's intellectual property rights."
        },

        // For Creators
        {
            category: "creators",
            question: "How do I become a creator?",
            answer: "Click 'Become a Creator' on our homepage, sign up, and complete your profile. To start selling, you'll need to get verified by subscribing to our Creator plan ($9.99/month) and submitting identity proof."
        },
        {
            category: "creators",
            question: "How much commission does ItineraryGravity take?",
            answer: "We take a 30% platform fee on all sales. You keep 70% of the revenue from your itineraries. This covers payment processing, hosting, marketing, and platform maintenance."
        },
        {
            category: "creators",
            question: "When do I get paid?",
            answer: "Earnings are processed monthly. Payments are made on the 1st of each month for the previous month's sales, provided you've reached the minimum payout threshold of $50."
        },
        {
            category: "creators",
            question: "What is the verification process?",
            answer: "After subscribing to the Creator plan, you'll need to submit a government-issued ID and proof of your travel content (social media profiles, blog, etc.). Our team reviews applications within 24-48 hours."
        },
        {
            category: "creators",
            question: "Can I set my own prices?",
            answer: "Yes! You have full control over pricing your itineraries. We recommend pricing between $10-$50 depending on the destination, duration, and detail level."
        },
        {
            category: "creators",
            question: "How detailed should my itinerary be?",
            answer: "The more detailed, the better! Include daily schedules, specific restaurant recommendations, hotel suggestions, transportation tips, estimated costs, best times to visit attractions, and insider tips that only a local would know."
        },

        // Technical
        {
            category: "technical",
            question: "What devices can I use to access itineraries?",
            answer: "Our platform works on all modern devices - desktop computers, laptops, tablets, and smartphones. PDFs can be downloaded and viewed on any device with a PDF reader."
        },
        {
            category: "technical",
            question: "Do I need an account to purchase?",
            answer: "Yes, you need to create a free account to purchase and access itineraries. This allows you to manage your library and re-download purchases anytime."
        },
        {
            category: "technical",
            question: "Can I access my purchases offline?",
            answer: "Yes! Once you download the PDF version of an itinerary, you can access it offline anytime. We recommend downloading before your trip."
        },

        // Payment & Pricing
        {
            category: "payment",
            question: "What payment methods do you accept?",
            answer: "We accept all major credit/debit cards (Visa, Mastercard, American Express), UPI, net banking, and digital wallets through our payment partners Stripe and Razorpay."
        },
        {
            category: "payment",
            question: "Are there any hidden fees?",
            answer: "No hidden fees! The price you see is the price you pay. For creators, the 30% platform fee is clearly stated, and the verification subscription is $9.99/month with no additional charges."
        },
        {
            category: "payment",
            question: "Can I cancel my creator subscription?",
            answer: "Yes, you can cancel your creator subscription anytime from your dashboard. You'll retain access until the end of your current billing period. Your published itineraries will remain available for purchase."
        }
    ];

    const categories = [
        { id: "all", label: "All Questions" },
        { id: "general", label: "General" },
        { id: "buyers", label: "For Buyers" },
        { id: "creators", label: "For Creators" },
        { id: "technical", label: "Technical" },
        { id: "payment", label: "Payment & Pricing" }
    ];

    const filteredFAQs = activeCategory === "all"
        ? faqs
        : faqs.filter(faq => faq.category === activeCategory);

    return (
        <div className="container" style={{ maxWidth: '1000px', padding: '60px 20px' }}>
            <header style={{ marginBottom: '48px', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '16px' }}>
                    Frequently Asked Questions
                </h1>
                <p style={{ color: 'var(--gray-400)', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', maxWidth: '600px', margin: '0 auto' }}>
                    Find answers to common questions about ItineraryGravity
                </p>
            </header>

            {/* Category Filter */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '40px',
                overflowX: 'auto',
                paddingBottom: '8px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => {
                            setActiveCategory(category.id);
                            setOpenIndex(null);
                        }}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '99px',
                            border: activeCategory === category.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                            background: activeCategory === category.id ? 'var(--input-bg)' : 'transparent',
                            color: activeCategory === category.id ? 'var(--primary)' : 'var(--gray-400)',
                            fontWeight: activeCategory === category.id ? 600 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                            fontSize: '0.9rem'
                        }}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {/* FAQ Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredFAQs.map((faq, index) => (
                    <div
                        key={index}
                        className="glass card"
                        style={{
                            padding: '0',
                            overflow: 'hidden',
                            border: openIndex === index ? '1px solid var(--primary)' : '1px solid var(--border)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            style={{
                                width: '100%',
                                padding: '24px',
                                background: 'transparent',
                                border: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '16px',
                                color: 'var(--foreground)'
                            }}
                        >
                            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                {faq.question}
                            </span>
                            <ChevronDown
                                size={20}
                                style={{
                                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s',
                                    flexShrink: 0,
                                    color: 'var(--primary)'
                                }}
                            />
                        </button>

                        {openIndex === index && (
                            <div style={{
                                padding: '0 24px 24px 24px',
                                color: 'var(--gray-400)',
                                lineHeight: '1.8',
                                animation: 'fadeIn 0.2s ease-in'
                            }}>
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Still have questions? */}
            <div style={{
                marginTop: '60px',
                textAlign: 'center',
                padding: '40px 20px',
                background: 'var(--surface)',
                borderRadius: '16px'
            }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Still have questions?</h3>
                <p style={{ color: 'var(--gray-400)', marginBottom: '24px' }}>
                    Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/contact" className="btn btn-primary">
                        Contact Support
                    </Link>
                    <Link href="/creators" className="btn btn-outline">
                        Become a Creator
                    </Link>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
