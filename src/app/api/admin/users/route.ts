import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

// GET - Fetch all users
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const sessionUser = session.user as any;
        const requestingUser = await User.findById(sessionUser.id).select('role').lean();

        if (requestingUser?.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const users = await User.find({})
            .select('full_name email role is_banned createdAt')
            .sort({ createdAt: -1 })
            .lean();

        const data = users.map((u: any) => ({
            ...u,
            id: u._id.toString()
        }));

        return NextResponse.json(data);
    } catch (error) {
        console.error("[ADMIN_USERS_API]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// PUT - Ban or Unban a user
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { userId, isBanned } = body;

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        await connectToDatabase();
        const sessionUser = session.user as any;
        const requestingUser = await User.findById(sessionUser.id).select('role').lean();

        if (requestingUser?.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        // Prevent admin from banning themselves
        if (userId === sessionUser.id) {
            return NextResponse.json({ error: "You cannot ban yourself" }, { status: 400 });
        }

        await User.findByIdAndUpdate(userId, {
            is_banned: isBanned
        });

        return NextResponse.json({ success: true, is_banned: isBanned });
    } catch (error) {
        console.error("[ADMIN_USERS_PUT_API]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
