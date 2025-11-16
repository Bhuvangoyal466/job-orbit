const jwt = require("jsonwebtoken");
const Candidate = require("../models/Candidate");
const Recruiter = require("../models/Recruiter");

// Protect routes - General authentication middleware
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // Make sure token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route",
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Try to find user as candidate first, then as recruiter
            let user = await Candidate.findById(decoded.id);
            let userType = "candidate";

            if (!user) {
                user = await Recruiter.findById(decoded.id);
                userType = "recruiter";
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "No user found with this token",
                });
            }

            // Check if user account is active
            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "Account has been deactivated",
                });
            }

            // Add user to request object
            req.user = user;
            req.userType = userType;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route",
            });
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error in authentication",
        });
    }
};

// Protect routes - Candidate only
const protectCandidate = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // Make sure token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route",
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find candidate
            const candidate = await Candidate.findById(decoded.id);

            if (!candidate) {
                return res.status(401).json({
                    success: false,
                    message: "No candidate found with this token",
                });
            }

            // Check if account is active
            if (!candidate.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "Account has been deactivated",
                });
            }

            // Add candidate to request object
            req.user = candidate;
            req.userType = "candidate";
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route",
            });
        }
    } catch (error) {
        console.error("Candidate auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error in authentication",
        });
    }
};

// Protect routes - Recruiter only
const protectRecruiter = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // Make sure token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route",
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find recruiter
            const recruiter = await Recruiter.findById(decoded.id);

            if (!recruiter) {
                return res.status(401).json({
                    success: false,
                    message: "No recruiter found with this token",
                });
            }

            // Check if account is active
            if (!recruiter.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "Account has been deactivated",
                });
            }

            // Add recruiter to request object
            req.user = recruiter;
            req.userType = "recruiter";
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route",
            });
        }
    } catch (error) {
        console.error("Recruiter auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error in authentication",
        });
    }
};

// Role-based access control
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userType)) {
            return res.status(403).json({
                success: false,
                message: `User type '${req.userType}' is not authorized to access this route`,
            });
        }
        next();
    };
};

module.exports = {
    protect,
    protectCandidate,
    protectRecruiter,
    authorize,
};

// Optional authentication - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // If no token, continue without authentication
        if (!token) {
            req.user = null;
            req.userType = null;
            return next();
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Try to find user as candidate first, then as recruiter
            let user = await Candidate.findById(decoded.id);
            let userType = "candidate";

            if (!user) {
                user = await Recruiter.findById(decoded.id);
                userType = "recruiter";
            }

            if (!user) {
                // Invalid token, continue without authentication
                req.user = null;
                req.userType = null;
                return next();
            }

            // Check if user account is active
            if (!user.isActive) {
                // Inactive user, continue without authentication
                req.user = null;
                req.userType = null;
                return next();
            }

            // Add user to request object
            req.user = user;
            req.userType = userType;
            next();
        } catch (error) {
            // Token verification failed, continue without authentication
            req.user = null;
            req.userType = null;
            next();
        }
    } catch (error) {
        console.error("Optional auth middleware error:", error);
        // Continue without authentication on any error
        req.user = null;
        req.userType = null;
        next();
    }
};

// Update module exports to include optionalAuth
module.exports.optionalAuth = optionalAuth;
