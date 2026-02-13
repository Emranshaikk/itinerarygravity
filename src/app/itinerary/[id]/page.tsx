import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ItineraryClientPage from '@/components/itinerary/ItineraryClientPage';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

async function getItinerary(id: string) {
    const supabase = await createClient();

    // Check if id is a UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

    let query = supabase
        .from('itineraries')
        .select(`
            *,
            profiles:creator_id (
                full_name,
                avatar_url,
                is_verified
            )
        `);

    if (isUuid) {
        query = query.eq('id', id);
    } else {
        query = query.eq('slug', id);
    }

    const { data, error } = await query.single();

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

    const title = itinerary.seo_title || `${itinerary.title} by @${itinerary.profiles?.full_name || 'Creator'}`;
    const description = itinerary.seo_description || itinerary.description || `Explore this curated travel itinerary for ${itinerary.location}.`;
    const image = itinerary.image_url || 'https://itinerarygravity.com/og-default.jpg';
    const slug = itinerary.slug || itinerary.id;
    const url = `https://itinerarygravity.com/itinerary/${slug}`;

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

    const slug = itinerary?.slug || id;
    const url = `https://itinerarygravity.com/itinerary/${slug}`;

    // Advanced Structured Data (JSON-LD)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Product',
                'name': itinerary?.title,
                'description': itinerary?.description,
                'image': itinerary?.image_url,
                'brand': {
                    '@type': 'Brand',
                    'name': 'ItineraryGravity'
                },
                'offers': {
                    '@type': 'Offer',
                    'price': itinerary?.price,
                    'priceCurrency': itinerary?.currency || 'INR',
                    'availability': 'https://schema.org/InStock',
                    'url': url
                },
                'aggregateRating': itinerary?.average_rating > 0 ? {
                    '@type': 'AggregateRating',
                    'ratingValue': itinerary.average_rating,
                    'reviewCount': itinerary.review_count || 1
                } : undefined
            },
            {
                '@type': 'Guide',
                'name': itinerary?.title,
                'abstract': itinerary?.description,
                'author': {
                    '@type': 'Person',
                    'name': itinerary?.profiles?.full_name
                },
                'publisher': {
                    '@type': 'Organization',
                    'name': 'ItineraryGravity'
                },
                'about': {
                    '@type': 'Place',
                    'name': itinerary?.location
                }
            },
            {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': 'Home',
                        'item': 'https://itinerarygravity.com'
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'name': 'Explore',
                        'item': 'https://itinerarygravity.com/explore'
                    },
                    {
                        '@type': 'ListItem',
                        'position': 3,
                        'name': itinerary?.title,
                        'item': url
                    }
                ]
            }
        ]
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
