import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/useAuth";

import MobileNavigation from "./MobileNavigation";
import {
    Menu,
    X,
    Briefcase,
    User,
    LogOut,
    Home,
    Info,
    Search,
    Users as UsersIcon,
} from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/");
        setIsOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
                    : "bg-white/90 backdrop-blur-sm"
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Link
                            to="/"
                            className="flex items-center space-x-2 group"
                        >
                            <motion.div
                                className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Briefcase className="h-6 w-6 text-white" />
                            </motion.div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                JobOrbit
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        {[
                            { to: "/", label: "Home", icon: Home },
                            { to: "/about", label: "About", icon: Info },
                        ].map((item) => (
                            <motion.div
                                key={item.to}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to={item.to}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                                        isActive(item.to)
                                            ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                                            : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                    }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}

                        {!user ? (
                            <div className="flex items-center space-x-3">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/candidate/jobs"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                                    >
                                        <Search className="h-4 w-4" />
                                        Browse Jobs
                                    </Link>
                                </motion.div>

                                <div className="flex items-center space-x-2">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            to="/candidate/login"
                                            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                                        >
                                            Login
                                        </Link>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            to="/candidate/signup"
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            Get Started
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link
                                        to={
                                            user.role === "candidate"
                                                ? "/candidate/dashboard"
                                                : "/recruiter/dashboard"
                                        }
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-300"
                                    >
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">
                                            {user.name || user.email}
                                        </span>
                                    </Link>
                                </motion.div>

                                <div className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-xs font-bold">
                                    {user.role}
                                </div>

                                <motion.button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        Logout
                                    </span>
                                </motion.button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-all"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <MobileNavigation
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </motion.nav>
    );
};

export default Navbar;
