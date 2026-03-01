import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * Standardized error handler for all API routes.
 * Safely handles Mongoose validation errors, duplicate keys, and generic server errors
 * without leaking sensitive database structure to the client.
 */
export function handleApiError(error: any) {
    console.error("[API_ERROR]", error);

    // Mongoose Validation Error (e.g. strict schema violation, max length exceeded)
    if (error instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(error.errors).map(err => err.message);
        return NextResponse.json({
            error: "Validation Error",
            message: messages.join(", ")
        }, { status: 400 });
    }

    // MongoDB Duplicate Key Error (e.g. registering with an existing email)
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return NextResponse.json({
            error: "Conflict",
            message: `An account or record with that ${field} already exists.`
        }, { status: 409 });
    }

    // Mongoose Cast Error (e.g. invalid ObjectId format in the URL)
    if (error instanceof mongoose.Error.CastError) {
        return NextResponse.json({
            error: "Invalid ID",
            message: "The provided ID format is invalid."
        }, { status: 400 });
    }

    // Fallback for unknown errors
    return NextResponse.json({
        error: "Internal Server Error",
        message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong processing your request."
    }, { status: 500 });
}
