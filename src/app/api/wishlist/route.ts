import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { Itinerary } from "@/models/Itinerary";

// Fetch saved itineraries for the logged-in user
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const userId = (session.user as any).id;

        const user = await User.findById(userId)
            .populate({
                path: 'saved_itineraries',
                populate: {
                    path: 'creator_id',
                    select: 'full_name avatar_url is_verified'
                }
            })
            .lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Map to expected frontend ItineraryCard format
        const savedItineraries = (user.saved_itineraries || []).map((itinerary: any) => ({
            ...itinerary,
            id: itinerary._id.toString(),
            profiles: itinerary.creator_id ? {
                full_name: (itinerary.creator_id as any).full_name,
                avatar_url: (itinerary.creator_id as any).avatar_url,
                is_verified: (itinerary.creator_id as any).is_verified,
            } : null,
        }));

        return NextResponse.json(savedItineraries);
    } catch (error: any) {
        console.error("[API_WISHLIST_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// Toggle save state for an itinerary
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { itinerary_id, action } = body; // action should be 'save' or 'unsave'

        if (!itinerary_id || !action || !['save', 'unsave'].includes(action)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        await connectToDatabase();
        const userId = (session.user as any).id;

        // Verify the itinerary exists
        const itineraryExists = await Itinerary.exists({ _id: itinerary_id });
        if (!itineraryExists) {
            return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
        }

        let update;
        if (action === 'save') {
            update = { $addToSet: { saved_itineraries: itinerary_id } };
        } else {
            update = { $pull: { saved_itineraries: itinerary_id } };
        }

        await User.findByIdAndUpdate(userId, update);

        return NextResponse.json({ success: true, action });
    } catch (error: any) {
        console.error("[API_WISHLIST_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
