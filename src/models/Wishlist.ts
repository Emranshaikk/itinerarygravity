import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlist extends Document {
    user_id: string;
    itinerary_id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const WishlistSchema: Schema = new Schema({
    user_id: { type: String, required: true, index: true },
    itinerary_id: { type: Schema.Types.ObjectId, ref: 'Itinerary', required: true }
}, {
    timestamps: true
});

WishlistSchema.index({ user_id: 1, itinerary_id: 1 }, { unique: true });

export const Wishlist = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);
