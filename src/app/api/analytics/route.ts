import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { Itinerary } from "@/models/Itinerary";

// GET - Fetch analytics for creator's itineraries
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const sessionUser = session.user as any;
        const { searchParams } = new URL(request.url);
        const itineraryId = searchParams.get('itinerary_id');

        // If specific itinerary requested
        if (itineraryId) {
            const itinerary = await Itinerary.findById(itineraryId)
                .select('title creator_id views_count purchases_count total_revenue')
                .lean();

            if (!itinerary) {
                return NextResponse.json({ error: 'Not found' }, { status: 404 });
            }

            // Verify ownership
            if (itinerary.creator_id.toString() !== sessionUser.id) {
                const user = await User.findById(sessionUser.id).select('role').lean();

                if (user?.role !== 'admin') {
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                }
            }

            return NextResponse.json({
                itinerary_id: itinerary._id.toString(),
                views_count: itinerary.views_count,
                purchases_count: itinerary.purchases_count,
                total_revenue: itinerary.total_revenue,
                itineraries: {
                    title: itinerary.title,
                    creator_id: itinerary.creator_id,
                }
            });
        }

        // Get all analytics for user's itineraries
        const itineraries = await Itinerary.find({ creator_id: sessionUser.id })
            .select('title price average_rating review_count is_published views_count purchases_count total_revenue')
            .lean();

        if (itineraries.length === 0) {
            return NextResponse.json({
                total_views: 0,
                total_purchases: 0,
                total_revenue: 0,
                itineraries: []
            });
        }

        const formattedItineraries = itineraries.map((i: any) => ({
            itinerary_id: i._id.toString(),
            views_count: i.views_count || 0,
            purchases_count: i.purchases_count || 0,
            total_revenue: i.total_revenue || 0,
            itineraries: {
                id: i._id.toString(),
                title: i.title,
                price: i.price,
                average_rating: i.average_rating,
                review_count: i.review_count,
                is_published: i.is_published
            }
        }));

        // Calculate totals
        const totals = formattedItineraries.reduce((acc, item) => ({
            total_views: acc.total_views + item.views_count,
            total_purchases: acc.total_purchases + item.purchases_count,
            total_revenue: acc.total_revenue + item.total_revenue
        }), { total_views: 0, total_purchases: 0, total_revenue: 0 });

        return NextResponse.json({
            ...totals,
            itineraries: formattedItineraries
        });
    } catch (error: any) {
        console.error('[ANALYTICS_FETCH_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Increment view count
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { itinerary_id } = body;

        if (!itinerary_id) {
            return NextResponse.json({ error: 'Itinerary ID required' }, { status: 400 });
        }

        await connectToDatabase();

        // Increment the views_count
        const result = await Itinerary.findByIdAndUpdate(
            itinerary_id,
            { $inc: { views_count: 1 } }
        );

        if (!result) {
            return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'View counted' });
    } catch (error: any) {
        console.error('[ANALYTICS_INCREMENT_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
