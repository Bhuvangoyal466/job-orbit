const mongoose = require("mongoose");
const Recruiter = require("../models/Recruiter");
const Job = require("../models/Job");
require("dotenv").config();

const fixRecruiterStats = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected to MongoDB");

        // Get all recruiters
        const recruiters = await Recruiter.find();

        console.log(`Found ${recruiters.length} recruiters`);

        for (let recruiter of recruiters) {
            console.log(`\nProcessing recruiter: ${recruiter.email}`);

            // Count jobs posted by this recruiter
            const totalJobs = await Job.countDocuments({
                recruiter: recruiter._id,
            });
            const activeJobs = await Job.countDocuments({
                recruiter: recruiter._id,
                isActive: true,
            });

            // Count applications received
            const jobs = await Job.find({ recruiter: recruiter._id });
            let totalApplications = 0;
            let totalHires = 0;

            jobs.forEach((job) => {
                totalApplications += job.applicants.length;
                totalHires += job.applicants.filter(
                    (app) => app.status === "hired"
                ).length;
            });

            // Update recruiter stats using updateOne to bypass validation
            await Recruiter.updateOne(
                { _id: recruiter._id },
                {
                    $set: {
                        "stats.totalJobsPosted": totalJobs,
                        "stats.activeJobs": activeJobs,
                        "stats.totalApplicationsReceived": totalApplications,
                        "stats.totalHires": totalHires,
                    },
                }
            );

            console.log(`Updated stats for ${recruiter.email}:`);
            console.log(`- Total Jobs Posted: ${totalJobs}`);
            console.log(`- Active Jobs: ${activeJobs}`);
            console.log(`- Total Applications: ${totalApplications}`);
            console.log(`- Total Hires: ${totalHires}`);
        }

        console.log("\nRecruiter stats fixed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error fixing recruiter stats:", error);
        process.exit(1);
    }
};

// Run the fix
fixRecruiterStats();
