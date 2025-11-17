const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Configuration for your FastAPI resume parser service
const RESUME_PARSER_URL =
    process.env.RESUME_PARSER_URL || "http://127.0.0.1:8000";

/**
 * Parse PDF resume using the FastAPI service
 * @param {string} filePath - Path to the uploaded PDF resume file
 * @returns {Object} Parsed resume data from PDF
 */
async function parseResumeWithAPI(filePath) {
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`Resume file not found: ${filePath}`);
        }

        // Create form data with file stream
        const formData = new FormData();
        const fileStream = fs.createReadStream(filePath);
        const fileName = path.basename(filePath);

        formData.append("file", fileStream, {
            filename: fileName,
            contentType: "application/pdf",
        });

        const response = await fetch(`${RESUME_PARSER_URL}/parse-resume/`, {
            method: "POST",
            body: formData,
            headers: formData.getHeaders(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`FastAPI error response: ${errorText}`);
            throw new Error(
                `Resume parsing failed: ${response.status} - ${errorText}`
            );
        }

        const parsedData = await response.json();

        // Transform the parsed data to match our Candidate schema
        return transformParsedData(parsedData);
    } catch (error) {
        console.error("Error parsing resume:", error);
        throw new Error(`Failed to parse resume: ${error.message}`);
    }
}

/**
 * Transform parsed data from FastAPI format to Candidate model format
 * @param {Object} parsedData - Data from FastAPI service
 * @returns {Object} Transformed data matching Candidate schema
 */
function transformParsedData(parsedData) {
    const transformed = {};

    // Personal Information
    if (parsedData.firstName) {
        transformed.firstName = parsedData.firstName.trim();
    }
    if (parsedData.lastName) {
        transformed.lastName = parsedData.lastName.trim();
    }

    // Fallback for name field (backward compatibility)
    if (!transformed.firstName && !transformed.lastName && parsedData.name) {
        const nameParts = parsedData.name.split(" ");
        transformed.firstName = nameParts[0] || "";
        transformed.lastName = nameParts.slice(1).join(" ") || "";
    }

    if (parsedData.email) {
        transformed.email = parsedData.email;
    }

    if (parsedData.phone) {
        transformed.phone = parsedData.phone;
    }

    // Date of Birth (if provided)
    if (parsedData.dateOfBirth) {
        try {
            transformed.dateOfBirth = new Date(parsedData.dateOfBirth);
        } catch (error) {
            console.warn(
                "Invalid date of birth format:",
                parsedData.dateOfBirth
            );
        }
    }

    // Address Information
    if (parsedData.address) {
        transformed.address = {
            street: parsedData.address.street || "",
            city: parsedData.address.city || "",
            state: parsedData.address.state || "",
            zipCode: parsedData.address.zipCode || "",
            country: parsedData.address.country || "",
        };
    }
    // Backward compatibility for location field
    else if (parsedData.location) {
        transformed.address = {
            city: parsedData.location.city || "",
            state: parsedData.location.state || "",
            country: parsedData.location.country || "",
        };
    }

    // Experience - handle both number and array formats
    if (typeof parsedData.experience === "number") {
        transformed.experience = Math.min(parsedData.experience, 10); // Cap at 10 years
    } else if (parsedData.experience && Array.isArray(parsedData.experience)) {
        // Calculate total experience in years from experience array
        let totalExperience = 0;
        parsedData.experience.forEach((exp) => {
            if (exp.duration) {
                const yearMatch = exp.duration.match(/(\d+)\s*year/i);
                if (yearMatch) {
                    totalExperience += parseInt(yearMatch[1]);
                }
            }
        });
        if (totalExperience > 0) {
            transformed.experience = Math.min(totalExperience, 10);
        }
    }

    // Skills
    if (parsedData.skills && Array.isArray(parsedData.skills)) {
        transformed.skills = parsedData.skills.filter(
            (skill) => skill && skill.trim()
        );
    }

    // Education
    if (parsedData.education && Array.isArray(parsedData.education)) {
        transformed.education = parsedData.education
            .map((edu) => ({
                degree: edu.degree || edu.qualification || "",
                institution:
                    edu.institution || edu.university || edu.school || "",
                graduationYear: edu.graduationYear || edu.year || null,
                grade: edu.grade || edu.gpa || "",
            }))
            .filter((edu) => edu.degree || edu.institution);
    }

    // Projects
    if (parsedData.projects && Array.isArray(parsedData.projects)) {
        transformed.projects = parsedData.projects
            .map((project) => ({
                name: project.name || "",
                description: Array.isArray(project.description)
                    ? project.description
                    : project.description
                    ? [project.description]
                    : [],
                link: project.link || project.url || "",
                technologies: Array.isArray(project.technologies)
                    ? project.technologies
                    : project.technologies
                    ? [project.technologies]
                    : [],
                duration: project.duration || "",
            }))
            .filter((project) => project.name);
    }

    // Portfolio URL
    if (parsedData.portfolioUrl || parsedData.portfolio || parsedData.website) {
        transformed.portfolioUrl =
            parsedData.portfolioUrl ||
            parsedData.portfolio ||
            parsedData.website;
    }

    // LinkedIn URL
    if (parsedData.linkedinUrl || parsedData.linkedin) {
        transformed.linkedinUrl = parsedData.linkedinUrl || parsedData.linkedin;
    }

    return transformed;
}

module.exports = {
    parseResumeWithAPI,
    transformParsedData,
};
