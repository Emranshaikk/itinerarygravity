const { loadEnvConfig } = require('@next/env');
const mongoose = require('mongoose');
const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function seedCapeTown() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Define schemas matching models
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ email: String, full_name: String, role: String }));
        const Itinerary = mongoose.models.Itinerary || mongoose.model('Itinerary', new mongoose.Schema({
            creator_id: mongoose.Schema.Types.ObjectId,
            title: String,
            location: String,
            price: Number,
            currency: String,
            description: String,
            image_url: String,
            is_published: Boolean,
            is_approved: Boolean,
            duration_days: Number,
            content: Object,
            slug: String,
            average_rating: Number,
            review_count: Number
        }));

        const admin = await User.findOne({ role: 'admin' }) || await User.findOne({ email: 'jane.explorer@example.com' });
        if (!admin) throw new Error("No admin or influencer user found to assign as creator");

        // Delete existing Cape Town Masterpiece if exists
        await Itinerary.deleteMany({ title: "Cape Town Masterpiece: Penguins & Peaks" });

        const capetown = await Itinerary.create({
            creator_id: admin._id,
            title: "Cape Town Masterpiece: Penguins & Peaks",
            location: "Cape Town, South Africa",
            price: 49.00,
            currency: "USD",
            slug: "cape-town-masterpiece",
            description: "Experience the ultimate 4-day journey through the Mother City. From the heights of Table Mountain to the penguins of Boulders Beach, this interactive guide includes precise map locations for every stop.",
            image_url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2071&auto=format&fit=crop",
            is_published: true,
            is_approved: true,
            duration_days: 4,
            average_rating: 4.9,
            review_count: 124,
            content: {
                proofOfVisit: {
                    images: [
                        { url: "https://images.unsplash.com/photo-1579626359300-47b2df1ec7e1?q=80&w=2070", caption: "Sunrise at Boulders Beach with the locals!" },
                        { url: "https://images.unsplash.com/photo-1522045437190-84cf0d8293dd?q=80&w=2070", caption: "The view from Table Mountain is absolutely unreal." },
                        { url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2071", caption: "Camps Bay vibes." }
                    ],
                    notes: "I've spent over 3 months living in Cape Town. I personally vetted every single hotel, trail, and restaurant listed in this guide. Enjoy the Mother City!"
                },
                affiliateProducts: [
                    {
                        title: "DJI Mini 3 Pro Drone",
                        productUrl: "https://amazon.com",
                        imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000",
                        priceDisplay: "$759.00",
                        category: "Gear"
                    },
                    {
                        title: "Patagonia Daypack",
                        productUrl: "https://amazon.com",
                        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000",
                        priceDisplay: "$89.00",
                        category: "Luggage"
                    }
                ],
                days: [
                    {
                        dayNumber: 1,
                        title: "Iconic Peaks & Islands",
                        morningPlan: "Take the Aerial Cableway to the top of Table Mountain for breath-taking views of the city.",
                        afternoonPlan: "Visit the historic Robben Island and the vibrant V&A Waterfront for lunch and shopping.",
                        eveningPlan: "Sunset drinks at the Waterfront followed by dinner at a local seafood restaurant.",
                        hotelName: "The Silo Hotel",
                        transportMode: "Private Driver / Uber",
                        locationCoordinates: [
                            { longitude: 18.4026, latitude: -33.9482 }, // Table Mountain
                            { longitude: 18.3712, latitude: -33.8066 }, // Robben Island
                            { longitude: 18.4208, latitude: -33.9036 }, // V&A Waterfront
                        ],
                        meals: { breakfast: true, lunch: true, dinner: true }
                    },
                    {
                        dayNumber: 2,
                        title: "Coastal Charm & Wildlife",
                        morningPlan: "Breakfast at the hotel, then head to Boulders Beach to see the famous penguin colony.",
                        afternoonPlan: "Drive to Cape Point Nature Reserve for a scenic hike and visit the lighthouse.",
                        eveningPlan: "Casual dinner in Kalk Bay and drinks at a local club in the city center.",
                        hotelName: "The Silo Hotel",
                        transportMode: "Rental Car",
                        locationCoordinates: [
                            { longitude: 18.4513, latitude: -34.1973 }, // Boulders Beach
                            { longitude: 18.4844, latitude: -34.3568 }, // Cape Point
                            { longitude: 18.4235, latitude: -33.9085 }, // The Silo Hotel
                            { longitude: 18.3780, latitude: -33.9515 }, // Camps Bay Beach
                            { longitude: 18.4285, latitude: -33.8998 }, // Shimmy Beach Club
                        ],
                        meals: { breakfast: true, lunch: true, dinner: true }
                    },
                    {
                        dayNumber: 3,
                        title: "Winelands & Gastronomy",
                        morningPlan: "Full-day safari at Aquila Private Game Reserve (2 hours from city).",
                        afternoonPlan: "Continue safari and enjoy a late lunch at the wine estate.",
                        eveningPlan: "Fine dining at The Test Kitchen (Old Biscuit Mill).",
                        hotelName: "The Silo Hotel",
                        transportMode: "Safari Vehicle / SUV",
                        locationCoordinates: [
                            { longitude: 19.7422, latitude: -33.3486 }, // Aquila Safari
                            { longitude: 18.4594, latitude: -33.9273 }, // Test Kitchen
                        ],
                        meals: { breakfast: true, lunch: true, dinner: true }
                    },
                    {
                        dayNumber: 4,
                        title: "Gardens & Scenic Drives",
                        morningPlan: "Stroll through Kirstenbosch National Botanical Garden.",
                        afternoonPlan: "Drive along Chapman's Peak to Hout Bay and enjoy fish and chips.",
                        eveningPlan: "Final sunset at Signal Hill before departure.",
                        hotelName: "The Silo Hotel",
                        transportMode: "Rental Car",
                        locationCoordinates: [
                            { longitude: 18.4328, latitude: -33.9871 }, // Kirstenbosch
                            { longitude: 18.3614, latitude: -34.0883 }, // Chapman's Peak
                            { longitude: 18.3494, latitude: -34.0452 }, // Hout Bay
                        ],
                        meals: { breakfast: true, lunch: true, dinner: false }
                    }
                ]
            }
        });

        console.log(`✅ Cape Town Masterpiece itinerary created with ID: ${capetown._id}`);
        process.exit(0);
    } catch (e) {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    }
}

seedCapeTown();
