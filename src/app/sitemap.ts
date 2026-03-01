import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Itinerary } from '@/models/Itinerary';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    await connectToDatabase();
    const baseUrl = 'https://itinerarygravity.com';

    // Fetch all published itineraries
    const itineraries = await Itinerary.find({ is_published: true })
        .select('_id slug updatedAt location')
        .lean();

    const uniqueLocations = Array.from(new Set(itineraries.map((l: any) => l.location).filter(Boolean)));
    const destinationUrls = uniqueLocations.map(loc => ({
        url: `${baseUrl}/explore/${encodeURIComponent(loc as string)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const itineraryUrls = itineraries.map((itinerary: any) => ({
        url: `${baseUrl}/itinerary/${itinerary.slug || itinerary._id.toString()}`,
        lastModified: itinerary.updatedAt || new Date(),
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
