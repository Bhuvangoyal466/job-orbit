/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    FileText,
    CheckCircle,
    AlertCircle,
    Edit,
    Save,
    X,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    Award,
    Trash2,
    Plus,
    Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import { candidateAPI } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const UploadResume = () => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch candidate profile on mount
        const fetchProfile = async () => {
            try {
                const data = await candidateAPI.getFullProfile();
                setFormData(data);
            } catch (err) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = async (file) => {
        setUploadedFile(file);
        setUploading(true);
        try {
            const response = await candidateAPI.uploadResume(file);

            if (response.parsed && response.parsedData) {
                // Show success message with parsing info
                toast.success(
                    "Resume uploaded and parsed successfully! Your profile has been auto-filled with extracted data."
                );

                // Update form data with parsed information
                if (response.candidateProfile) {
                    setFormData(response.candidateProfile);
                    // Automatically enable edit mode so user can review and modify
                    setEditMode(true);
                } else {
                    // Refresh the profile to get updated data
                    const updatedProfile = await candidateAPI.getFullProfile();
                    setFormData(updatedProfile);
                    setEditMode(true);
                }

                // Show a modal or toast with what was extracted
                const extractedFields = [];
                if (
                    response.parsedData.firstName ||
                    response.parsedData.lastName
                ) {
                    extractedFields.push("Name");
                }
                if (response.parsedData.email) {
                    extractedFields.push("Email");
                }
                if (response.parsedData.phone) {
                    extractedFields.push("Phone");
                }
                if (
                    response.parsedData.skills &&
                    response.parsedData.skills.length > 0
                ) {
                    extractedFields.push("Skills");
                }
                if (
                    response.parsedData.education &&
                    response.parsedData.education.length > 0
                ) {
                    extractedFields.push("Education");
                }
                if (response.parsedData.experience) {
                    extractedFields.push("Experience");
                }

                if (extractedFields.length > 0) {
                    setTimeout(() => {
                        toast.info(
                            `Extracted: ${extractedFields.join(
                                ", "
                            )}. Please review and save the changes.`,
                            {
                                autoClose: 8000,
                            }
                        );
                    }, 2000);
                }
            } else {
                toast.success("Resume uploaded successfully!");
                if (response.parsed === false) {
                    toast.warn(
                        "Resume parsing failed, but file was uploaded. You can fill your profile manually."
                    );
                }
            }
        } catch (err) {
            toast.error(err.message || "Upload failed");
        }
        setUploading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent, child, value) => {
        setFormData((prev) => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [child]: value,
            },
        }));
    };

    const handleArrayChange = (field, idx, key, value) => {
        setFormData((prev) => {
            const arr = [...(prev[field] || [])];
            arr[idx] = { ...arr[idx], [key]: value };
            return { ...prev, [field]: arr };
        });
    };

    const handleAddArrayItem = (field, emptyObj) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...(prev[field] || []), emptyObj],
        }));
    };

    const handleRemoveArrayItem = (field, idx) => {
        setFormData((prev) => {
            const arr = [...(prev[field] || [])];
            arr.splice(idx, 1);
            return { ...prev, [field]: arr };
        });
    };

    const handleSave = async () => {
        try {
            const updatedProfile = await candidateAPI.updateFullProfile(
                formData
            );
            setFormData(updatedProfile); // Update with the new data including updated profileCompleteness
            toast.success("Profile updated successfully!");
            setEditMode(false);
        } catch (err) {
            toast.error(err.message || "Update failed");
        }
    };

    const handleReParseResume = async () => {
        if (!formData?.resume) {
            toast.error("No resume found to parse");
            return;
        }

        setUploading(true);
        try {
            const response = await candidateAPI.parseExistingResume();

            if (response.parsed && response.parsedData) {
                toast.success("Resume re-parsed successfully!");

                // Update form data with newly parsed information
                const updatedFormData = { ...formData };

                // Apply parsed data to form (similar to upload logic)
                const parsedData = response.parsedData;

                if (parsedData.firstName && !updatedFormData.firstName) {
                    updatedFormData.firstName = parsedData.firstName;
                }
                if (parsedData.lastName && !updatedFormData.lastName) {
                    updatedFormData.lastName = parsedData.lastName;
                }
                if (parsedData.email && !updatedFormData.email) {
                    updatedFormData.email = parsedData.email;
                }
                if (parsedData.phone && !updatedFormData.phone) {
                    updatedFormData.phone = parsedData.phone;
                }
                if (parsedData.skills && parsedData.skills.length > 0) {
                    const existingSkills = updatedFormData.skills || [];
                    const newSkills = parsedData.skills || [];
                    const combinedSkills = [
                        ...new Set([...existingSkills, ...newSkills]),
                    ];
                    updatedFormData.skills = combinedSkills;
                }
                if (parsedData.education && parsedData.education.length > 0) {
                    updatedFormData.education = [
                        ...(updatedFormData.education || []),
                        ...parsedData.education,
                    ];
                }
                if (parsedData.experience && !updatedFormData.experience) {
                    updatedFormData.experience = parsedData.experience;
                }
                if (
                    parsedData.address &&
                    Object.keys(parsedData.address).length > 0
                ) {
                    updatedFormData.address = {
                        ...(updatedFormData.address || {}),
                        ...parsedData.address,
                    };
                }
                if (parsedData.portfolioUrl && !updatedFormData.portfolioUrl) {
                    updatedFormData.portfolioUrl = parsedData.portfolioUrl;
                }
                if (parsedData.linkedinUrl && !updatedFormData.linkedinUrl) {
                    updatedFormData.linkedinUrl = parsedData.linkedinUrl;
                }

                setFormData(updatedFormData);
                setEditMode(true); // Enable edit mode for review

                toast.info(
                    "Please review the extracted data and save your profile.",
                    {
                        autoClose: 5000,
                    }
                );
            } else {
                toast.error("Failed to parse resume. Please try again.");
            }
        } catch (err) {
            toast.error(err.message || "Failed to parse resume");
        }
        setUploading(false);
    };

    if (loading) {
        return (
            <LoadingSpinner
                fullScreen={true}
                message="Loading your profile..."
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                {/* Header */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Upload Your Resume
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Upload your resume and let our AI automatically extract
                        and organize your information. Review and edit before
                        saving.
                    </p>
                </motion.div>

                {/* Upload Section */}
                <motion.div
                    className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <AnimatePresence mode="wait">
                        {!uploadedFile ? (
                            <motion.div
                                key="upload-area"
                                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                                    dragActive
                                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-105"
                                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute top-4 left-4 w-8 h-8 bg-blue-600 rounded-full"></div>
                                    <div className="absolute top-8 right-8 w-6 h-6 bg-purple-600 rounded-full"></div>
                                    <div className="absolute bottom-8 left-8 w-4 h-4 bg-green-600 rounded-full"></div>
                                </div>

                                <motion.div
                                    className="relative z-10"
                                    animate={
                                        dragActive
                                            ? { scale: 1.1 }
                                            : { scale: 1 }
                                    }
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.div
                                        className="mx-auto mb-6 p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl w-fit"
                                        animate={{
                                            rotate: dragActive ? 360 : 0,
                                            y: [0, -5, 0],
                                        }}
                                        transition={{
                                            rotate: { duration: 0.6 },
                                            y: {
                                                duration: 2,
                                                repeat: Infinity,
                                            },
                                        }}
                                    >
                                        <Upload className="h-12 w-12 text-white" />
                                    </motion.div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        {dragActive
                                            ? "Drop it like it's hot!"
                                            : "Drag & Drop Your Resume"}
                                    </h3>
                                    <p className="text-gray-600 mb-6 text-lg">
                                        or click to browse files (PDF, DOC, DOCX
                                        supported)
                                    </p>

                                    <div className="flex items-center justify-center gap-4 mb-6">
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle className="h-5 w-5" />
                                            <span className="text-sm font-medium">
                                                AI-Powered Parsing
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <CheckCircle className="h-5 w-5" />
                                            <span className="text-sm font-medium">
                                                Secure Upload
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="uploaded-file"
                                className="text-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <motion.div
                                    className="mx-auto mb-6 p-6 bg-green-500 rounded-2xl shadow-xl w-fit"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        duration: 0.6,
                                    }}
                                >
                                    <FileText className="h-12 w-12 text-white" />
                                </motion.div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {uploadedFile.name}
                                </h3>
                                <p className="text-green-600 font-semibold flex items-center justify-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    Resume uploaded successfully!
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                            e.target.files && handleFile(e.target.files[0])
                        }
                        className="hidden"
                        id="resume-upload"
                    />

                    <div className="flex gap-4 flex-wrap justify-center mt-8">
                        <motion.label
                            htmlFor="resume-upload"
                            className="btn-primary cursor-pointer flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Upload className="h-5 w-5" />
                            Choose File
                        </motion.label>

                        {formData?.resume && (
                            <motion.button
                                type="button"
                                onClick={handleReParseResume}
                                disabled={uploading}
                                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: uploading ? 1 : 1.05 }}
                                whileTap={{ scale: uploading ? 1 : 0.95 }}
                            >
                                <FileText className="h-5 w-5" />
                                Re-parse Resume
                            </motion.button>
                        )}

                        {formData?.resume && (
                            <motion.button
                                type="button"
                                onClick={() =>
                                    window.open(
                                        `http://localhost:5000/api/candidate/resume/${formData.candidateId}`,
                                        "_blank"
                                    )
                                }
                                className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-700 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Eye className="h-5 w-5" />
                                View Resume
                            </motion.button>
                        )}
                    </div>

                    <AnimatePresence>
                        {uploading && (
                            <motion.div
                                className="mt-6 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                                    <span className="font-medium">
                                        {uploadedFile
                                            ? "Uploading and parsing your resume..."
                                            : "Parsing resume with AI..."}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Profile Form */}
            {formData && (
                <motion.div
                    className="glass p-8 rounded-3xl border border-white/20 shadow-2xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Profile Information
                                </h2>
                            </motion.div>

                            {/* Enhanced Profile Completeness Indicator */}
                            <motion.div
                                className="flex items-center space-x-3"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="relative">
                                    <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                (formData.profileCompleteness ||
                                                    0) >= 80
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                                    : (formData.profileCompleteness ||
                                                          0) >= 60
                                                    ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                                    : "bg-gradient-to-r from-red-500 to-pink-500"
                                            }`}
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${
                                                    formData.profileCompleteness ||
                                                    0
                                                }%`,
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                delay: 0.8,
                                            }}
                                        />
                                    </div>
                                    {/* Progress indicator dots */}
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-1">
                                        {[25, 50, 75].map((mark) => (
                                            <div
                                                key={mark}
                                                className={`w-1 h-1 rounded-full ${
                                                    (formData.profileCompleteness ||
                                                        0) >= mark
                                                        ? "bg-white"
                                                        : "bg-gray-400"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-gray-700 bg-white/50 px-3 py-1 rounded-full">
                                    {formData.profileCompleteness || 0}%
                                    Complete
                                </span>
                            </motion.div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                            {(formData.profileCompleteness || 0) < 100 && (
                                <motion.div
                                    className="flex items-center gap-2 text-sm text-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-full border border-blue-200"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Award className="h-4 w-4 text-blue-600" />
                                    Complete your profile to stand out!
                                </motion.div>
                            )}

                            <div className="flex gap-3">
                                {!editMode ? (
                                    <motion.button
                                        className="btn-primary flex items-center gap-2"
                                        onClick={() => setEditMode(true)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit Profile
                                    </motion.button>
                                ) : (
                                    <div className="flex gap-2">
                                        <motion.button
                                            type="button"
                                            className="btn-primary flex items-center gap-2"
                                            onClick={handleSave}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            className="btn-secondary flex items-center gap-2"
                                            onClick={() => setEditMode(false)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <X className="h-4 w-4" />
                                            Cancel
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <form
                        className="space-y-8"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                    >
                        {/* Personal Information Section */}
                        <motion.div
                            className="bg-gradient-to-br from-white/90 to-blue-50/50 p-8 rounded-2xl border border-blue-100 shadow-lg backdrop-blur-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <motion.div
                                    className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl"
                                    whileHover={{ rotate: 10, scale: 1.1 }}
                                >
                                    <User className="h-5 w-5 text-white" />
                                </motion.div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Personal Information
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.9, duration: 0.4 }}
                                >
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <User className="h-4 w-4 text-blue-500" />
                                        First Name{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName || ""}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            required
                                            className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900 transition-all duration-300 ${
                                                !editMode
                                                    ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                                                    : "bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-blue-300"
                                            } placeholder-gray-400 shadow-sm group-hover:shadow-md`}
                                            placeholder="Enter your first name"
                                        />
                                        {editMode && (
                                            <motion.div
                                                className="absolute inset-0 border-2 border-blue-500 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"
                                                layoutId="input-focus"
                                            />
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.0, duration: 0.4 }}
                                >
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <User className="h-4 w-4 text-blue-500" />
                                        Last Name{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName || ""}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            required
                                            className={`w-full border-2 rounded-xl px-4 py-3 text-gray-900 transition-all duration-300 ${
                                                !editMode
                                                    ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                                                    : "bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-blue-300"
                                            } placeholder-gray-400 shadow-sm group-hover:shadow-md`}
                                            placeholder="Enter your last name"
                                        />
                                        {editMode && (
                                            <motion.div
                                                className="absolute inset-0 border-2 border-blue-500 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"
                                                layoutId="input-focus"
                                            />
                                        )}
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.1, duration: 0.4 }}
                                >
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-blue-500" />
                                        Email Address{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email || ""}
                                            onChange={handleInputChange}
                                            disabled
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 cursor-not-allowed text-gray-600 shadow-sm"
                                            placeholder="Your email address"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <div className="bg-gray-300 text-gray-600 text-xs px-2 py-1 rounded-md">
                                                Read-only
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        Email cannot be changed for security
                                        reasons
                                    </p>
                                </motion.div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone || ""}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        required
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={
                                            formData.dateOfBirth
                                                ? formData.dateOfBirth.slice(
                                                      0,
                                                      10
                                                  )
                                                : ""
                                        }
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        required
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Address Information Section */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                Address Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="md:col-span-2 lg:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="123 Main Street, Apt 4B"
                                        value={formData.address?.street || ""}
                                        onChange={(e) =>
                                            handleNestedChange(
                                                "address",
                                                "street",
                                                e.target.value
                                            )
                                        }
                                        disabled={!editMode}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="New York"
                                        value={formData.address?.city || ""}
                                        onChange={(e) =>
                                            handleNestedChange(
                                                "address",
                                                "city",
                                                e.target.value
                                            )
                                        }
                                        disabled={!editMode}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State/Province
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="NY"
                                        value={formData.address?.state || ""}
                                        onChange={(e) =>
                                            handleNestedChange(
                                                "address",
                                                "state",
                                                e.target.value
                                            )
                                        }
                                        disabled={!editMode}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ZIP/Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="10001"
                                        value={formData.address?.zipCode || ""}
                                        onChange={(e) =>
                                            handleNestedChange(
                                                "address",
                                                "zipCode",
                                                e.target.value
                                            )
                                        }
                                        disabled={!editMode}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <select
                                        value={formData.address?.country || ""}
                                        onChange={(e) =>
                                            handleNestedChange(
                                                "address",
                                                "country",
                                                e.target.value
                                            )
                                        }
                                        disabled={!editMode}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
                                    >
                                        <option value="">Select Country</option>
                                        <option value="US">
                                            United States
                                        </option>
                                        <option value="CA">Canada</option>
                                        <option value="GB">
                                            United Kingdom
                                        </option>
                                        <option value="AU">Australia</option>
                                        <option value="IN">India</option>
                                        <option value="DE">Germany</option>
                                        <option value="FR">France</option>
                                        <option value="JP">Japan</option>
                                        <option value="SG">Singapore</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Professional Information Section */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                Professional Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Years of Experience
                                    </label>
                                    <select
                                        name="experience"
                                        value={formData.experience || 0}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
                                    >
                                        <option value={0}>
                                            Fresh Graduate / No Experience
                                        </option>
                                        <option value={1}>1 year</option>
                                        <option value={2}>2 years</option>
                                        <option value={3}>3 years</option>
                                        <option value={4}>4 years</option>
                                        <option value={5}>5 years</option>
                                        <option value={6}>6-10 years</option>
                                        <option value={10}>10+ years</option>
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Skills
                                    </label>
                                    <textarea
                                        name="skills"
                                        rows={3}
                                        value={
                                            Array.isArray(formData.skills)
                                                ? formData.skills.join(", ")
                                                : formData.skills || ""
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData((prev) => ({
                                                ...prev,
                                                skills: value,
                                            }));
                                        }}
                                        onBlur={(e) => {
                                            // Convert to array format when user finishes editing
                                            const value = e.target.value;
                                            setFormData((prev) => ({
                                                ...prev,
                                                skills: value
                                                    .split(",")
                                                    .map((s) => s.trim())
                                                    .filter(Boolean),
                                            }));
                                        }}
                                        disabled={!editMode}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
                                        placeholder="JavaScript, React, Node.js, Python, etc. (comma separated)"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Separate skills with commas
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Education Section */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                Education
                            </h3>
                            <div className="space-y-4">
                                {(formData.education || []).map((edu, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white p-4 rounded-lg border border-gray-200"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Degree
                                                </label>
                                                <select
                                                    value={edu.degree || ""}
                                                    onChange={(e) =>
                                                        handleArrayChange(
                                                            "education",
                                                            idx,
                                                            "degree",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={!editMode}
                                                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                        !editMode
                                                            ? "bg-gray-100 cursor-not-allowed"
                                                            : "bg-white"
                                                    }`}
                                                >
                                                    <option value="">
                                                        Select Degree
                                                    </option>
                                                    <option value="High School">
                                                        High School
                                                    </option>
                                                    <option value="Associate">
                                                        Associate Degree
                                                    </option>
                                                    <option value="Bachelor">
                                                        Bachelor's Degree
                                                    </option>
                                                    <option value="Master">
                                                        Master's Degree
                                                    </option>
                                                    <option value="PhD">
                                                        PhD
                                                    </option>
                                                    <option value="Diploma">
                                                        Diploma
                                                    </option>
                                                    <option value="Certificate">
                                                        Certificate
                                                    </option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Institution
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="University/College Name"
                                                    value={
                                                        edu.institution || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleArrayChange(
                                                            "education",
                                                            idx,
                                                            "institution",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={!editMode}
                                                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                        !editMode
                                                            ? "bg-gray-100 cursor-not-allowed"
                                                            : "bg-white"
                                                    }`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Graduation Year
                                                </label>
                                                <select
                                                    value={
                                                        edu.graduationYear || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleArrayChange(
                                                            "education",
                                                            idx,
                                                            "graduationYear",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={!editMode}
                                                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                        !editMode
                                                            ? "bg-gray-100 cursor-not-allowed"
                                                            : "bg-white"
                                                    }`}
                                                >
                                                    <option value="">
                                                        Select Year
                                                    </option>
                                                    {Array.from(
                                                        { length: 50 },
                                                        (_, i) => {
                                                            const year =
                                                                new Date().getFullYear() +
                                                                5 -
                                                                i;
                                                            return (
                                                                <option
                                                                    key={year}
                                                                    value={year}
                                                                >
                                                                    {year}
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Grade/GPA
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Scale of 0-10 (only numbers)"
                                                    value={edu.grade || ""}
                                                    onChange={(e) =>
                                                        handleArrayChange(
                                                            "education",
                                                            idx,
                                                            "grade",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={!editMode}
                                                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                        !editMode
                                                            ? "bg-gray-100 cursor-not-allowed"
                                                            : "bg-white"
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                        {editMode && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveArrayItem(
                                                        "education",
                                                        idx
                                                    )
                                                }
                                                className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                                            >
                                                Remove Education
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {editMode && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddArrayItem("education", {
                                                degree: "",
                                                institution: "",
                                                graduationYear: "",
                                                grade: "",
                                            })
                                        }
                                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
                                    >
                                        + Add Education
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Links & Portfolio Section */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                Links & Portfolio
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Portfolio URL
                                    </label>
                                    <input
                                        type="url"
                                        name="portfolioUrl"
                                        value={formData.portfolioUrl || ""}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
                                        placeholder="https://yourportfolio.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        LinkedIn Profile
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedinUrl"
                                        value={formData.linkedinUrl || ""}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Job Preferences Section */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                Job Preferences
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Job Type
                                    </label>
                                    <select
                                        name="preferredJobType"
                                        value={
                                            formData.preferredJobType ||
                                            "full-time"
                                        }
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
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
                                        <option value="remote">Remote</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Currency
                                    </label>
                                    <select
                                        value={
                                            formData.expectedSalary?.currency ||
                                            "INR"
                                        }
                                        onChange={(e) =>
                                            handleNestedChange(
                                                "expectedSalary",
                                                "currency",
                                                e.target.value
                                            )
                                        }
                                        disabled={!editMode}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
                                    >
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="CAD">CAD (C$)</option>
                                        <option value="AUD">AUD (A$)</option>
                                        <option value="JPY">JPY (¥)</option>
                                        <option value="SGD">SGD (S$)</option>
                                    </select>
                                </div>
                                <div className="lg:col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Locations
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={
                                            Array.isArray(
                                                formData.preferredLocations
                                            )
                                                ? formData.preferredLocations.join(
                                                      ", "
                                                  )
                                                : ""
                                        }
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                preferredLocations:
                                                    e.target.value
                                                        .split(",")
                                                        .map((s) => s.trim())
                                                        .filter(Boolean),
                                            }))
                                        }
                                        disabled={!editMode}
                                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                                            !editMode
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        }`}
                                        placeholder="New York, San Francisco, Remote, etc. (comma separated)"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Separate locations with commas
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Expected Salary Range (Annually)
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                            Minimum
                                        </label>
                                        <input
                                            type="number"
                                            value={
                                                formData.expectedSalary?.min ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleNestedChange(
                                                    "expectedSalary",
                                                    "min",
                                                    e.target.value
                                                )
                                            }
                                            disabled={!editMode}
                                            className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                !editMode
                                                    ? "bg-gray-100 cursor-not-allowed"
                                                    : "bg-white"
                                            }`}
                                            placeholder="50000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                            Maximum
                                        </label>
                                        <input
                                            type="number"
                                            value={
                                                formData.expectedSalary?.max ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleNestedChange(
                                                    "expectedSalary",
                                                    "max",
                                                    e.target.value
                                                )
                                            }
                                            disabled={!editMode}
                                            className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                !editMode
                                                    ? "bg-gray-100 cursor-not-allowed"
                                                    : "bg-white"
                                            }`}
                                            placeholder="80000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {editMode && (
                            <div className="bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors cursor-pointer"
                                        onClick={() => setEditMode(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </motion.div>
            )}
        </div>
    );
};

export default UploadResume;
