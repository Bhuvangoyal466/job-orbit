const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
    registerCandidate,
    loginCandidate,
    getCurrentCandidate,
    updateCandidateProfile,
    changePassword,
    resetPassword,
    deactivateAccount,
    getDashboardStats,
} = require("../controllers/authCandidate");
const { protect } = require("../middleware/auth");

// Validation rules
const registerValidation = [
    body("firstName")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage(
            "First name is required and must be less than 50 characters"
        ),
    body("lastName")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage(
            "Last name is required and must be less than 50 characters"
        ),
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
    body("phone")
        .matches(/^\+?[\d\s\-\(\)]{10,}$/)
        .withMessage("Please provide a valid phone number"),
    body("dateOfBirth")
        .isISO8601()
        .withMessage("Please provide a valid date of birth")
        .custom((value) => {
            const age = Math.floor(
                (Date.now() - new Date(value).getTime()) /
                    (365.25 * 24 * 60 * 60 * 1000)
            );
            if (age < 18) {
                throw new Error("You must be at least 18 years old");
            }
            if (age > 100) {
                throw new Error("Please provide a valid date of birth");
            }
            return true;
        }),
];

const loginValidation = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
];

const updateProfileValidation = [
    body("firstName")
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("First name must be less than 50 characters"),
    body("lastName")
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Last name must be less than 50 characters"),
    body("phone")
        .optional()
        .matches(/^\+?[\d\s\-\(\)]{10,}$/)
        .withMessage("Please provide a valid phone number"),
    body("dateOfBirth")
        .optional()
        .isISO8601()
        .withMessage("Please provide a valid date of birth"),
    body("skills").optional().isArray().withMessage("Skills must be an array"),
    body("skills.*")
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Each skill must be less than 50 characters"),
    body("experience")
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage("Experience must be a number between 0 and 50"),
    body("portfolioUrl")
        .optional()
        .isURL()
        .withMessage("Portfolio URL must be a valid URL"),
    body("linkedinUrl")
        .optional()
        .matches(/^https?:\/\/(www\.)?linkedin\.com\/.+/)
        .withMessage("LinkedIn URL must be a valid LinkedIn profile URL"),
    body("preferredJobType")
        .optional()
        .isIn(["full-time", "part-time", "contract", "internship", "remote"])
        .withMessage("Invalid job type"),
    body("expectedSalary.min")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Minimum salary must be a positive number"),
    body("expectedSalary.max")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Maximum salary must be a positive number")
        .custom((value, { req }) => {
            if (
                req.body.expectedSalary?.min &&
                value < req.body.expectedSalary.min
            ) {
                throw new Error(
                    "Maximum salary must be greater than minimum salary"
                );
            }
            return true;
        }),
];

const changePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            "New password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error(
                    "New password must be different from current password"
                );
            }
            return true;
        }),
];

// Public routes
router.post("/register", registerValidation, registerCandidate);
router.post("/login", loginValidation, loginCandidate);

// Reset password validation
const resetPasswordValidation = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email"),
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
];

router.post("/reset-password", resetPasswordValidation, resetPassword);

// Protected routes (require authentication)
router.use(protect); // Apply auth middleware to all routes below

// Maintenance endpoint - can be removed after fixing profiles
router.post("/fix-profiles", recalculateProfileCompleteness);

// Force recalculate specific user
router.post("/fix-user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const candidate = await Candidate.findById(userId);
        if (!candidate) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const oldCompleteness = candidate.profileCompleteness;

        // Force trigger the pre-save middleware by modifying a field temporarily
        candidate.markModified("skills"); // This will trigger the pre-save hook
        await candidate.save();

        res.json({
            success: true,
            message: `Updated user ${candidate.email}`,
            data: {
                oldCompleteness,
                newCompleteness: candidate.profileCompleteness,
                updated: oldCompleteness !== candidate.profileCompleteness,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
router.get("/check-user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const candidate = await Candidate.findById(userId);
        if (!candidate) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            data: {
                id: candidate._id,
                name: `${candidate.firstName} ${candidate.lastName}`,
                email: candidate.email,
                profileCompleteness: candidate.profileCompleteness,
                fields: {
                    firstName: !!candidate.firstName,
                    lastName: !!candidate.lastName,
                    email: !!candidate.email,
                    phone: !!candidate.phone,
                    dateOfBirth: !!candidate.dateOfBirth,
                    addressCity: !!(
                        candidate.address && candidate.address.city
                    ),
                    addressCountry: !!(
                        candidate.address && candidate.address.country
                    ),
                    experience: candidate.experience !== undefined,
                    skills: candidate.skills && candidate.skills.length > 0,
                    education:
                        candidate.education && candidate.education.length > 0,
                    preferredJobType: !!candidate.preferredJobType,
                    portfolioUrl: !!candidate.portfolioUrl,
                },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Protected routes (require authentication)
router.use(protect); // Apply auth middleware to all routes below

router.get("/me", getCurrentCandidate);
router.put("/profile", updateProfileValidation, updateCandidateProfile);
router.put("/password", changePasswordValidation, changePassword);
router.delete("/account", deactivateAccount);
router.get("/dashboard", getDashboardStats);

module.exports = router;
