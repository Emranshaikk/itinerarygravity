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
    verification_status: 'none' | 'pending' | 'verified' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            select: false, // Don't return password by default
        },
        full_name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            sparse: true, // Allow nulls/undefined but enforce uniqueness if present
        },
        avatar_url: {
            type: String,
        },
        bio: {
            type: String,
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
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation errors in Next.js development
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
