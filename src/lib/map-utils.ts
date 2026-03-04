export function generateStaticMapUrl(coordinates: [number, number][], width = 800, height = 600) {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return null;

    if (coordinates.length === 0) return null;

    // Single point vs route
    if (coordinates.length === 1) {
        const [lng, lat] = coordinates[0];
        return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+ed64a6(${lng},${lat})/${lng},${lat},13,0/${width}x${height}?access_token=${token}`;
    }

    // Build the path definition for Static Maps API
    // Format: path-strokeWidth+strokeColor-strokeOpacity(lng,lat|lng,lat|...)
    const pathCoordinates = coordinates.map(c => `${c[0]},${c[1]}`).join('|');
    const pathOverlay = `path-4+ec4899-0.8(${pathCoordinates})`;

    // Build individual markers (first and last, or all)
    // We'll mark all points as small pins
    const pinsOverlay = coordinates.map(c => `pin-s+ed64a6(${c[0]},${c[1]})`).join(',');

    // Ensure we use 'auto' viewport so Mapbox calculates the best zoom/center to fit the entire route
    const overlays = `${pathOverlay},${pinsOverlay}`;

    return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${encodeURIComponent(overlays)}/auto/${width}x${height}?padding=50&access_token=${token}`;
}
