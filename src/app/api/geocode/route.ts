import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { location } = body;

        if (!location) {
            return NextResponse.json({ error: "Location is required" }, { status: 400 });
        }

        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

        if (!mapboxToken) {
            return NextResponse.json({ error: "Mapbox token not configured" }, { status: 500 });
        }

        const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(location)}&access_token=${mapboxToken}&limit=1`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Mapbox API error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
            // Mapbox returns coordinates as [longitude, latitude]
            const coordinates = data.features[0].geometry.coordinates;
            const placeName = data.features[0].properties.full_address || data.features[0].properties.name;

            return NextResponse.json({
                success: true,
                coordinates,
                placeName
            });
        } else {
            return NextResponse.json({
                success: false,
                error: "Location not found"
            });
        }
    } catch (error: any) {
        console.error("Geocoding error:", error);
        return NextResponse.json({ error: "Failed to geocode location" }, { status: 500 });
    }
}
