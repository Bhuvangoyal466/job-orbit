// Server-side currency utility functions for INR formatting

/**
 * Formats a number according to Indian numbering system
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted amount with Indian comma separation
 */
const formatINR = (amount) => {
    if (!amount && amount !== 0) return "Not specified";

    // Convert to Indian numbering system (lakhs and crores)
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Formats salary range in INR
 * @param {number} min - Minimum salary
 * @param {number} max - Maximum salary
 * @returns {string} - Formatted salary range
 */
const formatSalaryRange = (min, max) => {
    if (!min && !max) return "Salary not specified";

    if (min && max) {
        return `${formatINR(min)} - ${formatINR(max)}`;
    } else if (min) {
        return `From ${formatINR(min)}`;
    } else if (max) {
        return `Up to ${formatINR(max)}`;
    }

    return "Salary not specified";
};

/**
 * Formats a number with Indian comma separation (without currency symbol)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted amount with commas
 */
const formatIndianNumber = (amount) => {
    if (!amount && amount !== 0) return "0";
    return new Intl.NumberFormat("en-IN").format(amount);
};

/**
 * Default currency for the application
 */
const DEFAULT_CURRENCY = "INR";

module.exports = {
    formatINR,
    formatSalaryRange,
    formatIndianNumber,
    DEFAULT_CURRENCY,
};
