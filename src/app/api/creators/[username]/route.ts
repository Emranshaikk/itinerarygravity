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
        const totalReviews = itineraries.reduce((sum, it: any) => sum + (it.review_count || 0), 0);
        const validRatings = itineraries.filter((it: any) => it.average_rating > 0);
        const averageRating = validRatings.length > 0
            ? validRatings.reduce((sum, it: any) => sum + it.average_rating, 0) / validRatings.length
            : 0;

        const mappedCreator = {
            id: profile._id.toString(),
            name: profile.full_name || "Traveler",
            handle: `@${profile.username || "traveler"}`,
            image: profile.avatar_url,
            bio: profile.bio || "Travel enthusiast and itinerary creator.",
            followers: "124", // still fake or derived
            rating: Number(averageRating.toFixed(1)),
            reviews: totalReviews,
            social_links: profile.social_links || {},
            itineraries: itineraries.map((item: any) => ({
                id: item._id.toString(),
                title: item.title,
                location: item.location,
                image: item.image_url || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
                price: item.price,
                rating: item.average_rating || 0
            }))
        };

        return NextResponse.json(mappedCreator);
    } catch (error: any) {
        console.error("[CREATOR_PROFILE_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
