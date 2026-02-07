import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Role check from Supabase - try Profile Table first, then User Metadata
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        // Source of truth prioritizing DB profile, then user metadata (set during signup)
        const role = profile?.role || user.user_metadata?.role || "buyer";

        if (role === "admin") {
            redirect("/dashboard/admin");
        } else if (role === "influencer") {
            redirect("/dashboard/influencer");
        } else {
            redirect("/dashboard/buyer");
        }
    } catch (e) {
        // Even if DB check fails, trust metadata as fallback during initial signup
        const metaRole = user.user_metadata?.role;
        if (metaRole === 'influencer') redirect("/dashboard/influencer");
        if (metaRole === 'admin') redirect("/dashboard/admin");

        console.error("Dashboard role check failed", e);
        redirect("/dashboard/buyer"); // Safe fallback
    }
}
