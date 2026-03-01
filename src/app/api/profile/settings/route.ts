import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessionUser = session.user as any;
        await connectToDatabase();

        const user = await User.findById(sessionUser.id).lean();
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("GET Profile Settings Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessionUser = session.user as any;
        const body = await req.json();

        await connectToDatabase();

        // Update fields whitelist
        const updates: any = {};
        if (body.full_name !== undefined) updates.full_name = body.full_name;
        if (body.username !== undefined) updates.username = body.username;
        if (body.bio !== undefined) updates.bio = body.bio;
        if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url;

        if (body.social_links) {
            updates.social_links = body.social_links;
        }

        if (body.payment_info) {
            updates.payment_info = body.payment_info;
        }

        const user = await User.findByIdAndUpdate(
            sessionUser.id,
            { $set: updates },
            { new: true }
        ).lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("PUT Profile Settings Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
