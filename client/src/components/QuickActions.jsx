import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Upload,
    Briefcase,
    Calendar,
    Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const QuickActions = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();

    if (!user) return null;

    const candidateActions = [
        {
            icon: Search,
            label: "Browse Jobs",
            href: "/candidate/jobs",
            color: "bg-blue-500 hover:bg-blue-600",
        },
        {
            icon: Upload,
            label: "Upload PDF Resume",
            href: "/candidate/upload-resume",
            color: "bg-green-500 hover:bg-green-600",
        },
        {
            icon: Briefcase,
            label: "My Applications",
            href: "/candidate/applications",
            color: "bg-purple-500 hover:bg-purple-600",
        },
        {
            icon: Calendar,
            label: "Interviews",
            href: "/candidate/interviews",
            color: "bg-orange-500 hover:bg-orange-600",
        },
    ];

    const recruiterActions = [
        {
            icon: Plus,
            label: "Post New Job",
            href: "/recruiter/post-job",
            color: "bg-blue-500 hover:bg-blue-600",
        },
        {
            icon: Briefcase,
            label: "Manage Jobs",
            href: "/recruiter/dashboard",
            color: "bg-green-500 hover:bg-green-600",
        },
        {
            icon: Settings,
            label: "Manage Applicants",
            href: "/recruiter/applicants",
            color: "bg-purple-500 hover:bg-purple-600",
        },
        {
            icon: Calendar,
            label: "Interviews",
            href: "/recruiter/interviews",
            color: "bg-orange-500 hover:bg-orange-600",
        },
    ];

    const actions =
        user.role === "candidate" ? candidateActions : recruiterActions;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 right-0 space-y-3"
                    >
                        {actions.map((action, index) => (
                            <motion.div
                                key={action.href}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={action.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 ${action.color} text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap`}
                                >
                                    <action.icon className="h-5 w-5" />
                                    <span className="text-sm font-medium">
                                        {action.label}
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: isOpen ? 45 : 0 }}
            >
                <Plus className="h-6 w-6" />
            </motion.button>
        </div>
    );
};

export default QuickActions;
