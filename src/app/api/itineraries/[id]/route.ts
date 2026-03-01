import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { Itinerary } from "@/models/Itinerary";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await context.params;

        // Try mapping slug or ID. If it's a valid ObjectId array, search by ID, else slug:
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        const query = isObjectId ? { _id: id } : { slug: id };

        // NextJS fallback, fallback to ID purely if slug fails, although findById is better if it is ID type
        const itinerary = await Itinerary.findOne(query)
            .populate('creator_id', 'full_name avatar_url')
            .lean();

        if (!itinerary) {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }

        const mappedData = {
            ...itinerary,
            id: itinerary._id.toString(),
            profiles: itinerary.creator_id ? {
                full_name: (itinerary.creator_id as any).full_name,
                avatar_url: (itinerary.creator_id as any).avatar_url
            } : null,
        };

        return NextResponse.json(mappedData);
    } catch (error: any) {
        console.error("[ITINERARY_GET]", error);
        return NextResponse.json({ error: "Internal Error", message: error.message }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const { id } = await context.params;
        const body = await req.json();

        // Check ownership
        const existing = await Itinerary.findById(id).select('creator_id').lean();

        if (!existing || existing.creator_id?.toString() !== (session.user as any).id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

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

        const updatedItinerary = await Itinerary.findByIdAndUpdate(
            id,
            {
                title,
                location: finalLocation,
                price,
                currency: currency || "USD",
                description: body.description,
                content: body.content,
                is_published: true,
                is_approved: true
            },
            { new: true } // Return updated document
        ).lean();

        if (!updatedItinerary) {
            return NextResponse.json({ error: "Failed to update" }, { status: 500 });
        }

        return NextResponse.json({
            ...updatedItinerary,
            id: updatedItinerary._id.toString(),
        });
    } catch (error: any) {
        console.error("[ITINERARY_PATCH]", error);
        return NextResponse.json({ error: "Internal Error", message: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const { id } = await context.params;

        // Check ownership
        const existing = await Itinerary.findById(id).select('creator_id').lean();

        if (!existing || existing.creator_id?.toString() !== (session.user as any).id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await Itinerary.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[ITINERARY_DELETE]", error);
        return NextResponse.json({ error: "Internal Error", message: error.message }, { status: 500 });
    }
}
