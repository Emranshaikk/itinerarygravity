import { createClient } from "@/lib/supabase/server";
import ItineraryCard from "@/components/ItineraryCard";
import Breadcrumbs from "@/components/itinerary/Breadcrumbs";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
    params: { destination: string };
}

async function getItinerariesByDestination(destination: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('itineraries')
        .select(`
            *,
            profiles:creator_id (
                full_name,
                avatar_url,
                is_verified
            )
        `)
        .eq('is_approved', true)
        .ilike('location', `%${destination}%`)
        .order('average_rating', { ascending: false });

    if (error) return [];
    return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { destination } = await params;
    const decodedDest = decodeURIComponent(destination);
    const title = `Best ${decodedDest} Itineraries & Travel Guides | ItineraryGravity`;
    const description = `Explore the best hand-picked travel itineraries for ${decodedDest} created by top influencers. Save time and travel like a local.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        }
    };
}

export default async function DestinationPage({ params }: Props) {
    const { destination } = await params;
    const decodedDest = decodeURIComponent(destination);
    const itineraries = await getItinerariesByDestination(decodedDest);

    if (itineraries.length === 0) {
        notFound();
    }

    return (
        <div style={{ padding: '60px 0', minHeight: '100vh' }}>
            <div className="container">
                <Breadcrumbs
                    items={[
                        { label: 'Explore', href: '/explore' },
                        { label: decodedDest }
                    ]}
                />

                <div style={{ marginBottom: '60px' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '16px' }}>
                        {decodedDest} Travel Guides
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--gray-400)', maxWidth: '700px' }}>
                        Discover {itineraries.length} expert-curated itineraries for your next trip to {decodedDest}.
                        Each guide is created by travelers who have personally explored these paths.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
                    {itineraries.map((itinerary: any) => (
                        <ItineraryCard
                            key={itinerary.id}
                            itinerary={{
                                id: itinerary.id,
                                slug: itinerary.slug,
                                title: itinerary.title,
                                creator: itinerary.profiles?.full_name || "@Creator",
                                location: itinerary.location,
                                price: Number(itinerary.price),
                                average_rating: Number(itinerary.average_rating),
                                review_count: itinerary.review_count,
                                image: itinerary.image_url || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800",
                                tags: itinerary.tags || [],
                                is_verified: itinerary.profiles?.is_verified
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
