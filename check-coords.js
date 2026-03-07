const { loadEnvConfig } = require('@next/env');
const mongoose = require('mongoose');
const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function checkItineraries() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Itinerary = mongoose.models.Itinerary || mongoose.model('Itinerary', new mongoose.Schema({ content: Object }));
        const itineraries = await Itinerary.find({});

        console.log(`Found ${itineraries.length} itineraries.`);
        itineraries.forEach(i => {
            const hasCoords = i.content?.dailyItinerary?.some(d => d.morning?.locationCoordinates || d.afternoon?.locationCoordinates || d.evening?.locationCoordinates) ||
                i.content?.accommodation?.hotelRecommendations?.some(h => h.locationCoordinates);
            console.log(`ID: ${i._id}, Title: ${i.title}, Has Coords: ${!!hasCoords}`);
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkItineraries();
