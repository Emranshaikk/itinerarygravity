const { loadEnvConfig } = require('@next/env');
const mongoose = require('mongoose');

// We have to mock Next.js's environment loading
const projectDir = process.cwd();
loadEnvConfig(projectDir);

// Re-implement the schemas locally for the seed script so we don't have to deal with Next.js compiled TypeScript
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    full_name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    avatar_url: String,
    bio: String,
    role: { type: String, enum: ['buyer', 'influencer', 'admin'], default: 'buyer' },
    is_verified: { type: Boolean, default: false },
    verification_status: { type: String, enum: ['none', 'pending', 'verified', 'rejected'], default: 'none' }
}, { timestamps: true });

const DaySchema = new mongoose.Schema({
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
        dinner: { type: Boolean, default: false }
    }
});

const ItinerarySchema = new mongoose.Schema({
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'USD' },
    description: String,
    image_url: String,
    is_published: { type: Boolean, default: false },
    is_approved: { type: Boolean, default: true },
    duration_days: { type: Number, default: 1 },
    tags: [String],
    average_rating: { type: Number, default: 0 },
    review_count: { type: Number, default: 0 },
    content: {
        days: [DaySchema],
        proofOfVisit: { images: [String], notes: String },
        logistics: mongoose.Schema.Types.Mixed,
        preTrip: mongoose.Schema.Types.Mixed
    },
    views_count: { type: Number, default: 0 },
    purchases_count: { type: Number, default: 0 },
    total_revenue: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Itinerary = mongoose.models.Itinerary || mongoose.model('Itinerary', ItinerarySchema);

async function seedDatabase() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected successfully!");

        // 1. Create a sample Influencer User
        console.log("Creating sample user...");

        // Remove existing users to avoid unique constraint errors during testing
        await User.deleteMany({ email: 'jane.explorer@example.com' });

        const testUser = await User.create({
            email: "jane.explorer@example.com",
            full_name: "Jane Explorer",
            username: "jane_explores",
            role: "influencer",
            is_verified: true,
            verification_status: "verified",
            bio: "Travel passionate exploring the world 🌎",
            avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
        });

        console.log("Created user:", testUser._id);

        // 2. Add an Itinerary created by this User
        console.log("Creating samples itineraries...");

        await Itinerary.deleteMany({ creator_id: testUser._id });

        await Itinerary.create({
            creator_id: testUser._id,
            title: "Ultimate 3 Days in Paris",
            location: "Paris, France",
            price: 19.99,
            currency: "USD",
            description: "A complete guide to seeing the best of Paris in a weekend.",
            image_url: "https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=1000&q=80",
            is_published: true,
            duration_days: 3,
            tags: ["city", "romantic", "food"],
            content: {
                days: [
                    {
                        dayNumber: 1,
                        title: "Eiffel Tower & Center",
                        morningPlan: "Visit the Eiffel Tower right at opening time.",
                        afternoonPlan: "Walk down the Champs-Élysées.",
                        eveningPlan: "Dinner cruise on the Seine river.",
                        meals: { breakfast: true, lunch: true, dinner: true }
                    }
                ]
            }
        });

        await Itinerary.create({
            creator_id: testUser._id,
            title: "Bali Backpacker's Paradise",
            location: "Bali, Indonesia",
            price: 9.99,
            currency: "USD",
            description: "How to travel Bali on a budget while seeing all the beautiful spots.",
            image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
            is_published: true,
            duration_days: 7,
            tags: ["beach", "budget", "nature"],
            content: {
                days: [
                    {
                        dayNumber: 1,
                        title: "Arrival in Canggu",
                        morningPlan: "Arrive at airport and get to the hostel.",
                        afternoonPlan: "Rent a scooter and explore the beaches.",
                        eveningPlan: "Sunset drinks at Old Man's.",
                        meals: { breakfast: false, lunch: true, dinner: true }
                    }
                ]
            }
        });

        console.log("✅ Database seeded successfully!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding failed:");
        console.error(error);
        process.exit(1);
    }
}

seedDatabase();
