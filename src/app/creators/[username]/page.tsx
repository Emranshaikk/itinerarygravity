"use client";

import { useParams } from "next/navigation";
import { ShieldCheck, MapPin, Star } from "@/components/Icons";
import Link from "next/link";

export default function CreatorProfilePage() {
    const params = useParams();
    const username = params?.username as string || "traveler";

    const creator = {
        name: "Sarah Travels",
        image: username === "sarah_travels" ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200" : null,
        handle: `@${(username || "").replace('-', '_')}`,
        bio: "Full-time traveler and photographer. I've been to 45 countries and counting. My guides focus on high-end experiences, hidden photographic spots, and late-night food gems.",
        followers: "124k",
        rating: 4.9,
        reviews: 342,
        itineraries: [
            {
                id: "kyoto-traditional",
                title: "Kyoto: Traditional Japan",
                location: "Kyoto, Japan",
                price: 15.00,
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400"
            },
            {
                id: "amalfi-summer",
                title: "Amalfi Coast Summer",
                location: "Amalfi, Italy",
                price: 25.00,
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=400"
            }
        ]
    };

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            {/* Profile Header */}
            <div className="glass card" style={{ padding: '60px', marginBottom: '60px', display: 'flex', gap: '48px', alignItems: 'center' }}>
                <div style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: creator.image ? `url(${creator.image})` : 'linear-gradient(45deg, var(--primary), var(--secondary))',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    fontWeight: 800,
                    color: 'white',
                    flexShrink: 0,
                    border: '4px solid var(--border)'
                }}>
                    {!creator.image && creator.name.charAt(0)}
                </div>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0' }}>{creator.name}</h1>
                        <ShieldCheck size={28} color="var(--primary)" />
                    </div>
                    <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.2rem', marginBottom: '16px' }}>{creator.handle}</p>
                    <p style={{ color: 'var(--gray-400)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '24px', maxWidth: '600px' }}>
                        {creator.bio}
                    </p>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        <div>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{creator.followers}</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)' }}>Followers</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{creator.rating}</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)' }}>Rating ({creator.reviews})</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{creator.itineraries.length}</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)' }}>Itineraries</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Creator's Itineraries */}
            <h2 style={{ fontSize: '2rem', marginBottom: '32px' }}>Guides by {creator.name}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
                {creator.itineraries.map((item) => (
                    <Link href={`/itinerary/${item.id}`} key={item.id} className="glass card" style={{ padding: '0', overflow: 'hidden', display: 'block' }}>
                        <div style={{
                            height: '200px',
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }} />
                        <div style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{item.title}</h3>
                            <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '20px' }}>
                                {item.location}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>${item.price.toFixed(2)}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Star size={16} color="#fbbf24" fill="#fbbf24" />
                                    <span style={{ fontWeight: 600 }}>{item.rating}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
