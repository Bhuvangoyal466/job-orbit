import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

// Initialize AOS animations
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
    useEffect(() => {
        // Initialize AOS animations
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
        });

        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = "smooth";

        return () => {
            document.documentElement.style.scrollBehavior = "auto";
        };
    }, []);

    return (
        <AuthProvider>
            <Router>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen"
                >
                    <AppRoutes />

                    {/* Modern Toast Container */}
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                        toastClassName="backdrop-blur-sm bg-white/90 shadow-2xl border border-gray-200 rounded-xl"
                        bodyClassName="text-gray-700 font-medium"
                        progressClassName="bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                </motion.div>
            </Router>
        </AuthProvider>
    );
}

export default App;
