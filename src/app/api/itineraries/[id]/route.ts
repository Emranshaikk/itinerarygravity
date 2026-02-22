import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { id } = params;

        const { data, error } = await supabase
            .from('itineraries')
            .select(`
                *,
                profiles!creator_id (
                    full_name,
                    avatar_url
                )
            `)
            .eq('id', id)
            .single();

        if (error) {
            return NextResponse.json({ error: "Database Error", details: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[ITINERARY_GET]", error);
        return NextResponse.json({ error: "Internal Error", message: error.message }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await req.json();

        // Check ownership
        const { data: existing } = await supabase
            .from('itineraries')
            .select('creator_id')
            .eq('id', id)
            .single();

        if (!existing || existing.creator_id !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const {
            title,
            location,
            destination,
            price,
            currency,
            duration,
            ...rest
        } = body;

        const finalLocation = location || destination;

        const { data, error } = await supabase
            .from('itineraries')
            .update({
                title,
                location: finalLocation,
                price,
                currency: currency || "USD",
                description: body.description,
                seo_title: body.seo_title,
                seo_description: body.seo_description,
                content: body.content,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("[ITINERARY_UPDATE_ERROR]", error);
            return NextResponse.json({ error: "Database Error", details: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[ITINERARY_PATCH]", error);
        return NextResponse.json({ error: "Internal Error", message: error.message }, { status: 500 });
    }
}
