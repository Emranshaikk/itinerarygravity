import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = user.id;
        let role;
        try {
            const body = await req.json();
            role = body.role;
        } catch (e) {
            console.error("[PROFILES_JSON_ERROR]", e);
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        console.log("[PROFILES_UPDATING]", { userId, role });

        const { data, error } = await supabase
            .from('profiles')
            .upsert({ id: userId, role: role || 'buyer' }, { onConflict: 'id' })
            .select();

        if (error) {
            console.error("[PROFILE_UPSERT_ERROR]", error);
            return NextResponse.json({
                error: "Database Error",
                details: error.message,
            }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[PROFILES_POST]", error);
        return NextResponse.json({ error: "Internal Error", message: error.message }, { status: 500 });
    }
}
