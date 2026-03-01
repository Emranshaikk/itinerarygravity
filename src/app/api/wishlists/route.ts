import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { Wishlist } from "@/models/Wishlist";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const itinerary_id = searchParams.get('itinerary_id');

    if (!itinerary_id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ inWishlist: false });

        const user = session.user as any;
        await connectToDatabase();

        const match = await Wishlist.findOne({ user_id: user.id, itinerary_id }).lean();
        return NextResponse.json({ inWishlist: !!match });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ inWishlist: false, error: "Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = session.user as any;
        const body = await req.json();
        const { itinerary_id } = body;

        if (!itinerary_id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await connectToDatabase();

        const existing = await Wishlist.findOne({ user_id: user.id, itinerary_id });
        if (existing) {
            await Wishlist.deleteOne({ _id: existing._id });
            return NextResponse.json({ inWishlist: false });
        } else {
            await Wishlist.create({ user_id: user.id, itinerary_id });
            return NextResponse.json({ inWishlist: true });
        }
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
