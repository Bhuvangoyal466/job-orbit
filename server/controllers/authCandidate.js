const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Candidate = require("../models/Candidate");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
};

// Send token response
const sendTokenResponse = (candidate, statusCode, res) => {
    const token = generateToken(candidate._id);

    // Remove password from output
    candidate.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            candidate,
        },
    });
};

// @desc    Register candidate
// @route   POST /api/auth/candidate/register
// @access  Public
const registerCandidate = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            dateOfBirth,
            address,
            skills,
            experience,
        } = req.body;

        // Validate age (must be 18 or older)
        if (dateOfBirth) {
            const today = new Date();
            const birthDate = new Date(dateOfBirth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            if (
                monthDifference < 0 ||
                (monthDifference === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            if (age < 18) {
                return res.status(400).json({
                    success: false,
                    message:
                        "You must be at least 18 years old to register as a candidate",
                });
            }
        }

        // Check if candidate already exists
        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
            return res.status(409).json({
                success: false,
                message: "Candidate with this email already exists",
            });
        }

        // Create candidate
        const candidate = await Candidate.create({
            firstName,
            lastName,
            email,
            password,
            phone,
            dateOfBirth,
            address,
            skills: skills || [],
            experience: experience || 0,
        });
        sendTokenResponse(candidate, 201, res);
    } catch (error) {
        console.error("Register candidate error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during registration",
        });
    }
};

// @desc    Login candidate
// @route   POST /api/auth/candidate/login
// @access  Public
const loginCandidate = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;

        // Check for candidate
        const candidate = await Candidate.findOne({ email }).select(
            "+password"
        );
        console.log("Candidate found:", candidate);
        if (!candidate) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Check if account is active
        if (!candidate.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account has been deactivated. Please contact support",
            });
        }

        // Check password
        const isMatch = await candidate.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        sendTokenResponse(candidate, 200, res);
    } catch (error) {
        console.error("Login candidate error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
};

// @desc    Get current candidate
// @route   GET /api/auth/candidate/me
// @access  Private
const getCurrentCandidate = async (req, res, next) => {
    try {
        const candidate = await Candidate.findById(req.user.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found",
            });
        }

        res.status(200).json({
            success: true,
            data: {
                candidate,
            },
        });
    } catch (error) {
        console.error("Get current candidate error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Update candidate profile
// @route   PUT /api/auth/candidate/profile
// @access  Private
const updateCandidateProfile = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        const allowedFields = [
            "firstName",
            "lastName",
            "phone",
            "dateOfBirth",
            "address",
            "skills",
            "experience",
            "education",
            "portfolioUrl",
            "linkedinUrl",
            "preferredJobType",
            "expectedSalary",
            "preferredLocations",
        ];

        const updateData = {};
        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                updateData[key] = req.body[key];
            }
        });

        const candidate = await Candidate.findByIdAndUpdate(
            req.user.id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found",
            });
        }

        res.status(200).json({
            success: true,
            data: {
                candidate,
            },
        });
    } catch (error) {
        console.error("Update candidate profile error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during profile update",
        });
    }
};

// @desc    Change candidate password
// @route   PUT /api/auth/candidate/password
// @access  Private
const changePassword = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        const { currentPassword, newPassword } = req.body;

        // Get candidate with password
        const candidate = await Candidate.findById(req.user.id).select(
            "+password"
        );

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found",
            });
        }

        // Check current password
        const isMatch = await candidate.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Update password
        candidate.password = newPassword;
        await candidate.save();

        sendTokenResponse(candidate, 200, res);
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during password change",
        });
    }
};

// @desc    Deactivate candidate account
// @route   DELETE /api/auth/candidate/account
// @access  Private
const deactivateAccount = async (req, res, next) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(
            req.user.id,
            { isActive: false },
            { new: true }
        );

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Account has been deactivated successfully",
        });
    } catch (error) {
        console.error("Deactivate account error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during account deactivation",
        });
    }
};

// @desc    Get candidate dashboard stats
// @route   GET /api/auth/candidate/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
    try {
        const candidate = await Candidate.findById(req.user.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found",
            });
        }

        const stats = {
            totalApplications: candidate.applications.length,
            activeApplications: candidate.applications.filter((app) =>
                ["applied", "under-review", "interviewed"].includes(app.status)
            ).length,
            hiredApplications: candidate.applications.filter(
                (app) => app.status === "hired"
            ).length,
            rejectedApplications: candidate.applications.filter(
                (app) => app.status === "rejected"
            ).length,
            profileCompleteness: candidate.profileCompleteness,
            recentApplications: candidate.applications
                .sort((a, b) => b.appliedDate - a.appliedDate)
                .slice(0, 5),
        };

        res.status(200).json({
            success: true,
            data: {
                stats,
            },
        });
    } catch (error) {
        console.error("Get dashboard stats error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    registerCandidate,
    loginCandidate,
    getCurrentCandidate,
    updateCandidateProfile,
    changePassword,
    deactivateAccount,
    getDashboardStats,
};
