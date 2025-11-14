/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    MapPin,
    DollarSign,
    Clock,
    Filter,
    Heart,
    ExternalLink,
    Loader,
    IndianRupee,
    Briefcase,
    Building2,
    Star,
    TrendingUp,
    Calendar,
    Users,
    Zap,
    ArrowRight,
    SortAsc,
    Grid3X3,
    List,
} from "lucide-react";
import { toast } from "react-toastify";
import { jobsAPI } from "../../utils/api";
import { useAuth } from "../../context/useAuth";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import AdvancedJobSearch from "../../components/AdvancedJobSearch";
import { formatSalaryRange } from "../../utils/currency";

// Import API URL
const API_BASE_URL = "http://localhost:5000/api";

const JobBoard = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("all");
    const [salaryRange, setSalaryRange] = useState("all");
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savedJobIds, setSavedJobIds] = useState(new Set());
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const [sortBy, setSortBy] = useState("saved-first");
    const { user } = useAuth();

    // Fetch jobs from backend
    useEffect(() => {
        fetchJobs();
        if (user) {
            fetchSavedJobs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchJobs = async (filters, isLoadMore = false) => {
        setLoading(true);
        try {
            const currentPage = isLoadMore ? page + 1 : 1;
            if (!isLoadMore) {
                setPage(1);
            }

            const searchFilters = filters || {
                search: searchTerm,
                location,
                type: jobType !== "all" ? jobType : undefined,
                salary: salaryRange !== "all" ? salaryRange : undefined,
                page: currentPage,
                limit: 10,
            };

            // Just use the jobsAPI helper from our utils
            const responseData = await jobsAPI.getJobs(searchFilters);

            // responseData could either be just the jobs array or the full pagination object
            const newJobs = Array.isArray(responseData)
                ? responseData
                : responseData.jobs || [];
            const pages = responseData.totalPages || 1;
            const total = responseData.totalJobs || newJobs.length;

            if (isLoadMore && jobs.length > 0) {
                setJobs([...jobs, ...newJobs]);
            } else {
                setJobs(newJobs);
            }

            if (!isLoadMore) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }

            setPage(currentPage);
            setTotalPages(pages);
            setTotalJobs(total);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError("Failed to load jobs. Please try again later.");
            toast.error("Could not load jobs");
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedJobs = async () => {
        try {
            const savedJobs = await jobsAPI.getSavedJobs();
            const savedIds = new Set(savedJobs.map((job) => job._id));
            setSavedJobIds(savedIds);
        } catch (err) {
            console.error("Failed to fetch saved jobs:", err);
        }
    };

    // Filter jobs based on search criteria
    const filteredJobs = jobs
        .filter((job) => {
            const matchesSearch =
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (job.company?.name &&
                    job.company.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));
            const matchesLocation =
                location === "" ||
                (job.location?.city &&
                    job.location.city
                        .toLowerCase()
                        .includes(location.toLowerCase())) ||
                (job.location?.state &&
                    job.location.state
                        .toLowerCase()
                        .includes(location.toLowerCase())) ||
                (job.location?.country &&
                    job.location.country
                        .toLowerCase()
                        .includes(location.toLowerCase())) ||
                (job.location?.remote &&
                    location.toLowerCase().includes("remote"));
            const matchesType =
                jobType === "all" ||
                job.type.toLowerCase() === jobType.toLowerCase();

            return matchesSearch && matchesLocation && matchesType;
        })
        .sort((a, b) => {
            // Apply sorting based on selected sort option
            switch (sortBy) {
                case "saved-first": {
                    // Sort saved jobs first
                    const aIsSaved = savedJobIds.has(a._id);
                    const bIsSaved = savedJobIds.has(b._id);

                    if (aIsSaved && !bIsSaved) return -1;
                    if (!aIsSaved && bIsSaved) return 1;
                    return new Date(b.createdAt) - new Date(a.createdAt); // Then by most recent
                }

                case "most-recent":
                    return new Date(b.createdAt) - new Date(a.createdAt);

                case "salary-high": {
                    const aSalaryMax = a.salary?.max || 0;
                    const bSalaryMax = b.salary?.max || 0;
                    return bSalaryMax - aSalaryMax;
                }

                case "salary-low": {
                    const aSalaryMin = a.salary?.min || Infinity;
                    const bSalaryMin = b.salary?.min || Infinity;
                    return aSalaryMin - bSalaryMin;
                }

                case "company-az": {
                    const aCompany = (a.company?.name || "").toLowerCase();
                    const bCompany = (b.company?.name || "").toLowerCase();
                    return aCompany.localeCompare(bCompany);
                }

                default:
                    return 0;
            }
        });

    // Handle job application
    const handleApply = async (job) => {
        if (!user) {
            toast.info("Please login to apply for jobs");
            return;
        }

        try {
            await jobsAPI.applyJob(job._id, {});
            toast.success(
                `Applied to "${job.title}" at ${
                    job.company?.name || "Company"
                }!`
            );
            fetchJobs(); // Refresh jobs to update status
        } catch (err) {
            console.error("Failed to apply:", err);
            toast.error("Failed to apply for job. Please try again.");
        }
    };

    // Handle saving a job
    const toggleSave = async (job) => {
        if (!user) {
            toast.info("Please login to save jobs");
            return;
        }

        const isJobSaved = savedJobIds.has(job._id);

        try {
            if (isJobSaved) {
                await jobsAPI.unsaveJob(job._id);
                savedJobIds.delete(job._id);
                setSavedJobIds(new Set(savedJobIds));
                toast.info(`Removed "${job.title}" from saved jobs`);
            } else {
                await jobsAPI.saveJob(job._id);
                setSavedJobIds(new Set(savedJobIds.add(job._id)));
                toast.success(`"${job.title}" saved to your list!`);
            }
        } catch (err) {
            console.error("Failed to toggle job save:", err);
            toast.error("Failed to update saved jobs. Please try again.");
        }
    };

    if (loading && jobs.length === 0) {
        return (
            <LoadingSpinner
                fullScreen={true}
                message="Loading amazing job opportunities..."
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="space-y-8 pb-12">
                    {/* Modern Header */}
                    <motion.div
                        className="bg-white/80 backdrop-blur-sm mt-15 rounded-3xl p-8 shadow-2xl border border-white/20 mb-8"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="text-center max-w-4xl mx-auto">
                            <motion.div
                                className="flex items-center justify-center gap-3 mb-6"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <motion.div
                                    className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg"
                                    animate={{
                                        rotate: [0, 5, -5, 0],
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                    }}
                                >
                                    <Briefcase className="h-8 w-8 text-white" />
                                </motion.div>
                                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                                    Job Board
                                </h1>
                            </motion.div>

                            <motion.p
                                className="text-xl text-gray-600 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                Discover your next career opportunity and join
                                amazing companies
                            </motion.p>

                            {/* Stats Row */}
                            <motion.div
                                className="flex justify-center items-center gap-8 text-sm"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                    <span className="text-blue-700 font-medium">
                                        {totalJobs} Total Jobs
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                                    <Users className="h-4 w-4 text-green-600" />
                                    <span className="text-green-700 font-medium">
                                        Top Companies
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                                    <Zap className="h-4 w-4 text-purple-600" />
                                    <span className="text-purple-700 font-medium">
                                        Fresh Opportunities
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Modern Search and Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <AdvancedJobSearch
                            onSearch={fetchJobs}
                            onFilterChange={(filters) => {
                                setSearchTerm(filters.search || "");
                                setLocation(filters.location || "");
                                setJobType(filters.type || "all");
                                setSalaryRange(filters.salary || "all");
                            }}
                            filters={{
                                search: searchTerm,
                                location: location,
                                type: jobType,
                                salary: salaryRange,
                            }}
                        />
                    </motion.div>
                </div>

                {/* Results Header */}
                <motion.div
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">
                                {filteredJobs.length} job
                                {filteredJobs.length !== 1 ? "s" : ""} found
                            </span>
                        </div>
                        {user && savedJobIds.size > 0 && (
                            <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full">
                                <Heart className="h-4 w-4 text-red-500 fill-current" />
                                <span className="text-sm font-medium text-red-700">
                                    {savedJobIds.size} saved
                                </span>
                            </div>
                        )}
                    </div>

                    {filteredJobs.length > 0 && (
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <SortAsc className="h-4 w-4 text-gray-500" />
                                Sort by:
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/80 backdrop-blur-sm cursor-pointer"
                            >
                                <option value="saved-first">
                                    Saved Jobs First
                                </option>
                                <option value="most-recent">Most Recent</option>
                                <option value="salary-high">
                                    Salary: High to Low
                                </option>
                                <option value="salary-low">
                                    Salary: Low to High
                                </option>
                                <option value="company-az">Company A-Z</option>
                            </select>
                        </div>
                    )}
                </motion.div>

                {/* Job Listings */}
                <AnimatePresence mode="wait">
                    {loading && jobs.length === 0 ? (
                        <LoadingSpinner
                            fullScreen={false}
                            message="Finding perfect jobs for you..."
                        />
                    ) : error ? (
                        <motion.div
                            className="text-center py-20"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                                <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
                                    <ExternalLink className="h-8 w-8 text-red-600" />
                                </div>
                                <p className="text-red-700 text-lg font-medium mb-4">
                                    {error}
                                </p>
                                <motion.button
                                    onClick={fetchJobs}
                                    className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-semibold"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Try Again
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : filteredJobs.length === 0 ? (
                        <motion.div
                            className="text-center py-20"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 max-w-md mx-auto">
                                <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                                    <Search className="h-8 w-8 text-blue-600" />
                                </div>
                                <p className="text-blue-700 text-lg font-medium mb-2">
                                    No jobs found
                                </p>
                                <p className="text-blue-600 mb-4">
                                    Try adjusting your search criteria
                                </p>
                                <motion.button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setLocation("");
                                        setJobType("all");
                                    }}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Clear Filters
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:gap-8">
                            {filteredJobs.map((job, index) => (
                                <div
                                    key={job._id}
                                    className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-blue-200/50"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                                                            {job.title}
                                                        </h3>
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full whitespace-nowrap">
                                                            {job.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {job.company?.logo ? (
                                                        <img
                                                            className="h-12 w-12 lg:h-16 lg:w-16 object-contain rounded-lg bg-gray-50 p-2"
                                                            src={
                                                                job.company.logo
                                                            }
                                                            alt={`${job.company?.name} logo`}
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 lg:h-16 lg:w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <Building2 className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-lg lg:text-xl font-semibold text-gray-800 mb-3">
                                                    {job.company?.name ||
                                                        "Company"}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm lg:text-base text-gray-600 mb-4">
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>
                                                        {job.location?.remote
                                                            ? "Remote"
                                                            : [
                                                                  job.location
                                                                      ?.city,
                                                                  job.location
                                                                      ?.state,
                                                                  job.location
                                                                      ?.country,
                                                              ]
                                                                  .filter(
                                                                      Boolean
                                                                  )
                                                                  .join(", ") ||
                                                              "Location not specified"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <IndianRupee className="h-4 w-4" />
                                                    <span>
                                                        {formatSalaryRange(
                                                            job.salary?.min,
                                                            job.salary?.max
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>
                                                        {new Date(
                                                            job.createdAt
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 mb-4">
                                                {job.description.length > 200
                                                    ? `${job.description.substring(
                                                          0,
                                                          200
                                                      )}...`
                                                    : job.description}
                                            </p>

                                            {/* Skills */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {job.skills.map(
                                                    (skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                                        >
                                                            {skill}
                                                        </span>
                                                    )
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-100">
                                                <button
                                                    onClick={() =>
                                                        handleApply(job)
                                                    }
                                                    className="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium cursor-pointer"
                                                    disabled={!user}
                                                >
                                                    Apply Now
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        toggleSave(job)
                                                    }
                                                    className={`flex-1 sm:flex-none px-6 py-3 rounded-xl border-2 transition-all duration-200 font-medium cursor-pointer ${
                                                        savedJobIds.has(job._id)
                                                            ? "border-red-300 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400"
                                                            : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                                    }`}
                                                    disabled={!user}
                                                >
                                                    <Heart
                                                        className={`h-4 w-4 inline mr-1 ${
                                                            savedJobIds.has(
                                                                job._id
                                                            )
                                                                ? "fill-current"
                                                                : ""
                                                        }`}
                                                    />
                                                    {savedJobIds.has(job._id)
                                                        ? "Saved"
                                                        : "Save"}
                                                </button>
                                                <Link
                                                    to={`/jobs/${job._id}`}
                                                    className="text-blue-600 hover:text-blue-500"
                                                >
                                                    <ExternalLink className="h-4 w-4 inline mr-1" />
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {/* Load More */}
                {filteredJobs.length > 0 && (
                    <div className="text-center">
                        <button
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 cursor-pointer"
                            onClick={() => fetchJobs(null, true)}
                            disabled={loading || page >= totalPages}
                        >
                            {loading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin inline mr-2" />
                                    Loading...
                                </>
                            ) : page >= totalPages ? (
                                "No More Jobs"
                            ) : (
                                "Load More Jobs"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobBoard;
