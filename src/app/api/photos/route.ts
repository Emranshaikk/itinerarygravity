import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { TravelerPhoto } from "@/models/TravelerPhoto";
import { Purchase } from "@/models/Purchase";
import { Itinerary } from "@/models/Itinerary";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { itinerary_id, image_url, caption } = body;

        if (!itinerary_id || !image_url) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectToDatabase();
        const sessionUser = session.user as any;

        // 1. Verify purchase
        const purchase = await Purchase.findOne({
            user_id: sessionUser.id,
            itinerary_id: itinerary_id,
            status: 'completed'
        }).lean();

        if (!purchase) {
            return NextResponse.json({ error: "You must purchase this itinerary to upload photos." }, { status: 403 });
        }

        // 2. Insert photo record
        const photo = await TravelerPhoto.create({
            user_id: sessionUser.id,
            itinerary_id,
            image_url,
            caption: caption || ""
        });

        return NextResponse.json(photo);
    } catch (error: any) {
        console.error("[API_PHOTOS_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const idOrSlug = searchParams.get('itinerary_id');

        if (!idOrSlug) {
            return NextResponse.json({ error: "Missing itinerary_id" }, { status: 400 });
        }

        await connectToDatabase();
        let finalItineraryId = idOrSlug;

        // Check if idOrSlug is a MongoDB ObjectId
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);

        if (!isObjectId) {
            // Try to resolve slug to ID
            const itinerary = await Itinerary.findOne({ slug: idOrSlug }).select('_id').lean();

            if (itinerary) {
                finalItineraryId = itinerary._id.toString();
            } else {
                return NextResponse.json([]);
            }
        }

        const photos = await TravelerPhoto.find({ itinerary_id: finalItineraryId })
            .populate('user_id', 'full_name avatar_url')
            .sort({ createdAt: -1 })
            .lean();

        const data = photos.map((p: any) => ({
            ...p,
            id: p._id.toString(),
            profiles: {
                full_name: p.user_id?.full_name,
                avatar_url: p.user_id?.avatar_url
            },
            created_at: p.createdAt
        }));

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[API_PHOTOS_GET_ERROR]", error);
        return NextResponse.json([], { status: 500 });
    }
}
