/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    MapPin,
    Building2,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    RefreshCw,
    User,
    AlertCircle,
    TrendingUp,
    Filter,
    BarChart3,
    Target,
    Award,
    Briefcase,
    ArrowRight,
} from "lucide-react";
import { candidateAPI } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatSalaryRange } from "../../utils/currency";

const ApplicationTracker = () => {
    const [statusFilter, setStatusFilter] = useState("all");
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        applied: 0,
        interviewed: 0,
        hired: 0,
        rejected: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter !== "all") {
                params.status = statusFilter;
            }

            const response = await candidateAPI.getApplications(params);
            setApplications(response.applications || []);
            setStats(
                response.stats || {
                    total: 0,
                    applied: 0,
                    interviewed: 0,
                    hired: 0,
                    rejected: 0,
                }
            );
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to fetch applications");
            setApplications([]);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const getStatusIcon = (status) => {
        switch (status) {
            case "applied":
                return <Clock className="h-5 w-5 text-blue-600" />;
            case "interviewed":
                return <Eye className="h-5 w-5 text-purple-600" />;
            case "hired":
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case "rejected":
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return <Clock className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "applied":
                return "bg-blue-100 text-blue-800";
            case "interviewed":
                return "bg-purple-100 text-purple-800";
            case "hired":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatStatus = (status) => {
        switch (status) {
            case "applied":
                return "Applied";
            case "interviewed":
                return "Interviewed";
            case "hired":
                return "Hired";
            case "rejected":
                return "Rejected";
            default:
                return status;
        }
    };

    if (loading && applications.length === 0) {
        return (
            <LoadingSpinner
                fullScreen={true}
                message="Loading your applications..."
            />
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="space-y-8 pb-12">
                {/* Modern Header */}
                <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mt-15 shadow-2xl border border-white/20"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="p-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg"
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
                                <BarChart3 className="h-8 w-8 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                                    Application Tracker
                                </h1>
                                <p className="text-xl text-gray-600 mt-2">
                                    Monitor your job search progress and
                                    application status
                                </p>
                            </div>
                        </div>

                        <motion.button
                            onClick={fetchApplications}
                            disabled={loading}
                            className="btn-primary flex items-center gap-3 disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <RefreshCw
                                className={`h-5 w-5 ${
                                    loading ? "animate-spin" : ""
                                }`}
                            />
                            Refresh Data
                        </motion.button>
                    </div>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <div>
                            <p className="text-red-800 font-medium">
                                Error loading applications
                            </p>
                            <p className="text-red-600 text-sm">{error}</p>
                            <button
                                onClick={fetchApplications}
                                className="text-red-600 hover:text-red-800 text-sm underline mt-1 cursor-pointer"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )}

                {loading || !stats ? null : (
                    <>
                        {/* Enhanced Stats Overview */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {/* Applied Stats */}
                            <motion.div
                                className="glass p-6 rounded-2xl border border-white/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                                whileHover={{ y: -5 }}
                                data-aos="fade-up"
                                data-aos-delay="100"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium group-hover:text-blue-600 transition-colors">
                                            Applied
                                        </p>
                                        <motion.p
                                            className="text-3xl font-bold text-gray-900 mt-2"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: 0.4,
                                                duration: 0.5,
                                                type: "spring",
                                            }}
                                        >
                                            {stats.applied}
                                        </motion.p>
                                    </div>
                                    <motion.div
                                        className="p-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl"
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 3,
                                        }}
                                    >
                                        <Clock className="h-6 w-6 text-white" />
                                    </motion.div>
                                </div>
                                <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${Math.min(
                                                stats.applied * 10,
                                                100
                                            )}%`,
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            delay: 0.6,
                                        }}
                                    />
                                </div>
                            </motion.div>

                            {/* Interviewed Stats */}
                            <motion.div
                                className="glass p-6 rounded-2xl border border-white/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                                whileHover={{ y: -5 }}
                                data-aos="fade-up"
                                data-aos-delay="200"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium group-hover:text-purple-600 transition-colors">
                                            Interviewed
                                        </p>
                                        <motion.p
                                            className="text-3xl font-bold text-gray-900 mt-2"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: 0.5,
                                                duration: 0.5,
                                                type: "spring",
                                            }}
                                        >
                                            {stats.interviewed}
                                        </motion.p>
                                    </div>
                                    <motion.div
                                        className="p-3 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 2,
                                        }}
                                    >
                                        <Eye className="h-6 w-6 text-white" />
                                    </motion.div>
                                </div>
                                <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-linear-to-r from-purple-500 to-purple-600 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${Math.min(
                                                stats.interviewed * 15,
                                                100
                                            )}%`,
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            delay: 0.7,
                                        }}
                                    />
                                </div>
                            </motion.div>

                            {/* Hired Stats */}
                            <motion.div
                                className="glass p-6 rounded-2xl border border-white/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                                whileHover={{ y: -5 }}
                                data-aos="fade-up"
                                data-aos-delay="300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium group-hover:text-green-600 transition-colors">
                                            Hired
                                        </p>
                                        <motion.p
                                            className="text-3xl font-bold text-gray-900 mt-2"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: 0.6,
                                                duration: 0.5,
                                                type: "spring",
                                            }}
                                        >
                                            {stats.hired}
                                        </motion.p>
                                    </div>
                                    <motion.div
                                        className="p-3 bg-linear-to-br from-green-500 to-green-600 rounded-xl"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    >
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </motion.div>
                                </div>
                                <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-linear-to-r from-green-500 to-green-600 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${Math.min(
                                                stats.hired * 25,
                                                100
                                            )}%`,
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            delay: 0.8,
                                        }}
                                    />
                                </div>
                            </motion.div>

                            {/* Rejected Stats */}
                            <motion.div
                                className="glass p-6 rounded-2xl border border-white/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                                whileHover={{ y: -5 }}
                                data-aos="fade-up"
                                data-aos-delay="400"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium group-hover:text-red-600 transition-colors">
                                            Rejected
                                        </p>
                                        <motion.p
                                            className="text-3xl font-bold text-gray-900 mt-2"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: 0.7,
                                                duration: 0.5,
                                                type: "spring",
                                            }}
                                        >
                                            {stats.rejected}
                                        </motion.p>
                                    </div>
                                    <motion.div
                                        className="p-3 bg-linear-to-br from-red-500 to-red-600 rounded-xl"
                                        animate={{
                                            rotate: [0, -5, 5, 0],
                                            scale: [1, 0.95, 1],
                                        }}
                                        transition={{
                                            duration: 2.5,
                                            repeat: Infinity,
                                            repeatDelay: 4,
                                        }}
                                    >
                                        <XCircle className="h-6 w-6 text-white" />
                                    </motion.div>
                                </div>
                                <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-linear-to-r from-red-500 to-red-600 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${Math.min(
                                                stats.rejected * 20,
                                                100
                                            )}%`,
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            delay: 0.9,
                                        }}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}

                {/* Filters */}
                <div className="bg-white shadow rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700">
                            Filter by status:
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                            disabled={loading}
                        >
                            <option value="all">All Applications</option>
                            <option value="applied">Applied</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Applications List */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            My Applications ({applications.length})
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-6">
                            <div className="animate-pulse space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center space-x-4"
                                    >
                                        <div className="bg-gray-300 rounded h-5 w-5"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                                        </div>
                                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="p-12 text-center">
                            <User className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                No applications found
                            </h3>
                            <p className="mt-2 text-gray-500">
                                {statusFilter === "all"
                                    ? "You haven't applied to any jobs yet."
                                    : `No applications with status "${formatStatus(
                                          statusFilter
                                      )}" found.`}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {applications.map((application) => (
                                <div
                                    key={application.id}
                                    className="p-6 hover:bg-gray-50"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getStatusIcon(
                                                        application.status
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {application.position}
                                                    </h3>
                                                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                        <div className="flex items-center space-x-1">
                                                            <Building2 className="h-4 w-4" />
                                                            <span>
                                                                {
                                                                    application.company
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>
                                                                {
                                                                    application.location
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>
                                                                Applied{" "}
                                                                {new Date(
                                                                    application.appliedDate
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        Salary:{" "}
                                                        {application.salary}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 ml-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                    application.status
                                                )}`}
                                            >
                                                {formatStatus(
                                                    application.status
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationTracker;
