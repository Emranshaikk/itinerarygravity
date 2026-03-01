import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { handleApiError } from "@/lib/api-errorhandler";

export async function POST(req: Request) {
    try {
        const { email, password, role } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            full_name: email.split("@")[0], // Default name
            username: `user_${Math.random().toString(36).substring(2, 9)}`,
            role: role || "buyer",
            is_verified: false,
            verification_status: "none",
        });

        return NextResponse.json(
            { message: "User registered successfully", userId: newUser._id },
            { status: 201 }
        );
    } catch (error: any) {
        return handleApiError(error);
    }
}
