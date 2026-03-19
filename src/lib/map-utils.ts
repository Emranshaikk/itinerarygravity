export function generateStaticMapUrl(
    coordinates: [number, number][], 
    width = 800, 
    height = 600,
    startCoord?: [number, number],
    endCoord?: [number, number]
) {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return null;

    if (coordinates.length === 0 && !startCoord && !endCoord) return null;

    let overlays = [];

    // 1. Build the path for the route
    if (coordinates.length > 1) {
        const pathCoordinates = coordinates.map(c => `${c[0]},${c[1]}`).join('|');
        overlays.push(`path-4+ec4899-0.8(${pathCoordinates})`);
    }

    // 2. Build individual markers for the route points (small pins)
    if (coordinates.length > 0) {
        const pinsOverlay = coordinates.map(c => `pin-s+ed64a6(${c[0]},${c[1]})`).join(',');
        overlays.push(pinsOverlay);
    }

    // 3. Add Journey Start Pin (Green)
    if (startCoord) {
        overlays.push(`pin-l-play+10b981(${startCoord[0]},${startCoord[1]})`);
    }

    // 4. Add Journey End Pin (Red)
    if (endCoord) {
        overlays.push(`pin-l-stop+ef4444(${endCoord[0]},${endCoord[1]})`);
    }

    const overlayStr = overlays.join(',');

    // Ensure we use 'auto' viewport so Mapbox calculates the best zoom/center 
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${encodeURIComponent(overlayStr)}/auto/${width}x${height}?padding=50&access_token=${token}`;
}
