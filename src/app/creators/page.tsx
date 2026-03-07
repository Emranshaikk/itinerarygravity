"use client";

import Link from "next/link";
import { ShieldCheck, Download, Star, Plus, MapPin, Globe, ArrowRight, CheckCircle2, TrendingUp } from "@/components/Icons";

export default function CreatorsPage() {
    const handleCreatorSignup = (e: React.MouseEvent) => {
        // We'll use a sessionStorage flag to tell the dashboard to set the role after signup
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('pending_role', 'influencer');
        }
    };

    return (
        <div>
            {/* 1. The Hook (Hero Section) */}
            <section style={{
                padding: '120px 0',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center'
            }}>
                {/* Animated Mesh Gradient Background */}
                <div className="mesh-gradient-animate" style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '120%',
                    height: '100%',
                    zIndex: -1,
                    opacity: 0.3,
                    filter: 'blur(80px)',
                    background: `
                        radial-gradient(at 0% 0%, rgba(255, 133, 162, 0.4) 0px, transparent 50%),
                        radial-gradient(at 50% 0%, rgba(139, 92, 246, 0.4) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.4) 0px, transparent 50%)
                    `
                }}></div>
                <div className="container">
                    <span className="badge" style={{ background: 'var(--surface)', border: '1px solid var(--primary)', marginBottom: '24px', color: 'var(--primary)' }}>
                        Made for Travel Creators
                    </span>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                        fontWeight: 800,
                        marginBottom: '24px',
                        lineHeight: 1.1
                    }}>
                        Stop Answering 'Which Hotel?'<br />
                        <span className="text-gradient">DMs for Free.</span>
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                        color: 'var(--gray-400)',
                        maxWidth: '700px',
                        margin: '0 auto 48px',
                        lineHeight: '1.8',
                        padding: '0 20px'
                    }}>
                        Turn your travel expertise into a recurring revenue stream in under 10 minutes. Build a premium storefront, sell beautiful itineraries, and keep 70% of every sale. Zero coding required.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        padding: '0 20px'
                    }}>
                        <Link
                            href="/signup"
                            onClick={handleCreatorSignup}
                            className="btn btn-primary"
                            style={{ padding: '16px 40px', fontSize: '1.1rem', minWidth: '200px' }}
                        >
                            Start Creating Now
                        </Link>
                        <Link href="#how-it-works" className="btn btn-outline" style={{ padding: '16px 40px', fontSize: '1.1rem', minWidth: '200px' }}>
                            See How It Works
                        </Link>
                    </div>

                    {/* Stats/Trust Bar */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '64px', flexWrap: 'wrap', color: 'var(--gray-400)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={20} color="var(--primary)" /> Free Trial Available</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={20} color="var(--primary)" /> Secure Payments</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={20} color="var(--primary)" /> Global Reach</div>
                    </div>
                </div>
            </section>

            {/* 2. "The Creator Arsenal" (Expanded Features) */}
            <section style={{ padding: '100px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '800px', margin: '0 auto 80px' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '16px' }}>Everything You Need to Scale</h2>
                        <p style={{ color: 'var(--gray-400)', fontSize: '1.1rem' }}>We built the boring stuff so you can focus on traveling and creating content. ItineraryGravity gives you an enterprise-grade toolkit out of the box.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        {[
                            {
                                icon: <Globe color="var(--primary)" size={32} />,
                                title: "Zero-Friction Storefront",
                                desc: "Get a beautiful, SEO-optimized landing page for every itinerary. No domains to configure, no plugins to manage."
                            },
                            {
                                icon: <Star color="var(--primary)" size={32} />,
                                title: "70% Revenue Share",
                                desc: "Keep the lion's share of your hard work. We cover server costs, payment processing fees, and PDF generation overhead."
                            },
                            {
                                icon: <MapPin color="var(--primary)" size={32} />,
                                title: "Interactive Map Magic",
                                desc: "Drop pins on our interactive map builder. We automatically generate a gorgeous routing map for the web and static images for your PDF."
                            },
                            {
                                icon: <ShieldCheck color="var(--primary)" size={32} />,
                                title: "Building Radical Trust",
                                desc: "Earn the 'Verified Creator' badge. It signals to your audience that your itineraries are premium, vetted, and trustworthy."
                            },
                            {
                                icon: <ArrowRight color="var(--primary)" size={32} />,
                                title: "Global Payments (Razorpay)",
                                desc: "Sell to anyone, anywhere. We handle complex international payments and currency conversion seamlessly."
                            },
                            {
                                icon: <Download color="var(--primary)" size={32} />,
                                title: "Automated PDF Delivery",
                                desc: "Buyers get instant access and a beautifully formatted PDF download the second their payment clears. No manual emailing required."
                            }
                        ].map((item, i) => (
                            <div key={i} className="glass card card-hover" style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.05)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>{item.title}</h3>
                                <p style={{ color: 'var(--gray-400)', lineHeight: '1.6', flexGrow: 1 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. "How it Works" (New Section) */}
            <section id="how-it-works" style={{ padding: '100px 0', background: 'var(--surface)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '16px' }}>From Idea to Income in 3 Steps</h2>
                        <p style={{ color: 'var(--gray-400)', fontSize: '1.1rem' }}>It's literally as easy as filling out a form.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
                        {[
                            { step: "01", title: "Dump Your Brain", desc: "Use our intuitive, block-based builder to input your favorite spots, local secrets, and daily walking routes." },
                            { step: "02", title: "We Make it Beautiful", desc: "Our engine instantly turns your brain dump into a stunning, fast-loading web page and a downloadable PDF guide." },
                            { step: "03", title: "Share & Earn", desc: "Drop your unique shortlink in your Instagram bio, YouTube description, or TikTok. Watch the automated sales roll in." }
                        ].map((item, i) => (
                            <div key={i} style={{ position: 'relative', padding: '24px' }}>
                                <div className="text-gradient" style={{ fontSize: '4rem', fontWeight: 800, opacity: 0.3, position: 'absolute', top: -10, left: 10, zIndex: 0 }}>
                                    {item.step}
                                </div>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', paddingTop: '20px' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.6' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Social Proof / Testimonials (Mock) */}
            <section style={{ padding: '100px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>Creators Are Leveling Up</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        <div className="glass card" style={{ padding: '40px' }}>
                            <Star color="#fbbf24" fill="#fbbf24" size={20} style={{ marginBottom: '20px' }} />
                            <Star color="#fbbf24" fill="#fbbf24" size={20} style={{ marginBottom: '20px' }} />
                            <Star color="#fbbf24" fill="#fbbf24" size={20} style={{ marginBottom: '20px' }} />
                            <Star color="#fbbf24" fill="#fbbf24" size={20} style={{ marginBottom: '20px' }} />
                            <Star color="#fbbf24" fill="#fbbf24" size={20} style={{ marginBottom: '20px' }} />
                            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '24px', lineHeight: '1.6' }}>
                                "I used to spend hours designing Canva PDFs that looked terrible on mobile and handling manual PayPal payments. ItineraryGravity did it for me in 5 minutes. My audience loves the built-in map!"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }} />
                                <div>
                                    <p style={{ fontWeight: 700 }}>@alexexplores</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>120k Followers</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass card" style={{ padding: '40px' }}>
                            <Star color="#fbbf24" fill="#fbbf24" size={20} style={{ marginBottom: '20px' }} />
                            <Star color="#fbbf24" fill="#fbbf24" size={20} style={{ marginBottom: '20px' }} />
                            <Star color="#fbbf24" fill="#fbbf24" size={20} style={{ marginBottom: '20px' }} />
                            <Star color="#fbbf24" fill="#fbbf24" size={20} style={{ marginBottom: '20px' }} />
                            <Star color="#fbbf24" fill="#fbbf24" size={20} style={{ marginBottom: '20px' }} />
                            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '24px', lineHeight: '1.6' }}>
                                "The verified badge and the clean storefront completely changed how my audience views my recommendations. It looks like I spent thousands on developer fees."
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)' }} />
                                <div>
                                    <p style={{ fontWeight: 700 }}>@sarah.travels</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>85k Followers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. The Final Push (Bottom CTA & Pricing) */}
            <section style={{ padding: '100px 0', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
                <div className="container">
                    <div className="glass card" style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '60px',
                        padding: 'clamp(30px, 5vw, 60px)',
                        alignItems: 'center',
                        border: '1px solid var(--primary)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 50%)', zIndex: 0 }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', marginBottom: '16px' }}>Unlock Your Creator Business</h2>
                            <p style={{ color: 'var(--gray-400)', marginBottom: '32px', fontSize: 'clamp(1rem, 2vw, 1.1rem)', lineHeight: '1.6' }}>
                                For less than a Netflix subscription ($9.99/mo), unlock the ability to sell endless itineraries, get the verified badge, and keep 70% of everything you make.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', color: 'var(--gray-400)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="var(--primary)" /> Unlimited Itineraries</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="var(--primary)" /> Verified Profile Badge</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} color="var(--primary)" /> Automated Map & PDF Engine</li>
                            </ul>
                            <Link href="/signup" onClick={handleCreatorSignup} className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
                                Connect Razorpay & Start Selling
                            </Link>
                        </div>
                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <div className="glass" style={{ borderRadius: '20px', padding: '32px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <h4 style={{ color: 'var(--gray-400)', marginBottom: '8px' }}>Your Potential Earnings</h4>
                                <div className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '8px' }}>$700</div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)' }}>Selling ten $10 itineraries to 10 buyers per month.</p>
                                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                                    <TrendingUp size={24} color="var(--primary)" style={{ marginBottom: '8px' }} />
                                    <p style={{ fontSize: '0.85rem' }}>It pays for itself with just 2 sales.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
