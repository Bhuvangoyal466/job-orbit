const express = require("express");
const multer = require("multer");
const path = require("path");
const Candidate = require("../models/Candidate");
const { protectCandidate } = require("../middleware/auth");

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
        const candidate = await Candidate.findByIdAndUpdate(
            req.user.id,
            updateFields,
            { new: true, runValidators: true }
        ).select("-password");
        if (!candidate)
            return res.status(404).json({ message: "Candidate not found" });
        res.json(candidate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
