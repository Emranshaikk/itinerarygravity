import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/mongodb";
import { Purchase } from "@/models/Purchase";
import { User } from "@/models/User";
import { sendPurchaseReceipt } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const payload = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        // Webhook Secret must be in your environment variables
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!secret) {
            console.error("Missing RAZORPAY_WEBHOOK_SECRET");
            return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
        }

        // Verify the signature
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(payload)
            .digest("hex");

        if (expectedSignature !== signature) {
            console.error("Invalid Webhook Signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        // Parse the payload safely after verification
        const event = JSON.parse(payload);

        // We only care about successful payment events
        if (event.event === "order.paid" || event.event === "payment.captured") {
            const payment = event.payload.payment.entity;
            const orderId = payment.order_id;

            // Extract notes passed during checkout
            const notes = payment.notes || {};
            const userId = notes.userId;
            const itineraryId = notes.itineraryId;

            if (!userId || !itineraryId) {
                console.error("Missing userId or itineraryId in notes", notes);
                return NextResponse.json({ success: true, message: "No notes attached" });
            }

            // At this point, the payment is fully verified by Razorpay
            // 70/30 split calculation
            const totalAmount = payment.amount / 100; // Razorpay amounts are in paise
            const platformFee = totalAmount * 0.30;
            const creatorEarnings = totalAmount * 0.70;

            await connectToDatabase();

            // UPSERT Purchase Record
            await Purchase.findOneAndUpdate(
                {
                    user_id: userId,
                    itinerary_id: itineraryId
                },
                {
                    user_id: userId,
                    itinerary_id: itineraryId,
                    amount_paid: totalAmount,
                    currency: payment.currency || 'INR',
                    status: 'completed',
                    platform_fee: platformFee,
                    creator_earnings: creatorEarnings,
                    stripe_session_id: payment.id // Actually razorpay payment id
                },
                { upsert: true, new: true }
            );

            // Update Itinerary Analytics
            const { Itinerary } = await import('@/models/Itinerary');
            const updatedItinerary = await Itinerary.findByIdAndUpdate(
                itineraryId,
                {
                    $inc: {
                        purchases_count: 1,
                        total_revenue: creatorEarnings
                    }
                }
            );

            // Fetch User details for email
            const buyer = await User.findById(userId).lean();

            // Send automated receipt!
            if (buyer && buyer.email && updatedItinerary) {
                const url = `${process.env.NEXTAUTH_URL || 'https://itinerarygravity.com'}/itinerary/${(updatedItinerary as any).slug || updatedItinerary._id}`;
                await sendPurchaseReceipt(
                    buyer.email,
                    buyer.full_name,
                    updatedItinerary.title,
                    totalAmount,
                    payment.currency || 'INR',
                    url
                );
            }

            console.log(`Payment successfully recorded and receipt sent for Order ${orderId}`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
