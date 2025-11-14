import React, { Component } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });

        // Log error to console or external service
        console.error("Error Boundary caught an error:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 0.2,
                                type: "spring",
                                stiffness: 200,
                            }}
                            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <AlertTriangle className="h-10 w-10 text-red-600" />
                        </motion.div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-gray-600 mb-6">
                            We're sorry for the inconvenience. An unexpected
                            error has occurred. Please try refreshing the page
                            or contact support if the problem persists.
                        </p>

                        {import.meta.env.DEV && (
                            <details className="text-left bg-gray-50 rounded-lg p-4 mb-6">
                                <summary className="font-medium text-gray-700 cursor-pointer mb-2">
                                    Error Details (Development Mode)
                                </summary>
                                <pre className="text-sm text-red-600 overflow-auto">
                                    {this.state.error &&
                                        this.state.error.toString()}
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <motion.button
                                onClick={this.handleRetry}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </motion.button>

                            <motion.button
                                onClick={() => (window.location.href = "/")}
                                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Home className="h-4 w-4" />
                                Go Home
                            </motion.button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-3">
                                Need help? Contact our support team
                            </p>
                            <a
                                href="mailto:support@joborbit.com"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <Mail className="h-4 w-4" />
                                support@joborbit.com
                            </a>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
