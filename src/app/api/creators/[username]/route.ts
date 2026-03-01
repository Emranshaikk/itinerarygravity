import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { Itinerary } from "@/models/Itinerary";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;
        if (!username) {
            return NextResponse.json({ error: "Username required" }, { status: 400 });
        }

        await connectToDatabase();

        // Find by username first
        let profile = await User.findOne({ username }).lean();

        // If not found, try by ObjectId
        if (!profile && /^[0-9a-fA-F]{24}$/.test(username)) {
            profile = await User.findById(username).lean();
        }

        if (!profile) {
            return NextResponse.json({ error: "Creator not found" }, { status: 404 });
        }

        // Fetch itineraries
        const itineraries = await Itinerary.find({
            creator_id: profile._id,
            is_published: true
        })
            .sort({ createdAt: -1 })
            .lean();

        // Map to frontend structure
        const mappedCreator = {
            id: profile._id.toString(),
            name: profile.full_name || "Traveler",
            handle: `@${profile.username || "traveler"}`,
            image: profile.avatar_url,
            bio: profile.bio || "Travel enthusiast and itinerary creator.",
            followers: "0",
            rating: 5.0,
            reviews: 0,
            itineraries: itineraries.map((item: any) => ({
                ...item,
                id: item._id.toString()
            }))
        };

        return NextResponse.json(mappedCreator);
    } catch (error: any) {
        console.error("[CREATOR_PROFILE_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
