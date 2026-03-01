import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { itineraryId, price, title } = await req.json();

        if (!itineraryId || !price) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        // Fetch itinerary to find creator
        const { Itinerary } = await import('@/models/Itinerary');
        const { User } = await import('@/models/User');
        await import('@/lib/mongodb').then(m => m.default());

        const itinerary = await Itinerary.findById(itineraryId);
        if (!itinerary) {
            return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
        }

        const creator = await User.findById(itinerary.creator_id);

        // Razorpay expects amount in paise (cents counterpart)
        const amount = Math.round(price * 100);

        const options: any = {
            amount: amount,
            currency: "INR",
            receipt: `rcpt_${itineraryId.substring(0, 10)}`,
            notes: {
                userId,
                itineraryId,
                title
            }
        };

        // If creator has a connected Razorpay Account, split the payment
        if (creator?.razorpay_account_id) {
            const transferAmount = Math.round(amount * 0.70); // 70% to creator
            options.transfers = [
                {
                    account: creator.razorpay_account_id,
                    amount: transferAmount,
                    currency: "INR",
                    notes: {
                        name: "Creator Earnings",
                        roll: "creator",
                    },
                    linked_account_notes: ["roll"],
                    on_hold: 0 // Process immediately or hold based on your business logic
                }
            ];
        }

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error: any) {
        console.error("[RAZORPAY_ERROR]", error);
        return NextResponse.json({ error: "Internal Error", message: error.message }, { status: 500 });
    }
}
