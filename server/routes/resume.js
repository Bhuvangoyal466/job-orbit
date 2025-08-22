const express = require("express");
const multer = require("multer");
const path = require("path");
const Candidate = require("../models/Candidate");
const { protectCandidate, protectRecruiter } = require("../middleware/auth");

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

// Upload resume endpoint
router.post(
    "/upload-resume",
    protectCandidate,
    upload.single("resume"),
    async (req, res) => {
        try {
            const candidate = await Candidate.findById(req.user.id);
            if (!candidate)
                return res.status(404).json({ message: "Candidate not found" });

            candidate.resume = {
                filename: req.file.filename,
                originalName: req.file.originalname,
                path: req.file.path,
                size: req.file.size,
                uploadDate: new Date(),
            };
            await candidate.save();
            res.json({
                message: "Resume uploaded successfully",
                resume: candidate.resume,
            });
        } catch (err) {
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

// Get candidate resume by ID (for recruiters)
router.get("/view/:candidateId", protectRecruiter, async (req, res) => {
    try {
        const { candidateId } = req.params;
        
        const candidate = await Candidate.findById(candidateId).select('resume firstName lastName');
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        if (!candidate.resume || !candidate.resume.path) {
            return res.status(404).json({ message: "Resume not found for this candidate" });
        }

        // Check if file exists
        const fs = require('fs');
        if (!fs.existsSync(candidate.resume.path)) {
            return res.status(404).json({ message: "Resume file not found on server" });
        }

        // Set appropriate headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${candidate.resume.originalName}"`);
        
        // Send the file
        res.sendFile(path.resolve(candidate.resume.path));
    } catch (err) {
        console.error("Error viewing resume:", err);
        res.status(500).json({ message: "Server error while retrieving resume" });
    }
});

module.exports = router;
