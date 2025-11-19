import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
    Edit3,
    Trash2,
    Eye,
    Calendar,
    MapPin,
    DollarSign,
    Users,
    Briefcase,
    Clock,
    Search,
    Filter,
    Plus,
    AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { recruiterAPI } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const ManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive
    const [selectedJob, setSelectedJob] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await recruiterAPI.getMyJobs();
            setJobs(response.jobs || []);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to fetch jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async () => {
        if (!selectedJob) return;

        try {
            setDeleteLoading(true);
            await recruiterAPI.deleteJob(selectedJob._id);
            setJobs(
                (jobs || []).map((job) =>
                    job._id === selectedJob._id
                        ? { ...job, isActive: false }
                        : job
                )
            );
            setShowDeleteModal(false);
            setSelectedJob(null);
        } catch (err) {
            alert(err.message || "Failed to delete job");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEditJob = async (e) => {
        e.preventDefault();
        if (!selectedJob) return;

        try {
            setEditLoading(true);
            const response = await recruiterAPI.updateJob(
                selectedJob._id,
                editFormData
            );
            setJobs(
                (jobs || []).map((job) =>
                    job._id === selectedJob._id ? response : job
                )
            );
            setShowEditModal(false);
            setSelectedJob(null);
            setEditFormData({});
        } catch (err) {
            alert(err.message || "Failed to update job");
        } finally {
            setEditLoading(false);
        }
    };

    const openEditModal = (job) => {
        setSelectedJob(job);
        setEditFormData({
            title: job.title || "",
            description: job.description || "",
            requirements: job.requirements || [],
            skills: job.skills || [],
            experience: job.experience || "",
            type: job.type || "",
            location: {
                city: job.location?.city || "",
                state: job.location?.state || "",
                country: job.location?.country || "",
                remote: job.location?.remote || false,
            },
            salary: {
                min: job.salary?.min || "",
                max: job.salary?.max || "",
                currency: job.salary?.currency || "INR",
            },
        });
        setShowEditModal(true);
    };

    const filteredJobs = (jobs || []).filter((job) => {
        const matchesSearch =
            job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === "all" ||
            (filterStatus === "active" && job.isActive) ||
            (filterStatus === "inactive" && !job.isActive);

        return matchesSearch && matchesFilter;
    });

    if (loading) return <LoadingSpinner />;

    return (
        <motion.div
            className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-7xl mx-auto px-4 mt-10 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h1 className="text-4xl font-bold bg-linear-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                            Manage Jobs
                        </h1>
                        <p className="text-gray-600 mt-2">
                            View, edit, and manage your job postings
                        </p>
                    </div>

                    <Link to="/recruiter/post-job">
                        <motion.button
                            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="h-5 w-5" />
                            Post New Job
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Search and Filter */}
                <motion.div
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-500" />
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
                                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Jobs</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Error State */}
                {error && (
                    <motion.div
                        className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </motion.div>
                )}

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredJobs.map((job, index) => (
                            <motion.div
                                key={job._id}
                                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-200 ${
                                    !job.isActive
                                        ? "border-red-200 opacity-75"
                                        : "border-white/20"
                                }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
                                }}
                                whileHover={{ y: -5 }}
                            >
                                {/* Status Badge */}
                                <div className="flex justify-between items-start mb-4">
                                    <span
                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                            job.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                job.isActive
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        />
                                        {job.isActive ? "Active" : "Inactive"}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        {job.applications?.length > 0 && (
                                            <span className="flex items-center gap-1 text-sm text-gray-500">
                                                <Users className="h-4 w-4" />
                                                {job.applications.length}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Job Info */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {job.title}
                                    </h3>
                                    <p className="text-gray-600 mb-3 line-clamp-2">
                                        {job.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <MapPin className="h-4 w-4" />
                                            <span>
                                                {job.location?.remote
                                                    ? "Remote"
                                                    : `${job.location?.city}, ${job.location?.state}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Briefcase className="h-4 w-4" />
                                            <span className="capitalize">
                                                {job.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            {/* <DollarSign className="h-4 w-4" /> */}
                                            <span>
                                                ₹
                                                {job.salary?.min?.toLocaleString(
                                                    "en-IN"
                                                )}{" "}
                                                - ₹
                                                {job.salary?.max?.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {new Date(
                                                    job.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                {job.skills && job.skills.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {job.skills
                                                .slice(0, 4)
                                                .map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            {job.skills.length > 4 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                                                    +{job.skills.length - 4}{" "}
                                                    more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <Link
                                        to={`/jobs/${job._id}`}
                                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View
                                    </Link>

                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            onClick={() => openEditModal(job)}
                                            className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Edit3 className="h-4 w-4" />
                                            Edit
                                        </motion.button>

                                        {job.isActive && (
                                            <motion.button
                                                onClick={() => {
                                                    setSelectedJob(job);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Remove
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredJobs.length === 0 && !loading && (
                    <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-center mb-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                <Briefcase className="h-12 w-12 text-gray-400" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No jobs found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm || filterStatus !== "all"
                                ? "Try adjusting your search or filter criteria."
                                : "You haven't posted any jobs yet."}
                        </p>
                        <Link to="/recruiter/post-job">
                            <motion.button
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Post Your First Job
                            </motion.button>
                        </Link>
                    </motion.div>
                )}

                {/* Delete Modal */}
                <AnimatePresence>
                    {showDeleteModal && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white rounded-2xl p-6 w-full max-w-md"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Remove Job
                                        </h3>
                                        <p className="text-gray-600">
                                            This action cannot be undone
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6">
                                    Are you sure you want to remove "
                                    {selectedJob?.title}"? The job will be
                                    deactivated and won't be visible to
                                    candidates.
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setSelectedJob(null);
                                        }}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        disabled={deleteLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteJob}
                                        disabled={deleteLoading}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {deleteLoading && (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        )}
                                        Remove Job
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Edit Modal */}
                <AnimatePresence>
                    {showEditModal && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white rounded-2xl p-6 w-full max-w-4xl my-8"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Edit Job
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedJob(null);
                                            setEditFormData({});
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ×
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleEditJob}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Job Title
                                            </label>
                                            <input
                                                type="text"
                                                value={editFormData.title || ""}
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        title: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Job Type
                                            </label>
                                            <select
                                                value={editFormData.type || ""}
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        type: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="">
                                                    Select Type
                                                </option>
                                                <option value="full-time">
                                                    Full Time
                                                </option>
                                                <option value="part-time">
                                                    Part Time
                                                </option>
                                                <option value="contract">
                                                    Contract
                                                </option>
                                                <option value="internship">
                                                    Internship
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={
                                                editFormData.description || ""
                                            }
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    description: e.target.value,
                                                })
                                            }
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    editFormData.location
                                                        ?.city || ""
                                                }
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        location: {
                                                            ...editFormData.location,
                                                            city: e.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Min Salary
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    editFormData.salary?.min ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        salary: {
                                                            ...editFormData.salary,
                                                            min: parseInt(
                                                                e.target.value
                                                            ),
                                                        },
                                                    })
                                                }
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Max Salary
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    editFormData.salary?.max ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        salary: {
                                                            ...editFormData.salary,
                                                            max: parseInt(
                                                                e.target.value
                                                            ),
                                                        },
                                                    })
                                                }
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="remote"
                                            checked={
                                                editFormData.location?.remote ||
                                                false
                                            }
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    location: {
                                                        ...editFormData.location,
                                                        remote: e.target
                                                            .checked,
                                                    },
                                                })
                                            }
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor="remote"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Remote Work Available
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowEditModal(false);
                                                setSelectedJob(null);
                                                setEditFormData({});
                                            }}
                                            className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                            disabled={editLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={editLoading}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {editLoading && (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            )}
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ManageJobs;
