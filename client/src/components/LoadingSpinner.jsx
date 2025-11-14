import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Loader } from "lucide-react";

const LoadingSpinner = ({
    size = "md",
    message = "Loading...",
    fullScreen = false,
    type = "default",
}) => {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24",
    };

    const containerClasses = fullScreen
        ? "fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50"
        : "flex items-center justify-center p-8";

    if (type === "dots") {
        return (
            <div className={containerClasses}>
                <div className="text-center">
                    <div className="flex space-x-1 justify-center mb-4">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                                animate={{
                                    y: ["0%", "-100%", "0%"],
                                    scale: [1, 0.8, 1],
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>
                    {message && (
                        <motion.p
                            className="text-gray-600 font-medium"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            {message}
                        </motion.p>
                    )}
                </div>
            </div>
        );
    }

    if (type === "pulse") {
        return (
            <div className={containerClasses}>
                <div className="text-center">
                    <motion.div
                        className={`${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4`}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    {message && (
                        <motion.p
                            className="text-gray-600 font-medium"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            {message}
                        </motion.p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={containerClasses}>
            <div className="text-center">
                <motion.div
                    className="relative mx-auto mb-4"
                    style={{ width: "fit-content" }}
                >
                    {/* Outer spinning ring */}
                    <motion.div
                        className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full relative`}
                        style={{
                            background: `conic-gradient(from 0deg, transparent, transparent, #3b82f6, #8b5cf6)`,
                            borderRadius: "50%",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    {/* Inner pulsing icon */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-white rounded-full m-1"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Briefcase className="w-1/3 h-1/3 text-blue-600" />
                    </motion.div>
                </motion.div>

                {message && (
                    <motion.p
                        className="text-gray-600 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {message}
                    </motion.p>
                )}
            </div>
        </div>
    );
};

export default LoadingSpinner;
