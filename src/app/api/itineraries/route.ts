import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User, IUser } from "@/models/User";
import { Itinerary } from "@/models/Itinerary";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();
        const {
            title,
            location,
            destination,
            price,
            currency,
            duration,
            ...rest
        } = body;

        const finalLocation = location || destination;

        await connectToDatabase();

        // Generate slug from title (frontend might still expect/use slug)
        const slug = title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

        // Insert Itinerary
        const newItinerary = await Itinerary.create({
            creator_id: userId,
            title,
            slug, // if we added slug to schema, otherwise it drops it seamlessly if strict Mode is true. It handles it.
            location: finalLocation,
            price,
            currency: currency || "USD",
            description: body.description || `A trip to ${finalLocation}`,
            content: body.content,
            is_published: true,
            is_approved: true
        });

        // Add additional loose fields that might have mapped to Supabase
        // Mongoose handles it if we have it properly configured or mixed

        return NextResponse.json(newItinerary);
    } catch (error: any) {
        console.error("[ITINERARIES_POST]", error);
        return NextResponse.json({ error: "Internal Error", message: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToDatabase();

        const data = await Itinerary.find({
            is_published: true
        })
            .populate('creator_id', 'full_name avatar_url')
            .sort({ createdAt: -1 })
            .lean();

        // To perfectly mirror Supabase layout to avoid breaking frontend:
        const mappedData = data.map((it: any) => ({
            ...it,
            id: it._id.toString(), // Normalize to 'id'
            profiles: it.creator_id ? {
                full_name: it.creator_id.full_name,
                avatar_url: it.creator_id.avatar_url
            } : null,
            purchases: [] // Return empty or mock for now, until we aggregate
        }));

        return NextResponse.json(mappedData);
    } catch (error: any) {
        console.error("[ITINERARIES_GET]", error);
        return NextResponse.json({ error: "Internal Error", message: error.message }, { status: 500 });
    }
}
