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
            <div className="container" style={{ padding: '0 0 60px 0' }}>
                {/* Dynamic Cover Photo Background */}
                <div style={{
                    width: '100vw',
                    position: 'relative',
                    left: '50%',
                    right: '50%',
                    marginLeft: '-50vw',
                    marginRight: '-50vw',
                    height: '350px',
                    background: creator.image ? `linear-gradient(to bottom, rgba(0,0,0,0.1), var(--background)), url(${creator.image})` : 'linear-gradient(45deg, var(--primary), var(--secondary))',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    marginBottom: '-100px',
                    filter: 'blur(2px) brightness(0.6)',
                    zIndex: -1
                }}></div>

                {/* Profile Header Card */}
                <div className="glass card" style={{
                    padding: '40px',
                    marginBottom: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '24px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{
                        width: '150px',
                        height: '150px',
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
                        border: '6px solid var(--background)',
                        marginTop: '-100px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                    }}>
                        {!creator.image && creator.name.charAt(0)}
                    </div>

                    <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0', lineHeight: 1 }}>{creator.name}</h1>
                            <ShieldCheck size={28} color="var(--primary)" />
                        </div>
                        <p className="text-gradient" style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '24px' }}>{creator.handle}</p>
                        <p style={{ color: 'var(--gray-400)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px' }}>
                            {creator.bio}
                        </p>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '16px',
                            width: '100%',
                            maxWidth: '500px',
                            background: 'rgba(255,255,255,0.03)',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '1px solid var(--border)'
                        }}>
                            <div>
                                <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{creator.followers}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '1px' }}>Followers</p>
                            </div>
                            <div style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                    <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{creator.rating}</p>
                                    <Star size={16} color="#fbbf24" fill="#fbbf24" />
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '1px' }}>{creator.reviews} Reviews</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{creator.itineraries.length}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '1px' }}>Guides</p>
                            </div>
                        </div>

                        {/* Social Links */}
                        {Math.max(Object.values(creator.social_links || {}).filter(Boolean).length) > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '32px' }}>
                                {creator.social_links.instagram && (
                                    <a href={`https://instagram.com/${creator.social_links.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground)', opacity: 0.6, transition: 'all 0.2s', padding: '12px', background: 'var(--surface)', borderRadius: '50%', border: '1px solid var(--border)' }}>
                                        <Instagram size={20} />
                                    </a>
                                )}
                                {creator.social_links.tiktok && (
                                    <a href={`https://tiktok.com/@${creator.social_links.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground)', opacity: 0.6, transition: 'all 0.2s', padding: '12px', background: 'var(--surface)', borderRadius: '50%', border: '1px solid var(--border)' }}>
                                        <Video size={20} />
                                    </a>
                                )}
                                {creator.social_links.youtube && (
                                    <a href={creator.social_links.youtube} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground)', opacity: 0.6, transition: 'all 0.2s', padding: '12px', background: 'var(--surface)', borderRadius: '50%', border: '1px solid var(--border)' }}>
                                        <Youtube size={20} />
                                    </a>
                                )}
                                {creator.social_links.twitter && (
                                    <a href={`https://twitter.com/${creator.social_links.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground)', opacity: 0.6, transition: 'all 0.2s', padding: '12px', background: 'var(--surface)', borderRadius: '50%', border: '1px solid var(--border)' }}>
                                        <Twitter size={20} />
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
