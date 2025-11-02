const mongoose = require("mongoose");
const Job = require("../models/Job");
const Candidate = require("../models/Candidate");

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI || "mongodb://localhost:27017/job-orbit"
        );
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

// Update jobs to use INR instead of USD
const updateJobCurrency = async () => {
    try {
        console.log("Updating job currencies from USD to INR...");

        const result = await Job.updateMany(
            { "salary.currency": "USD" },
            { $set: { "salary.currency": "INR" } }
        );

        console.log(`Updated ${result.modifiedCount} job records`);

        // Also update jobs with no currency set to INR
        const defaultResult = await Job.updateMany(
            {
                $and: [
                    { salary: { $exists: true } },
                    { "salary.currency": { $exists: false } },
                ],
            },
            { $set: { "salary.currency": "INR" } }
        );

        console.log(
            `Set default currency for ${defaultResult.modifiedCount} job records`
        );
    } catch (error) {
        console.error("Error updating job currencies:", error);
    }
};

// Update candidates to use INR instead of USD
const updateCandidateCurrency = async () => {
    try {
        console.log(
            "Updating candidate expected salary currencies from USD to INR..."
        );

        const result = await Candidate.updateMany(
            { "expectedSalary.currency": "USD" },
            { $set: { "expectedSalary.currency": "INR" } }
        );

        console.log(`Updated ${result.modifiedCount} candidate records`);

        // Also update candidates with no currency set to INR
        const defaultResult = await Candidate.updateMany(
            {
                $and: [
                    { expectedSalary: { $exists: true } },
                    { "expectedSalary.currency": { $exists: false } },
                ],
            },
            { $set: { "expectedSalary.currency": "INR" } }
        );

        console.log(
            `Set default currency for ${defaultResult.modifiedCount} candidate records`
        );
    } catch (error) {
        console.error("Error updating candidate currencies:", error);
    }
};

// Main migration function
const migrateCurrency = async () => {
    console.log("Starting currency migration from USD to INR...");

    await connectDB();

    await updateJobCurrency();
    await updateCandidateCurrency();

    console.log("Currency migration completed successfully!");
    process.exit(0);
};

// Handle errors
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});

process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    process.exit(1);
});

// Run migration if called directly
if (require.main === module) {
    migrateCurrency();
}

module.exports = migrateCurrency;
