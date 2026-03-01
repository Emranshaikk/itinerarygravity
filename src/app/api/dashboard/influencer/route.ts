import { NextResponse } from "next/server";
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

        const userId = (session.user as any).id;
        await connectToDatabase();

        const profile = await User.findById(userId).lean();
        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        // Fetch itineraries and calculate earnings
        const itineraries = await Itinerary.find({ creator_id: userId })
            .sort({ createdAt: -1 })
            .lean();

        const itineraryIds = itineraries.map(it => it._id);

        const purchases = await Purchase.find({
            itinerary_id: { $in: itineraryIds },
            status: 'completed'
        }).lean();

        // Map purchases to itineraries and calculate earnings locally
        const itinerariesWithPurchases = itineraries.map((it: any) => {
            const itPurchases = purchases.filter(p => p.itinerary_id.toString() === it._id.toString());
            return {
                ...it,
                id: it._id.toString(), // Normalize Mongo _id to id for the frontend
                purchases: itPurchases,
            };
        });

        const totalEarnings = purchases.reduce((acc, p) => acc + (p.creator_earnings || 0), 0);

        return NextResponse.json({
            profile: {
                ...profile,
                id: profile._id.toString(),
            },
            itineraries: itinerariesWithPurchases,
            totalEarnings,
        });
    } catch (error: any) {
        console.error("Dashboard API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
