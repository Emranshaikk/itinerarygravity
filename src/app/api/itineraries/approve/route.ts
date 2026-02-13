import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const { itineraryId, approved } = await req.json();

        if (!itineraryId) {
            return NextResponse.json({ error: "Missing itineraryId" }, { status: 400 });
        }

        const { error } = await supabase
            .from('itineraries')
            .update({ is_approved: approved })
            .eq('id', itineraryId);

        if (error) {
            console.error("[ADMIN_APPROVE_ERROR]", error);
            return NextResponse.json({ error: "Database Error" }, { status: 500 });
        }

        return NextResponse.json({ success: true, approved });
    } catch (error: any) {
        console.error("[ADMIN_APPROVE_API]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
