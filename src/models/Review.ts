import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
    itinerary_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
    {
        itinerary_id: {
            type: Schema.Types.ObjectId,
            ref: 'Itinerary',
            required: true,
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        }
    },
    {
        timestamps: true,
    }
);

// Prevent a user from reviewing the same itinerary twice
ReviewSchema.index({ itinerary_id: 1, user_id: 1 }, { unique: true });

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
