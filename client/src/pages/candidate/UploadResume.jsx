import React, { useState } from "react";
import { Upload, FileText, Check, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

const UploadResume = () => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [parsing, setParsing] = useState(false);
    const [parsedData, setParsedData] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = async (file) => {
        setUploadedFile(file);
        setParsing(true);

        // Simulate parsing
        setTimeout(() => {
            setParsedData({
                name: "John Doe",
                email: "john.doe@email.com",
                phone: "+1 (555) 123-4567",
                skills: ["React", "JavaScript", "Node.js", "MongoDB"],
                experience: [
                    {
                        title: "Frontend Developer",
                        company: "Tech Corp",
                        duration: "2022 - Present",
                    },
                    {
                        title: "Junior Developer",
                        company: "StartupXYZ",
                        duration: "2020 - 2022",
                    },
                ],
            });
            setParsing(false);
        }, 2000);
    };

    const handleSaveResumeData = () => {
        toast.success("Resume data saved successfully!");
    };

    const handleEditInformation = () => {
        toast.info("Edit mode enabled. You can now modify the information.");
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Upload Resume
                </h1>
                <p className="text-gray-600 mt-2">
                    Upload your resume for AI-powered parsing and analysis
                </p>
            </div>

            {/* Upload Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center ${
                        dragActive
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-300"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                        {uploadedFile
                            ? uploadedFile.name
                            : "Drop your resume here"}
                    </p>
                    <p className="text-gray-600 mb-4">
                        or click to browse files (PDF, DOC, DOCX)
                    </p>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                            e.target.files && handleFile(e.target.files[0])
                        }
                        className="hidden"
                        id="resume-upload"
                    />
                    <label
                        htmlFor="resume-upload"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
                    >
                        Choose File
                    </label>
                </div>
            </div>

            {/* Parsing Status */}
            {parsing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                        <p className="text-blue-700">
                            Parsing your resume... This may take a moment.
                        </p>
                    </div>
                </div>
            )}

            {/* Parsed Results */}
            {parsedData && (
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <Check className="h-6 w-6 text-green-600 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Resume Parsed Successfully!
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {/* Personal Info */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">
                                Personal Information
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                    <div>
                                        <span className="font-medium">
                                            Name:
                                        </span>{" "}
                                        {parsedData.name}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Email:
                                        </span>{" "}
                                        {parsedData.email}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Phone:
                                        </span>{" "}
                                        {parsedData.phone}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {parsedData.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Experience */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">
                                Experience
                            </h3>
                            <div className="space-y-3">
                                {parsedData.experience.map((exp, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 rounded-lg p-4"
                                    >
                                        <h4 className="font-medium text-gray-900">
                                            {exp.title}
                                        </h4>
                                        <p className="text-gray-600">
                                            {exp.company}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {exp.duration}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                                <p className="text-yellow-700 text-sm">
                                    Please review the parsed information above
                                    and make any necessary corrections before
                                    saving.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
                                onClick={handleEditInformation}
                            >
                                Edit Information
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                                onClick={handleSaveResumeData}
                            >
                                Save Resume Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadResume;
