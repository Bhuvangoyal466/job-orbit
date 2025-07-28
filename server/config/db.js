const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error(
                "MongoDB URI is not defined in environment variables"
            );
        }

        const conn = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`📦 MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("🔌 MongoDB disconnected");
        });

        // Graceful shutdown
        process.on("SIGINT", async () => {
            try {
                await mongoose.connection.close();
                console.log(
                    "🔐 MongoDB connection closed through app termination"
                );
                process.exit(0);
            } catch (err) {
                console.error("Error during MongoDB disconnection:", err);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
