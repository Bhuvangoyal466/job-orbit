import React, { useState } from "react";
import {
    Calendar,
    MapPin,
    Building2,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
} from "lucide-react";

const ApplicationTracker = () => {
    const [statusFilter, setStatusFilter] = useState("all");

    const applications = [
        {
            id: 1,
            position: "Frontend Developer",
            company: "TechCorp Inc.",
            location: "New York, NY",
            appliedDate: "2024-01-15",
            status: "Applied",
            salary: "$80K - $120K",
            notes: "Applied through company website",
        },
        {
            id: 2,
            position: "React Developer",
            company: "StartupXYZ",
            location: "San Francisco, CA",
            appliedDate: "2024-01-12",
            status: "Interviewing",
            salary: "$90K - $130K",
            notes: "Phone screening completed, waiting for technical round",
        },
        {
            id: 3,
            position: "Software Engineer",
            company: "BigTech Corp",
            location: "Seattle, WA",
            appliedDate: "2024-01-10",
            status: "Offer",
            salary: "$100K - $150K",
            notes: "Received offer, need to respond by Friday",
        },
        {
            id: 4,
            position: "Full Stack Developer",
            company: "InnovateLab",
            location: "Austin, TX",
            appliedDate: "2024-01-08",
            status: "Rejected",
            salary: "$75K - $110K",
            notes: "Not selected after final interview",
        },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case "Applied":
                return <Clock className="h-5 w-5 text-blue-600" />;
            case "Interviewing":
                return <AlertCircle className="h-5 w-5 text-yellow-600" />;
            case "Offer":
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case "Rejected":
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return <Clock className="h-5 w-5 text-gray-600" />;
        }
    };

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

    const filteredApplications =
        statusFilter === "all"
            ? applications
            : applications.filter(
                  (app) => app.status.toLowerCase() === statusFilter
              );

    const statusCounts = {
        applied: applications.filter((app) => app.status === "Applied").length,
        interviewing: applications.filter(
            (app) => app.status === "Interviewing"
        ).length,
        offer: applications.filter((app) => app.status === "Offer").length,
        rejected: applications.filter((app) => app.status === "Rejected")
            .length,
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Application Tracker
                </h1>
                <p className="text-gray-600 mt-2">
                    Track the status of all your job applications
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <Clock className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Applied
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {statusCounts.applied}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <AlertCircle className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Interviewing
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {statusCounts.interviewing}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Offers
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {statusCounts.offer}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <XCircle className="h-8 w-8 text-red-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Rejected
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {statusCounts.rejected}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">
                        Filter by status:
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                        <option value="all">All Applications</option>
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        My Applications ({filteredApplications.length})
                    </h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                        <div
                            key={application.id}
                            className="p-6 hover:bg-gray-50"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getStatusIcon(application.status)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {application.position}
                                            </h3>
                                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Building2 className="h-4 w-4" />
                                                    <span>
                                                        {application.company}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>
                                                        {application.location}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        Applied{" "}
                                                        {new Date(
                                                            application.appliedDate
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">
                                                Salary: {application.salary}
                                            </p>
                                            {application.notes && (
                                                <p className="text-sm text-gray-500 mt-2 italic">
                                                    Note: {application.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 ml-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                            application.status
                                        )}`}
                                    >
                                        {application.status}
                                    </span>
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ApplicationTracker;
