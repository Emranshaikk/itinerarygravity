import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = user.id;

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
