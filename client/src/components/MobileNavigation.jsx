import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Home,
    Briefcase,
    User,
    Search,
    Calendar,
    Settings,
    LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const MobileNavigation = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
        onClose();
    };

    const candidateNavItems = [
        { to: "/candidate/dashboard", label: "Dashboard", icon: Home },
        { to: "/candidate/jobs", label: "Browse Jobs", icon: Search },
        {
            to: "/candidate/applications",
            label: "My Applications",
            icon: Briefcase,
        },
        { to: "/candidate/interviews", label: "Interviews", icon: Calendar },
        { to: "/candidate/upload-resume", label: "Upload Resume", icon: User },
    ];

    const recruiterNavItems = [
        { to: "/recruiter/dashboard", label: "Dashboard", icon: Home },
        { to: "/recruiter/post-job", label: "Post Job", icon: Briefcase },
        { to: "/recruiter/applicants", label: "Manage Applicants", icon: User },
        { to: "/recruiter/interviews", label: "Interviews", icon: Calendar },
    ];

    const navItems = user
        ? user.role === "candidate"
            ? candidateNavItems
            : recruiterNavItems
        : [];

    const isActive = (path) => location.pathname === path;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
                        onClick={onClose}
                    />

                    {/* Navigation Panel */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 200,
                        }}
                        className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Briefcase className="h-6 w-6" />
                                    </div>
                                    <span className="text-xl font-bold">
                                        JobOrbit
                                    </span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {user && (
                                <div className="flex items-center space-x-3 pt-4 border-t border-white/20">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {user.name || user.email}
                                        </p>
                                        <p className="text-blue-100 text-sm capitalize">
                                            {user.role}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Items */}
                        <div className="flex-1 overflow-y-auto py-4">
                            {user ? (
                                <div className="space-y-2 px-4">
                                    {navItems.map((item, index) => (
                                        <motion.div
                                            key={item.to}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link
                                                to={item.to}
                                                onClick={onClose}
                                                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                                                    isActive(item.to)
                                                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-4 border-blue-600"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                            >
                                                <item.icon
                                                    className={`h-5 w-5 ${
                                                        isActive(item.to)
                                                            ? "text-blue-600"
                                                            : "text-gray-500"
                                                    }`}
                                                />
                                                <span className="font-medium">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2 px-4">
                                    <Link
                                        to="/"
                                        onClick={onClose}
                                        className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Home className="h-5 w-5 text-gray-500" />
                                        <span className="font-medium">
                                            Home
                                        </span>
                                    </Link>
                                    <Link
                                        to="/about"
                                        onClick={onClose}
                                        className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Settings className="h-5 w-5 text-gray-500" />
                                        <span className="font-medium">
                                            About
                                        </span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 p-4">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        to="/candidate/login"
                                        onClick={onClose}
                                        className="block w-full text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/candidate/signup"
                                        onClick={onClose}
                                        className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileNavigation;
