import { Metadata } from 'next';
import Image from "next/image";
import { ShieldCheck, MapPin, Star, Instagram, Youtube, Twitter, Video } from "lucide-react";
import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { Itinerary } from "@/models/Itinerary";

interface Props {
    params: Promise<{ username: string }>;
}

async function getCreatorData(username: string) {
    if (!username) return null;

    try {
        await connectToDatabase();

        // Find by username first
        let profile = await User.findOne({ username }).lean();

        // If not found, try by ObjectId
        if (!profile && /^[0-9a-fA-F]{24}$/.test(username)) {
            profile = await User.findById(username).lean();
        }

        if (!profile) return null;

        // Fetch itineraries
        const itineraries = await Itinerary.find({
            creator_id: profile._id,
            is_published: true
        })
            .sort({ createdAt: -1 })
            .lean();

        const totalReviews = itineraries.reduce((sum, it: any) => sum + (it.review_count || 0), 0);
        const validRatings = itineraries.filter((it: any) => it.average_rating > 0);
        const averageRating = validRatings.length > 0
            ? validRatings.reduce((sum, it: any) => sum + it.average_rating, 0) / validRatings.length
            : 0;

        // Map to frontend structure
        const mappedCreator = {
            id: profile._id.toString(),
            name: profile.full_name || "Traveler",
            handle: `@${profile.username || "traveler"}`,
            image: profile.avatar_url,
            bio: profile.bio || "Travel enthusiast and itinerary creator.",
            followers: "124",
            rating: Number(averageRating.toFixed(1)),
            reviews: totalReviews,
            social_links: profile.social_links || {},
            itineraries: itineraries.map((item: any) => ({
                id: item._id.toString(),
                title: item.title,
                location: item.location,
                image: item.image_url || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
                price: item.price,
                rating: item.average_rating || 0
            }))
        };

        return mappedCreator;
    } catch (err) {
        console.error("Error fetching creator data:", err);
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params;
    const creator = await getCreatorData(username);

    if (!creator) {
        return {
            title: 'Creator Not Found | ItineraryGravity',
        };
    }

    const title = `${creator.name} (@${creator.handle.replace('@', '')}) | ItineraryGravity`;
    const description = creator.bio || `Check out ${creator.name}'s amazing travel itineraries on ItineraryGravity!`;
    const image = creator.image || 'https://itinerarygravity.com/og-default.jpg';
    const url = `https://itinerarygravity.com/creators/${username}`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            type: 'profile',
            images: [{ url: image }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}

export default async function CreatorProfilePage({ params }: Props) {
    const { username } = await params;
    const creator = await getCreatorData(username);

    if (!creator) {
        return (
            <div className="container" style={{ padding: '60px 0', minHeight: '60vh', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Creator not found</h2>
                <p style={{ color: 'var(--gray-400)', marginBottom: '32px' }}>This profile might be private or doesn't exist yet.</p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link href="/dashboard/influencer" className="btn btn-outline">Go to Dashboard</Link>
                    <Link href="/" className="btn btn-primary">Go Home</Link>
                </div>
            </div>
        );
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        'mainEntity': {
            '@type': 'Person',
            'name': creator.name,
            'alternateName': creator.handle,
            'description': creator.bio,
            'image': creator.image,
            'url': `https://itinerarygravity.com/creators/${username}`,
            'sameAs': [
                creator.social_links?.instagram ? `https://instagram.com/${creator.social_links.instagram.replace('@', '')}` : undefined,
                creator.social_links?.tiktok ? `https://tiktok.com/@${creator.social_links.tiktok.replace('@', '')}` : undefined,
                creator.social_links?.youtube ? creator.social_links.youtube : undefined,
                creator.social_links?.twitter ? `https://twitter.com/${creator.social_links.twitter.replace('@', '')}` : undefined
            ].filter(Boolean)
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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

                        {/* Social Links */}
                        {Math.max(Object.values(creator.social_links || {}).filter(Boolean).length) > 0 && (
                            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                                {creator.social_links.instagram && (
                                    <a href={`https://instagram.com/${creator.social_links.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground)', opacity: 0.8, transition: 'opacity 0.2s' }}>
                                        <Instagram size={24} />
                                    </a>
                                )}
                                {creator.social_links.tiktok && (
                                    <a href={`https://tiktok.com/@${creator.social_links.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground)', opacity: 0.8, transition: 'opacity 0.2s' }}>
                                        <Video size={24} />
                                    </a>
                                )}
                                {creator.social_links.youtube && (
                                    <a href={creator.social_links.youtube} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground)', opacity: 0.8, transition: 'opacity 0.2s' }}>
                                        <Youtube size={24} />
                                    </a>
                                )}
                                {creator.social_links.twitter && (
                                    <a href={`https://twitter.com/${creator.social_links.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground)', opacity: 0.8, transition: 'opacity 0.2s' }}>
                                        <Twitter size={24} />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Creator's Itineraries */}
                <h2 style={{ fontSize: '2rem', marginBottom: '32px' }}>Guides by {creator.name}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
                    {creator.itineraries.map((item: any) => (
                        <Link href={`/itinerary/${item.id}`} key={item.id} className="glass card" style={{ padding: '0', overflow: 'hidden', display: 'block' }}>
                            <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                                <Image
                                    src={item.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34"}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{item.title}</h3>
                                <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '20px' }}>
                                    {item.location}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>${item.price.toFixed(2)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Star size={16} color="#fbbf24" fill={item.rating > 0 ? "#fbbf24" : "none"} />
                                        <span style={{ fontWeight: 600 }}>{item.rating > 0 ? item.rating : 'New'}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
