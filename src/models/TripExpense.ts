import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITripExpense extends Document {
    user_id: mongoose.Types.ObjectId;
    itinerary_id: mongoose.Types.ObjectId;
    day_number: number;
    amount: number;
    category: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TripExpenseSchema: Schema<ITripExpense> = new Schema(
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
        day_number: {
            type: Number,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

TripExpenseSchema.index({ itinerary_id: 1, user_id: 1, createdAt: 1 });

export const TripExpense: Model<ITripExpense> = mongoose.models.TripExpense || mongoose.model<ITripExpense>('TripExpense', TripExpenseSchema);
