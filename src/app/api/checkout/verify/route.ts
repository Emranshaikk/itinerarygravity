import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { Purchase } from "@/models/Purchase";

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            itineraryId,
            amount
        } = await req.json();

        // 1. Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Calculate split (30/70)
        const totalAmount = amount / 100; // Convert from paise
        const platformFee = totalAmount * 0.30;
        const creatorEarnings = totalAmount * 0.70;

        await connectToDatabase();

        // 3. Record purchase
        await Purchase.create({
            user_id: (session.user as any).id,
            itinerary_id: itineraryId,
            amount_paid: totalAmount,
            currency: 'INR',
            status: 'completed',
            platform_fee: platformFee,
            creator_earnings: creatorEarnings,
            stripe_session_id: razorpay_payment_id // Reusing this field for payment ID
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[CHECKOUT_VERIFY_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
