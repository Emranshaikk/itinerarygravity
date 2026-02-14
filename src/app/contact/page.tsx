"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageCircle, MapPin, Send } from "@/components/Icons";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        // Simulate sending (replace with actual API call)
        setTimeout(() => {
            setStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setStatus("idle"), 3000);
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container" style={{ maxWidth: '1200px', padding: '60px 20px' }}>
            <header style={{ marginBottom: '48px', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '16px' }}>
                    Get in Touch
                </h1>
                <p style={{ color: 'var(--gray-400)', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', maxWidth: '600px', margin: '0 auto' }}>
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '60px' }}>
                {/* Contact Info Cards */}
                <div className="glass card" style={{ padding: '32px', textAlign: 'center' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--input-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        color: 'var(--primary)'
                    }}>
                        <Mail size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Email Us</h3>
                    <p style={{ color: 'var(--gray-400)', marginBottom: '16px', fontSize: '0.9rem' }}>
                        For general inquiries and support
                    </p>
                    <a href="mailto:support@itinerarygravity.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        support@itinerarygravity.com
                    </a>
                </div>

                <div className="glass card" style={{ padding: '32px', textAlign: 'center' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--input-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        color: 'var(--primary)'
                    }}>
                        <MessageCircle size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Live Chat</h3>
                    <p style={{ color: 'var(--gray-400)', marginBottom: '16px', fontSize: '0.9rem' }}>
                        Chat with our support team
                    </p>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                        Available Mon-Fri, 9AM-6PM IST
                    </span>
                </div>

                <div className="glass card" style={{ padding: '32px', textAlign: 'center' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--input-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        color: 'var(--primary)'
                    }}>
                        <MapPin size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Location</h3>
                    <p style={{ color: 'var(--gray-400)', marginBottom: '16px', fontSize: '0.9rem' }}>
                        Visit our office
                    </p>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                        Mumbai, Maharashtra, India
                    </span>
                </div>
            </div>

            {/* Contact Form */}
            <div className="glass card" style={{ padding: 'clamp(32px, 5vw, 48px)', maxWidth: '700px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '24px', textAlign: 'center' }}>Send us a Message</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Your Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Subject *</label>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="form-input"
                            style={{ outline: 'none' }}
                            required
                        >
                            <option value="" style={{ background: '#1a1a1a', color: '#ffffff' }}>Select a subject</option>
                            <option value="general" style={{ background: '#1a1a1a', color: '#ffffff' }}>General Inquiry</option>
                            <option value="support" style={{ background: '#1a1a1a', color: '#ffffff' }}>Technical Support</option>
                            <option value="creator" style={{ background: '#1a1a1a', color: '#ffffff' }}>Creator Account</option>
                            <option value="payment" style={{ background: '#1a1a1a', color: '#ffffff' }}>Payment Issue</option>
                            <option value="partnership" style={{ background: '#1a1a1a', color: '#ffffff' }}>Partnership Opportunity</option>
                            <option value="other" style={{ background: '#1a1a1a', color: '#ffffff' }}>Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Message *</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Tell us how we can help you..."
                            rows={6}
                            required
                        />
                    </div>

                    {status === "success" && (
                        <div style={{
                            padding: '16px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid #10b981',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            color: '#10b981',
                            textAlign: 'center'
                        }}>
                            ✓ Message sent successfully! We'll get back to you soon.
                        </div>
                    )}

                    {status === "error" && (
                        <div style={{
                            padding: '16px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid #ef4444',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            color: '#ef4444',
                            textAlign: 'center'
                        }}>
                            ✗ Something went wrong. Please try again.
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        disabled={status === "sending"}
                    >
                        {status === "sending" ? (
                            "Sending..."
                        ) : (
                            <>
                                <Send size={18} />
                                Send Message
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* FAQ Link */}
            <div style={{ marginTop: '60px', textAlign: 'center', padding: '40px 20px', background: 'var(--surface)', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Looking for Quick Answers?</h3>
                <p style={{ color: 'var(--gray-400)', marginBottom: '24px' }}>
                    Check out our FAQ page for instant answers to common questions.
                </p>
                <Link href="/faq" className="btn btn-outline">
                    Visit FAQ
                </Link>
            </div>
        </div>
    );
}
