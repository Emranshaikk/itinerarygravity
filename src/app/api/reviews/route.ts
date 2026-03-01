import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { Purchase } from "@/models/Purchase";
import { Itinerary } from "@/models/Itinerary";
import mongoose from 'mongoose';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const itineraryId = searchParams.get('itinerary_id');

        if (!itineraryId) {
            return NextResponse.json({ error: "Missing itinerary_id" }, { status: 400 });
        }

        await connectToDatabase();

        const reviews = await Review.find({ itinerary_id: itineraryId })
            .populate('user_id', 'full_name avatar_url')
            .sort({ createdAt: -1 })
            .lean();

        // Map to expected frontend format
        const data = reviews.map((r: any) => ({
            ...r,
            id: r._id.toString(),
            profiles: {
                full_name: r.user_id?.full_name || "Anonymous Traveler",
                avatar_url: r.user_id?.avatar_url
            },
            created_at: r.createdAt
        }));

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[API_REVIEWS_GET]", error);
        // Important: Always return an array to prevent frontend crashes mapped over undefined
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { itinerary_id, rating, comment } = body;

        if (!itinerary_id || !rating || !comment) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
        }

        await connectToDatabase();
        const userId = (session.user as any).id;

        // 1. Verify user purchased this itinerary
        const expectedPurchase = await Purchase.findOne({
            user_id: userId,
            itinerary_id,
            status: 'completed'
        }).lean();

        if (!expectedPurchase) {
            return NextResponse.json({ error: "You can only review itineraries you have purchased." }, { status: 403 });
        }

        // 2. Upsert the review (one review per user per itinerary)
        const review = await Review.findOneAndUpdate(
            { user_id: userId, itinerary_id },
            { rating, comment },
            { upsert: true, new: true }
        );

        // 3. Recalculate average rating for the Itinerary
        const stats = await Review.aggregate([
            { $match: { itinerary_id: new mongoose.Types.ObjectId(itinerary_id) } },
            {
                $group: {
                    _id: '$itinerary_id',
                    average_rating: { $avg: '$rating' },
                    review_count: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            await Itinerary.findByIdAndUpdate(itinerary_id, {
                average_rating: Math.round(stats[0].average_rating * 10) / 10, // Round to 1 decimal
                review_count: stats[0].review_count
            });
        }

        return NextResponse.json(review);
    } catch (error: any) {
        console.error("[API_REVIEWS_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
