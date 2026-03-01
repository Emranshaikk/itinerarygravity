import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPurchase extends Document {
    user_id: mongoose.Types.ObjectId;
    itinerary_id: mongoose.Types.ObjectId;
    amount_paid: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    stripe_session_id?: string;
    creator_earnings: number;
    platform_fee: number;
    createdAt: Date;
    updatedAt: Date;
}

const PurchaseSchema: Schema<IPurchase> = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        itinerary_id: {
            type: Schema.Types.ObjectId,
            ref: 'Itinerary',
            required: true,
        },
        amount_paid: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
            default: 'USD',
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        stripe_session_id: String,
        creator_earnings: {
            type: Number,
            required: true,
            default: 0,
        },
        platform_fee: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

PurchaseSchema.index({ user_id: 1, itinerary_id: 1 });
PurchaseSchema.index({ itinerary_id: 1, status: 1 });

export const Purchase: Model<IPurchase> = mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema);
