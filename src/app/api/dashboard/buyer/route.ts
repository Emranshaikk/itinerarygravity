import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { Purchase } from "@/models/Purchase";
import { Itinerary } from "@/models/Itinerary";
import { Wishlist } from "@/models/Wishlist";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as any;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const purchases = await Purchase.find({ user_id: user.id, status: 'completed' })
            .populate({
                path: 'itinerary_id',
                populate: { path: 'creator_id', select: 'full_name' }
            })
            .sort({ createdAt: -1 })
            .lean();

        const formattedPurchases = purchases.map((p: any) => {
            const itinerary = p.itinerary_id;
            const itineraryId = itinerary?._id?.toString() || (typeof itinerary === 'string' ? itinerary : undefined);
            
            return {
                id: p._id.toString(),
                itinerary_id: itineraryId,
                title: itinerary?.title || "Itinerary",
                creator: itinerary?.creator_id?.full_name || "@Influencer",
                location: itinerary?.location || "Unknown Location",
                date: new Date(p.createdAt).toLocaleDateString(),
                image: itinerary?.image_url || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600",
                description: itinerary?.description || ""
            };
        });

        const wishlists = await Wishlist.find({ user_id: user.id })
            .populate('itinerary_id')
            .lean();

        const formattedWishlists = wishlists.map((w: any) => {
            if (!w.itinerary_id) return null;
            return {
                ...w.itinerary_id,
                id: w.itinerary_id._id.toString()
            };
        }).filter(Boolean);

        const marketplace = await Itinerary.find({ is_published: true })
            .populate('creator_id', 'full_name')
            .limit(6)
            .lean();

        const formattedMarketplace = marketplace.map((item: any) => ({
            ...item,
            id: item._id.toString(),
            profiles: { full_name: item.creator_id?.full_name }
        }));

        return NextResponse.json({
            purchases: formattedPurchases,
            wishlist: formattedWishlists,
            marketplaceItems: formattedMarketplace
        });
    } catch (error: any) {
        console.error("[BUYER_DASHBOARD_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
