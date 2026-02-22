import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { itinerary_id, image_url, caption } = body;

        if (!itinerary_id || !image_url) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Verify purchase
        const { data: purchase, error: purchaseError } = await supabase
            .from('purchases')
            .select('id')
            .eq('user_id', user.id)
            .eq('itinerary_id', itinerary_id)
            .single();

        if (purchaseError || !purchase) {
            return NextResponse.json({ error: "You must purchase this itinerary to upload photos." }, { status: 403 });
        }

        // 2. Insert photo record
        const { data, error } = await supabase
            .from('traveler_photos')
            .insert({
                user_id: user.id,
                itinerary_id,
                image_url,
                caption: caption || ""
            })
            .select()
            .single();

        if (error) {
            console.error("[PHOTOS_POST_ERROR]", error);
            return NextResponse.json({ error: "Database Error", details: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[API_PHOTOS_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const idOrSlug = searchParams.get('itinerary_id');

        if (!idOrSlug) {
            return NextResponse.json({ error: "Missing itinerary_id" }, { status: 400 });
        }

        const supabase = await createClient();
        let finalItineraryId = idOrSlug;

        // Check if idOrSlug is a UUID
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

        if (!isUuid) {
            // Try to resolve slug to UUID
            const { data: itinerary } = await supabase
                .from('itineraries')
                .select('id')
                .eq('slug', idOrSlug)
                .maybeSingle();

            if (itinerary) {
                finalItineraryId = itinerary.id;
            } else {
                return NextResponse.json([]);
            }
        }

        const { data, error } = await supabase
            .from('traveler_photos')
            .select(`
                *,
                profiles:user_id (
                    full_name,
                    avatar_url
                )
            `)
            .eq('itinerary_id', finalItineraryId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("[API_PHOTOS_QUERY_ERROR]", error);
            return NextResponse.json([]);
        }

        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error("[API_PHOTOS_GET_ERROR]", error);
        return NextResponse.json([], { status: 500 });
    }
}
