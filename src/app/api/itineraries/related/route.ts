import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import { Itinerary } from "@/models/Itinerary";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const itineraryId = searchParams.get('itineraryId');
    const location = searchParams.get('location');
    const creatorId = searchParams.get('creatorId');

    if (!itineraryId) {
        return NextResponse.json({ error: "Missing itineraryId" }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // Build the query to match location (case-insensitive) OR creatorId
        const orConditions: any[] = [];

        if (location) {
            orConditions.push({ location: { $regex: location, $options: 'i' } });
        }

        if (creatorId && /^[0-9a-fA-F]{24}$/.test(creatorId)) {
            orConditions.push({ creator_id: creatorId });
        }

        if (orConditions.length === 0) {
            return NextResponse.json([]);
        }

        const related = await Itinerary.find({
            _id: { $ne: itineraryId },
            is_published: true,
            $or: orConditions
        })
            .populate('creator_id', 'full_name')
            .limit(3)
            .lean();

        const formatted = related.map((item: any) => ({
            ...item,
            id: item._id.toString(),
            profiles: { full_name: item.creator_id?.full_name || "@Influencer" }
        }));

        return NextResponse.json(formatted);
    } catch (error: any) {
        console.error("[RELATED_ITINERARIES_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
