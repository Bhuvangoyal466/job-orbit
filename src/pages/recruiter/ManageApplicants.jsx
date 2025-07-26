import React, { useState } from "react";
import { User, Mail, Phone, FileText, Eye, Check, X } from "lucide-react";

const ManageApplicants = () => {
    const [selectedStatus, setSelectedStatus] = useState("all");

    // Mock applicants data
    const applicants = [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@email.com",
            phone: "+1 (555) 123-4567",
            position: "Frontend Developer",
            status: "Applied",
            appliedDate: "2024-01-15",
            resume: "john_doe_resume.pdf",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@email.com",
            phone: "+1 (555) 987-6543",
            position: "React Developer",
            status: "Interviewing",
            appliedDate: "2024-01-12",
            resume: "jane_smith_resume.pdf",
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike.j@email.com",
            phone: "+1 (555) 456-7890",
            position: "Software Engineer",
            status: "Offer",
            appliedDate: "2024-01-10",
            resume: "mike_johnson_resume.pdf",
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "Applied":
                return "bg-blue-100 text-blue-800";
            case "Interviewing":
                return "bg-yellow-100 text-yellow-800";
            case "Offer":
                return "bg-green-100 text-green-800";
            case "Rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const filteredApplicants =
        selectedStatus === "all"
            ? applicants
            : applicants.filter(
                  (app) => app.status.toLowerCase() === selectedStatus
              );

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Manage Applicants
                </h1>
                <p className="text-gray-600 mt-2">
                    Review and manage job applications
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">
                        Filter by status:
                    </label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                        <option value="all">All Statuses</option>
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Applicants List */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Applications ({filteredApplicants.length})
                    </h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {filteredApplicants.map((applicant) => (
                        <div key={applicant.id} className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 rounded-full p-3">
                                        <User className="h-8 w-8 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {applicant.name}
                                        </h3>
                                        <p className="text-gray-600">
                                            {applicant.position}
                                        </p>
                                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Mail className="h-4 w-4" />
                                                <span>{applicant.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Phone className="h-4 w-4" />
                                                <span>{applicant.phone}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Applied on{" "}
                                            {new Date(
                                                applicant.appliedDate
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                            applicant.status
                                        )}`}
                                    >
                                        {applicant.status}
                                    </span>

                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                                            <FileText className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-md">
                                            <Check className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageApplicants;
