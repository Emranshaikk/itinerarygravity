import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let role;
        try {
            const body = await req.json();
            role = body.role;
        } catch (e) {
            console.error("[PROFILES_JSON_ERROR]", e);
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        console.log("[PROFILES_UPDATING]", { userId, role });

        // Try a simpler approach: update if exists, insert if not
        const { data, error } = await supabase
            .from('profiles')
            .upsert({ id: userId, role: role || 'buyer' }, { onConflict: 'id' })
            .select();

        if (error) {
            console.error("[PROFILE_UPSERT_ERROR]", error);
            // If it's a permission error, it's likely RLS
            return NextResponse.json({
                error: "Database Error",
                details: error.message,
                hint: "Ensure you have run the RLS policies in Supabase SQL editor."
            }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[PROFILES_POST]", error);
        return NextResponse.json({ error: "Internal Error", message: error.message }, { status: 500 });
    }
}
