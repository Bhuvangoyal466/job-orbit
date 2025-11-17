import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Check,
    User,
    Briefcase,
    MapPin,
    FileText,
    Upload,
    ChevronRight,
    Star,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import { candidateAPI } from "../utils/api";
import { toast } from "react-toastify";

const ProfileCompletionWizard = () => {
    const { user, updateUser } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [profile, setProfile] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        location: user?.location || "",
        experience: user?.experience || "",
        skills: user?.skills || [],
        bio: user?.bio || "",
        resume: user?.resume || null,
    });

    const [completionPercentage, setCompletionPercentage] = useState(0);

    // Check profile completion on mount
    useEffect(() => {
        if (user) {
            const completion = calculateCompletionPercentage();
            setCompletionPercentage(completion);

            // Automatic popup disabled - popup will only show when manually triggered
            // if (completion < 70) {
            //     setTimeout(() => setIsVisible(true), 2000);
            // }
        }
    }, [user]);

    const calculateCompletionPercentage = () => {
        const fields = [
            user?.name,
            user?.phone,
            user?.location,
            user?.experience,
            user?.skills?.length > 0,
            user?.bio,
            user?.resume,
        ];

        const completedFields = fields.filter(Boolean).length;
        return Math.round((completedFields / fields.length) * 100);
    };

    const wizardSteps = [
        {
            id: "basic",
            title: "Basic Information",
            description: "Complete your basic profile details",
            icon: User,
            fields: ["name", "phone", "location"],
        },
        {
            id: "experience",
            title: "Experience & Skills",
            description: "Add your professional background",
            icon: Briefcase,
            fields: ["experience", "skills", "bio"],
        },
        {
            id: "documents",
            title: "Upload Documents",
            description: "Upload your PDF resume and portfolio",
            icon: Upload,
            fields: ["resume"],
        },
    ];

    const handleInputChange = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleSkillAdd = (skill) => {
        if (skill.trim() && !profile.skills.includes(skill.trim())) {
            setProfile((prev) => ({
                ...prev,
                skills: [...prev.skills, skill.trim()],
            }));
        }
    };

    const handleSkillRemove = (skillToRemove) => {
        setProfile((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill !== skillToRemove),
        }));
    };

    const handleStepComplete = async () => {
        try {
            const response = await candidateAPI.updateProfile(profile);
            if (response.success) {
                updateUser(response.candidate);
                toast.success("Profile updated successfully!");

                if (currentStep < wizardSteps.length - 1) {
                    setCurrentStep((prev) => prev + 1);
                } else {
                    setIsVisible(false);
                    toast.success("Profile setup completed! 🎉");
                }
            }
        } catch (error) {
            toast.error(error.message || "Failed to update profile");
        }
    };

    const handleSkipStep = () => {
        if (currentStep < wizardSteps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            setIsVisible(false);
        }
    };

    const isStepValid = () => {
        const currentStepData = wizardSteps[currentStep];
        if (currentStepData.id === "basic") {
            return profile.name && profile.phone && profile.location;
        } else if (currentStepData.id === "experience") {
            return (
                profile.experience && profile.skills.length > 0 && profile.bio
            );
        } else if (currentStepData.id === "documents") {
            return true; // Optional step
        }
        return false;
    };

    if (!isVisible || !user) return null;

    const currentStepData = wizardSteps[currentStep];
    const StepIcon = currentStepData.icon;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Complete Your Profile
                                </h2>
                                <p className="text-blue-100 mt-1">
                                    {completionPercentage}% complete • Get more
                                    job matches
                                </p>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-2">
                                {wizardSteps.map((step, index) => (
                                    <div
                                        key={step.id}
                                        className={`flex items-center gap-1 ${
                                            index <= currentStep
                                                ? "text-white"
                                                : "text-blue-200"
                                        }`}
                                    >
                                        <step.icon className="h-4 w-4" />
                                        <span className="hidden sm:inline">
                                            {step.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="w-full bg-blue-400/30 rounded-full h-2">
                                <motion.div
                                    className="bg-white h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${
                                            ((currentStep + 1) /
                                                wizardSteps.length) *
                                            100
                                        }%`,
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
                                <StepIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                                {currentStepData.title}
                            </h3>
                            <p className="text-gray-600 mt-1">
                                {currentStepData.description}
                            </p>
                        </div>

                        {/* Step Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                {currentStepData.id === "basic" && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "phone",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Location *
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.location}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "location",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="City, State"
                                            />
                                        </div>
                                    </>
                                )}

                                {currentStepData.id === "experience" && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Years of Experience *
                                            </label>
                                            <select
                                                value={profile.experience}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "experience",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">
                                                    Select experience level
                                                </option>
                                                <option value="0-1">
                                                    0-1 years (Entry Level)
                                                </option>
                                                <option value="2-4">
                                                    2-4 years (Mid Level)
                                                </option>
                                                <option value="5-7">
                                                    5-7 years (Senior Level)
                                                </option>
                                                <option value="8+">
                                                    8+ years (Lead/Manager)
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Skills *
                                            </label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {profile.skills.map(
                                                    (skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                                        >
                                                            {skill}
                                                            <button
                                                                onClick={() =>
                                                                    handleSkillRemove(
                                                                        skill
                                                                    )
                                                                }
                                                                className="text-blue-500 hover:text-blue-700"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleSkillAdd(
                                                            e.target.value
                                                        );
                                                        e.target.value = "";
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Type a skill and press Enter"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Add skills that describe your
                                                expertise
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Professional Summary *
                                            </label>
                                            <textarea
                                                value={profile.bio}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "bio",
                                                        e.target.value
                                                    )
                                                }
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Brief summary of your professional background and career goals"
                                            />
                                        </div>
                                    </>
                                )}

                                {currentStepData.id === "documents" && (
                                    <div className="text-center py-8">
                                        <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                                            Upload Your PDF Resume
                                        </h4>
                                        <p className="text-gray-600 mb-4">
                                            This step is optional but
                                            recommended for better job matches
                                            (PDF only)
                                        </p>
                                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                            Browse Files
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-between items-center">
                        <button
                            onClick={handleSkipStep}
                            className="text-gray-600 hover:text-gray-700 font-medium"
                        >
                            Skip this step
                        </button>

                        <div className="flex gap-3">
                            {currentStep > 0 && (
                                <button
                                    onClick={() =>
                                        setCurrentStep((prev) => prev - 1)
                                    }
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Back
                                </button>
                            )}

                            <button
                                onClick={handleStepComplete}
                                disabled={
                                    !isStepValid() &&
                                    currentStepData.id !== "documents"
                                }
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {currentStep === wizardSteps.length - 1 ? (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Complete
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProfileCompletionWizard;
