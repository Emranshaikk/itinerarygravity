const { loadEnvConfig } = require('@next/env');
const mongoose = require('mongoose');
const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function seedMasterpiece() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
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
            duration_days: Number,
            content: Object
        }));

        const admin = await User.findOne({ role: 'admin' }) || await User.findOne({ email: 'jane.explorer@example.com' });
        if (!admin) throw new Error("No admin or influencer user found to assign as creator");

        const masterpiece = await Itinerary.create({
            creator_id: admin._id,
            title: "Masterpiece: The Ultimate Bali Map & Guide",
            location: "Ubud, Bali",
            price: 25.00,
            currency: "USD",
            description: "This itinerary is designed specifically to test the MAP integration. It includes coordinates for every stop!",
            image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2076&auto=format&fit=crop",
            is_published: true,
            duration_days: 3,
            content: {
                days: [
                    {
                        dayNumber: 1,
                        title: "Cultural Heart of Ubud",
                        morningPlan: "Visit the Monkey Forest Sanctuary.",
                        afternoonPlan: "Traditional Balinese lunch at Ibu Rai.",
                        eveningPlan: "Ubud Palace Dance Performance.",
                        hotelName: "Komaneka at Bisma",
                        transportMode: "Walking",
                        locationCoordinates: [
                            { longitude: 115.2588, latitude: -8.5194 }, // Monkey Forest
                            { longitude: 115.2625, latitude: -8.5069 }, // Ubud Palace
                        ],
                        meals: { breakfast: true, lunch: true, dinner: true }
                    },
                    {
                        dayNumber: 2,
                        title: "Rice Terraces & Swing",
                        morningPlan: "Tegalalang Rice Terrace for sunrise.",
                        afternoonPlan: "Bali Swing experience.",
                        eveningPlan: "Relaxing spa session.",
                        hotelName: "Komaneka at Bisma",
                        transportMode: "Scooter",
                        locationCoordinates: [
                            { longitude: 115.2789, latitude: -8.4333 }, // Tegalalang
                            { longitude: 115.2441, latitude: -8.4900 }, // Bali Swing
                        ],
                        meals: { breakfast: true, lunch: true, dinner: false }
                    }
                ]
            }
        });

        console.log(`✅ Masterpiece itinerary created with ID: ${masterpiece._id}`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
seedMasterpiece();
