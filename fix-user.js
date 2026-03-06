const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fixUser() {
    console.log('Connecting to MongoDB...');
    if (!process.env.MONGODB_URI) {
        console.error('Error: MONGODB_URI is not defined in .env.local');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    const db = mongoose.connection.db;

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ username: 'SarahTravels' });
    if (existingUser) {
        console.log('User SarahTravels already exists!');
        process.exit(0);
    }

    // Try to update Jane Explorer if she exists
    const result = await db.collection('users').updateOne(
        { full_name: 'Jane Explorer' },
        { $set: { username: 'SarahTravels', full_name: 'Sarah Travels' } }
    );

    if (result.matchedCount > 0) {
        console.log('Successfully updated Jane Explorer to SarahTravels!');
    } else {
        console.log('No user found with name "Jane Explorer". Creating a fresh SarahTravels...');
        await db.collection('users').insertOne({
            username: 'SarahTravels',
            full_name: 'Sarah Travels',
            email: 'sarah@example.com',
            avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
            bio: 'Expert traveler and itinerary curator. Sharing my favorite hidden gems around the world.',
            social_links: {
                instagram: 'sarahtravels',
                youtube: 'sarahtravels_channel'
            },
            role: 'influencer',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('Created fresh SarahTravels profile!');
    }

    process.exit(0);
}

fixUser().catch(err => {
    console.error('An error occurred:', err);
    process.exit(1);
});
