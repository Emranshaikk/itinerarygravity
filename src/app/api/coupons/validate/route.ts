import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Coupon } from '@/models/Coupon';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code, itineraryId } = await req.json();

        if (!code) {
            return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
        }

        await connectToDatabase();

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
            expiresAt: { $gt: new Date() }
        });

        if (!coupon) {
            return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 404 });
        }

        // Check if coupon is restricted to a specific itinerary
        if (coupon.itineraryId && itineraryId && coupon.itineraryId.toString() !== itineraryId) {
            return NextResponse.json({ error: "This coupon is not valid for this itinerary" }, { status: 400 });
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
        }

        return NextResponse.json({
            valid: true,
            discountType: coupon.discountType,
            value: coupon.value,
            code: coupon.code
        });

    } catch (error: any) {
        console.error("[COUPON_VALIDATE_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
