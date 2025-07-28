// API base URL - update this to match your backend server
const API_BASE_URL = "http://localhost:5000/api";

// Helper function to make API requests
const makeRequest = async (url, options = {}) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    };

    // Add authorization header if token exists
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;
    } catch (error) {
        console.error("API Request Error:", error);
        throw error;
    }
};

// Candidate API calls
export const candidateAPI = {
    // Register candidate
    register: async (userData) => {
        return makeRequest("/auth/candidate/register", {
            method: "POST",
            body: JSON.stringify(userData),
        });
    },

    // Login candidate
    login: async (credentials) => {
        return makeRequest("/auth/candidate/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
    },

    // Get current candidate profile
    getProfile: async () => {
        return makeRequest("/auth/candidate/me");
    },

    // Update candidate profile
    updateProfile: async (userData) => {
        return makeRequest("/auth/candidate/profile", {
            method: "PUT",
            body: JSON.stringify(userData),
        });
    },

    // Change password
    changePassword: async (passwordData) => {
        return makeRequest("/auth/candidate/password", {
            method: "PUT",
            body: JSON.stringify(passwordData),
        });
    },

    // Get dashboard stats
    getDashboard: async () => {
        return makeRequest("/auth/candidate/dashboard");
    },
};

// Recruiter API calls
export const recruiterAPI = {
    // Register recruiter
    register: async (userData) => {
        return makeRequest("/auth/recruiter/register", {
            method: "POST",
            body: JSON.stringify(userData),
        });
    },

    // Login recruiter
    login: async (credentials) => {
        return makeRequest("/auth/recruiter/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
    },

    // Get current recruiter profile
    getProfile: async () => {
        return makeRequest("/auth/recruiter/me");
    },

    // Update recruiter profile
    updateProfile: async (userData) => {
        return makeRequest("/auth/recruiter/profile", {
            method: "PUT",
            body: JSON.stringify(userData),
        });
    },

    // Change password
    changePassword: async (passwordData) => {
        return makeRequest("/auth/recruiter/password", {
            method: "PUT",
            body: JSON.stringify(passwordData),
        });
    },

    // Update subscription
    updateSubscription: async (planData) => {
        return makeRequest("/auth/recruiter/subscription", {
            method: "PUT",
            body: JSON.stringify(planData),
        });
    },

    // Get dashboard stats
    getDashboard: async () => {
        return makeRequest("/auth/recruiter/dashboard");
    },

    // Get verification status
    getVerificationStatus: async () => {
        return makeRequest("/auth/recruiter/verification");
    },
};

// General utility functions
export const authUtils = {
    // Get stored token
    getToken: () => localStorage.getItem("token"),

    // Get stored user data
    getUser: () => {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        return !!(token && user);
    },

    // Clear auth data
    clearAuth: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    // Store auth data
    setAuth: (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
    },
};
