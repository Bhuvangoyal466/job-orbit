import React, { useState } from "react";
import {  AnimatePresence } from "framer-motion";
import { Search, MapPin, Filter, X, ChevronDown } from "lucide-react";

const AdvancedJobSearch = ({ onSearch, onFilterChange, filters = {} }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [location, setLocation] = useState(filters.location || "");
    const [jobType, setJobType] = useState(filters.type || "all");
    const [salaryRange, setSalaryRange] = useState(filters.salary || "all");
    const [experienceLevel, setExperienceLevel] = useState(
        filters.experience || "all"
    );
    const [company, setCompany] = useState(filters.company || "");

    const jobTypes = [
        { value: "all", label: "All Job Types" },
        { value: "full-time", label: "Full-time" },
        { value: "part-time", label: "Part-time" },
        { value: "contract", label: "Contract" },
        { value: "internship", label: "Internship" },
        { value: "remote", label: "Remote" },
    ];

    const salaryRanges = [
        { value: "all", label: "All Salaries" },
        { value: "0-300000", label: "Up to ₹3 LPA" },
        { value: "300000-600000", label: "₹3-6 LPA" },
        { value: "600000-1000000", label: "₹6-10 LPA" },
        { value: "1000000-1500000", label: "₹10-15 LPA" },
        { value: "1500000+", label: "₹15+ LPA" },
    ];

    const experienceLevels = [
        { value: "all", label: "All Levels" },
        { value: "entry", label: "Entry Level (0-2 years)" },
        { value: "mid", label: "Mid Level (2-5 years)" },
        { value: "senior", label: "Senior Level (5+ years)" },
        { value: "lead", label: "Lead/Manager (8+ years)" },
    ];

    const handleSearch = () => {
        const searchFilters = {
            search: searchTerm,
            location,
            type: jobType !== "all" ? jobType : undefined,
            salary: salaryRange !== "all" ? salaryRange : undefined,
            experience: experienceLevel !== "all" ? experienceLevel : undefined,
            company: company || undefined,
        };

        onSearch && onSearch(searchFilters);
        onFilterChange && onFilterChange(searchFilters);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setLocation("");
        setJobType("all");
        setSalaryRange("all");
        setExperienceLevel("all");
        setCompany("");

        const emptyFilters = {
            search: "",
            location: "",
            type: undefined,
            salary: undefined,
            experience: undefined,
            company: undefined,
        };

        onSearch && onSearch(emptyFilters);
        onFilterChange && onFilterChange(emptyFilters);
    };

    const hasActiveFilters =
        searchTerm ||
        location ||
        jobType !== "all" ||
        salaryRange !== "all" ||
        experienceLevel !== "all" ||
        company;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            {/* Basic Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Job title, keywords, or company"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                <div className="flex gap-2">
                    <motion.button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Filter className="h-5 w-5" />
                        Filters
                        <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                            }`}
                        />
                    </motion.button>

                    <motion.button
                        onClick={handleSearch}
                        className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Search
                    </motion.button>
                </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 pt-4 overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Type
                                </label>
                                <select
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {jobTypes.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Salary Range
                                </label>
                                <select
                                    value={salaryRange}
                                    onChange={(e) =>
                                        setSalaryRange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {salaryRanges.map((range) => (
                                        <option
                                            key={range.value}
                                            value={range.value}
                                        >
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience Level
                                </label>
                                <select
                                    value={experienceLevel}
                                    onChange={(e) =>
                                        setExperienceLevel(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {experienceLevels.map((level) => (
                                        <option
                                            key={level.value}
                                            value={level.value}
                                        >
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    placeholder="Company name"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    Filters applied
                                </div>
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
                                >
                                    <X className="h-4 w-4" />
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdvancedJobSearch;
