import React, { useState } from "react";
import {
    Search,
    MapPin,
    DollarSign,
    Clock,
    Filter,
    Heart,
    ExternalLink,
} from "lucide-react";

const JobBoard = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("all");
    const [salaryRange, setSalaryRange] = useState("all");

    // Mock job data
    const jobs = [
        {
            id: 1,
            title: "Frontend Developer",
            company: "TechCorp Inc.",
            location: "New York, NY",
            salary: "$80K - $120K",
            type: "Full-time",
            posted: "2 days ago",
            description:
                "We are looking for a skilled Frontend Developer to join our team...",
            skills: ["React", "JavaScript", "TypeScript", "CSS"],
            saved: false,
        },
        {
            id: 2,
            title: "React Developer",
            company: "StartupXYZ",
            location: "San Francisco, CA",
            salary: "$90K - $130K",
            type: "Full-time",
            posted: "1 day ago",
            description:
                "Join our innovative team and help build the next generation of web applications...",
            skills: ["React", "Node.js", "MongoDB", "GraphQL"],
            saved: true,
        },
        {
            id: 3,
            title: "Software Engineer",
            company: "BigTech Corp",
            location: "Seattle, WA",
            salary: "$100K - $150K",
            type: "Full-time",
            posted: "3 days ago",
            description:
                "We are seeking a talented Software Engineer to develop scalable solutions...",
            skills: ["JavaScript", "Python", "AWS", "Docker"],
            saved: false,
        },
        {
            id: 4,
            title: "Full Stack Developer",
            company: "InnovateLab",
            location: "Austin, TX",
            salary: "$75K - $110K",
            type: "Contract",
            posted: "5 days ago",
            description:
                "Looking for a Full Stack Developer to work on exciting projects...",
            skills: ["React", "Express.js", "PostgreSQL", "AWS"],
            saved: false,
        },
    ];

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation =
            location === "" ||
            job.location.toLowerCase().includes(location.toLowerCase());
        const matchesType =
            jobType === "all" ||
            job.type.toLowerCase() === jobType.toLowerCase();

        return matchesSearch && matchesLocation && matchesType;
    });

    const handleApply = (jobId) => {
        alert(`Applied to job ${jobId}! (This would integrate with backend)`);
    };

    const toggleSave = (jobId) => {
        alert(
            `Toggled save for job ${jobId}! (This would integrate with backend)`
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
                <p className="text-gray-600 mt-2">
                    Discover your next opportunity
                </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                    {/* Search Term */}
                    <div className="lg:col-span-2">
                        <label
                            htmlFor="search"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Job Title or Company
                        </label>
                        <div className="relative">
                            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            <input
                                id="search"
                                type="text"
                                placeholder="Search jobs..."
                                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Location
                        </label>
                        <div className="relative">
                            <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            <input
                                id="location"
                                type="text"
                                placeholder="City, State"
                                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Job Type */}
                    <div>
                        <label
                            htmlFor="jobType"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Job Type
                        </label>
                        <select
                            id="jobType"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                        </select>
                    </div>

                    {/* Search Button */}
                    <div className="flex items-end">
                        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <Filter className="h-5 w-5 inline mr-2" />
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
                <p className="text-gray-600">
                    Showing {filteredJobs.length} job
                    {filteredJobs.length !== 1 ? "s" : ""}
                </p>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                    <option>Most Recent</option>
                    <option>Salary: High to Low</option>
                    <option>Salary: Low to High</option>
                    <option>Company A-Z</option>
                </select>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
                {filteredJobs.map((job) => (
                    <div
                        key={job.id}
                        className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {job.title}
                                    </h3>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        {job.type}
                                    </span>
                                </div>

                                <p className="text-lg text-gray-700 mb-2">
                                    {job.company}
                                </p>

                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <DollarSign className="h-4 w-4" />
                                        <span>{job.salary}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{job.posted}</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-4">
                                    {job.description}
                                </p>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {job.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleApply(job.id)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Apply Now
                                    </button>
                                    <button
                                        onClick={() => toggleSave(job.id)}
                                        className={`px-4 py-2 rounded-md border ${
                                            job.saved
                                                ? "border-red-300 text-red-700 bg-red-50 hover:bg-red-100"
                                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        <Heart
                                            className={`h-4 w-4 inline mr-1 ${
                                                job.saved ? "fill-current" : ""
                                            }`}
                                        />
                                        {job.saved ? "Saved" : "Save"}
                                    </button>
                                    <button className="text-blue-600 hover:text-blue-500">
                                        <ExternalLink className="h-4 w-4 inline mr-1" />
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More */}
            <div className="text-center">
                <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300">
                    Load More Jobs
                </button>
            </div>
        </div>
    );
};

export default JobBoard;
