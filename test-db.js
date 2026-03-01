const { loadEnvConfig } = require('@next/env');
const mongoose = require('mongoose');

const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function testConnection() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in your .env.local file.");
        }

        console.log("Attempting to connect to MongoDB...");
        // Hide password in logs
        const safeUri = uri.replace(/:([^:@]+)@/, ':****@');
        console.log(`Using URI: ${safeUri}`);

        await mongoose.connect(uri);
        console.log("✅ Successfully connected to MongoDB Atlas!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Connection failed:");
        console.error(error.message);
        process.exit(1);
    }
}

testConnection();
