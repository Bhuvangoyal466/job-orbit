import React from "react";
import { Link } from "react-router-dom";

import {
    BarChart3,
    TrendingUp,
    FileText,
    Calendar,
    Search,
    Upload,
    MessageSquare,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";

const CandidateDashboard = () => {
    // Mock data - replace with actual data from API
    const stats = [
        {
            name: "Applications Sent",
            value: "12",
            icon: FileText,
            color: "bg-blue-500",
        },
        {
            name: "Interviews",
            value: "3",
            icon: Calendar,
            color: "bg-green-500",
        },
        {
            name: "Profile Views",
            value: "45",
            icon: TrendingUp,
            color: "bg-purple-500",
        },
        {
            name: "Saved Jobs",
            value: "8",
            icon: BarChart3,
            color: "bg-orange-500",
        },
    ];

    const recentApplications = [
        {
            id: 1,
            company: "TechCorp Inc.",
            position: "Frontend Developer",
            status: "Applied",
            date: "2024-01-15",
            statusColor: "bg-blue-100 text-blue-800",
        },
        {
            id: 2,
            company: "StartupXYZ",
            position: "React Developer",
            status: "Interviewing",
            date: "2024-01-12",
            statusColor: "bg-yellow-100 text-yellow-800",
        },
        {
            id: 3,
            company: "BigTech Corp",
            position: "Software Engineer",
            status: "Offer",
            date: "2024-01-10",
            statusColor: "bg-green-100 text-green-800",
        },
        {
            id: 4,
            company: "InnovateLab",
            position: "Full Stack Developer",
            status: "Rejected",
            date: "2024-01-08",
            statusColor: "bg-red-100 text-red-800",
        },
    ];

    const quickActions = [
        {
            title: "Browse Jobs",
            description: "Discover new opportunities",
            icon: Search,
            link: "/candidate/jobs",
            color: "bg-blue-500",
        },
        {
            title: "Upload Resume",
            description: "Update your resume",
            icon: Upload,
            link: "/candidate/upload-resume",
            color: "bg-green-500",
        },
        {
            title: "Cover Letters",
            description: "Manage templates",
            icon: MessageSquare,
            link: "/candidate/cover-letters",
            color: "bg-purple-500",
        },
        {
            title: "Applications",
            description: "Track your progress",
            icon: BarChart3,
            link: "/candidate/applications",
            color: "bg-orange-500",
        },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case "Applied":
                return <Clock className="h-4 w-4" />;
            case "Interviewing":
                return <AlertCircle className="h-4 w-4" />;
            case "Offer":
                return <CheckCircle className="h-4 w-4" />;
            case "Rejected":
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Welcome back! Here's your job search overview.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.name}
                                className="bg-white overflow-hidden shadow rounded-lg"
                            >
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`${stat.color} p-3 rounded-md`}
                                            >
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    {stat.name}
                                                </dt>
                                                <dd className="text-2xl font-bold text-gray-900">
                                                    {stat.value}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={action.title}
                                    to={action.link}
                                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-start space-x-3">
                                        <div
                                            className={`${action.color} p-2 rounded-md`}
                                        >
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {action.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Recent Applications
                        </h2>
                        <Link
                            to="/candidate/applications"
                            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {recentApplications.map((application) => (
                            <div
                                key={application.id}
                                className="px-6 py-4 hover:bg-gray-50"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-gray-900">
                                            {application.position}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {application.company}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Applied on{" "}
                                            {new Date(
                                                application.date
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${application.statusColor}`}
                                        >
                                            {getStatusIcon(application.status)}
                                            <span className="ml-1">
                                                {application.status}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CandidateDashboard;
