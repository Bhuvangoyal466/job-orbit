import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
    BarChart3,
    FileText,
    Calendar,
    Search,
    Upload,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader,
    TrendingUp,
    Target,
    Zap,
    Award,
    ArrowRight,
    Plus,
    Eye,
} from "lucide-react";
import { jobsAPI } from "../../utils/api";
import { useAuth } from "../../context/useAuth";
import LoadingSpinner from "../../components/LoadingSpinner";

const CandidateDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        {
            name: "Applications Sent",
            value: "0",
            icon: FileText,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700",
        },
        {
            name: "Interviews Scheduled",
            value: "0",
            icon: Calendar,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            textColor: "text-green-700",
        },
        {
            name: "Saved Jobs",
            value: "0",
            icon: BarChart3,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            textColor: "text-orange-700",
        },
        {
            name: "Profile Views",
            value: "0",
            icon: Eye,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-700",
        },
    ]);

    const [recentApplications, setRecentApplications] = useState([]);
    const [, setSavedJobs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch job applications
                const applicationsResponse = await jobsAPI.getApplications();

                // Extract applications array from response
                const applications =
                    applicationsResponse.applications ||
                    applicationsResponse ||
                    [];

                // Ensure applications is an array
                if (!Array.isArray(applications)) {
                    console.error(
                        "Applications is not an array:",
                        applications
                    );
                    throw new Error("Invalid applications data format");
                }

                // Fetch saved jobs
                const saved = await jobsAPI.getSavedJobs();
                setSavedJobs(saved);

                // Map the applications to the format expected by the UI
                const formattedApplications = applications.map((app) => ({
                    id: app.id,
                    jobId: app.jobId,
                    company: app.company,
                    position: app.position,
                    status: mapStatusToUI(app.status),
                    date: app.appliedDate,
                    statusColor: getStatusColor(app.status),
                }));

                setRecentApplications(formattedApplications);

                // Update stats
                setStats([
                    {
                        name: "Applications Sent",
                        value: applications.length.toString(),
                        icon: FileText,
                        color: "bg-blue-500",
                    },
                    {
                        name: "Interviews",
                        value: applications
                            .filter((app) => app.status === "interviewed")
                            .length.toString(),
                        icon: Calendar,
                        color: "bg-green-500",
                    },
                    {
                        name: "Saved Jobs",
                        value: saved.length.toString(),
                        icon: BarChart3,
                        color: "bg-orange-500",
                    },
                ]);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError(
                    "Failed to load dashboard data. Please try again later."
                );
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper function to map API status to UI status
    const mapStatusToUI = (status) => {
        switch (status) {
            case "applied":
                return "Applied";
            case "under-review":
                return "Interviewing";
            case "interviewed":
                return "Interviewing";
            case "hired":
                return "Offer";
            case "rejected":
                return "Rejected";
            default:
                return "Applied";
        }
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "applied":
                return "bg-blue-100 text-blue-800";
            case "under-review":
            case "interviewed":
                return "bg-yellow-100 text-yellow-800";
            case "hired":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    const quickActions = [
        {
            title: "Browse Jobs",
            description: "Discover new opportunities",
            icon: Search,
            link: "/candidate/jobs",
            color: "bg-blue-500",
        },
        {
            title: "Profile Information",
            description: "Update your profile & upload PDF resume",
            icon: Upload,
            link: "/candidate/upload-resume",
            color: "bg-green-500",
        },
        {
            title: "Applications",
            description: "Track your progress",
            icon: BarChart3,
            link: "/candidate/applications",
            color: "bg-orange-500",
        },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case "Applied":
                return <Clock className="h-4 w-4" />;
            case "Interviewing":
                return <AlertCircle className="h-4 w-4" />;
            case "Offer":
                return <CheckCircle className="h-4 w-4" />;
            case "Rejected":
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <LoadingSpinner
                fullScreen={true}
                message="Loading your dashboard..."
            />
        );
    }

    return (
        <div className="w-full min-h-full bg-gradient-to-br from-blue-50 to-indigo-100 -m-6 p-6">
            <div className="space-y-6 pb-12">
                {/* Header */}
                <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mt-15 shadow-xl border border-white/20"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                Dashboard
                            </h1>
                            <p className="text-lg text-gray-600">
                                Welcome back
                                {user ? `, ${user.firstName || user.name}` : ""}
                                ! 🚀 Here's your job search overview.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/candidate/jobs"
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <Search className="h-5 w-5" />
                                    Browse Jobs
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/candidate/upload-resume"
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <Upload className="h-5 w-5" />
                                    Profile Info
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {error ? (
                    <motion.div
                        className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center shadow-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-700 text-lg font-medium mb-4">
                            {error}
                        </p>
                        <motion.button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Try again
                        </motion.button>
                    </motion.div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={stat.name}
                                        className="glass p-4 rounded-xl border border-white/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer overflow-hidden"
                                        data-aos="fade-up"
                                        data-aos-delay={100 * (index + 1)}
                                        whileHover={{ y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.1 * index,
                                            duration: 0.5,
                                        }}
                                    >
                                        {/* Background gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="relative flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-gray-600 text-sm font-medium group-hover:text-blue-600 transition-colors duration-300">
                                                    {stat.name}
                                                </p>
                                                <motion.p
                                                    className="text-2xl font-bold text-gray-900 mt-1"
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.5,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    transition={{
                                                        delay:
                                                            0.3 + 0.1 * index,
                                                        duration: 0.5,
                                                        type: "spring",
                                                    }}
                                                >
                                                    {stat.value}
                                                </motion.p>
                                            </div>
                                            <motion.div
                                                className="p-3 rounded-xl relative overflow-hidden"
                                                style={{
                                                    background: `linear-gradient(135deg, ${
                                                        stat.color ===
                                                        "bg-blue-500"
                                                            ? "#3B82F6, #1E40AF"
                                                            : stat.color ===
                                                              "bg-green-500"
                                                            ? "#10B981, #047857"
                                                            : "#F59E0B, #D97706"
                                                    })`,
                                                }}
                                                whileHover={{
                                                    rotate: 5,
                                                    scale: 1.1,
                                                }}
                                                animate={{
                                                    rotate: [0, 2, -2, 0],
                                                    scale: [1, 1.05, 1],
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    repeatDelay: 2,
                                                    ease: "easeInOut",
                                                }}
                                            >
                                                {/* Floating particles effect */}
                                                <motion.div
                                                    className="absolute inset-0 opacity-20"
                                                    animate={{
                                                        background: [
                                                            "radial-gradient(circle at 20% 80%, white 1px, transparent 1px)",
                                                            "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                                                            "radial-gradient(circle at 40% 40%, white 1px, transparent 1px)",
                                                        ],
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                    }}
                                                />
                                                <Icon className="h-6 w-6 text-white relative z-10" />
                                            </motion.div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{
                                                    background: `linear-gradient(90deg, ${
                                                        stat.color ===
                                                        "bg-blue-500"
                                                            ? "#3B82F6, #60A5FA"
                                                            : stat.color ===
                                                              "bg-green-500"
                                                            ? "#10B981, #34D399"
                                                            : "#F59E0B, #FBBF24"
                                                    })`,
                                                }}
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${Math.min(
                                                        parseInt(stat.value) *
                                                            10,
                                                        100
                                                    )}%`,
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    delay: 0.5 + 0.1 * index,
                                                    ease: "easeOut",
                                                }}
                                            />
                                        </div>

                                        {/* Hover effect line */}
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                                            initial={{ width: 0 }}
                                            whileHover={{ width: "100%" }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </>
                )}

                {!loading && !error && (
                    /* Quick Actions */
                    <motion.div
                        className="glass p-6 rounded-2xl border border-white/20 shadow-xl"
                        data-aos="fade-up"
                        data-aos-delay="400"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <motion.div
                                className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatDelay: 2,
                                }}
                            >
                                <Zap className="h-5 w-5 text-white" />
                            </motion.div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Quick Actions
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <motion.div
                                        key={action.title}
                                        whileHover={{ scale: 1.03, y: -3 }}
                                        whileTap={{ scale: 0.97 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.7 + 0.1 * index,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Link
                                            to={action.link}
                                            className="block p-4 border border-gray-200/50 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 group bg-white/50 backdrop-blur-sm relative overflow-hidden"
                                        >
                                            {/* Background hover effect */}
                                            <motion.div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            <div className="relative flex items-start space-x-3">
                                                <motion.div
                                                    className="p-2 rounded-lg relative overflow-hidden"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${
                                                            action.color ===
                                                            "bg-blue-500"
                                                                ? "#3B82F6, #1E40AF"
                                                                : action.color ===
                                                                  "bg-green-500"
                                                                ? "#10B981, #047857"
                                                                : "#F59E0B, #D97706"
                                                        })`,
                                                    }}
                                                    whileHover={{
                                                        rotate: 10,
                                                        scale: 1.1,
                                                    }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                    }}
                                                >
                                                    {/* Shimmer effect */}
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                                                        animate={{
                                                            translateX: [
                                                                "100%",
                                                                "100%",
                                                                "-100%",
                                                                "-100%",
                                                            ],
                                                        }}
                                                        transition={{
                                                            duration: 3,
                                                            repeat: Infinity,
                                                            repeatDelay: 2,
                                                        }}
                                                    />
                                                    <Icon className="h-5 w-5 text-white relative z-10" />
                                                </motion.div>
                                                <div className="flex-1">
                                                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-1">
                                                        {action.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                                                        {action.description}
                                                    </p>

                                                    {/* Arrow indicator */}
                                                    <motion.div
                                                        className="flex items-center mt-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                        whileHover={{ x: 5 }}
                                                    >
                                                        <span className="text-sm font-medium mr-1">
                                                            Get started
                                                        </span>
                                                        <ArrowRight className="h-4 w-4" />
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {!loading && !error && (
                    <>
                        {/* Recent Applications */}
                        <div className="glass rounded-xl border border-white/20 shadow-lg">
                            <div className="px-4 py-3 border-b border-gray-200/50 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Recent Applications
                                </h2>
                                <Link
                                    to="/candidate/applications"
                                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentApplications.length === 0 ? (
                                    <div className="px-4 py-6 text-center">
                                        <p className="text-gray-500 mb-3">
                                            You haven't applied to any jobs yet.
                                        </p>
                                        <Link
                                            to="/candidate/jobs"
                                            className="inline-flex items-center text-blue-600 hover:underline"
                                        >
                                            <Search className="h-4 w-4 mr-1" />
                                            Browse jobs
                                        </Link>
                                    </div>
                                ) : (
                                    recentApplications
                                        .slice(0, 5)
                                        .map((application) => (
                                            <div
                                                key={application.id}
                                                className="px-4 py-3 hover:bg-white/30"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="text-sm font-medium text-gray-900">
                                                            {
                                                                application.position
                                                            }
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {
                                                                application.company
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            Applied on{" "}
                                                            {new Date(
                                                                application.date
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${application.statusColor}`}
                                                        >
                                                            {getStatusIcon(
                                                                application.status
                                                            )}
                                                            <span className="ml-1">
                                                                {
                                                                    application.status
                                                                }
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CandidateDashboard;
