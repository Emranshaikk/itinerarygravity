import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { Itinerary } from "@/models/Itinerary";
import { Purchase } from "@/models/Purchase";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const sessionUser = session.user as any;
        const user = await User.findById(sessionUser.id).select('role').lean();

        if (user?.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const [
            totalUsers,
            totalCreators,
            pendingVerifications,
            totalItineraries,
            publishedItineraries,
            purchases
        ] = await Promise.all([
            User.countDocuments({}),
            User.countDocuments({ role: 'influencer' }),
            User.countDocuments({ verification_status: 'pending' }),
            Itinerary.countDocuments({}),
            Itinerary.countDocuments({ is_published: true }),
            Purchase.find({ status: 'completed' }).select('platform_fee').lean()
        ]);

        const totalRevenue = purchases.reduce((sum, p) => sum + (p.platform_fee || 0), 0) || 0;

        return NextResponse.json({
            totalUsers,
            totalCreators,
            pendingVerifications,
            totalItineraries,
            publishedItineraries,
            totalRevenue
        });
    } catch (error) {
        console.error("[ADMIN_STATS_API]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
