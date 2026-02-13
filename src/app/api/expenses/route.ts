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
        const { itinerary_id, day_number, amount, category, description } = body;

        if (!itinerary_id || day_number === undefined || amount === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('trip_expenses')
            .insert({
                user_id: user.id,
                itinerary_id,
                day_number,
                amount,
                category,
                description
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: "Database Error", details: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
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
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('trip_expenses')
            .select('*')
            .eq('itinerary_id', itinerary_id)
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (error) {
            return NextResponse.json({ error: "Database Error" }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const expense_id = searchParams.get('id');

        if (!expense_id) {
            return NextResponse.json({ error: "Missing expense_id" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { error } = await supabase
            .from('trip_expenses')
            .delete()
            .eq('id', expense_id)
            .eq('user_id', user.id);

        if (error) {
            return NextResponse.json({ error: "Database Error" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
