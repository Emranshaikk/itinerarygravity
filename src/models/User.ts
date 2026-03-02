import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string;
    full_name: string;
    username: string;
    avatar_url?: string;
    bio?: string;
    role: 'buyer' | 'influencer' | 'admin';
    is_verified: boolean;
    is_banned: boolean;
    verification_status: 'none' | 'pending' | 'verified' | 'rejected';
    razorpay_account_id?: string;
    social_links?: {
        instagram?: string;
        tiktok?: string;
        youtube?: string;
        twitter?: string;
    };
    saved_itineraries?: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password: {
            type: String,
            select: false,
        },
        full_name: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            maxlength: [100, "Full name cannot exceed 100 characters"]
        },
        username: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            maxlength: [50, "Username cannot exceed 50 characters"],
            match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
        },
        avatar_url: {
            type: String,
            match: [/^https?:\/\/.*/, 'Please enter a valid URL']
        },
        bio: {
            type: String,
            maxlength: [500, "Bio cannot exceed 500 characters"]
        },
        role: {
            type: String,
            enum: ['buyer', 'influencer', 'admin'],
            default: 'buyer',
        },
        is_verified: {
            type: Boolean,
            default: false,
        },
        verification_status: {
            type: String,
            enum: ['none', 'pending', 'verified', 'rejected'],
            default: 'none',
        },
        razorpay_account_id: {
            type: String,
            trim: true
        },
        is_banned: {
            type: Boolean,
            default: false,
        },
        saved_itineraries: [{
            type: Schema.Types.ObjectId,
            ref: 'Itinerary'
        }],
        social_links: {
            instagram: { type: String, trim: true },
            tiktok: { type: String, trim: true },
            youtube: { type: String, trim: true },
            twitter: { type: String, trim: true },
        }
    },
    {
        timestamps: true,
        strict: "throw" // Automatically reject any fields not explicitly defined in the schema
    }
);

// Prevent model recompilation errors in Next.js development
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
