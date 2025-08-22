import React, { useState, useEffect, useCallback } from "react";
import { X, Download, FileText, Loader } from "lucide-react";
import { toast } from "react-toastify";
import { recruiterAPI } from "../utils/api";

const ResumeViewer = ({ candidateId, candidateName, isOpen, onClose }) => {
    const [resumeUrl, setResumeUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadResume = useCallback(async () => {
        if (!candidateId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await recruiterAPI.viewResume(candidateId);
            const blob = await response.blob();

            if (blob.type !== "application/pdf") {
                throw new Error("Invalid file format. Expected PDF.");
            }

            const url = URL.createObjectURL(blob);
            setResumeUrl(url);
        } catch (err) {
            console.error("Error loading resume:", err);
            setError(err.message);
            toast.error(err.message || "Failed to load resume");
        } finally {
            setLoading(false);
        }
    }, [candidateId]);

    const handleClose = useCallback(() => {
        if (resumeUrl) {
            URL.revokeObjectURL(resumeUrl);
            setResumeUrl(null);
        }
        setError(null);
        onClose();
    }, [resumeUrl, onClose]);

    useEffect(() => {
        if (isOpen && candidateId) {
            loadResume();
        }

        // Cleanup function to revoke object URL
        return () => {
            if (resumeUrl) {
                URL.revokeObjectURL(resumeUrl);
            }
        };
    }, [isOpen, candidateId, loadResume, resumeUrl]);

    const handleDownload = async () => {
        if (!resumeUrl) return;

        try {
            const response = await recruiterAPI.viewResume(candidateId);
            const blob = await response.blob();

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${candidateName}_Resume.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success("Resume downloaded successfully");
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download resume");
        }
    };

    // Handle escape key press
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-full p-2">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {candidateName}'s Resume
                            </h2>
                            <p className="text-sm text-gray-600">
                                PDF Document Viewer
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {resumeUrl && (
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </button>
                        )}
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                    {loading && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                                <p className="text-gray-600">
                                    Loading resume...
                                </p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="bg-red-100 rounded-full p-3 mx-auto mb-4 w-fit">
                                    <FileText className="h-8 w-8 text-red-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Resume Not Available
                                </h3>
                                <p className="text-gray-600 mb-4">{error}</p>
                                <button
                                    onClick={loadResume}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {resumeUrl && !loading && !error && (
                        <div className="h-full border border-gray-300 rounded-lg overflow-hidden">
                            <iframe
                                src={resumeUrl}
                                title={`${candidateName}'s Resume`}
                                className="w-full h-full"
                                style={{ minHeight: "500px" }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeViewer;
