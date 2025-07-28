const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const jobController = require("../controllers/jobs");

// Public routes
router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJobById);

// Candidate authenticated routes
router.post("/:id/apply", protect, jobController.applyToJob);
router.post("/:id/save", protect, jobController.saveJob);
router.delete("/:id/unsave", protect, jobController.unsaveJob);
router.get("/saved", protect, jobController.getSavedJobs);

// Recruiter authenticated routes
router.post("/", protect, jobController.createJob);
router.put("/:id", protect, jobController.updateJob);
router.delete("/:id", protect, jobController.deleteJob);
router.get("/recruiter/myjobs", protect, jobController.getRecruiterJobs);
router.put("/:id/status", protect, jobController.updateApplicationStatus);

module.exports = router;
