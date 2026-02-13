import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export const alt = 'Itinerary Preview';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

async function getItinerary(id: string) {
    // Note: We use a service role or public client here as it's edge runtime
    // For simplicity in this demo, we assume the URL provides enough context
    const supabase = await createClient();
    const { data } = await supabase
        .from('itineraries')
        .select(`
            *,
            profiles:creator_id (
                full_name
            )
        `)
        .eq('id', id)
        .single();
    return data;
}

export default async function Image({ params }: { params: { id: string } }) {
    const { id } = await params;
    const itinerary = await getItinerary(id);

    if (!itinerary) {
        return new ImageResponse(
            (
                <div style={{ fontSize: 48, background: 'white', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ItineraryGravity
                </div>
            )
        );
    }

    const title = itinerary.title;
    const creator = itinerary.profiles?.full_name || 'Creator';
    const price = `₹${itinerary.price}`;
    const location = itinerary.location;

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                    backgroundImage: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
                    padding: '80px',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 40,
                        right: 40,
                        background: 'linear-gradient(to bottom right, #ff007f, #7f00ff)',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        color: 'white',
                        fontSize: 24,
                        fontWeight: 'bold',
                    }}
                >
                    {price}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ color: '#ff007f', fontSize: 32, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
                        Itinerary Gravity
                    </div>

                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: 800,
                            color: 'white',
                            lineHeight: 1.1,
                            marginBottom: '20px',
                            maxWidth: '900px',
                        }}
                    >
                        {title}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ color: '#aaa', fontSize: 32 }}>by</div>
                        <div style={{ color: 'white', fontSize: 32, fontWeight: 600 }}>@{creator}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', color: '#ff007f', fontSize: 24, marginTop: '20px' }}>
                        📍 {location}
                    </div>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        left: 80,
                        color: '#444',
                        fontSize: 20,
                    }}
                >
                    Join the gravity of travel.
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
