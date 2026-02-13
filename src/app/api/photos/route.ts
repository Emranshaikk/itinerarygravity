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
        const itinerary_id = searchParams.get('itinerary_id');

        if (!itinerary_id) {
            return NextResponse.json({ error: "Missing itinerary_id" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('traveler_photos')
            .select(`
                *,
                profiles:user_id (
                    full_name,
                    avatar_url
                )
            `)
            .eq('itinerary_id', itinerary_id)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: "Database Error" }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[API_PHOTOS_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
