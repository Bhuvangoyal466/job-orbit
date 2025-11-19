/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Plus,
    X,
    Building2,
    MapPin,
    DollarSign,
    Users,
    Star,
    CheckCircle,
    Clock,
    Briefcase,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { recruiterAPI } from "../../utils/api";
import { formatSalaryRange, formatIndianNumber } from "../../utils/currency";

const PostJob = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "full-time",
        salary: {
            min: "",
            max: "",
            currency: "INR",
        },
        location: {
            city: "",
            state: "",
            country: "",
            remote: false,
        },
        skills: [],
        company: {
            name: "",
            logo: "",
            website: "",
            industry: "",
            size: "",
        },
        perks: [],
        benefits: [],
        applicationDeadline: "",
        numberOfOpenings: 1,
    });

    // For handling skills, perks, and benefits
    const [skill, setSkill] = useState("");
    const [perk, setPerk] = useState("");
    const [benefit, setBenefit] = useState("");

    // Wizard steps configuration
    const steps = [
        {
            title: "Job Basics",
            description: "Define the core job details",
            icon: Briefcase,
            color: "from-blue-500 to-blue-600",
        },
        {
            title: "Company Info",
            description: "Add your company details",
            icon: Building2,
            color: "from-purple-500 to-purple-600",
        },
        {
            title: "Location & Salary",
            description: "Set location and compensation",
            icon: MapPin,
            color: "from-green-500 to-green-600",
        },
        {
            title: "Skills & Benefits",
            description: "Add requirements and perks",
            icon: Star,
            color: "from-orange-500 to-orange-600",
        },
        {
            title: "Review & Post",
            description: "Review and publish your job",
            icon: CheckCircle,
            color: "from-teal-500 to-teal-600",
        },
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle nested objects
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === "checkbox" ? checked : value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    // Form submit handler
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await recruiterAPI.createJob(formData);

            // console.log("Job posted successfully:", response);
            toast.success("Job posted successfully!");

            // Redirect to the recruiter dashboard
            navigate("/recruiter/dashboard");
        } catch (error) {
            console.error("Error posting job:", error);
            toast.error(
                error.message || "Failed to post job. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Navigation handlers
    const nextStep = () =>
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    // Validation for each step
    const isStepValid = (step) => {
        switch (step) {
            case 0:
                return formData.title && formData.description && formData.type;
            case 1:
                return formData.company.name;
            case 2:
                return true; // Optional fields
            case 3:
                return true; // Optional fields
            case 4:
                return true; // Review step
            default:
                return false;
        }
    };

    const addSkill = () => {
        if (skill.trim() && !formData.skills.includes(skill.trim())) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, skill.trim()],
            }));
            setSkill("");
        }
    };

    const removeSkill = (index) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
        }));
    };

    return (
        <motion.div
            className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-6xl mx-auto p-6">
                {/* Enhanced Header */}
                <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-6">
                        <Link to="/recruiter/dashboard">
                            <motion.div
                                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                whileHover={{ scale: 1.05, x: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowLeft className="h-6 w-6 text-gray-600" />
                            </motion.div>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                                Post New Job
                            </h1>
                            <p className="text-gray-600 text-lg mt-2">
                                Create an engaging job listing to attract top
                                talent
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">
                                Step {currentStep + 1} of {steps.length}
                            </div>
                            <div className="text-lg font-medium text-gray-900">
                                {steps[currentStep]?.title}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Enhanced Progress Stepper */}
                <motion.div
                    className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            const isCompleted = index < currentStep;
                            const isCurrent = index === currentStep;
                            const isUpcoming = index > currentStep;

                            return (
                                <div key={index} className="flex items-center">
                                    <motion.div
                                        className="flex flex-col items-center"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <motion.div
                                            className={`
                                                relative p-4 rounded-2xl shadow-lg transition-all duration-300
                                                ${
                                                    isCurrent
                                                        ? `bg-linear-to-r ${step.color} text-white shadow-xl`
                                                        : isCompleted
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-100 text-gray-400"
                                                }
                                            `}
                                            whileHover={{ scale: 1.05 }}
                                            animate={
                                                isCurrent
                                                    ? {
                                                          boxShadow:
                                                              "0 0 0 3px rgba(59, 130, 246, 0.2)",
                                                          scale: [1, 1.05, 1],
                                                      }
                                                    : {}
                                            }
                                            transition={{
                                                duration: 2,
                                                repeat: isCurrent
                                                    ? Infinity
                                                    : 0,
                                            }}
                                        >
                                            <StepIcon className="h-6 w-6" />
                                            {isCompleted && (
                                                <motion.div
                                                    className="absolute -top-1 -right-1 bg-green-400 rounded-full p-1"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 500,
                                                    }}
                                                >
                                                    <CheckCircle className="h-3 w-3 text-white" />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                        <div className="mt-3 text-center">
                                            <div
                                                className={`text-sm font-medium ${
                                                    isCurrent
                                                        ? "text-gray-900"
                                                        : isCompleted
                                                        ? "text-green-600"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {step.title}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1 hidden sm:block">
                                                {step.description}
                                            </div>
                                        </div>
                                    </motion.div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
                                                isCompleted
                                                    ? "bg-green-400"
                                                    : "bg-gray-200"
                                            }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Enhanced Form Container */}
                <motion.div
                    className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence mode="wait">
                            {/* Step 0: Job Basics */}
                            {currentStep === 0 && (
                                <motion.div
                                    key="step-0"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-8">
                                        <motion.div
                                            className="inline-flex p-4 bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                delay: 0.1,
                                            }}
                                        >
                                            <Briefcase className="h-8 w-8 text-white" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            Job Basics
                                        </h2>
                                        <p className="text-gray-600">
                                            Let's start with the essential
                                            details about your job opening
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                Job Title *
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                required
                                                placeholder="e.g., Senior Software Engineer"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                value={formData.title}
                                                onChange={handleChange}
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                Job Type *
                                            </label>
                                            <select
                                                name="type"
                                                required
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                value={formData.type}
                                                onChange={handleChange}
                                            >
                                                <option value="full-time">
                                                    Full-time
                                                </option>
                                                <option value="part-time">
                                                    Part-time
                                                </option>
                                                <option value="contract">
                                                    Contract
                                                </option>
                                                <option value="internship">
                                                    Internship
                                                </option>
                                                <option value="remote">
                                                    Remote
                                                </option>
                                            </select>
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Job Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            rows="8"
                                            required
                                            maxLength={3000}
                                            placeholder="Provide a detailed job description including responsibilities, requirements, and what makes this role exciting..."
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                        <div className="flex justify-between mt-2">
                                            <p className="text-xs text-gray-500">
                                                {formData.description.length}
                                                /3000 characters
                                            </p>
                                            <div
                                                className={`text-xs font-medium ${
                                                    formData.description
                                                        .length > 2700
                                                        ? "text-red-500"
                                                        : formData.description
                                                              .length > 2000
                                                        ? "text-yellow-500"
                                                        : "text-green-500"
                                                }`}
                                            >
                                                {3000 -
                                                    formData.description
                                                        .length}{" "}
                                                remaining
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Step 1: Company Details */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step-1"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-8">
                                        <motion.div
                                            className="inline-flex p-4 bg-linear-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg mb-4"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                delay: 0.1,
                                            }}
                                        >
                                            <Building2 className="h-8 w-8 text-white" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            Company Information
                                        </h2>
                                        <p className="text-gray-600">
                                            Tell candidates about your company
                                            and culture
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                Company Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="company.name"
                                                required
                                                placeholder="Your company name"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                value={formData.company.name}
                                                onChange={handleChange}
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                Company Website
                                            </label>
                                            <input
                                                type="url"
                                                name="company.website"
                                                placeholder="https://yourcompany.com"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                value={formData.company.website}
                                                onChange={handleChange}
                                            />
                                        </motion.div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                Company Logo URL
                                            </label>
                                            <input
                                                type="url"
                                                name="company.logo"
                                                placeholder="https://example.com/logo.png"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                value={formData.company.logo}
                                                onChange={handleChange}
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                Industry
                                            </label>
                                            <input
                                                type="text"
                                                name="company.industry"
                                                placeholder="e.g., Technology, Healthcare"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                value={
                                                    formData.company.industry
                                                }
                                                onChange={handleChange}
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                Company Size
                                            </label>
                                            <input
                                                type="text"
                                                name="company.size"
                                                placeholder="e.g., 50-100 employees"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                value={formData.company.size}
                                                onChange={handleChange}
                                            />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Location & Salary */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step-2"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center mb-8">
                                        <motion.div
                                            className="inline-flex p-4 bg-linear-to-r from-green-500 to-green-600 rounded-2xl shadow-lg mb-4"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                delay: 0.1,
                                            }}
                                        >
                                            <MapPin className="h-8 w-8 text-white" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            Location & Compensation
                                        </h2>
                                        <p className="text-gray-600">
                                            Set the location and salary details
                                            for this position
                                        </p>
                                    </div>

                                    {/* Location Section */}
                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-green-500" />
                                            Job Location
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-4">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    name="location.city"
                                                    placeholder="e.g., San Francisco"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                    value={
                                                        formData.location.city
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    State/Province
                                                </label>
                                                <input
                                                    type="text"
                                                    name="location.state"
                                                    placeholder="e.g., California"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                    value={
                                                        formData.location.state
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    name="location.country"
                                                    placeholder="e.g., United States"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                    value={
                                                        formData.location
                                                            .country
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
                                        >
                                            <input
                                                type="checkbox"
                                                id="remoteOption"
                                                name="location.remote"
                                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
                                                checked={
                                                    formData.location.remote
                                                }
                                                onChange={handleChange}
                                            />
                                            <label
                                                htmlFor="remoteOption"
                                                className="text-gray-700 font-medium cursor-pointer"
                                            >
                                                🌍 This is a remote position
                                            </label>
                                        </motion.div>
                                    </div>

                                    {/* Salary Section */}
                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <DollarSign className="h-5 w-5 text-green-500" />
                                            Salary Range
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    Minimum Salary
                                                </label>
                                                <input
                                                    type="number"
                                                    name="salary.min"
                                                    placeholder="50000"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                    value={formData.salary.min}
                                                    onChange={handleChange}
                                                />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.7 }}
                                            >
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    Maximum Salary
                                                </label>
                                                <input
                                                    type="number"
                                                    name="salary.max"
                                                    placeholder="80000"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                    value={formData.salary.max}
                                                    onChange={handleChange}
                                                />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.8 }}
                                            >
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    Currency
                                                </label>
                                                <select
                                                    name="salary.currency"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                    value={
                                                        formData.salary.currency
                                                    }
                                                    onChange={handleChange}
                                                >
                                                    <option value="INR">
                                                        INR - Indian Rupee (₹)
                                                    </option>
                                                    <option value="USD">
                                                        USD - US Dollar
                                                    </option>
                                                    <option value="EUR">
                                                        EUR - Euro
                                                    </option>
                                                    <option value="GBP">
                                                        GBP - British Pound
                                                    </option>
                                                    <option value="CAD">
                                                        CAD - Canadian Dollar
                                                    </option>
                                                    <option value="AUD">
                                                        AUD - Australian Dollar
                                                    </option>
                                                </select>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Skills & Benefits */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step-3"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center mb-8">
                                        <motion.div
                                            className="inline-flex p-4 bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-4"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                delay: 0.1,
                                            }}
                                        >
                                            <Star className="h-8 w-8 text-white" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            Skills & Benefits
                                        </h2>
                                        <p className="text-gray-600">
                                            Define requirements and highlight
                                            what you offer
                                        </p>
                                    </div>

                                    {/* Skills Section */}
                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Users className="h-5 w-5 text-orange-500" />
                                            Required Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {formData.skills.map(
                                                (skillItem, index) => (
                                                    <motion.span
                                                        key={index}
                                                        initial={{
                                                            opacity: 0,
                                                            scale: 0.8,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            scale: 1,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            scale: 0.8,
                                                        }}
                                                        className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg flex items-center gap-2 font-medium"
                                                    >
                                                        {skillItem}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeSkill(
                                                                    index
                                                                )
                                                            }
                                                            className="text-blue-500 hover:text-red-500 transition-colors"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </motion.span>
                                                )
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add a required skill (e.g., React, Python, Communication)"
                                                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                value={skill}
                                                onChange={(e) =>
                                                    setSkill(e.target.value)
                                                }
                                                onKeyPress={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addSkill();
                                                    }
                                                }}
                                            />
                                            <motion.button
                                                type="button"
                                                className="bg-linear-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg"
                                                onClick={addSkill}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Plus className="h-5 w-5" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Benefits & Perks Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Perks */}
                                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <Star className="h-5 w-5 text-green-500" />
                                                Perks
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {formData.perks.map(
                                                    (item, index) => (
                                                        <motion.span
                                                            key={index}
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            className="bg-green-100 text-green-800 px-3 py-2 rounded-lg flex items-center gap-2 font-medium"
                                                        >
                                                            {item}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            perks: prev.perks.filter(
                                                                                (
                                                                                    _,
                                                                                    i
                                                                                ) =>
                                                                                    i !==
                                                                                    index
                                                                            ),
                                                                        })
                                                                    );
                                                                }}
                                                                className="text-green-500 hover:text-red-500 transition-colors"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </motion.span>
                                                    )
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add a perk"
                                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                    value={perk}
                                                    onChange={(e) =>
                                                        setPerk(e.target.value)
                                                    }
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            if (perk.trim()) {
                                                                setFormData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        perks: [
                                                                            ...prev.perks,
                                                                            perk.trim(),
                                                                        ],
                                                                    })
                                                                );
                                                                setPerk("");
                                                            }
                                                        }
                                                    }}
                                                />
                                                <motion.button
                                                    type="button"
                                                    className="bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg"
                                                    onClick={() => {
                                                        if (perk.trim()) {
                                                            setFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    perks: [
                                                                        ...prev.perks,
                                                                        perk.trim(),
                                                                    ],
                                                                })
                                                            );
                                                            setPerk("");
                                                        }
                                                    }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </motion.button>
                                            </div>
                                        </div>

                                        {/* Benefits */}
                                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5 text-purple-500" />
                                                Benefits
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {formData.benefits.map(
                                                    (item, index) => (
                                                        <motion.span
                                                            key={index}
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg flex items-center gap-2 font-medium"
                                                        >
                                                            {item}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            benefits:
                                                                                prev.benefits.filter(
                                                                                    (
                                                                                        _,
                                                                                        i
                                                                                    ) =>
                                                                                        i !==
                                                                                        index
                                                                                ),
                                                                        })
                                                                    );
                                                                }}
                                                                className="text-purple-500 hover:text-red-500 transition-colors"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </motion.span>
                                                    )
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add a benefit"
                                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                    value={benefit}
                                                    onChange={(e) =>
                                                        setBenefit(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            if (
                                                                benefit.trim()
                                                            ) {
                                                                setFormData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        benefits:
                                                                            [
                                                                                ...prev.benefits,
                                                                                benefit.trim(),
                                                                            ],
                                                                    })
                                                                );
                                                                setBenefit("");
                                                            }
                                                        }
                                                    }}
                                                />
                                                <motion.button
                                                    type="button"
                                                    className="bg-linear-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
                                                    onClick={() => {
                                                        if (benefit.trim()) {
                                                            setFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    benefits: [
                                                                        ...prev.benefits,
                                                                        benefit.trim(),
                                                                    ],
                                                                })
                                                            );
                                                            setBenefit("");
                                                        }
                                                    }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Details */}
                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-orange-500" />
                                            Additional Details
                                        </h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    Application Deadline
                                                </label>
                                                <input
                                                    type="date"
                                                    name="applicationDeadline"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                    value={
                                                        formData.applicationDeadline
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    Number of Openings
                                                </label>
                                                <input
                                                    type="number"
                                                    name="numberOfOpenings"
                                                    min="1"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                                    value={
                                                        formData.numberOfOpenings
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Review & Post */}
                            {currentStep === 4 && (
                                <motion.div
                                    key="step-4"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-8">
                                        <motion.div
                                            className="inline-flex p-4 bg-linear-to-r from-teal-500 to-teal-600 rounded-2xl shadow-lg mb-4"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                delay: 0.1,
                                            }}
                                        >
                                            <CheckCircle className="h-8 w-8 text-white" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            Review & Post
                                        </h2>
                                        <p className="text-gray-600">
                                            Review your job listing before
                                            publishing
                                        </p>
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                    {formData.title ||
                                                        "Job Title"}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {formData.company.name ||
                                                        "Company Name"}{" "}
                                                    • {formData.type}
                                                </p>
                                            </div>

                                            {formData.description && (
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-2">
                                                        Description
                                                    </h4>
                                                    <p className="text-gray-600 whitespace-pre-wrap">
                                                        {formData.description}
                                                    </p>
                                                </div>
                                            )}

                                            {formData.skills.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-2">
                                                        Required Skills
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {formData.skills.map(
                                                            (skill, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {(formData.salary.min ||
                                                formData.salary.max) && (
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-2">
                                                        Salary Range
                                                    </h4>
                                                    <p className="text-gray-600">
                                                        {formatSalaryRange(
                                                            formData.salary.min
                                                                ? Number(
                                                                      formData
                                                                          .salary
                                                                          .min
                                                                  )
                                                                : null,
                                                            formData.salary.max
                                                                ? Number(
                                                                      formData
                                                                          .salary
                                                                          .max
                                                                  )
                                                                : null
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Controls */}
                        <div className="flex justify-between items-center pt-8 border-t border-gray-200/50">
                            <motion.button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                    currentStep === 0
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md"
                                }`}
                                whileHover={
                                    currentStep > 0 ? { scale: 1.05 } : {}
                                }
                                whileTap={
                                    currentStep > 0 ? { scale: 0.95 } : {}
                                }
                            >
                                <ArrowLeft className="h-5 w-5 inline mr-2" />
                                Previous
                            </motion.button>

                            <div className="flex items-center gap-4">
                                <Link
                                    to="/recruiter/dashboard"
                                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
                                >
                                    Cancel
                                </Link>

                                {currentStep < steps.length - 1 ? (
                                    <motion.button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!isStepValid(currentStep)}
                                        className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                                            isStepValid(currentStep)
                                                ? "bg-linear-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                        whileHover={
                                            isStepValid(currentStep)
                                                ? { scale: 1.05 }
                                                : {}
                                        }
                                        whileTap={
                                            isStepValid(currentStep)
                                                ? { scale: 0.95 }
                                                : {}
                                        }
                                    >
                                        Next
                                        <ArrowLeft className="h-5 w-5 inline ml-2 rotate-180" />
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-linear-to-r from-teal-500 to-green-600 text-white rounded-xl font-medium hover:from-teal-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                                        whileHover={{
                                            scale: isSubmitting ? 1 : 1.05,
                                        }}
                                        whileTap={{
                                            scale: isSubmitting ? 1 : 0.95,
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <motion.div
                                                    className="inline-block mr-2"
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                >
                                                    <Clock className="h-5 w-5" />
                                                </motion.div>
                                                Posting Job...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-5 w-5 inline mr-2" />
                                                Post Job
                                            </>
                                        )}
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PostJob;
