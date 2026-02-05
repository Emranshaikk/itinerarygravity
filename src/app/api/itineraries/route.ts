import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            title,
            location, // Map to location from destination if provided
            destination,
            price,
            currency,
            duration,
            ...rest
        } = body;

        const finalLocation = location || destination;

        // 1. Ensure profile exists (Upsert)
        // In a real app, you'd do this via Webhooks, but for now we'll do it on-the-fly
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                role: 'influencer' // Assuming only creators call this
            });

        if (profileError) {
            console.error("[PROFILE_UPSERT_ERROR]", profileError);
        }

        // 2. Insert Itinerary
        const { data, error } = await supabase
            .from('itineraries')
            .insert({
                creator_id: userId,
                title,
                location: finalLocation, // Use the resolved location
                price,
                currency: currency || "USD",
                description: body.description || `A trip to ${finalLocation}`,
                content: body.content, // Use the content directly from body
                is_published: true
            })
            .select()
            .single();

        if (error) {
            console.error("[ITINERARY_CREATE_ERROR]", error);
            return NextResponse.json({ error: "Database Error", details: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[ITINERARIES_POST]", error);
        return NextResponse.json({ error: "Internal Error", message: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('itineraries')
            .select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `)
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: "Database Error", details: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[ITINERARIES_GET]", error);
        return NextResponse.json({ error: "Internal Error", message: error.message }, { status: 500 });
    }
}
