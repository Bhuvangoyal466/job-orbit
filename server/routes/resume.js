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
                console.log(
                    "Auto-filling candidate profile with parsed resume data..."
                );

                // Auto-fill basic information (always overwrite with parsed data)
                if (parsedData.firstName) {
                    candidate.firstName = parsedData.firstName;
                }
                if (parsedData.lastName) {
                    candidate.lastName = parsedData.lastName;
                }
                if (parsedData.email) {
                    candidate.email = parsedData.email;
                }
                if (parsedData.phone) {
                    candidate.phone = parsedData.phone;
                }

                // Handle skills - merge without duplicates
                if (parsedData.skills && Array.isArray(parsedData.skills)) {
                    const existingSkills = candidate.skills || [];
                    const newSkills = parsedData.skills.filter(
                        (skill) => skill && skill.trim()
                    );
                    const combinedSkills = [
                        ...new Set([...existingSkills, ...newSkills]),
                    ];
                    candidate.skills = combinedSkills;
                    console.log(
                        `Updated skills: ${combinedSkills.length} total skills`
                    );
                }

                // Handle education - merge new entries with existing ones
                if (
                    parsedData.education &&
                    Array.isArray(parsedData.education)
                ) {
                    const existingEducation = candidate.education || [];
                    const newEducation = parsedData.education;

                    // Merge education, avoiding duplicates based on degree and institution
                    const combinedEducation = [...existingEducation];

                    newEducation.forEach((newEdu) => {
                        const isDuplicate = existingEducation.some(
                            (existingEdu) =>
                                existingEdu.degree === newEdu.degree &&
                                existingEdu.institution === newEdu.institution
                        );

                        if (!isDuplicate) {
                            combinedEducation.push(newEdu);
                        }
                    });

                    candidate.education = combinedEducation;
                    console.log(
                        `Updated education: ${combinedEducation.length} entries`
                    );
                }

                // Handle projects - merge new entries with existing ones
                if (parsedData.projects && Array.isArray(parsedData.projects)) {
                    const existingProjects = candidate.projects || [];
                    const newProjects = parsedData.projects;

                    // Merge projects, avoiding duplicates based on name
                    const combinedProjects = [...existingProjects];

                    newProjects.forEach((newProject) => {
                        const isDuplicate = existingProjects.some(
                            (existingProject) =>
                                existingProject.name === newProject.name
                        );

                        if (!isDuplicate) {
                            combinedProjects.push(newProject);
                        }
                    });

                    candidate.projects = combinedProjects;
                    console.log(
                        `Updated projects: ${combinedProjects.length} projects`
                    );
                }

                // Handle other fields
                if (parsedData.experience !== undefined) {
                    candidate.experience = parsedData.experience;
                }

                if (parsedData.portfolioUrl) {
                    candidate.portfolioUrl = parsedData.portfolioUrl;
                }

                if (parsedData.linkedinUrl) {
                    candidate.linkedinUrl = parsedData.linkedinUrl;
                }

                // Handle address information
                if (parsedData.address) {
                    candidate.address = {
                        ...(candidate.address || {}),
                        ...parsedData.address,
                    };
                }

                console.log("Profile auto-fill completed");
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

// Auto-fill profile from parsed resume data
router.post("/auto-fill-profile", protectCandidate, async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.user.id);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        if (!candidate.resume || !candidate.resume.path) {
            return res.status(400).json({
                message:
                    "No resume found to parse. Please upload a resume first.",
            });
        }

        try {
            console.log("Parsing resume for auto-fill...");
            const parsedData = await parseResumeWithAPI(candidate.resume.path);

            if (!parsedData || Object.keys(parsedData).length === 0) {
                return res.status(400).json({
                    message: "No data could be extracted from the resume",
                });
            }

            // Apply the same auto-fill logic as in upload
            console.log(
                "Auto-filling candidate profile with parsed resume data..."
            );

            // Auto-fill basic information (always overwrite with parsed data)
            if (parsedData.firstName) {
                candidate.firstName = parsedData.firstName;
            }
            if (parsedData.lastName) {
                candidate.lastName = parsedData.lastName;
            }
            if (parsedData.email) {
                candidate.email = parsedData.email;
            }
            if (parsedData.phone) {
                candidate.phone = parsedData.phone;
            }

            // Handle skills - merge without duplicates
            if (parsedData.skills && Array.isArray(parsedData.skills)) {
                const existingSkills = candidate.skills || [];
                const newSkills = parsedData.skills.filter(
                    (skill) => skill && skill.trim()
                );
                const combinedSkills = [
                    ...new Set([...existingSkills, ...newSkills]),
                ];
                candidate.skills = combinedSkills;
                console.log(
                    `Updated skills: ${combinedSkills.length} total skills`
                );
            }

            // Handle education - merge new entries with existing ones
            if (parsedData.education && Array.isArray(parsedData.education)) {
                const existingEducation = candidate.education || [];
                const newEducation = parsedData.education;

                const combinedEducation = [...existingEducation];

                newEducation.forEach((newEdu) => {
                    const isDuplicate = existingEducation.some(
                        (existingEdu) =>
                            existingEdu.degree === newEdu.degree &&
                            existingEdu.institution === newEdu.institution
                    );

                    if (!isDuplicate) {
                        combinedEducation.push(newEdu);
                    }
                });

                candidate.education = combinedEducation;
                console.log(
                    `Updated education: ${combinedEducation.length} entries`
                );
            }

            // Handle projects - merge new entries with existing ones
            if (parsedData.projects && Array.isArray(parsedData.projects)) {
                const existingProjects = candidate.projects || [];
                const newProjects = parsedData.projects;

                const combinedProjects = [...existingProjects];

                newProjects.forEach((newProject) => {
                    const isDuplicate = existingProjects.some(
                        (existingProject) =>
                            existingProject.name === newProject.name
                    );

                    if (!isDuplicate) {
                        combinedProjects.push(newProject);
                    }
                });

                candidate.projects = combinedProjects;
                console.log(
                    `Updated projects: ${combinedProjects.length} projects`
                );
            }

            // Handle other fields
            if (parsedData.experience !== undefined) {
                candidate.experience = parsedData.experience;
            }

            if (parsedData.portfolioUrl) {
                candidate.portfolioUrl = parsedData.portfolioUrl;
            }

            if (parsedData.linkedinUrl) {
                candidate.linkedinUrl = parsedData.linkedinUrl;
            }

            // Handle address information
            if (parsedData.address) {
                candidate.address = {
                    ...(candidate.address || {}),
                    ...parsedData.address,
                };
            }

            await candidate.save();

            res.json({
                message: "Profile auto-filled successfully from resume",
                parsedData: parsedData,
                updatedProfile: candidate,
            });
        } catch (parseError) {
            console.error("Resume parsing failed:", parseError.message);
            res.status(500).json({
                message: "Failed to parse resume for auto-fill",
                error: parseError.message,
            });
        }
    } catch (err) {
        console.error("Auto-fill profile error:", err);
        res.status(500).json({ message: err.message });
    }
});

// Get candidate's own resume (for candidates)
router.get("/my-resume", protectCandidate, async (req, res) => {
    try {
        console.log("Server: Fetching resume for candidate:", req.user.id);

        const candidate = await Candidate.findById(req.user.id).select(
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
            console.log("Server: File not found on disk:", filePath);
            return res
                .status(404)
                .json({ message: "Resume file not found on server" });
        }

        // Set appropriate headers for PDF viewing
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename="${candidate.firstName}_${candidate.lastName}_Resume.pdf"`
        );

        console.log("Server: Sending file:", filePath);

        // Send the file
        const path = require("path");
        res.sendFile(path.resolve(filePath));
    } catch (err) {
        console.error("Error viewing resume:", err);
        res.status(500).json({
            message: "Server error while retrieving resume",
        });
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
