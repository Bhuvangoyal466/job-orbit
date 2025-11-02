/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Users,
    BarChart3,
    Calendar,
    AlertCircle,
    Briefcase,
    TrendingUp,
    Clock,
} from "lucide-react";
import { recruiterAPI } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const RecruiterDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await recruiterAPI.getDashboard();
            setDashboardData(response.data.stats);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to fetch dashboard stats");
        } finally {
            setLoading(false);
        }
    };

    const getStatsArray = () => {
        if (!dashboardData) return [];

        return [
            {
                name: "Active Jobs",
                value: dashboardData.activeJobs?.toString() || "0",
                icon: BarChart3,
                color: "bg-blue-500",
            },
            {
                name: "Total Applications",
                value:
                    dashboardData.totalApplicationsReceived?.toString() || "0",
                icon: Users,
                color: "bg-green-500",
            },
            {
                name: "Jobs Posted",
                value: dashboardData.totalJobsPosted?.toString() || "0",
                icon: Calendar,
                color: "bg-yellow-500",
            },
            {
                name: "Total Hires",
                value: dashboardData.totalHires?.toString() || "0",
                icon: Plus,
                color: "bg-purple-500",
            },
        ];
    };

    const stats = getStatsArray();

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Enhanced Header Section */}
                <motion.div
                    className="bg-white/80 backdrop-blur-sm mt-15 rounded-2xl shadow-xl border border-white/20 p-8"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                >
                                    <Briefcase className="h-8 w-8 text-white" />
                                </motion.div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                                        Recruiter Dashboard
                                    </h1>
                                    <p className="text-gray-600 text-lg mt-1">
                                        Manage your job postings and track
                                        applications
                                    </p>
                                </div>
                            </div>
                        </div>
                        <motion.button
                            onClick={fetchDashboardStats}
                            disabled={loading}
                            className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex items-center gap-2">
                                <motion.div
                                    animate={{ rotate: loading ? 360 : 0 }}
                                    transition={{
                                        duration: 1,
                                        repeat: loading ? Infinity : 0,
                                        ease: "linear",
                                    }}
                                >
                                    <TrendingUp className="h-5 w-5" />
                                </motion.div>
                                <span>Refresh Data</span>
                            </div>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Enhanced Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-start gap-4">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                                </motion.div>
                                <div className="flex-1">
                                    <p className="text-red-800 font-semibold text-lg">
                                        Unable to load dashboard data
                                    </p>
                                    <p className="text-red-600 mt-1">{error}</p>
                                    <motion.button
                                        onClick={fetchDashboardStats}
                                        className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors duration-200"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Try Again
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Enhanced Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="bg-white/60 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-white/20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                            >
                                <div className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="animate-pulse">
                                            <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-4 rounded-xl h-14 w-14"></div>
                                        </div>
                                        <div className="flex-1 space-y-3 animate-pulse">
                                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                                            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    /* Enhanced Stats Grid */
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.name}
                                    className="group bg-white/60 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="p-6 relative overflow-hidden">
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="relative flex items-center justify-between">
                                            <div className="flex-1">
                                                <dt className="text-sm font-medium text-gray-600 mb-2">
                                                    {stat.name}
                                                </dt>
                                                <dd className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                                    {stat.value}
                                                </dd>
                                            </div>
                                            <motion.div
                                                className={`p-4 rounded-xl bg-gradient-to-br ${
                                                    index === 0
                                                        ? "from-blue-500 to-blue-600"
                                                        : index === 1
                                                        ? "from-green-500 to-green-600"
                                                        : index === 2
                                                        ? "from-yellow-500 to-orange-500"
                                                        : "from-purple-500 to-purple-600"
                                                } shadow-lg group-hover:shadow-xl`}
                                                whileHover={{
                                                    rotate: 10,
                                                    scale: 1.1,
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                }}
                                            >
                                                <Icon className="h-8 w-8 text-white" />
                                            </motion.div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <motion.div
                                                className={`h-full rounded-full bg-gradient-to-r ${
                                                    index === 0
                                                        ? "from-blue-400 to-blue-500"
                                                        : index === 1
                                                        ? "from-green-400 to-green-500"
                                                        : index === 2
                                                        ? "from-yellow-400 to-orange-400"
                                                        : "from-purple-400 to-purple-500"
                                                }`}
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${Math.min(
                                                        parseInt(stat.value) *
                                                            2,
                                                        100
                                                    )}%`,
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    delay: index * 0.2 + 0.5,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Enhanced Quick Actions */}
                <motion.div
                    className="bg-white/60 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3,
                            }}
                        >
                            <Clock className="h-6 w-6 text-blue-600" />
                        </motion.div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                            Quick Actions
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Link to="/recruiter/post-job">
                            <motion.div
                                className="group relative overflow-hidden p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 rounded-2xl hover:border-blue-400 transition-all duration-300 cursor-pointer"
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative">
                                    <motion.div
                                        className="inline-flex p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl mb-4"
                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                        }}
                                    >
                                        <Plus className="h-8 w-8 text-white" />
                                    </motion.div>

                                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                                        Post New Job
                                    </h3>
                                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                                        Create and publish a new job listing to
                                        attract top candidates
                                    </p>
                                </div>
                            </motion.div>
                        </Link>

                        <Link to="/recruiter/applicants">
                            <motion.div
                                className="group relative overflow-hidden p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-dashed border-green-200 rounded-2xl hover:border-green-400 transition-all duration-300 cursor-pointer"
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative">
                                    <motion.div
                                        className="inline-flex p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg group-hover:shadow-xl mb-4"
                                        whileHover={{ rotate: -10, scale: 1.1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                        }}
                                    >
                                        <Users className="h-8 w-8 text-white" />
                                    </motion.div>

                                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-green-600 transition-colors">
                                        Review Applicants
                                    </h3>
                                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                                        Manage applications and connect with
                                        potential hires
                                    </p>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default RecruiterDashboard;
