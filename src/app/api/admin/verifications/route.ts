import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const sessionUser = session.user as any;
        const user = await User.findById(sessionUser.id).select('role').lean();

        if (user?.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const verifications = await User.find({ verification_status: 'pending' })
            .select('full_name email identity_proof verification_status')
            .sort({ createdAt: -1 })
            .lean();

        const data = verifications.map((v: any) => ({
            ...v,
            id: v._id.toString()
        }));

        return NextResponse.json(data);
    } catch (error) {
        console.error("[ADMIN_VERIFS_API]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { userId, isApproved } = body;

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        await connectToDatabase();
        const sessionUser = session.user as any;
        const user = await User.findById(sessionUser.id).select('role').lean();

        if (user?.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        await User.findByIdAndUpdate(userId, {
            is_verified: isApproved,
            verification_status: isApproved ? 'verified' : 'none'
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_VERIFS_PUT_API]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
