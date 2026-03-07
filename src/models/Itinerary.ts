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
    locationCoordinates?: {
        longitude: number;
        latitude: number;
    }[];
}

export interface IItinerary extends Document {
    creator_id: mongoose.Types.ObjectId;
    title: string;
    location: string;
    price: number;
    currency: string;
    description?: string;
    slug?: string;
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
            images: { url: string; caption?: string }[];
            notes?: string;
        };
        logistics?: any;
        preTrip?: any;
        [key: string]: any;
    };
    views_count: number;
    purchases_count: number;
    total_revenue: number;
    createdAt: Date;
    updatedAt: Date;
}

const DaySchema = new Schema({
    dayNumber: { type: Number, required: true, min: 1, max: 30 },
    title: { type: String, maxlength: 100 },
    morningPlan: { type: String, maxlength: 1000 },
    afternoonPlan: { type: String, maxlength: 1000 },
    eveningPlan: { type: String, maxlength: 1000 },
    hotelName: { type: String, maxlength: 100 },
    transportMode: { type: String, maxlength: 100 },
    meals: {
        breakfast: { type: Boolean, default: false },
        lunch: { type: Boolean, default: false },
        dinner: { type: Boolean, default: false },
    },
    locationCoordinates: [{
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    }]
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
            trim: true,
            maxlength: [150, "Title cannot exceed 150 characters"]
        },
        location: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, "Location cannot exceed 100 characters"]
        },
        price: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Price cannot be negative"],
            max: [10000, "Price exceeds maximum allowed limit"]
        },
        currency: {
            type: String,
            default: 'USD',
            enum: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY']
        },
        description: {
            type: String,
            maxlength: [5000, "Description cannot exceed 5000 characters"]
        },
        slug: {
            type: String,
            trim: true
        },
        image_url: {
            type: String,
            match: [/^https?:\/\/.*/, 'Please enter a valid URL']
        },
        is_published: {
            type: Boolean,
            default: false,
        },
        is_approved: {
            type: Boolean,
            default: true,
        },
        duration_days: {
            type: Number,
            default: 1,
            min: [1, "Duration must be at least 1 day"],
            max: [30, "Duration cannot exceed 30 days"]
        },
        tags: {
            type: [String],
            validate: [
                { validator: (val: string[]) => val.length <= 10, msg: '{PATH} exceeds the limit of 10' }
            ]
        },
        average_rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        review_count: {
            type: Number,
            default: 0,
            min: 0
        },
        content: {
            days: {
                type: [DaySchema],
                validate: [
                    { validator: (val: any[]) => val.length <= 30, msg: '{PATH} exceeds maximum of 30 days' }
                ]
            },
            proofOfVisit: {
                images: {
                    type: [{
                        url: { type: String, required: true },
                        caption: { type: String, default: '' }
                    }],
                    validate: [
                        { validator: (val: any[]) => val.length <= 20, msg: '{PATH} exceeds maximum of 20 images' }
                    ]
                },
                notes: { type: String, maxlength: 2000 },
            },
            logistics: Schema.Types.Mixed,
            preTrip: Schema.Types.Mixed,
            cover: Schema.Types.Mixed,
            arrival: Schema.Types.Mixed,
            dailyItinerary: Schema.Types.Mixed,
            food: Schema.Types.Mixed,
            transport: Schema.Types.Mixed,
            secrets: Schema.Types.Mixed,
            safety: Schema.Types.Mixed,
            customization: Schema.Types.Mixed,
            shopping: Schema.Types.Mixed,
            departure: Schema.Types.Mixed,
            postTrip: Schema.Types.Mixed,
            bonus: Schema.Types.Mixed,
            accommodation: Schema.Types.Mixed,
            affiliateProducts: Schema.Types.Mixed,
            creatorProducts: Schema.Types.Mixed,
        },
        views_count: {
            type: Number,
            default: 0,
            min: 0
        },
        purchases_count: {
            type: Number,
            default: 0,
            min: 0
        },
        total_revenue: {
            type: Number,
            default: 0,
            min: 0
        },
    },
    {
        timestamps: true,
        strict: true // Enforce strict schema validation
    }
);

// Search and performance indexes
ItinerarySchema.index({ title: 'text', location: 'text', tags: 'text' });
ItinerarySchema.index({ creator_id: 1 });
// Compound index for trending itineraries queries
ItinerarySchema.index({ is_published: 1, is_approved: 1, average_rating: -1 });

export const Itinerary: Model<IItinerary> = mongoose.models.Itinerary || mongoose.model<IItinerary>('Itinerary', ItinerarySchema);
