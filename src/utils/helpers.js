// Date formatting utilities
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
};

// Form validation utilities
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

// Status utilities
export const getStatusColor = (status) => {
    const statusColors = {
        Applied: "bg-blue-100 text-blue-800",
        Interviewing: "bg-yellow-100 text-yellow-800",
        Offer: "bg-green-100 text-green-800",
        Rejected: "bg-red-100 text-red-800",
        Withdrawn: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
};

// Local storage utilities
export const setLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Error setting localStorage:", error);
    }
};

export const getLocalStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error("Error getting localStorage:", error);
        return defaultValue;
    }
};
