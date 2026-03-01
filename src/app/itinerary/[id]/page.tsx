import { Metadata } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { Itinerary } from "@/models/Itinerary";
import { Purchase } from "@/models/Purchase";
import { Review } from "@/models/Review";
import ItineraryClientPage from '@/components/itinerary/ItineraryClientPage';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

async function getItinerary(id: string) {
    await connectToDatabase();

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { slug: id };

    const itinerary = await Itinerary.findOne(query)
        .populate('creator_id', 'full_name avatar_url is_verified')
        .lean();

    if (!itinerary) return null;

    // Convert MongoDB document to match the structure the frontend expects
    const mapped = {
        ...itinerary,
        id: itinerary._id.toString(),
        profiles: itinerary.creator_id ? {
            full_name: (itinerary.creator_id as any).full_name,
            avatar_url: (itinerary.creator_id as any).avatar_url,
            is_verified: (itinerary.creator_id as any).is_verified,
        } : null,
    };

    return mapped;
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
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    let isPurchased = false;
    let initialUserReview = null;

    if (user && itinerary) {
        await connectToDatabase();
        const purchase = await Purchase.findOne({
            user_id: user.id,
            itinerary_id: itinerary.id,
            status: 'completed'
        }).lean();

        if (purchase) isPurchased = true;

        const review = await Review.findOne({
            user_id: user.id,
            itinerary_id: itinerary.id
        }).lean();

        if (review) {
            initialUserReview = { ...review, id: review._id.toString() };
        }
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
                    'priceCurrency': itinerary?.currency || 'USD',
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
                initialUserReview={initialUserReview}
            />
        </>
    );
}
