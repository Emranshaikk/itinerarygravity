import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/login");
    }

    const user = await currentUser();
    let role = user?.publicMetadata?.role as string;

    // If role is not in Clerk, check Supabase
    if (!role) {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            role = profile?.role || "buyer";
        } catch (e) {
            console.error("Dashboard role check failed", e);
            role = "buyer"; // Safe fallback
        }
    }

    if (role === "admin") {
        redirect("/dashboard/admin");
    } else if (role === "influencer") {
        redirect("/dashboard/influencer");
    } else {
        redirect("/dashboard/buyer");
    }
}
