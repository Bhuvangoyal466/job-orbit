import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Home,
    ArrowLeft,
    Search,
    Briefcase,
    MapPin,
    RefreshCw,
} from "lucide-react";

const NotFound = () => {
    const floatingAnimation = {
        y: [-20, 20, -20],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        },
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-20"
                    animate={floatingAnimation}
                />
                <motion.div
                    className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-20"
                    animate={{
                        ...floatingAnimation,
                        transition: {
                            ...floatingAnimation.transition,
                            delay: 1,
                        },
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-indigo-200 rounded-full opacity-20"
                    animate={{
                        ...floatingAnimation,
                        transition: {
                            ...floatingAnimation.transition,
                            delay: 2,
                        },
                    }}
                />
            </div>

            <div className="text-center relative z-10">
                {/* 404 Number */}
                <motion.div
                    className="mb-8"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, duration: 1 }}
                >
                    <h1 className="text-9xl md:text-[12rem] font-bold bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        404
                    </h1>
                </motion.div>

                {/* Title and Description */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
                        Looks like this page took a different career path! Don't
                        worry, let's get you back on track to finding your dream
                        job.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Home className="mr-3 h-5 w-5" />
                            Back to Home
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
                        >
                            <ArrowLeft className="mr-3 h-5 w-5" />
                            Go Back
                        </button>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
                        >
                            <RefreshCw className="mr-3 h-5 w-5" />
                            Refresh Page
                        </button>
                    </motion.div>
                </motion.div>

                {/* Popular Pages */}
                <motion.div
                    className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Popular Destinations
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                to: "/candidate/jobs",
                                label: "Browse Jobs",
                                icon: Search,
                                color: "bg-blue-500",
                            },
                            {
                                to: "/candidate/dashboard",
                                label: "Candidate Dashboard",
                                icon: Briefcase,
                                color: "bg-green-500",
                            },
                            {
                                to: "/recruiter/post-job",
                                label: "Post a Job",
                                icon: MapPin,
                                color: "bg-purple-500",
                            },
                            {
                                to: "/about",
                                label: "About Us",
                                icon: Home,
                                color: "bg-orange-500",
                            },
                            {
                                to: "/candidate/signup",
                                label: "Get Started",
                                icon: ArrowLeft,
                                color: "bg-pink-500",
                            },
                            {
                                to: "/recruiter/dashboard",
                                label: "Recruiter Portal",
                                icon: Briefcase,
                                color: "bg-indigo-500",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={item.to}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 1.4 + index * 0.1,
                                    duration: 0.5,
                                }}
                            >
                                <Link
                                    to={item.to}
                                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                                >
                                    <div
                                        className={`${item.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-200`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                                        {item.label}
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Help Section */}
                <motion.div
                    className="mt-8 text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.8 }}
                >
                    <p>
                        Still having trouble? Contact our support team at{" "}
                        <a
                            href="mailto:support@joborbit.com"
                            className="text-blue-600 hover:underline"
                        >
                            support@joborbit.com
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
