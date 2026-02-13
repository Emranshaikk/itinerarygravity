import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();
    const baseUrl = 'https://itinerarygravity.com';

    // Fetch all approved itineraries
    const { data: itineraries } = await supabase
        .from('itineraries')
        .select('id, slug, updated_at')
        .eq('is_approved', true);

    // Fetch all unique locations for destination pages
    const { data: locations } = await supabase
        .from('itineraries')
        .select('location')
        .eq('is_approved', true);

    const uniqueLocations = Array.from(new Set((locations || []).map(l => l.location).filter(Boolean)));
    const destinationUrls = uniqueLocations.map(loc => ({
        url: `${baseUrl}/explore/${encodeURIComponent(loc as string)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const itineraryUrls = (itineraries || []).map((itinerary) => ({
        url: `${baseUrl}/itinerary/${itinerary.slug || itinerary.id}`,
        lastModified: itinerary.updated_at,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/explore`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...destinationUrls,
        ...itineraryUrls,
    ];
}
