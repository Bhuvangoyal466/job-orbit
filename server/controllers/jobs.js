const Job = require("../models/Job");
const Candidate = require("../models/Candidate");
const mongoose = require("mongoose");

// @desc    Get all jobs with optional filtering
// @route   GET /api/jobs
// @access  Public
exports.getAllJobs = async (req, res) => {
    try {
        const {
            search,
            location,
            type,
            salary,
            page = 1,
            limit = 10,
        } = req.query;
        const query = { isActive: true };

        // Apply filters if provided
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { "company.name": { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { skills: { $in: [new RegExp(search, "i")] } },
            ];
        }

        if (location) {
            query.$or = query.$or || [];
            query.$or.push(
                { "location.city": { $regex: location, $options: "i" } },
                { "location.state": { $regex: location, $options: "i" } },
                { "location.country": { $regex: location, $options: "i" } }
            );

            // If "remote" is in the search, include remote jobs
            if (location.toLowerCase().includes("remote")) {
                query.$or.push({ "location.remote": true });
            }
        }

        if (type && type !== "all") {
            query.type = type;
        }

        if (salary) {
            const [min, max] = salary.split("-").map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                query["salary.min"] = { $gte: min };
                query["salary.max"] = { $lte: max };
            }
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Execute query
        const jobs = await Job.find(query)
            .populate("recruiter", "company")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Job.countDocuments(query);

        res.json({
            jobs,
            totalJobs: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error getting jobs:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get a job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate(
            "recruiter",
            "company"
        );

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json(job);
    } catch (error) {
        console.error("Error getting job:", error);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Candidates only)
exports.applyToJob = async (req, res) => {
    try {
        // Check if the user is a candidate
        if (req.user.role !== "candidate") {
            return res
                .status(403)
                .json({ message: "Not authorized to apply for jobs" });
        }

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if job is active
        if (!job.isActive) {
            return res
                .status(400)
                .json({
                    message: "This job is no longer accepting applications",
                });
        }

        // Check if already applied
        const alreadyApplied = job.applicants.some(
            (applicant) => applicant.candidateId.toString() === req.user.id
        );

        if (alreadyApplied) {
            return res
                .status(400)
                .json({ message: "You have already applied to this job" });
        }

        // Get cover letter from request body
        const { coverLetter } = req.body;

        // Add candidate to applicants
        job.applicants.push({
            candidateId: req.user.id,
            status: "applied",
            appliedAt: Date.now(),
            coverLetter: coverLetter || "",
        });

        await job.save();

        // Also update the candidate's applications
        await Candidate.findByIdAndUpdate(req.user.id, {
            $push: {
                jobApplications: { jobId: job._id, appliedAt: new Date() },
            },
        });

        res.json({ message: "Successfully applied to job", job });
    } catch (error) {
        console.error("Error applying to job:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Save a job (bookmark)
// @route   POST /api/jobs/:id/save
// @access  Private (Candidates only)
exports.saveJob = async (req, res) => {
    try {
        // Check if the user is a candidate
        if (req.user.role !== "candidate") {
            return res
                .status(403)
                .json({ message: "Not authorized to save jobs" });
        }

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if already saved
        const alreadySaved = job.savedBy.includes(req.user.id);
        if (alreadySaved) {
            return res.status(400).json({ message: "Job already saved" });
        }

        // Add user to savedBy array
        job.savedBy.push(req.user.id);
        await job.save();

        res.json({ message: "Job saved successfully" });
    } catch (error) {
        console.error("Error saving job:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Unsave a job (remove bookmark)
// @route   DELETE /api/jobs/:id/unsave
// @access  Private (Candidates only)
exports.unsaveJob = async (req, res) => {
    try {
        // Check if the user is a candidate
        if (req.user.role !== "candidate") {
            return res
                .status(403)
                .json({ message: "Not authorized to unsave jobs" });
        }

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Remove user from savedBy array
        const index = job.savedBy.indexOf(req.user.id);
        if (index === -1) {
            return res.status(400).json({ message: "Job not saved by you" });
        }

        job.savedBy.splice(index, 1);
        await job.save();

        res.json({ message: "Job unsaved successfully" });
    } catch (error) {
        console.error("Error unsaving job:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all jobs saved by the user
// @route   GET /api/jobs/saved
// @access  Private (Candidates only)
exports.getSavedJobs = async (req, res) => {
    try {
        // Check if the user is a candidate
        if (req.user.role !== "candidate") {
            return res
                .status(403)
                .json({ message: "Not authorized to view saved jobs" });
        }

        // Find jobs where the user's ID is in the savedBy array
        const savedJobs = await Job.find({
            savedBy: req.user.id,
            isActive: true,
        }).populate("recruiter", "company");

        res.json(savedJobs);
    } catch (error) {
        console.error("Error getting saved jobs:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiters only)
exports.createJob = async (req, res) => {
    try {
        // Check if the user is a recruiter
        if (req.user.role !== "recruiter") {
            return res
                .status(403)
                .json({ message: "Not authorized to create jobs" });
        }

        const {
            title,
            description,
            type,
            salary,
            location,
            skills,
            company,
            perks,
            benefits,
            applicationDeadline,
            numberOfOpenings,
        } = req.body;

        // Create new job
        const newJob = new Job({
            title,
            description,
            type,
            salary,
            location,
            skills,
            recruiter: req.user.id,
            company,
            perks,
            benefits,
            applicationDeadline,
            numberOfOpenings,
            isActive: true,
        });

        const job = await newJob.save();
        res.status(201).json(job);
    } catch (error) {
        console.error("Error creating job:", error);
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid job data",
                errors: Object.values(error.errors).map((e) => e.message),
            });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Job owner only)
exports.updateJob = async (req, res) => {
    try {
        // Check if the user is a recruiter
        if (req.user.role !== "recruiter") {
            return res
                .status(403)
                .json({ message: "Not authorized to update jobs" });
        }

        // Find the job
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if the user is the job owner
        if (job.recruiter.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ message: "Not authorized to update this job" });
        }

        // Update fields
        const updateData = { ...req.body };
        delete updateData.applicants; // Don't allow updating applicants through this endpoint
        delete updateData.savedBy; // Don't allow updating savedBy through this endpoint

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.json(updatedJob);
    } catch (error) {
        console.error("Error updating job:", error);
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid job data",
                errors: Object.values(error.errors).map((e) => e.message),
            });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Job owner only)
exports.deleteJob = async (req, res) => {
    try {
        // Check if the user is a recruiter
        if (req.user.role !== "recruiter") {
            return res
                .status(403)
                .json({ message: "Not authorized to delete jobs" });
        }

        // Find the job
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if the user is the job owner
        if (job.recruiter.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this job" });
        }

        // Instead of deleting, set isActive to false
        job.isActive = false;
        await job.save();

        res.json({ message: "Job successfully removed" });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all jobs created by the recruiter
// @route   GET /api/jobs/recruiter/myjobs
// @access  Private (Recruiters only)
exports.getRecruiterJobs = async (req, res) => {
    try {
        // Check if the user is a recruiter
        if (req.user.role !== "recruiter") {
            return res
                .status(403)
                .json({ message: "Not authorized to view recruiter jobs" });
        }

        const { status, page = 1, limit = 10 } = req.query;
        const query = { recruiter: req.user.id };

        // Filter by status if provided
        if (status) {
            if (status === "active") {
                query.isActive = true;
            } else if (status === "inactive") {
                query.isActive = false;
            }
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Execute query
        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Job.countDocuments(query);

        res.json({
            jobs,
            totalJobs: total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        });
    } catch (error) {
        console.error("Error getting recruiter jobs:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update application status of a candidate
// @route   PUT /api/jobs/:id/status
// @access  Private (Job owner only)
exports.updateApplicationStatus = async (req, res) => {
    try {
        // Check if the user is a recruiter
        if (req.user.role !== "recruiter") {
            return res
                .status(403)
                .json({
                    message: "Not authorized to update application status",
                });
        }

        const { candidateId, status } = req.body;

        if (!candidateId || !status) {
            return res
                .status(400)
                .json({ message: "Candidate ID and status are required" });
        }

        // Validate status
        const validStatuses = [
            "applied",
            "under-review",
            "interviewed",
            "hired",
            "rejected",
        ];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Find the job
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if the user is the job owner
        if (job.recruiter.toString() !== req.user.id) {
            return res
                .status(403)
                .json({
                    message: "Not authorized to update this job's applications",
                });
        }

        // Find the applicant
        const applicantIndex = job.applicants.findIndex(
            (applicant) => applicant.candidateId.toString() === candidateId
        );

        if (applicantIndex === -1) {
            return res
                .status(404)
                .json({ message: "Candidate not found in job applicants" });
        }

        // Update the status
        job.applicants[applicantIndex].status = status;
        await job.save();

        res.json({
            message: "Application status updated successfully",
            applicant: job.applicants[applicantIndex],
        });
    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
