import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { proof } = body;

        if (!proof) {
            return NextResponse.json({ error: "Identity proof required" }, { status: 400 });
        }

        const sessionUser = session.user as any;
        const userId = sessionUser.id;

        await connectToDatabase();
        await User.findByIdAndUpdate(userId, {
            identity_proof: proof,
            verification_status: 'pending'
        });

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
