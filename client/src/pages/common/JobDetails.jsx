/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    MapPin,
    DollarSign,
    IndianRupee,
    Clock,
    Building,
    Globe,
    Users,
    Heart,
    Calendar,
    Briefcase,
    Loader,
    Tag,
    Gift,
    Check,
    Star,
    Award,
    Shield,
    Zap,
    Target,
    Share2,
    BookOpen,
    TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";
import { jobsAPI } from "../../utils/api";
import { useAuth } from "../../context/useAuth";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatSalaryRange } from "../../utils/currency";

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const { user, isCandidate } = useAuth();

    // Debug logging to help troubleshoot
    // console.log("JobDetails Debug:", {
    //     user,
    //     isCandidate: isCandidate(),
    //     userRole: user?.role,
    //     isAuthenticated: !!user,
    // });

    useEffect(() => {
        fetchJobDetails();
        if (user && isCandidate()) {
            checkIfJobIsSaved();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const data = await jobsAPI.getJob(id);
            setJob(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching job details:", err);
            setError(
                "Failed to load job details. The job may not exist or has been removed."
            );
            toast.error("Could not load job details");
        } finally {
            setLoading(false);
        }
    };

    const checkIfJobIsSaved = async () => {
        try {
            const savedJobs = await jobsAPI.getSavedJobs();
            const jobIsSaved = savedJobs.some(
                (savedJob) => savedJob._id === id
            );
            setIsSaved(jobIsSaved);
        } catch (err) {
            console.error("Error checking if job is saved:", err);
        }
    };

    const handleSaveJob = async () => {
        if (!user) {
            toast.info("Please login as a candidate to save jobs");
            return;
        }

        if (!isCandidate()) {
            toast.info("Only candidates can save jobs");
            return;
        }

        try {
            if (isSaved) {
                await jobsAPI.unsaveJob(id);
                setIsSaved(false);
                toast.info("Job removed from saved jobs");
            } else {
                await jobsAPI.saveJob(id);
                setIsSaved(true);
                toast.success("Job saved successfully");
            }
        } catch (err) {
            console.error("Error saving/unsaving job:", err);
            toast.error("Failed to update saved jobs");
        }
    };

    const handleApplyJob = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        // console.log("Handle Apply Job - User:", user);
        // console.log("Handle Apply Job - Is Candidate:", isCandidate());

        if (!user) {
            toast.info("Please login as a candidate to apply for jobs");
            return;
        }

        if (!isCandidate()) {
            toast.info("Only candidates can apply for jobs");
            return;
        }

        if (hasApplied()) {
            toast.info("You have already applied for this job");
            return;
        }

        try {
            setIsApplying(true);
            // console.log(
            //     "Applying to job:",
            //     id
            // );

            const response = await jobsAPI.applyJob(id, {});
            // console.log("Apply job response:", response);

            toast.success("Application submitted successfully");
            fetchJobDetails(); // Refresh job details to update application status
        } catch (err) {
            console.error("Error applying for job:", err);
            toast.error(err.message || "Failed to submit application");
        } finally {
            setIsApplying(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const hasApplied = () => {
        if (!user || !job) return false;

        // Check both id and _id to be safe
        const userId = user.id || user._id;
        if (!userId) return false;

        return job.applicants?.some(
            (applicant) =>
                applicant.candidateId === userId ||
                applicant.candidateId === userId.toString() ||
                applicant.candidateId?.toString() === userId.toString()
        );
    };

    if (loading) {
        return (
            <LoadingSpinner
                fullScreen={true}
                message="Loading job details..."
            />
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <motion.div
                    className="text-center max-w-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-red-50 border border-red-200 rounded-3xl p-8 shadow-2xl">
                        <motion.div
                            className="p-4 bg-red-100 rounded-2xl w-fit mx-auto mb-6"
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3,
                            }}
                        >
                            <Briefcase className="h-12 w-12 text-red-600" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-red-800 mb-4">
                            Job Not Found
                        </h2>
                        <p className="text-red-600 mb-6">{error}</p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/candidate/jobs"
                                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-semibold"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Job Board
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!job) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-6xl mx-auto px-4 py-8 mt-15">
                {/* Modern Back Link */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        to="/candidate/jobs"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Job Board
                    </Link>
                </motion.div>

                {/* Modern Job Header */}
                <motion.div
                    className="glass rounded-3xl p-8 border border-white/20 shadow-2xl mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        {/* Left Content */}
                        <div className="flex-1">
                            {/* Company Logo & Badge */}
                            <motion.div
                                className="flex items-center gap-4 mb-6"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <motion.div
                                    className="relative"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                >
                                    {job.company?.logo ? (
                                        <img
                                            src={job.company.logo}
                                            alt={
                                                job.company?.name ||
                                                "Company Logo"
                                            }
                                            className="h-16 w-16 rounded-2xl shadow-lg border-2 border-white/50 object-cover"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.nextSibling.style.display =
                                                    "flex";
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className={`h-16 w-16 rounded-2xl shadow-lg border-2 border-white/50 bg-gradient-to-br from-blue-100 to-purple-100 ${
                                            job.company?.logo
                                                ? "hidden"
                                                : "flex"
                                        } items-center justify-center`}
                                    >
                                        <Building className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                                        <Star className="h-3 w-3 text-white" />
                                    </div>
                                </motion.div>

                                <div>
                                    <motion.span
                                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold rounded-full border border-blue-200"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {job.type}
                                    </motion.span>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-600 font-medium">
                                                Active Hiring
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Job Title & Company */}
                            <motion.div
                                className="mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                                    {job.title}
                                </h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <Building className="h-5 w-5 text-gray-500" />
                                    <p className="text-xl text-gray-700 font-medium">
                                        {job.company?.name ||
                                            "Company Name Not Provided"}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Job Details Grid */}
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                {/* Location */}
                                <motion.div
                                    className="flex items-center gap-3 bg-white/50 px-4 py-3 rounded-xl backdrop-blur-sm border border-gray-200/50"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                >
                                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                                        <MapPin className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">
                                            Location
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {job.location?.remote
                                                ? "🌐 Remote"
                                                : [
                                                      job.location?.city,
                                                      job.location?.state,
                                                      job.location?.country,
                                                  ]
                                                      .filter(Boolean)
                                                      .join(", ") ||
                                                  "Not specified"}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Salary */}
                                <motion.div
                                    className="flex items-center gap-3 bg-white/50 px-4 py-3 rounded-xl backdrop-blur-sm border border-gray-200/50"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                >
                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                        <IndianRupee className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">
                                            Salary
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {job.salary?.min || job.salary?.max
                                                ? formatSalaryRange(
                                                      job.salary?.min,
                                                      job.salary?.max
                                                  )
                                                : "💰 Competitive"}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Deadline */}
                                <motion.div
                                    className="flex items-center gap-3 bg-white/50 px-4 py-3 rounded-xl backdrop-blur-sm border border-gray-200/50"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                >
                                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                        <Calendar className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">
                                            Deadline
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {job.applicationDeadline
                                                ? formatDate(
                                                      job.applicationDeadline
                                                  )
                                                : "⏰ Open"}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={handleSaveJob}
                                disabled={!user || !isCandidate()}
                                className={`inline-flex items-center justify-center px-4 py-2 rounded-md cursor-pointer ${
                                    isSaved
                                        ? "bg-red-50 text-red-700 border border-red-300 hover:bg-red-100"
                                        : "bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
                                }`}
                            >
                                <Heart
                                    className={`h-4 w-4 mr-2 ${
                                        isSaved ? "fill-current" : ""
                                    }`}
                                />
                                {isSaved ? "Saved" : "Save Job"}
                            </button>
                            {hasApplied() ? (
                                <button
                                    disabled
                                    className="inline-flex items-center justify-center px-4 py-2 bg-green-50 text-green-700 border border-green-300 rounded-md cursor-default"
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Applied
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        if (!user || !isCandidate()) {
                                            toast.info(
                                                "Please login as a candidate to apply"
                                            );
                                            return;
                                        }
                                        handleApplyJob(e);
                                    }}
                                    className={`inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                                        !user || !isCandidate() || isApplying
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    disabled={
                                        !user || !isCandidate() || isApplying
                                    }
                                >
                                    {isApplying ? (
                                        <>
                                            <Loader className="h-4 w-4 animate-spin mr-2" />
                                            Applying...
                                        </>
                                    ) : (
                                        <>
                                            <Briefcase className="h-4 w-4 mr-2" />
                                            Apply Now
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Posted on {formatDate(job.createdAt)}
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Job Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-10 py-10">
                {/* Main Job Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Job Description */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Job Description
                        </h2>
                        <div className="prose max-w-none text-gray-700">
                            {job.description
                                .split("\n")
                                .map((paragraph, index) => (
                                    <p key={index} className="mb-4">
                                        {paragraph}
                                    </p>
                                ))}
                        </div>
                    </div>

                    {/* Skills Required */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl mb-5 font-semibold text-gray-900">
                            Skills Required
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {job.skills && job.skills.length > 0 ? (
                                job.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-600">
                                    No specific skills mentioned
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Apply Section */}
                    {user && isCandidate() && !hasApplied() && (
                        <div
                            id="apply-section"
                            className="bg-white shadow rounded-lg p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Apply for this Job
                            </h2>
                            <form onSubmit={handleApplyJob}>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center cursor-pointer"
                                    disabled={isApplying}
                                >
                                    {isApplying ? (
                                        <>
                                            <Loader className="h-4 w-4 animate-spin mr-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Briefcase className="h-4 w-4 mr-2" />
                                            Submit Application
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Company Info */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Company Information
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Building className="h-5 w-5 text-gray-500 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Company Name
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {job.company?.name || "Not provided"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Globe className="h-5 w-5 text-gray-500 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Website
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {job.company?.website ? (
                                            <a
                                                href={job.company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {job.company.website}
                                            </a>
                                        ) : (
                                            "Not provided"
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Tag className="h-5 w-5 text-gray-500 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Industry
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {job.company?.industry ||
                                            "Not provided"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Users className="h-5 w-5 text-gray-500 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Company Size
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {job.company?.size || "Not provided"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Job Details
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    Job Type
                                </p>
                                <p className="text-sm text-gray-600 capitalize">
                                    {job.type || "Not specified"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    Number of Openings
                                </p>
                                <p className="text-sm text-gray-600">
                                    {job.numberOfOpenings || "1"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    Application Deadline
                                </p>
                                <p className="text-sm text-gray-600">
                                    {formatDate(job.applicationDeadline)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Perks & Benefits */}
                    {(job.perks?.length > 0 || job.benefits?.length > 0) && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Perks & Benefits
                            </h2>

                            {job.perks?.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Perks
                                    </p>
                                    <ul className="space-y-2">
                                        {job.perks.map((perk, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start"
                                            >
                                                <Gift className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                                <span className="text-sm text-gray-600">
                                                    {perk}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {job.benefits?.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Benefits
                                    </p>
                                    <ul className="space-y-2">
                                        {job.benefits.map((benefit, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start"
                                            >
                                                <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                                                <span className="text-sm text-gray-600">
                                                    {benefit}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
