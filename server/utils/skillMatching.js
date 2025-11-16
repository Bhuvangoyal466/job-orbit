/**
 * Utility functions for calculating skill matching between candidates and jobs
 */

/**
 * Calculate skill matching percentage between candidate skills and job requirements
 * @param {Array<string>} candidateSkills - Array of candidate's skills
 * @param {Array<string>} jobSkills - Array of job's required skills
 * @param {boolean} caseSensitive - Whether to perform case-sensitive matching
 * @returns {Object} - Object containing match percentage and details
 */
const calculateSkillMatchPercentage = (
    candidateSkills,
    jobSkills,
    caseSensitive = false
) => {
    if (
        !candidateSkills ||
        !Array.isArray(candidateSkills) ||
        candidateSkills.length === 0
    ) {
        return {
            percentage: 0,
            matchedSkills: [],
            missingSkills: [...jobSkills],
            totalJobSkills: jobSkills.length,
            totalMatchedSkills: 0,
        };
    }

    if (!jobSkills || !Array.isArray(jobSkills) || jobSkills.length === 0) {
        return {
            percentage: 100,
            matchedSkills: [],
            missingSkills: [],
            totalJobSkills: 0,
            totalMatchedSkills: 0,
        };
    }

    // Normalize skills for comparison if case insensitive
    const normalizedCandidateSkills = caseSensitive
        ? candidateSkills
        : candidateSkills.map((skill) => skill.toLowerCase().trim());

    const normalizedJobSkills = caseSensitive
        ? jobSkills
        : jobSkills.map((skill) => skill.toLowerCase().trim());

    // Find matched skills
    const matchedSkills = [];
    const missingSkills = [];

    normalizedJobSkills.forEach((jobSkill, index) => {
        const isMatched = normalizedCandidateSkills.some((candidateSkill) => {
            // Exact match
            if (candidateSkill === jobSkill) return true;

            // Partial match (useful for variations like "JavaScript" vs "JS")
            if (
                candidateSkill.includes(jobSkill) ||
                jobSkill.includes(candidateSkill)
            ) {
                return true;
            }

            return false;
        });

        if (isMatched) {
            matchedSkills.push(jobSkills[index]); // Use original case
        } else {
            missingSkills.push(jobSkills[index]); // Use original case
        }
    });

    const percentage = Math.round(
        (matchedSkills.length / jobSkills.length) * 100
    );

    return {
        percentage,
        matchedSkills,
        missingSkills,
        totalJobSkills: jobSkills.length,
        totalMatchedSkills: matchedSkills.length,
    };
};

/**
 * Enhanced skill matching that considers skill categories and synonyms
 * @param {Array<string>} candidateSkills - Array of candidate's skills
 * @param {Array<string>} jobSkills - Array of job's required skills
 * @returns {Object} - Object containing match percentage and details
 */
const calculateAdvancedSkillMatchPercentage = (candidateSkills, jobSkills) => {
    // Skill synonyms mapping
    const skillSynonyms = {
        javascript: ["js", "ecmascript", "es6", "es2015"],
        typescript: ["ts"],
        react: ["reactjs", "react.js"],
        angular: ["angularjs", "angular.js"],
        vue: ["vuejs", "vue.js"],
        nodejs: ["node.js", "node"],
        mongodb: ["mongo"],
        postgresql: ["postgres", "psql"],
        mysql: ["sql"],
        python: ["py"],
        csharp: ["c#", ".net"],
        cplusplus: ["c++"],
        "artificial intelligence": ["ai", "machine learning", "ml"],
        "machine learning": ["ml", "ai"],
        "data science": ["ds"],
        frontend: ["front-end", "ui", "client-side"],
        backend: ["back-end", "server-side"],
        fullstack: ["full-stack", "full stack"],
        devops: ["dev ops"],
        aws: ["amazon web services"],
        gcp: ["google cloud platform"],
        azure: ["microsoft azure"],
    };

    if (
        !candidateSkills ||
        !Array.isArray(candidateSkills) ||
        candidateSkills.length === 0
    ) {
        return {
            percentage: 0,
            matchedSkills: [],
            missingSkills: [...jobSkills],
            totalJobSkills: jobSkills.length,
            totalMatchedSkills: 0,
        };
    }

    if (!jobSkills || !Array.isArray(jobSkills) || jobSkills.length === 0) {
        return {
            percentage: 100,
            matchedSkills: [],
            missingSkills: [],
            totalJobSkills: 0,
            totalMatchedSkills: 0,
        };
    }

    const normalizedCandidateSkills = candidateSkills.map((skill) =>
        skill.toLowerCase().trim()
    );
    const normalizedJobSkills = jobSkills.map((skill) =>
        skill.toLowerCase().trim()
    );

    const matchedSkills = [];
    const missingSkills = [];

    normalizedJobSkills.forEach((jobSkill, index) => {
        let isMatched = false;

        // Check for exact match
        if (normalizedCandidateSkills.includes(jobSkill)) {
            isMatched = true;
        } else {
            // Check for synonym matches
            const candidateSet = new Set(normalizedCandidateSkills);

            // Check if job skill has synonyms in candidate skills
            if (skillSynonyms[jobSkill]) {
                isMatched = skillSynonyms[jobSkill].some((synonym) =>
                    candidateSet.has(synonym)
                );
            }

            // Check if any candidate skill has the job skill as synonym
            if (!isMatched) {
                isMatched = normalizedCandidateSkills.some((candidateSkill) => {
                    return skillSynonyms[candidateSkill]?.includes(jobSkill);
                });
            }

            // Partial matching for compound skills
            if (!isMatched) {
                isMatched = normalizedCandidateSkills.some((candidateSkill) => {
                    return (
                        candidateSkill.includes(jobSkill) ||
                        jobSkill.includes(candidateSkill)
                    );
                });
            }
        }

        if (isMatched) {
            matchedSkills.push(jobSkills[index]); // Use original case
        } else {
            missingSkills.push(jobSkills[index]); // Use original case
        }
    });

    const percentage = Math.round(
        (matchedSkills.length / jobSkills.length) * 100
    );

    return {
        percentage,
        matchedSkills,
        missingSkills,
        totalJobSkills: jobSkills.length,
        totalMatchedSkills: matchedSkills.length,
    };
};

/**
 * Sort jobs by skill match percentage
 * @param {Array} jobs - Array of job objects with skillMatch property
 * @param {string} order - 'desc' for highest match first, 'asc' for lowest match first
 * @returns {Array} - Sorted array of jobs
 */
const sortJobsBySkillMatch = (jobs, order = "desc") => {
    return jobs.sort((a, b) => {
        const aMatch = a.skillMatch?.percentage || 0;
        const bMatch = b.skillMatch?.percentage || 0;

        if (order === "desc") {
            return bMatch - aMatch;
        } else {
            return aMatch - bMatch;
        }
    });
};

module.exports = {
    calculateSkillMatchPercentage,
    calculateAdvancedSkillMatchPercentage,
    sortJobsBySkillMatch,
};
