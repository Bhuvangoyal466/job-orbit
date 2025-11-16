/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { candidateAPI } from "../../utils/api";
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar } from "lucide-react";

const CandidateSignup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Frontend validation
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        // Check password complexity
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            toast.error(
                "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            );
            setLoading(false);
            return;
        }

        // Check age validation
        if (formData.dateOfBirth) {
            const today = new Date();
            const birthDate = new Date(formData.dateOfBirth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            if (
                monthDifference < 0 ||
                (monthDifference === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            if (age < 18) {
                toast.error("You must be at least 18 years old to register");
                setLoading(false);
                return;
            }
        }

        // Check phone number format
        if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
            toast.error("Please enter a valid phone number");
            setLoading(false);
            return;
        }

        try {
            // Call the backend API for candidate registration
            await candidateAPI.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                password: formData.password,
            });

            navigate("/candidate/login", {
                state: {
                    message: "Account created successfully! Please sign in.",
                },
            });
        } catch (error) {
            console.error("Registration error:", error);

            // Check if error has specific validation messages
            if (
                error.response?.data?.errors &&
                Array.isArray(error.response.data.errors)
            ) {
                // Show each validation error
                error.response.data.errors.forEach((err) => {
                    toast.error(`${err.path || "Field"}: ${err.msg}`);
                });
            } else if (error.response?.data?.message) {
                // Show general error message from backend
                toast.error(error.response.data.message);
            } else if (error.message) {
                // Show error message from axios or other source
                toast.error(error.message);
            } else {
                // Fallback message
                toast.error(
                    "Failed to create account. Please check your information and try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-lg">
                    <div className="flex justify-center">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
                            <User className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Join JobOrbit
                    </h2>
                    <p className="mt-2 text-center text-base text-gray-600 font-medium">
                        Create your Job Seeker account and start your career
                        journey
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
                    <div className="bg-white/80 backdrop-blur-xl py-8 px-6 shadow-2xl sm:rounded-2xl border border-white/20">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label
                                        htmlFor="firstName"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        First Name
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            required
                                            className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white"
                                            placeholder="First name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                        <User className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-blue-500 transition-colors duration-300" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="lastName"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Last Name
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            required
                                            className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white"
                                            placeholder="Last name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                        <User className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-blue-500 transition-colors duration-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Email address
                                </label>
                                <div className="relative group">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <Mail className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-blue-500 transition-colors duration-300" />
                                </div>
                            </div>

                            {/* Date of Birth and Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label
                                        htmlFor="dateOfBirth"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Date of Birth
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            type="date"
                                            required
                                            className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                        />
                                        <Calendar className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-blue-500 transition-colors duration-300" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Phone Number
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white"
                                            placeholder="Phone number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                        <Phone className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-blue-500 transition-colors duration-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Password Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            required
                                            className="appearance-none block w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <Lock className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-blue-500 transition-colors duration-300" />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            required
                                            className="appearance-none block w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white"
                                            placeholder="Confirm password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                        <Lock className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-blue-500 transition-colors duration-300" />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <p className="text-xs text-blue-800 font-medium mb-2">
                                    Password must contain:
                                </p>
                                <ul className="text-xs text-blue-700 space-y-1">
                                    <li className="flex items-center">
                                        <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                                        At least 6 characters
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                                        One uppercase letter
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                                        One lowercase letter
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                                        One number
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <span className="flex items-center">
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                                                Creating account...
                                            </>
                                        ) : (
                                            "Create account"
                                        )}
                                    </span>
                                </button>
                            </div>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white/80 text-gray-600 font-medium">
                                        Already have an account?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link
                                    to="/candidate/login"
                                    className="w-full flex justify-center py-3 px-4 border border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-white/70 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-[1.02]"
                                >
                                    Sign in to existing account
                                </Link>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                to="/recruiter/signup"
                                className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                            >
                                Are you a recruiter?{" "}
                                <span className="text-blue-600 font-semibold">
                                    Register here
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CandidateSignup;
