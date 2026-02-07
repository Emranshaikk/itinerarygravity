import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch analytics for creator's itineraries
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const itineraryId = searchParams.get('itinerary_id');

        // If specific itinerary requested
        if (itineraryId) {
            const { data: analytics, error } = await supabase
                .from('itinerary_analytics')
                .select(`
                    *,
                    itineraries:itinerary_id (
                        title,
                        creator_id
                    )
                `)
                .eq('itinerary_id', itineraryId)
                .single();

            if (error) throw error;

            // Verify ownership
            if (analytics?.itineraries?.creator_id !== user.id) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profile?.role !== 'admin') {
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                }
            }

            return NextResponse.json(analytics);
        }

        // Get all analytics for user's itineraries
        const { data: itineraries, error: itinerariesError } = await supabase
            .from('itineraries')
            .select('id')
            .eq('creator_id', user.id);

        if (itinerariesError) throw itinerariesError;

        const itineraryIds = itineraries?.map(i => i.id) || [];

        if (itineraryIds.length === 0) {
            return NextResponse.json({
                total_views: 0,
                total_purchases: 0,
                total_revenue: 0,
                itineraries: []
            });
        }

        const { data: analytics, error: analyticsError } = await supabase
            .from('itinerary_analytics')
            .select(`
                *,
                itineraries:itinerary_id (
                    id,
                    title,
                    price,
                    average_rating,
                    review_count,
                    is_published
                )
            `)
            .in('itinerary_id', itineraryIds);

        if (analyticsError) throw analyticsError;

        // Calculate totals
        const totals = (analytics || []).reduce((acc, item) => ({
            total_views: acc.total_views + (item.views_count || 0),
            total_purchases: acc.total_purchases + (item.purchases_count || 0),
            total_revenue: acc.total_revenue + (Number(item.total_revenue) || 0)
        }), { total_views: 0, total_purchases: 0, total_revenue: 0 });

        return NextResponse.json({
            ...totals,
            itineraries: analytics || []
        });
    } catch (error: any) {
        console.error('[ANALYTICS_FETCH_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Increment view count
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { itinerary_id } = body;

        if (!itinerary_id) {
            return NextResponse.json({ error: 'Itinerary ID required' }, { status: 400 });
        }

        // Call the increment function
        const { error } = await supabase.rpc('increment_itinerary_views', {
            itinerary_uuid: itinerary_id
        });

        if (error) throw error;

        return NextResponse.json({ message: 'View counted' });
    } catch (error: any) {
        console.error('[ANALYTICS_INCREMENT_ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
