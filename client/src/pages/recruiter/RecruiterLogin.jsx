import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";
import { recruiterAPI } from "../../utils/api";
import { Eye, EyeOff, Mail, Lock, Building2 } from "lucide-react";

const RecruiterLogin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/recruiter/dashboard";

    // Check for success message from signup
    React.useEffect(() => {
        if (location.state?.message) {
            toast.success(location.state.message);
        }
    }, [location.state]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call the backend API for recruiter login
            const response = await recruiterAPI.login({
                email: formData.email,
                password: formData.password,
            });

            // Extract user data and token from response
            const { token, data } = response;
            const userData = {
                id: data.recruiter._id,
                name: data.recruiter.fullName,
                email: data.recruiter.email,
                firstName: data.recruiter.firstName,
                lastName: data.recruiter.lastName,
                role: "recruiter",
                company: data.recruiter.companyDisplayName,
                position: data.recruiter.position,
                profileCompleteness: data.recruiter.profileCompleteness,
                isEmailVerified: data.recruiter.isEmailVerified,
                isCompanyVerified: data.recruiter.isCompanyVerified,
            };

            // Login using auth context
            await login(userData, token);
            toast.success("Login successful! Welcome back.");
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
                        <Building2 className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Welcome Back
                </h2>
                <p className="mt-2 text-center text-base text-gray-600 font-medium">
                    Access your Recruiter dashboard
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700"
                            >
                                Email address
                            </label>
                            <div className="relative group">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <Mail className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-emerald-500 transition-colors duration-300" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700"
                            >
                                Password
                            </label>
                            <div className="relative group">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <Lock className="h-5 w-5 text-gray-400 absolute left-4 top-3.5 group-focus-within:text-emerald-500 transition-colors duration-300" />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700 font-medium cursor-pointer"
                                >
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link
                                    to="/forgot-password?type=recruiter"
                                    className="font-semibold text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <span className="flex items-center">
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign in"
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white/80 text-gray-600 font-medium">
                                    New to JobOrbit?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/recruiter/signup"
                                className="w-full flex justify-center py-3 px-4 border border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-white/70 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                Create recruiter account
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            to="/candidate/login"
                            className="text-sm text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200"
                        >
                            Are you a job seeker?{" "}
                            <span className="text-emerald-600 font-semibold">
                                Sign in here
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterLogin;
