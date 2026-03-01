require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Need to use the models we just updated
const { UserSchema } = require('./src/models/User');
// We will test directly with mongoose to see validation errors

async function testValidation() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    // We recreate the model here inside the script so we can test it directly
    // since the Next.js app is compiled in TS
    const TestUserSchema = new mongoose.Schema({
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        full_name: {
            type: String,
            required: [true, "Full name is required"],
            maxlength: [100, "Full name cannot exceed 100 characters"]
        },
        bio: {
            type: String,
            maxlength: [500, "Bio cannot exceed 500 characters"]
        }
    }, { strict: "throw" });

    const TestUser = mongoose.models.TestUser || mongoose.model('TestUser', TestUserSchema);

    console.log("\n--- Testing Bad Email ---");
    try {
        const badUser = new TestUser({ email: "not-an-email", full_name: "Test User" });
        await badUser.validate();
        console.log("❌ FAILED: Schema accepted bad email");
    } catch (e) {
        console.log("✅ SUCCESS: Schema rejected bad email:", e.message);
    }

    console.log("\n--- Testing Strict Mode (Unknown Field) ---");
    try {
        const hackerUser = new TestUser({ email: "test@test.com", full_name: "Hacker", adminPrivileges: true });
        // Mongoose strict mode throws on instantiation or save
        await hackerUser.save(); // Won't actually save if strict throws
        console.log("❌ FAILED: Schema accepted unknown field");
    } catch (e) {
        console.log("✅ SUCCESS: Schema rejected unknown field:", e.message);
    }

    console.log("\n--- Testing Max Length (Bio) ---");
    try {
        const longBio = "a".repeat(501);
        const chattyUser = new TestUser({ email: "chatty@test.com", full_name: "Chatty", bio: longBio });
        await chattyUser.validate();
        console.log("❌ FAILED: Schema accepted too long bio");
    } catch (e) {
        console.log("✅ SUCCESS: Schema rejected too long bio:", e.message);
    }

    console.log("\nDone testing validations.");
    process.exit(0);
}

testValidation().catch(console.error);
