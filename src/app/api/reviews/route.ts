import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { Purchase } from "@/models/Purchase";
import { Itinerary } from "@/models/Itinerary";

// GET - Fetch reviews for an itinerary
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const idOrSlug = searchParams.get('itinerary_id');

    if (!idOrSlug) {
        return NextResponse.json({ error: 'Itinerary ID or Slug required' }, { status: 400 });
    }

    try {
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

        const reviews = await Review.find({ itinerary_id: finalItineraryId })
            .populate('user_id', 'full_name email avatar_url')
            .sort({ createdAt: -1 })
            .lean();

        // Map to expected frontend structure
        const mappedReviews = reviews.map((r: any) => ({
            ...r,
            id: r._id.toString(),
            profiles: r.user_id ? {
                full_name: r.user_id.full_name,
                email: r.user_id.email,
                avatar_url: r.user_id.avatar_url
            } : { full_name: 'Unknown', email: '' }
        }));

        return NextResponse.json(mappedReviews);
    } catch (error: any) {
        console.error('[REVIEWS_FETCH_ERROR]', error);
        return NextResponse.json([], { status: 500 });
    }
}

// POST - Create a new review
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as any;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { itinerary_id, rating, comment } = body;

        if (!itinerary_id || !rating) {
            return NextResponse.json({ error: 'Itinerary ID and rating required' }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        await connectToDatabase();

        // Check if user has purchased this itinerary
        const purchase = await Purchase.findOne({
            user_id: user.id,
            itinerary_id: itinerary_id,
            status: 'completed'
        }).lean();

        if (!purchase) {
            return NextResponse.json({ error: 'You must purchase this itinerary before reviewing' }, { status: 403 });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({
            user_id: user.id,
            itinerary_id: itinerary_id
        }).lean();

        if (existingReview) {
            return NextResponse.json({ error: 'You have already reviewed this itinerary' }, { status: 409 });
        }

        // Create review
        const review = await Review.create({
            itinerary_id,
            user_id: user.id,
            rating,
            comment
        });

        // Update itinerary average rating and review count
        const allReviews = await Review.find({ itinerary_id }).lean();
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const average_rating = totalRating / allReviews.length;
        const review_count = allReviews.length;

        await Itinerary.findByIdAndUpdate(itinerary_id, {
            average_rating,
            review_count
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error: any) {
        console.error('[REVIEW_CREATE_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH - Update a review
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as any;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { review_id, rating, comment } = body;

        if (!review_id) {
            return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
        }

        const updateData: any = {};
        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
            }
            updateData.rating = rating;
        }
        if (comment !== undefined) updateData.comment = comment;

        await connectToDatabase();

        const review = await Review.findOneAndUpdate(
            { _id: review_id, user_id: user.id },
            updateData,
            { new: true }
        ).lean();

        if (!review) {
            return NextResponse.json({ error: 'Review not found or unauthorized' }, { status: 404 });
        }

        // Update itinerary average rating
        const allReviews = await Review.find({ itinerary_id: review.itinerary_id }).lean();
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const average_rating = totalRating / allReviews.length;

        await Itinerary.findByIdAndUpdate(review.itinerary_id, {
            average_rating
        });

        return NextResponse.json(review);
    } catch (error: any) {
        console.error('[REVIEW_UPDATE_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete a review
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as any;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const reviewId = searchParams.get('review_id');

        if (!reviewId) {
            return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
        }

        await connectToDatabase();

        const review = await Review.findOneAndDelete({
            _id: reviewId,
            user_id: user.id
        });

        if (!review) {
            return NextResponse.json({ error: 'Review not found or unauthorized' }, { status: 404 });
        }

        // Update itinerary average rating and review count
        const allReviews = await Review.find({ itinerary_id: review.itinerary_id }).lean();
        const review_count = allReviews.length;
        const average_rating = review_count > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / review_count
            : 0;

        await Itinerary.findByIdAndUpdate(review.itinerary_id, {
            average_rating,
            review_count
        });

        return NextResponse.json({ message: 'Review deleted successfully' });
    } catch (error: any) {
        console.error('[REVIEW_DELETE_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
