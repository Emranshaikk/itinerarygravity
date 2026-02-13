import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ItineraryClientPage from '@/components/itinerary/ItineraryClientPage';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

async function getItinerary(id: string) {
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
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const itinerary = await getItinerary(id);

    if (!itinerary) {
        return {
            title: 'Itinerary Not Found | ItineraryGravity',
        };
    }

    const title = `${itinerary.title} by @${itinerary.profiles?.full_name || 'Creator'}`;
    const description = itinerary.description || `Explore this curated travel itinerary for ${itinerary.location}.`;
    const image = itinerary.image_url || 'https://itinerarygravity.com/og-default.jpg';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
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

export default async function Page({ params }: Props) {
    const { id } = await params;
    const itinerary = await getItinerary(id);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let isPurchased = false;
    if (user) {
        const { data: purchase } = await supabase
            .from('purchases')
            .select('id')
            .eq('user_id', user.id)
            .eq('itinerary_id', id)
            .single();
        if (purchase) isPurchased = true;
    }

    if (!itinerary && id !== "kyoto-traditional" && id !== "bali-hidden") {
        notFound();
    }

    // Structured Data (JSON-LD)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TravelAction',
        'name': itinerary?.title || 'Travel Itinerary',
        'description': itinerary?.description,
        'url': `https://itinerarygravity.com/itinerary/${id}`,
        'provider': {
            '@type': 'Person',
            'name': itinerary?.profiles?.full_name,
        },
        'location': {
            '@type': 'Place',
            'name': itinerary?.location,
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ItineraryClientPage
                id={id}
                initialData={itinerary}
                initialIsPurchased={isPurchased}
                initialUser={user}
            />
        </>
    );
}
