import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { Itinerary } from "@/models/Itinerary";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const sessionUser = session.user as any;
        const user = await User.findById(sessionUser.id).select('role').lean();

        if (user?.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const itineraries = await Itinerary.find({})
            .populate('creator_id', 'full_name email')
            .sort({ createdAt: -1 })
            .lean();

        const data = itineraries.map((i: any) => ({
            ...i,
            id: i._id.toString(),
            profiles: {
                full_name: i.creator_id?.full_name,
                email: i.creator_id?.email
            }
        }));

        return NextResponse.json(data);
    } catch (error) {
        console.error("[ADMIN_ITIN_API]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const sessionUser = session.user as any;
        const user = await User.findById(sessionUser.id).select('role').lean();

        if (user?.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const body = await req.json();
        const { itineraryId, unpublish } = body;

        if (unpublish) {
            await Itinerary.findByIdAndUpdate(itineraryId, { is_published: false });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_ITIN_PUT_API]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const sessionUser = session.user as any;
        const user = await User.findById(sessionUser.id).select('role').lean();

        if (user?.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const itineraryId = searchParams.get('id');

        if (!itineraryId) {
            return NextResponse.json({ error: "Missing itinerary id" }, { status: 400 });
        }

        await Itinerary.findByIdAndDelete(itineraryId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_ITIN_DEL_API]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
