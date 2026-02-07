import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Role check from Supabase
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = profile?.role || "buyer";

        if (role === "admin") {
            redirect("/dashboard/admin");
        } else if (role === "influencer") {
            redirect("/dashboard/influencer");
        } else {
            redirect("/dashboard/buyer");
        }
    } catch (e) {
        console.error("Dashboard role check failed", e);
        redirect("/dashboard/buyer"); // Safe fallback
    }
}
