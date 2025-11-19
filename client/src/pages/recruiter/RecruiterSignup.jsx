import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { recruiterAPI } from "../../utils/api";
import {
    Building2,
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    MapPin,
    Briefcase,
    Calendar,
} from "lucide-react";

const RecruiterSignup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        position: "",
        department: "HR",
        company: {
            name: "",
            industry: "",
            size: "",
            website: "",
            description: "",
            address: {
                city: "",
                state: "",
                country: "",
            },
        },
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("company.")) {
            const fieldName = name.replace("company.", "");
            if (fieldName.startsWith("address.")) {
                const addressField = fieldName.replace("address.", "");
                setFormData((prev) => ({
                    ...prev,
                    company: {
                        ...prev.company,
                        address: {
                            ...prev.company.address,
                            [addressField]: value,
                        },
                    },
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    company: {
                        ...prev.company,
                        [fieldName]: value,
                    },
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

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
                toast.error(
                    "You must be at least 18 years old to register as a recruiter"
                );
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
            // Call the backend API for recruiter registration
            await recruiterAPI.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                position: formData.position,
                department: formData.department,
                company: formData.company,
                password: formData.password,
            });

            navigate("/recruiter/login", {
                state: {
                    message:
                        "Recruiter account created successfully! Please sign in.",
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
        <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-3xl">
                <div className="flex justify-center">
                    <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-4 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
                        <Building2 className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Join as Recruiter
                </h2>
                <p className="mt-2 text-center text-base text-gray-600 font-medium">
                    Create your recruiter account and find the best talent
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl relative z-10">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-6 shadow-2xl sm:rounded-2xl border border-white/20">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* Personal Information Section */}
                        <div className="bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center">
                                <User className="h-5 w-5 mr-2 text-emerald-600" />
                                Personal Information
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Tell us about yourself
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                            className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                            placeholder="First name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                        <User className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-emerald-500 transition-colors duration-300" />
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
                                            className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                            placeholder="Last name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                        <User className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-emerald-500 transition-colors duration-300" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        <Mail className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-emerald-500 transition-colors duration-300" />
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
                                            className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                            placeholder="Phone number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                        <Phone className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-emerald-500 transition-colors duration-300" />
                                    </div>
                                </div>

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
                                            className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                        />
                                        <Calendar className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-emerald-500 transition-colors duration-300" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="position"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Your Position
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="position"
                                            name="position"
                                            type="text"
                                            required
                                            className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                            placeholder="e.g., HR Manager, Talent Acquisition"
                                            value={formData.position}
                                            onChange={handleChange}
                                        />
                                        <Briefcase className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-emerald-500 transition-colors duration-300" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label
                                    htmlFor="department"
                                    className="block text-sm font-semibold text-gray-700 mb-1"
                                >
                                    Department
                                </label>
                                <select
                                    id="department"
                                    name="department"
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                    value={formData.department}
                                    onChange={handleChange}
                                >
                                    <option value="HR">Human Resources</option>
                                    <option value="Engineering">
                                        Engineering
                                    </option>
                                    <option value="Sales">Sales</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Operations">
                                        Operations
                                    </option>
                                    <option value="Finance">Finance</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Company Information Section */}
                        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center">
                                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                                Company Information
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Details about your organization
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label
                                        htmlFor="company.name"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Company Name
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="company.name"
                                            name="company.name"
                                            type="text"
                                            required
                                            className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                            placeholder="Your company name"
                                            value={formData.company.name}
                                            onChange={handleChange}
                                        />
                                        <Building2 className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-blue-500 transition-colors duration-300" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="company.industry"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Industry
                                    </label>
                                    <select
                                        id="company.industry"
                                        name="company.industry"
                                        required
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                        value={formData.company.industry}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Select Industry
                                        </option>
                                        <option value="Technology">
                                            Technology
                                        </option>
                                        <option value="Healthcare">
                                            Healthcare
                                        </option>
                                        <option value="Finance">Finance</option>
                                        <option value="Education">
                                            Education
                                        </option>
                                        <option value="Manufacturing">
                                            Manufacturing
                                        </option>
                                        <option value="Retail">Retail</option>
                                        <option value="Construction">
                                            Construction
                                        </option>
                                        <option value="Transportation">
                                            Transportation
                                        </option>
                                        <option value="Media">Media</option>
                                        <option value="Government">
                                            Government
                                        </option>
                                        <option value="Non-profit">
                                            Non-profit
                                        </option>
                                        <option value="Consulting">
                                            Consulting
                                        </option>
                                        <option value="Real Estate">
                                            Real Estate
                                        </option>
                                        <option value="Hospitality">
                                            Hospitality
                                        </option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="company.size"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Company Size
                                    </label>
                                    <select
                                        id="company.size"
                                        name="company.size"
                                        required
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                        value={formData.company.size}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Select Company Size
                                        </option>
                                        <option value="1-10">
                                            1-10 employees
                                        </option>
                                        <option value="11-50">
                                            11-50 employees
                                        </option>
                                        <option value="51-200">
                                            51-200 employees
                                        </option>
                                        <option value="201-1000">
                                            201-1000 employees
                                        </option>
                                        <option value="1001-5000">
                                            1001-5000 employees
                                        </option>
                                        <option value="5000+">
                                            5000+ employees
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="company.website"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Company Website
                                    </label>
                                    <input
                                        id="company.website"
                                        name="company.website"
                                        type="url"
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                        placeholder="https://www.company.com"
                                        value={formData.company.website}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label
                                    htmlFor="company.description"
                                    className="block text-sm font-semibold text-gray-700 mb-1"
                                >
                                    Company Description
                                </label>
                                <textarea
                                    id="company.description"
                                    name="company.description"
                                    rows="3"
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white resize-none"
                                    placeholder="Brief description of your company..."
                                    value={formData.company.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="space-y-1">
                                    <label
                                        htmlFor="company.address.city"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        City
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="company.address.city"
                                            name="company.address.city"
                                            type="text"
                                            required
                                            className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                            placeholder="City"
                                            value={
                                                formData.company.address.city
                                            }
                                            onChange={handleChange}
                                        />
                                        <MapPin className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-blue-500 transition-colors duration-300" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="company.address.state"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        State/Province
                                    </label>
                                    <input
                                        id="company.address.state"
                                        name="company.address.state"
                                        type="text"
                                        required
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                        placeholder="State/Province"
                                        value={formData.company.address.state}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="company.address.country"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Country
                                    </label>
                                    <input
                                        id="company.address.country"
                                        name="company.address.country"
                                        type="text"
                                        required
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                        placeholder="Country"
                                        value={formData.company.address.country}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="bg-linear-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center">
                                <Lock className="h-5 w-5 mr-2 text-purple-600" />
                                Account Security
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Create a secure password for your account
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                            className="appearance-none block w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                            placeholder="Create password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <Lock className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-purple-500 transition-colors duration-300" />
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
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            required
                                            className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 hover:bg-white focus:bg-white"
                                            placeholder="Confirm password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                        <Lock className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-purple-500 transition-colors duration-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-6">
                                <p className="text-xs text-purple-800 font-medium mb-2">
                                    Password must contain:
                                </p>
                                <ul className="text-xs text-purple-700 space-y-1 grid grid-cols-1 md:grid-cols-2 gap-1">
                                    <li className="flex items-center">
                                        <span className="w-1 h-1 bg-purple-600 rounded-full mr-2"></span>
                                        At least 6 characters
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1 h-1 bg-purple-600 rounded-full mr-2"></span>
                                        One uppercase letter
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1 h-1 bg-purple-600 rounded-full mr-2"></span>
                                        One lowercase letter
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1 h-1 bg-purple-600 rounded-full mr-2"></span>
                                        One number
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <span className="flex items-center">
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white mr-3"></div>
                                            Creating account...
                                        </>
                                    ) : (
                                        "Create recruiter account"
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <Link
                            to="/recruiter/login"
                            className="text-base text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200"
                        >
                            Already have an account?{" "}
                            <span className="text-emerald-600 font-semibold">
                                Sign in here
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterSignup;
