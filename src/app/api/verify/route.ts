import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { auth } from '@clerk/nextjs/server';

export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const amount = 999 * 100; // $9.99 in cents/paise (Assuming 1:1 for now or fixed price in INR)
        // Note: For India, Razorpay usually uses INR. If you want USD, you'd 
        // need an international account. I'll stick to INR for now as it's common.

        const options = {
            amount: 80000, // Fixed 800 INR for verification
            currency: "INR",
            receipt: `verify_${userId.substring(0, 10)}`,
            notes: {
                userId,
                type: 'verification'
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
        console.error("[VERIFY_ERROR]", error);
        return NextResponse.json({ error: "Internal Error", message: error.message }, { status: 500 });
    }
}
