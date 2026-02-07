import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch reviews for an itinerary
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const itineraryId = searchParams.get('itinerary_id');

    if (!itineraryId) {
        return NextResponse.json({ error: 'Itinerary ID required' }, { status: 400 });
    }

    try {
        const supabase = await createClient();

        const { data: reviews, error } = await supabase
            .from('reviews')
            .select(`
                *,
                profiles:user_id (
                    full_name,
                    email,
                    avatar_url
                )
            `)
            .eq('itinerary_id', itineraryId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(reviews || []);
    } catch (error: any) {
        console.error('[REVIEWS_FETCH_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create a new review
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

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

        // Check if user has purchased this itinerary
        const { data: purchase } = await supabase
            .from('purchases')
            .select('id')
            .eq('user_id', user.id)
            .eq('itinerary_id', itinerary_id)
            .single();

        if (!purchase) {
            return NextResponse.json({ error: 'You must purchase this itinerary before reviewing' }, { status: 403 });
        }

        // Check if user already reviewed
        const { data: existingReview } = await supabase
            .from('reviews')
            .select('id')
            .eq('user_id', user.id)
            .eq('itinerary_id', itinerary_id)
            .single();

        if (existingReview) {
            return NextResponse.json({ error: 'You have already reviewed this itinerary' }, { status: 409 });
        }

        // Create review
        const { data: review, error } = await supabase
            .from('reviews')
            .insert({
                itinerary_id,
                user_id: user.id,
                rating,
                comment
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(review, { status: 201 });
    } catch (error: any) {
        console.error('[REVIEW_CREATE_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH - Update a review
export async function PATCH(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

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

        const { data: review, error } = await supabase
            .from('reviews')
            .update(updateData)
            .eq('id', review_id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(review);
    } catch (error: any) {
        console.error('[REVIEW_UPDATE_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete a review
export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const reviewId = searchParams.get('review_id');

        if (!reviewId) {
            return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ message: 'Review deleted successfully' });
    } catch (error: any) {
        console.error('[REVIEW_DELETE_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
