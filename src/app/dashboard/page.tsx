import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const { role } = session.user as any;

    if (role === "admin") {
        redirect("/dashboard/admin");
    } else if (role === "influencer") {
        redirect("/dashboard/influencer");
    } else {
        redirect("/dashboard/buyer");
    }
}
