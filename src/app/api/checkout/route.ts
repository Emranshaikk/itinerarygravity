import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { itineraryId, price, title } = await req.json();

        if (!itineraryId || !price) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        // Razorpay expects amount in paise (cents counterpart)
        const amount = Math.round(price * 100);

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `rcpt_${itineraryId.substring(0, 10)}`,
            notes: {
                userId,
                itineraryId,
                title
            }
        };

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
