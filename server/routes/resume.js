const express = require("express");
const multer = require("multer");
const path = require("path");
const Candidate = require("../models/Candidate");
const { protectCandidate, protectRecruiter } = require("../middleware/auth");
const { parseResumeWithAPI } = require("../services/resumeParser");

const router = express.Router();

// Multer setup for PDF upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads/resumes"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed!"), false);
    }
};

const upload = multer({ storage, fileFilter });

// Upload resume endpoint with AI parsing
router.post(
    "/upload-resume",
    protectCandidate,
    upload.single("resume"),
    async (req, res) => {
        try {
            const candidate = await Candidate.findById(req.user.id);
            if (!candidate)
                return res.status(404).json({ message: "Candidate not found" });

            // Save resume file info
            candidate.resume = {
                filename: req.file.filename,
                originalName: req.file.originalname,
                path: req.file.path,
                size: req.file.size,
                uploadDate: new Date(),
            };

            let parsedData = {};
            let parseSuccess = false;

            // Try to parse the resume with AI
            try {
                console.log("Attempting to parse resume with AI...");
                parsedData = await parseResumeWithAPI(req.file.path);
                parseSuccess = true;
                console.log("Resume parsed successfully:", parsedData);
            } catch (parseError) {
                console.error("Resume parsing failed:", parseError.message);
                // Continue without parsed data if parsing fails
                parsedData = {};
            }

            // Update candidate with parsed data (only if parsing was successful)
            if (parseSuccess && Object.keys(parsedData).length > 0) {
                // Merge parsed data with existing candidate data, but don't overwrite existing non-empty fields
                Object.keys(parsedData).forEach((key) => {
                    if (
                        parsedData[key] !== undefined &&
                        parsedData[key] !== null &&
                        parsedData[key] !== ""
                    ) {
                        // For arrays, merge with existing data
                        if (Array.isArray(parsedData[key])) {
                            if (key === "skills") {
                                // Merge skills arrays, avoiding duplicates
                                const existingSkills = candidate.skills || [];
                                const newSkills = parsedData[key] || [];
                                const combinedSkills = [
                                    ...new Set([
                                        ...existingSkills,
                                        ...newSkills,
                                    ]),
                                ];
                                candidate.skills = combinedSkills;
                            } else if (key === "education") {
                                // For education, add new entries
                                const existingEducation =
                                    candidate.education || [];
                                const newEducation = parsedData[key] || [];
                                candidate.education = [
                                    ...existingEducation,
                                    ...newEducation,
                                ];
                            } else {
                                candidate[key] = parsedData[key];
                            }
                        } else if (
                            typeof parsedData[key] === "object" &&
                            parsedData[key] !== null
                        ) {
                            // For nested objects (like address), merge carefully
                            candidate[key] = {
                                ...(candidate[key] || {}),
                                ...parsedData[key],
                            };
                        } else {
                            // Only update if the candidate field is empty or undefined
                            if (!candidate[key] || candidate[key] === "") {
                                candidate[key] = parsedData[key];
                            }
                        }
                    }
                });
            }

            await candidate.save();

            res.json({
                message: "Resume uploaded successfully",
                resume: candidate.resume,
                parsed: parseSuccess,
                parsedData: parseSuccess ? parsedData : null,
                candidateProfile: candidate,
            });
        } catch (err) {
            console.error("Resume upload error:", err);
            res.status(500).json({ message: err.message });
        }
    }
);

// Get candidate profile
router.get("/profile", protectCandidate, async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.user.id).select(
            "-password"
        );
        if (!candidate)
            return res.status(404).json({ message: "Candidate not found" });
        res.json(candidate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update candidate profile
router.put("/profile", protectCandidate, async (req, res) => {
    try {
        const updateFields = { ...req.body };
        delete updateFields.password;

        // Get the candidate first to trigger pre-save middleware
        const candidate = await Candidate.findById(req.user.id);
        if (!candidate)
            return res.status(404).json({ message: "Candidate not found" });

        // Update fields and save to trigger middleware
        Object.keys(updateFields).forEach((key) => {
            candidate[key] = updateFields[key];
        });

        await candidate.save();
        res.json(candidate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Parse existing resume endpoint (for re-parsing)
router.post("/parse-existing", protectCandidate, async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.user.id);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        if (!candidate.resume || !candidate.resume.path) {
            return res
                .status(400)
                .json({ message: "No resume found to parse" });
        }

        try {
            console.log("Re-parsing existing resume...");
            const parsedData = await parseResumeWithAPI(candidate.resume.path);

            res.json({
                message: "Resume parsed successfully",
                parsed: true,
                parsedData: parsedData,
            });
        } catch (parseError) {
            console.error("Resume re-parsing failed:", parseError.message);
            res.status(500).json({
                message: "Failed to parse resume",
                error: parseError.message,
            });
        }
    } catch (err) {
        console.error("Parse existing resume error:", err);
        res.status(500).json({ message: err.message });
    }
});

// Get candidate resume by ID (for recruiters)
router.get("/view/:candidateId", protectRecruiter, async (req, res) => {
    try {
        const { candidateId } = req.params;
        console.log("Server: Fetching resume for candidate:", candidateId);

        const candidate = await Candidate.findById(candidateId).select(
            "resume firstName lastName"
        );
        if (!candidate) {
            console.log("Server: Candidate not found");
            return res.status(404).json({ message: "Candidate not found" });
        }

        console.log(
            "Server: Candidate found:",
            candidate.firstName,
            candidate.lastName
        );
        console.log("Server: Resume info:", candidate.resume);

        if (!candidate.resume || !candidate.resume.path) {
            console.log("Server: No resume path found");
            return res
                .status(404)
                .json({ message: "Resume not found for this candidate" });
        }

        // Check if file exists
        const fs = require("fs");
        const filePath = candidate.resume.path;
        console.log("Server: Checking file path:", filePath);

        if (!fs.existsSync(filePath)) {
            console.log("Server: File does not exist on filesystem");
            return res
                .status(404)
                .json({ message: "Resume file not found on server" });
        }

        // Get file stats for debugging
        const stats = fs.statSync(filePath);
        console.log("Server: File size:", stats.size, "bytes");

        // Set appropriate headers for PDF
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename="${candidate.resume.originalName}"`
        );

        console.log("Server: Sending file...");
        // Send the file
        res.sendFile(path.resolve(filePath));
    } catch (err) {
        console.error("Error viewing resume:", err);
        res.status(500).json({
            message: "Server error while retrieving resume",
        });
    }
});

module.exports = router;
