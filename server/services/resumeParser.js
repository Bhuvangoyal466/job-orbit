const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Configuration for your FastAPI resume parser service
const RESUME_PARSER_URL =
    process.env.RESUME_PARSER_URL || "http://127.0.0.1:8000";

/**
 * Parse resume using the FastAPI service
 * @param {string} filePath - Path to the uploaded resume file
 * @returns {Object} Parsed resume data
 */
async function parseResumeWithAPI(filePath) {
    try {
        const formData = new FormData();
        const fileStream = fs.createReadStream(filePath);
        formData.append("file", fileStream);

        const response = await fetch(`${RESUME_PARSER_URL}/parse-resume/`, {
            method: "POST",
            body: formData,
            headers: formData.getHeaders(),
        });

        if (!response.ok) {
            const errorText = await response.text();
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
    if (parsedData.name) {
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
                graduationYear: edu.year || edu.graduationYear || null,
                grade: edu.grade || edu.gpa || "",
            }))
            .filter((edu) => edu.degree || edu.institution);
    }

    // Experience - estimate total experience
    if (parsedData.experience && Array.isArray(parsedData.experience)) {
        // Calculate total experience in years
        let totalExperience = 0;
        parsedData.experience.forEach((exp) => {
            if (exp.duration) {
                // Try to extract years from duration string
                const yearMatch = exp.duration.match(/(\d+)\s*year/i);
                if (yearMatch) {
                    totalExperience += parseInt(yearMatch[1]);
                }
            }
        });
        if (totalExperience > 0) {
            transformed.experience = Math.min(totalExperience, 10); // Cap at 10+ years option
        }
    }

    // Additional fields that might be extracted
    if (parsedData.projects && Array.isArray(parsedData.projects)) {
        transformed.projects = parsedData.projects;
    }

    // Portfolio/LinkedIn URLs (if extracted)
    if (parsedData.portfolio || parsedData.website) {
        transformed.portfolioUrl = parsedData.portfolio || parsedData.website;
    }

    if (parsedData.linkedin) {
        transformed.linkedinUrl = parsedData.linkedin;
    }

    // Location information
    if (parsedData.location) {
        transformed.address = {
            city: parsedData.location.city || "",
            state: parsedData.location.state || "",
            country: parsedData.location.country || "",
        };
    }

    return transformed;
}

module.exports = {
    parseResumeWithAPI,
    transformParsedData,
};
