import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { TripExpense } from "@/models/TripExpense";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { itinerary_id, day_number, amount, category, description } = body;

        if (!itinerary_id || day_number === undefined || amount === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectToDatabase();
        const sessionUser = session.user as any;

        const expense = await TripExpense.create({
            user_id: sessionUser.id,
            itinerary_id,
            day_number,
            amount,
            category,
            description
        });

        return NextResponse.json(expense);
    } catch (error: any) {
        console.error("[EXPENSES_POST_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const itinerary_id = searchParams.get('itinerary_id');

        if (!itinerary_id) {
            return NextResponse.json({ error: "Missing itinerary_id" }, { status: 400 });
        }

        await connectToDatabase();
        const sessionUser = session.user as any;

        const expenses = await TripExpense.find({
            itinerary_id,
            user_id: sessionUser.id
        }).sort({ createdAt: 1 }).lean();

        const data = expenses.map((e: any) => ({ ...e, id: e._id.toString() }));

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[EXPENSES_GET_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const expense_id = searchParams.get('id');

        if (!expense_id) {
            return NextResponse.json({ error: "Missing expense_id" }, { status: 400 });
        }

        await connectToDatabase();
        const sessionUser = session.user as any;

        const result = await TripExpense.findOneAndDelete({
            _id: expense_id,
            user_id: sessionUser.id
        });

        if (!result) {
            return NextResponse.json({ error: "Expense not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[EXPENSES_DELETE_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
