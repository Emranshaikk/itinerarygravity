import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    discountType: 'percentage' | 'fixed';
    value: number;
    expiresAt: Date;
    isActive: boolean;
    itineraryId?: mongoose.Types.ObjectId;
    usageLimit?: number;
    usageCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema: Schema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    itineraryId: { type: Schema.Types.ObjectId, ref: 'Itinerary' },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 }
}, { timestamps: true });

// Index for fast lookups
CouponSchema.index({ code: 1 });

export const Coupon = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
