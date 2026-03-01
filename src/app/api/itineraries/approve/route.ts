import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { Itinerary } from "@/models/Itinerary";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessionUser = session.user as any;
        await connectToDatabase();

        // Check if user is admin
        const user = await User.findById(sessionUser.id).select('role').lean();
        if (user?.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const { itineraryId, approved } = await req.json();
        if (!itineraryId) {
            return NextResponse.json({ error: "Missing itineraryId" }, { status: 400 });
        }

        const result = await Itinerary.findByIdAndUpdate(
            itineraryId,
            { is_approved: approved },
            { new: true }
        );

        if (!result) {
            return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, approved });
    } catch (error: any) {
        console.error("[ADMIN_APPROVE_API]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
