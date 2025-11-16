const Job = require("../models/Job");
const Recruiter = require("../models/Recruiter");
const mongoose = require("mongoose");

/**
 * Migration script to update existing jobs with complete company information
 * from their respective recruiter profiles
 */
const migrateJobCompanyInfo = async () => {
    try {
        console.log("Starting job company info migration...");

        // Find all jobs
        const jobs = await Job.find({}).populate("recruiter");

        let updatedCount = 0;
        let errorCount = 0;

        for (const job of jobs) {
            try {
                if (!job.recruiter) {
                    console.log(`Job ${job._id} has no recruiter, skipping...`);
                    continue;
                }

                const recruiter = job.recruiter;

                // Check if company info needs updating
                const needsUpdate =
                    !job.company?.name ||
                    !job.company?.industry ||
                    !job.company?.size ||
                    job.company.name !== recruiter.company?.name ||
                    job.company.industry !== recruiter.company?.industry ||
                    job.company.size !== recruiter.company?.size;

                if (needsUpdate && recruiter.company) {
                    // Update job with complete company information
                    await Job.findByIdAndUpdate(job._id, {
                        $set: {
                            company: {
                                name: recruiter.company.name,
                                logo: recruiter.company.logo || "",
                                website: recruiter.company.website || "",
                                industry: recruiter.company.industry,
                                size: recruiter.company.size,
                            },
                        },
                    });

                    updatedCount++;
                    console.log(
                        `Updated job ${job._id}: "${job.title}" with company info from recruiter ${recruiter.company.name}`
                    );
                }
            } catch (error) {
                errorCount++;
                console.error(`Error updating job ${job._id}:`, error.message);
            }
        }

        console.log(`Migration completed!`);
        console.log(`- Jobs updated: ${updatedCount}`);
        console.log(`- Errors: ${errorCount}`);
        console.log(`- Total jobs processed: ${jobs.length}`);

        return {
            success: true,
            updatedCount,
            errorCount,
            totalProcessed: jobs.length,
        };
    } catch (error) {
        console.error("Migration failed:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};

module.exports = { migrateJobCompanyInfo };
