import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 1, // Keep at least 1 socket connection open
        };

        cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
            console.log("✅ MongoDB Connection Pool Initialized");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error("❌ MongoDB Connection Failed:", e);
        throw e;
    }

    return cached.conn;
}

// Global Connection Error Listener
mongoose.connection.on('error', err => {
    console.error('🔥 MongoDB Runtime Error:', err);
});

export default connectToDatabase;
