import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITravelerPhoto extends Document {
    user_id: mongoose.Types.ObjectId;
    itinerary_id: mongoose.Types.ObjectId;
    image_url: string;
    caption?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TravelerPhotoSchema: Schema<ITravelerPhoto> = new Schema(
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
        image_url: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

TravelerPhotoSchema.index({ itinerary_id: 1, createdAt: -1 });
TravelerPhotoSchema.index({ user_id: 1 });

export const TravelerPhoto: Model<ITravelerPhoto> = mongoose.models.TravelerPhoto || mongoose.model<ITravelerPhoto>('TravelerPhoto', TravelerPhotoSchema);
