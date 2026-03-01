import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
    user_id: mongoose.Types.ObjectId;
    itinerary_id: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
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
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: String,
    },
    {
        timestamps: true,
    }
);

// Ensure a user can only review an itinerary once
ReviewSchema.index({ user_id: 1, itinerary_id: 1 }, { unique: true });
ReviewSchema.index({ itinerary_id: 1 });

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
