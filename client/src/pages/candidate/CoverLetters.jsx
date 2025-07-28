import React, { useState } from "react";
import { Plus, FileText, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "react-toastify";

const CoverLetters = () => {
    const [templates] = useState([
        {
            id: 1,
            name: "Software Developer Template",
            lastModified: "2024-01-15",
            content:
                "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Software Developer position...",
        },
        {
            id: 2,
            name: "Frontend Developer Template",
            lastModified: "2024-01-12",
            content:
                "Dear [Hiring Manager],\n\nI am excited to apply for the Frontend Developer role at [Company Name]...",
        },
        {
            id: 3,
            name: "General Tech Template",
            lastModified: "2024-01-10",
            content:
                "Hello,\n\nI am reaching out regarding the [Position Title] opportunity at your organization...",
        },
    ]);

    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleNewTemplate = () => {
        setIsEditing(true);
        toast.info("Creating new cover letter template");
    };

    const handleSaveTemplate = () => {
        toast.success("Cover letter template saved successfully!");
        setIsEditing(false);
    };

    const handleDeleteTemplate = (templateName) => {
        toast.success(`"${templateName}" template deleted successfully!`);
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Cover Letter Templates
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage your cover letter templates for different job
                    applications
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Templates List */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow rounded-lg">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Templates
                                </h2>
                                <button
                                    onClick={handleNewTemplate}
                                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-500 text-sm"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>New</span>
                                </button>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                                        selectedTemplate?.id === template.id
                                            ? "bg-blue-50 border-r-4 border-blue-600"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedTemplate(template)
                                    }
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">
                                                {template.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Modified{" "}
                                                {new Date(
                                                    template.lastModified
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Template Preview/Editor */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow rounded-lg">
                        {selectedTemplate ? (
                            <>
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {selectedTemplate.name}
                                        </h2>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() =>
                                                    setIsEditing(!isEditing)
                                                }
                                                className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
                                            >
                                                {isEditing ? (
                                                    <Eye className="h-4 w-4" />
                                                ) : (
                                                    <Edit className="h-4 w-4" />
                                                )}
                                                <span>
                                                    {isEditing
                                                        ? "Preview"
                                                        : "Edit"}
                                                </span>
                                            </button>
                                            <button
                                                className="p-1 text-red-600 hover:bg-red-50 rounded-md"
                                                onClick={() =>
                                                    handleDeleteTemplate(
                                                        selectedTemplate.name
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Template Name
                                                </label>
                                                <input
                                                    type="text"
                                                    defaultValue={
                                                        selectedTemplate.name
                                                    }
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Cover Letter Content
                                                </label>
                                                <textarea
                                                    rows="12"
                                                    defaultValue={
                                                        selectedTemplate.content
                                                    }
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Write your cover letter template here..."
                                                />
                                            </div>
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() =>
                                                        setIsEditing(false)
                                                    }
                                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                    onClick={handleSaveTemplate}
                                                >
                                                    Save Template
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="prose max-w-none">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                                                    {selectedTemplate.content}
                                                </pre>
                                            </div>
                                            <div className="mt-6 flex justify-end space-x-3">
                                                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                                    Download as PDF
                                                </button>
                                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                                    Use for Application
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="p-12 text-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No Template Selected
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Select a template from the list to view or
                                    edit it
                                </p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Create New Template</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                    Cover Letter Tips
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                        • Use [Company Name] and [Position Title] as
                        placeholders for easy customization
                    </li>
                    <li>
                        • Keep your cover letter concise and focused on relevant
                        experience
                    </li>
                    <li>
                        • Customize each letter for the specific role and
                        company
                    </li>
                    <li>• Always proofread before sending your application</li>
                </ul>
            </div>
        </div>
    );
};

export default CoverLetters;
