/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../../context/useAuth";
import {
    Search,
    Upload,
    BarChart3,
    Users,
    Briefcase,
    ArrowRight,
    Zap,
    Star,
    TrendingUp,
    Shield,
    Clock,
    CheckCircle,
    Globe,
    Target,
    Award,
    Rocket,
} from "lucide-react";

const Home = () => {
    const navigate = useNavigate();
    const { user, userRole } = useAuth();

    const [heroRef, heroInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [featuresRef, featuresInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [statsRef, statsInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const features = [
        {
            icon: Upload,
            title: "Smart Resume Parsing",
            description:
                "Upload your resume and our AI will extract and organize your information automatically.",
            color: "from-blue-500 to-purple-600",
            path: "/candidate/upload-resume",
            authRequired: true,
            role: "candidate",
        },
        {
            icon: Search,
            title: "Advanced Job Search",
            description:
                "Find the perfect job with our intelligent matching system and comprehensive filters.",
            color: "from-green-500 to-teal-600",
            path: "/candidate/jobs",
            authRequired: true,
            role: "candidate",
        },
        {
            icon: BarChart3,
            title: "Application Tracking",
            description:
                "Keep track of all your applications with real-time status updates and analytics.",
            color: "from-orange-500 to-red-600",
            path: "/candidate/applications",
            authRequired: true,
            role: "candidate",
        },
        {
            icon: Users,
            title: "For Recruiters",
            description:
                "Streamline your hiring process with advanced candidate management tools.",
            color: "from-purple-500 to-pink-600",
            path: "/recruiter/dashboard",
            authRequired: true,
            role: "recruiter",
        },
    ];

    const handleFeatureClick = (feature) => {
        if (feature.authRequired) {
            // Check if user is logged in
            if (!user) {
                // If not logged in, redirect to appropriate login page
                if (feature.role === "candidate") {
                    navigate("/candidate/login");
                } else if (feature.role === "recruiter") {
                    navigate("/recruiter/login");
                }
                return;
            }

            // Check if user role matches
            if (userRole !== feature.role) {
                // If wrong role, redirect to appropriate login page
                if (feature.role === "candidate") {
                    navigate("/candidate/login");
                } else if (feature.role === "recruiter") {
                    navigate("/recruiter/login");
                }
                return;
            }
        }

        // Navigate to the feature page
        navigate(feature.path);
    };

    const stats = [
        {
            icon: Briefcase,
            number: "10K+",
            label: "Active Jobs",
            color: "text-blue-600",
        },
        {
            icon: Users,
            number: "50K+",
            label: "Registered Users",
            color: "text-green-600",
        },
        {
            icon: CheckCircle,
            number: "95%",
            label: "Success Rate",
            color: "text-purple-600",
        },
        {
            icon: Globe,
            number: "100+",
            label: "Companies",
            color: "text-orange-600",
        },
    ];

    const testimonials = [
        {
            name: "Aarav S.",
            role: "Software Engineer",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            content:
                "JobOrbit made my job search so much easier. The resume parsing was spot on and I landed interviews quickly!",
            rating: 5,
        },
        {
            name: "Priya M.",
            role: "HR Manager",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            content:
                "As a recruiter, I love the advanced filters and candidate management tools. Highly recommended!",
            rating: 5,
        },
        {
            name: "Rahul K.",
            role: "Product Manager",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            content:
                "The application tracking feature is game-changing. I can see exactly where I stand with each company.",
            rating: 5,
        },
    ];

    useEffect(() => {
        // Initialize AOS
        import("aos").then((AOS) => {
            AOS.init({
                duration: 1000,
                once: true,
            });
        });
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Hero Section with Parallax Effect */}
            <section
                className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden"
                ref={heroRef}
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full animate-float"></div>
                    <div
                        className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 opacity-10 rounded-full animate-float"
                        style={{ animationDelay: "2s" }}
                    ></div>
                    <div
                        className="absolute top-1/2 right-1/4 w-32 h-32 bg-purple-300 opacity-20 rounded-full animate-bounce-slow"
                        style={{ animationDelay: "1s" }}
                    ></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={
                            heroInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 50 }
                        }
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.h1
                            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={
                                heroInView
                                    ? { opacity: 1, scale: 1 }
                                    : { opacity: 0, scale: 0.5 }
                            }
                            transition={{
                                duration: 1,
                                ease: "easeOut",
                                delay: 0.2,
                            }}
                        >
                            Find Your Dream Job with JobOrbit
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 30 }}
                            animate={
                                heroInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 30 }
                            }
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Smart job board with AI-powered resume parsing,
                            intelligent matching, and real-time application
                            tracking
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            animate={
                                heroInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 30 }
                            }
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <Link
                                to="/candidate/signup"
                                className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-glow-hover transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center text-lg"
                            >
                                <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                                Get Started as Job Seeker
                                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/recruiter/signup"
                                className="group border-2 border-white text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:bg-white hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center text-lg glass"
                            >
                                <Users className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                                I'm a Recruiter
                                <Briefcase className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                            </Link>
                        </motion.div>

                        {/* Floating Feature Icons */}
                        <motion.div
                            className="flex justify-center gap-8 opacity-70"
                            initial={{ opacity: 0 }}
                            animate={
                                heroInView ? { opacity: 0.7 } : { opacity: 0 }
                            }
                            transition={{ duration: 1, delay: 1 }}
                        >
                            {[Upload, Search, BarChart3, Users].map(
                                (Icon, index) => (
                                    <motion.div
                                        key={index}
                                        className="p-4 glass rounded-full"
                                        animate={{
                                            y: [0, -10, 0],
                                            rotate: [0, 5, -5, 0],
                                        }}
                                        transition={{
                                            duration: 3,
                                            delay: index * 0.2,
                                            repeat: Infinity,
                                        }}
                                    >
                                        <Icon className="h-8 w-8" />
                                    </motion.div>
                                )
                            )}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 border-white rounded-full opacity-70">
                        <div className="w-1 h-3 bg-white rounded-full mx-auto mt-2 animate-pulse"></div>
                    </div>
                </motion.div>
            </section>
            {/* How It Works Section */}
            <section
                className="py-24 bg-gradient-to-br from-gray-50 to-blue-50"
                data-aos="fade-up"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            How <span className="text-gradient">JobOrbit</span>{" "}
                            Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Getting started is easy! Follow these simple steps
                            to land your dream job or find the perfect
                            candidate.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Upload,
                                title: "Create Your Profile",
                                description:
                                    "Sign up and set up your profile as a job seeker or recruiter in minutes.",
                                step: "01",
                                color: "from-blue-500 to-purple-600",
                            },
                            {
                                icon: Search,
                                title: "Explore & Apply",
                                description:
                                    "Browse jobs or candidates, use smart filters, and apply or connect instantly.",
                                step: "02",
                                color: "from-green-500 to-teal-600",
                            },
                            {
                                icon: BarChart3,
                                title: "Track & Succeed",
                                description:
                                    "Monitor your applications or hiring process with real-time updates and analytics.",
                                step: "03",
                                color: "from-orange-500 to-red-600",
                            },
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative group"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.2,
                                }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                            >
                                <div className="bg-white p-8 rounded-2xl shadow-modern hover:shadow-2xl transition-all duration-500 text-center relative overflow-hidden">
                                    {/* Background Pattern */}
                                    <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                                        <div
                                            className={`w-full h-full bg-gradient-to-br ${step.color} rounded-full transform rotate-45`}
                                        ></div>
                                    </div>

                                    {/* Step Number */}
                                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                        {step.step}
                                    </div>

                                    {/* Icon */}
                                    <div
                                        className={`relative z-10 w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <step.icon className="h-10 w-10 text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>

                                    {/* Animated Arrow for Connection */}
                                    {index < 2 && (
                                        <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-20">
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                }}
                                                className="text-blue-400"
                                            >
                                                <ArrowRight className="h-8 w-8" />
                                            </motion.div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                className="py-24 bg-white relative overflow-hidden"
                ref={featuresRef}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)",
                        }}
                    ></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        animate={
                            featuresInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 50 }
                        }
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Why Choose{" "}
                            <span className="text-gradient">JobOrbit?</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our platform combines cutting-edge AI technology
                            with user-friendly design to revolutionize your job
                            search experience.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="group relative cursor-pointer"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={
                                        featuresInView
                                            ? { opacity: 1, y: 0 }
                                            : { opacity: 0, y: 50 }
                                    }
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    onClick={() => handleFeatureClick(feature)}
                                >
                                    <div className="relative bg-white p-8 rounded-3xl shadow-modern hover:shadow-2xl transition-all duration-500 h-full border border-gray-100 overflow-hidden">
                                        {/* Gradient Background on Hover */}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                                        ></div>

                                        {/* Floating Icon */}
                                        <div
                                            className={`relative z-10 w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                                        >
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors text-center">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed text-center">
                                            {feature.description}
                                        </p>

                                        {/* Click indicator */}
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <ArrowRight className="h-5 w-5 text-gray-400" />
                                        </div>

                                        {/* Decorative Element */}
                                        <div className="absolute -bottom-2 -right-2 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <div
                                                className={`w-full h-full bg-gradient-to-br ${feature.color} rounded-full`}
                                            ></div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section
                className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden"
                ref={statsRef}
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -translate-x-36 -translate-y-36 animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 opacity-10 rounded-full translate-x-48 translate-y-48 animate-float"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        animate={
                            statsInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 50 }
                        }
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            Trusted by Thousands Worldwide
                        </h2>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Join the growing community of successful
                            professionals and innovative companies
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="text-center group"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={
                                        statsInView
                                            ? { opacity: 1, scale: 1 }
                                            : { opacity: 0, scale: 0.5 }
                                    }
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.2,
                                    }}
                                >
                                    <div className="relative">
                                        <div className="glass rounded-2xl p-8 group-hover:scale-105 transition-all duration-300">
                                            <Icon className="h-12 w-12 mx-auto mb-4 text-blue-200 group-hover:text-white transition-colors" />
                                            <motion.div
                                                className="text-4xl lg:text-5xl font-bold mb-2"
                                                initial={{ scale: 0 }}
                                                animate={
                                                    statsInView
                                                        ? { scale: 1 }
                                                        : { scale: 0 }
                                                }
                                                transition={{
                                                    duration: 0.8,
                                                    delay: index * 0.2 + 0.5,
                                                    type: "spring",
                                                }}
                                            >
                                                {stat.number}
                                            </motion.div>
                                            <div className="text-lg text-blue-100 font-medium">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-blue-600 rounded-full animate-float"></div>
                    <div
                        className="absolute bottom-20 right-10 w-24 h-24 bg-purple-600 rounded-full animate-float"
                        style={{ animationDelay: "2s" }}
                    ></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            What Our{" "}
                            <span className="text-gradient">Users Say</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Hear from job seekers and recruiters who found
                            success with JobOrbit.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
                            <p className="text-gray-700 italic mb-4">
                                “JobOrbit made my job search so much easier. The
                                resume parsing was spot on and I landed
                                interviews quickly!”
                            </p>
                            <div className="font-semibold text-blue-600">
                                Aarav S.
                            </div>
                            <div className="text-gray-500 text-sm">
                                Software Engineer
                            </div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
                            <p className="text-gray-700 italic mb-4">
                                “As a recruiter, I love the advanced filters and
                                candidate management tools. Highly recommended!”
                            </p>
                            <div className="font-semibold text-blue-600">
                                Priya M.
                            </div>
                            <div className="text-gray-500 text-sm">
                                HR Manager
                            </div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
                            <p className="text-gray-700 italic mb-4">
                                “The application tracking dashboard kept me
                                organized and motivated throughout my job hunt.”
                            </p>
                            <div className="font-semibold text-blue-600">
                                Rahul K.
                            </div>
                            <div className="text-gray-500 text-sm">
                                Marketing Specialist
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Trusted by Leading Companies
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            We are proud to be the choice of top employers and
                            innovative startups across the country.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-8">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                            alt="Microsoft"
                            className="h-10"
                        />
                        <img
                            src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                            alt="Google"
                            className="h-10"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
                            alt="IBM"
                            className="h-10"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1200px-Tesla_Motors.svg.png"
                            alt="Tesla"
                            className="h-10"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1200px-Meta_Platforms_Inc._logo.svg.png"
                            alt="Meta"
                            className="h-10"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png"
                            alt="Amazon"
                            className="h-10"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Join thousands of job seekers and recruiters who trust
                        JobOrbit
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/candidate/signup"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                            Sign Up Now
                        </Link>
                        <Link
                            to="/about"
                            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
