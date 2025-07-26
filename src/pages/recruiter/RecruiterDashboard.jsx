import React from "react";
import { Link } from "react-router-dom";
import { Plus, Users, BarChart3, Calendar } from "lucide-react";

const RecruiterDashboard = () => {
    const stats = [
        {
            name: "Active Jobs",
            value: "8",
            icon: BarChart3,
            color: "bg-blue-500",
        },
        {
            name: "Total Applicants",
            value: "45",
            icon: Users,
            color: "bg-green-500",
        },
        {
            name: "Interviews Scheduled",
            value: "12",
            icon: Calendar,
            color: "bg-yellow-500",
        },
        {
            name: "Positions Filled",
            value: "3",
            icon: Plus,
            color: "bg-purple-500",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Recruiter Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage your job postings and applicants
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Link
                        to="/recruiter/post-job"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
                    >
                        <Plus className="h-8 w-8 text-gray-400 mb-2" />
                        <h3 className="font-medium text-gray-900">
                            Post New Job
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Create a new job listing
                        </p>
                    </Link>
                    <Link
                        to="/recruiter/applicants"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
                    >
                        <Users className="h-8 w-8 text-gray-400 mb-2" />
                        <h3 className="font-medium text-gray-900">
                            Review Applicants
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Manage job applications
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
