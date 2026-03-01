import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDay {
    dayNumber: number;
    title?: string;
    morningPlan?: string;
    afternoonPlan?: string;
    eveningPlan?: string;
    hotelName?: string;
    transportMode?: string;
    meals?: {
        breakfast?: boolean;
        lunch?: boolean;
        dinner?: boolean;
    };
}

export interface IItinerary extends Document {
    creator_id: mongoose.Types.ObjectId;
    title: string;
    location: string;
    price: number;
    currency: string;
    description?: string;
    image_url?: string;
    is_published: boolean;
    is_approved: boolean;
    duration_days: number;
    tags: string[];
    average_rating: number;
    review_count: number;
    content: {
        days: IDay[];
        proofOfVisit?: {
            images: string[];
            notes?: string;
        };
        logistics?: any;
        preTrip?: any;
    };
    views_count: number;
    purchases_count: number;
    total_revenue: number;
    createdAt: Date;
    updatedAt: Date;
}

const DaySchema = new Schema({
    dayNumber: { type: Number, required: true },
    title: String,
    morningPlan: String,
    afternoonPlan: String,
    eveningPlan: String,
    hotelName: String,
    transportMode: String,
    meals: {
        breakfast: { type: Boolean, default: false },
        lunch: { type: Boolean, default: false },
        dinner: { type: Boolean, default: false },
    },
});

const ItinerarySchema: Schema<IItinerary> = new Schema(
    {
        creator_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        currency: {
            type: String,
            default: 'USD',
        },
        description: String,
        image_url: String,
        is_published: {
            type: Boolean,
            default: false,
        },
        is_approved: {
            type: Boolean,
            default: true, // Auto-approve for now unless needed otherwise
        },
        duration_days: {
            type: Number,
            default: 1,
        },
        tags: [String],
        average_rating: {
            type: Number,
            default: 0,
        },
        review_count: {
            type: Number,
            default: 0,
        },
        content: {
            days: [DaySchema],
            proofOfVisit: {
                images: [String],
                notes: String,
            },
            logistics: Schema.Types.Mixed,
            preTrip: Schema.Types.Mixed,
        },
        views_count: {
            type: Number,
            default: 0,
        },
        purchases_count: {
            type: Number,
            default: 0,
        },
        total_revenue: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for search and filtering
ItinerarySchema.index({ title: 'text', location: 'text', tags: 'text' });
ItinerarySchema.index({ creator_id: 1 });
ItinerarySchema.index({ is_published: 1, is_approved: 1 });

export const Itinerary: Model<IItinerary> = mongoose.models.Itinerary || mongoose.model<IItinerary>('Itinerary', ItinerarySchema);
