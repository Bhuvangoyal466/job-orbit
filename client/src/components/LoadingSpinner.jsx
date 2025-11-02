import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const LoadingSpinner = ({
    size = "md",
    message = "Loading...",
    fullScreen = false,
}) => {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24",
    };

    const containerClasses = fullScreen
        ? "fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
        : "flex items-center justify-center p-8";

    return (
        <div className={containerClasses}>
            <div className="text-center">
                <motion.div
                    className="relative mx-auto mb-4"
                    style={{ width: "fit-content" }}
                >
                    {/* Outer spinning ring */}
                    <motion.div
                        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full`}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    {/* Inner pulsing icon */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Briefcase className="w-1/2 h-1/2 text-blue-600" />
                    </motion.div>
                </motion.div>

                <motion.p
                    className="text-gray-600 font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    {message}
                </motion.p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
