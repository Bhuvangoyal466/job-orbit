const express = require("express");
const router = express.Router();
const { protect, optionalAuth } = require("../middleware/auth");
const jobController = require("../controllers/jobs");

// Public routes with optional authentication for skill matching
router.get("/", optionalAuth, jobController.getAllJobs);

// Candidate authenticated routes - Place specific routes BEFORE wildcard routes
router.get("/saved", protect, jobController.getSavedJobs);
router.get("/applications", protect, jobController.getCandidateApplications);

// Debug route - temporary
router.get(
    "/debug/applications/:candidateId",
    jobController.debugCandidateApplications
);

// Recruiter authenticated routes - Place specific routes BEFORE wildcard routes
router.get("/recruiter/myjobs", protect, jobController.getRecruiterJobs);
router.get(
    "/recruiter/applicants",
    protect,
    jobController.getRecruiterApplicants
);

// Routes with parameter must come AFTER specific routes
router.get("/:id", jobController.getJobById);
router.post("/:id/apply", protect, jobController.applyToJob);
router.post("/:id/save", protect, jobController.saveJob);
router.delete("/:id/unsave", protect, jobController.unsaveJob);

// Recruiter authenticated routes
router.post("/", protect, jobController.createJob);
router.put("/:id", protect, jobController.updateJob);
router.delete("/:id", protect, jobController.deleteJob);
router.put("/:id/status", protect, jobController.updateApplicationStatus);

// Development/Admin route for migrating company info
router.post(
    "/admin/migrate-company-info",
    protect,
    jobController.migrateCompanyInfo
);

module.exports = router;
