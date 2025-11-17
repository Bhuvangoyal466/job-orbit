import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
    Target,
    Users,
    Award,
    Zap,
    Heart,
    Rocket,
    Shield,
    Globe,
    TrendingUp,
    Star,
    Briefcase,
    CheckCircle,
    ArrowRight,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

const About = () => {
    const values = [
        {
            icon: Target,
            title: "Innovation",
            description:
                "We leverage cutting-edge AI technology to revolutionize the job search experience.",
        },
        {
            icon: Users,
            title: "Community",
            description:
                "Building bridges between talented professionals and forward-thinking companies.",
        },
        {
            icon: Award,
            title: "Excellence",
            description:
                "Committed to delivering the highest quality platform and user experience.",
        },
        {
            icon: Zap,
            title: "Efficiency",
            description:
                "Streamlining the hiring process to save time for both job seekers and recruiters.",
        },
    ];

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center bg-gradient-hero text-white overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full animate-float"></div>
                    <div
                        className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 opacity-10 rounded-full animate-float"
                        style={{ animationDelay: "2s" }}
                    ></div>
                    <div
                        className="absolute top-1/3 right-1/3 w-32 h-32 bg-purple-300 opacity-20 rounded-full animate-bounce-slow"
                        style={{ animationDelay: "1s" }}
                    ></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h1
                            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            About <span className="text-white ">JobOrbit</span>
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Revolutionizing the way people find jobs and
                            companies find talent through intelligent AI
                            technology, seamless user experience, and meaningful
                            connections.
                        </motion.p>

                        {/* Floating Stats */}
                        <motion.div
                            className="flex flex-wrap justify-center gap-8 mt-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                        >
                            {[
                                {
                                    number: "10K+",
                                    label: "Jobs Posted",
                                    icon: Rocket,
                                },
                                {
                                    number: "50K+",
                                    label: "Happy Users",
                                    icon: Users,
                                },
                                {
                                    number: "95%",
                                    label: "Success Rate",
                                    icon: TrendingUp,
                                },
                                {
                                    number: "24/7",
                                    label: "Support",
                                    icon: Shield,
                                },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="glass rounded-2xl p-6 text-center"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.8 + index * 0.1,
                                    }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                >
                                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                                    <div className="text-2xl font-bold">
                                        {stat.number}
                                    </div>
                                    <div className="text-blue-200 text-sm">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Our Mission
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                At JobOrbit, we believe that finding the right
                                job or the perfect candidate shouldn't be a
                                daunting task. Our mission is to simplify and
                                enhance the recruitment process through
                                innovative technology.
                            </p>
                            <p className="text-lg text-gray-600 mb-6">
                                We've built a platform that not only connects
                                job seekers with opportunities but also provides
                                intelligent tools for resume parsing,
                                application tracking, and data-driven insights.
                            </p>
                            <p className="text-lg text-gray-600">
                                Whether you're a job seeker looking for your
                                next opportunity or a recruiter searching for
                                top talent, JobOrbit is designed to make your
                                journey more efficient and successful.
                            </p>
                        </div>
                        <div className="bg-blue-50 p-8 rounded-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Key Features
                            </h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    Smart resume parsing with AI technology
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    Real-time application tracking system
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    Comprehensive dashboard with analytics
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    Advanced job matching algorithms
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Values Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Our Core Values
                        </motion.h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The principles that drive innovation and excellence
                            in everything we do
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="glass p-8 rounded-2xl shadow-2xl text-center border border-white/20 hover:shadow-3xl transition-all duration-300 group"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    viewport={{ once: true }}
                                >
                                    <motion.div
                                        className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                                        whileHover={{
                                            rotate: 360,
                                            scale: 1.1,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 10,
                                        }}
                                    >
                                        <Icon className="h-8 w-8 text-white" />
                                    </motion.div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                                        {value.description}
                                    </p>

                                    {/* Decorative element */}
                                    <motion.div
                                        className="mt-6 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.5 + index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Our Story
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            JobOrbit was founded with a simple vision: to create
                            a more efficient and intelligent job market. Our
                            team of experienced developers, designers, and
                            industry experts came together to build a platform
                            that addresses the real challenges faced by both job
                            seekers and recruiters in today's competitive
                            market.
                        </p>
                    </div>

                    <motion.div
                        className="bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 text-white rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 left-4 w-32 h-32 border border-white rounded-full"></div>
                            <div className="absolute bottom-4 right-4 w-24 h-24 border border-white rounded-full"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white rounded-full"></div>
                        </div>

                        <div className="relative z-10">
                            <motion.div
                                className="flex items-center justify-center gap-3 mb-6"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <motion.div
                                    className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"
                                    animate={{
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <Rocket className="h-8 w-8 text-white" />
                                </motion.div>
                                <h3 className="text-3xl md:text-4xl font-bold">
                                    Ready to Launch Your Career?
                                </h3>
                            </motion.div>

                            <motion.p
                                className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                Join thousands of professionals who have
                                discovered their dream jobs through JobOrbit's
                                intelligent platform
                            </motion.p>

                            <motion.div
                                className="flex flex-col md:flex-row gap-4 justify-center items-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <motion.a
                                    href="/candidate/signup"
                                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg flex items-center gap-2 min-w-[200px] justify-center"
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow:
                                            "0 20px 40px rgba(0,0,0,0.1)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Users className="h-5 w-5" />
                                    Join as Job Seeker
                                </motion.a>

                                <motion.div
                                    className="text-white/60 font-medium"
                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                >
                                    OR
                                </motion.div>

                                <motion.a
                                    href="/recruiter/signup"
                                    className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 min-w-[200px] justify-center"
                                    whileHover={{
                                        scale: 1.05,
                                        backgroundColor:
                                            "rgba(255,255,255,0.9)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Briefcase className="h-5 w-5" />
                                    Hire Top Talent
                                </motion.a>
                            </motion.div>

                            {/* Trust Indicators */}
                            <motion.div
                                className="flex justify-center items-center gap-8 mt-8 text-blue-200"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    <span className="text-sm font-medium">
                                        Secure Platform
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 fill-current" />
                                    <span className="text-sm font-medium">
                                        5-Star Rated
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    <span className="text-sm font-medium">
                                        Global Reach
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Get In Touch
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Have questions, suggestions, or want to partner
                                with us? We'd love to hear from you.
                            </p>

                            <div className="space-y-6">
                                {[
                                    {
                                        icon: Mail,
                                        label: "Email",
                                        value: "hello@joborbit.in",
                                    },
                                    {
                                        icon: Phone,
                                        label: "Phone",
                                        value: "+91-9876543210",
                                    },
                                    {
                                        icon: MapPin,
                                        label: "Address",
                                        value: "Solan, Himachal Pradesh, India",
                                    },
                                ].map((contact, index) => (
                                    <motion.div
                                        key={contact.label}
                                        className="flex items-center gap-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                            <contact.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {contact.label}
                                            </p>
                                            <p className="text-gray-600">
                                                {contact.value}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="space-y-8"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            

                            {/* Company Achievements */}
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                                <h3 className="text-2xl font-bold mb-6">
                                    Our Achievements
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-6 w-6 text-blue-200" />
                                        <span>
                                            AI-powered resume parsing with 95%
                                            accuracy
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-6 w-6 text-blue-200" />
                                        <span>
                                            Real-time application tracking
                                            system
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-6 w-6 text-blue-200" />
                                        <span>
                                            Comprehensive analytics dashboard
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-6 w-6 text-blue-200" />
                                        <span>
                                            Advanced job matching algorithms
                                        </span>
                                    </div>
                                </div>

                                <motion.div
                                    className="mt-6 pt-6 border-t border-white/20"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    <h4 className="text-lg font-bold mb-3">
                                        Future Roadmap
                                    </h4>
                                    <ul className="space-y-2 text-blue-100">
                                        <li>• Video interview integration</li>
                                        <li>• Advanced skill assessments</li>
                                        <li>• Mobile app development</li>
                                        <li>• International expansion</li>
                                    </ul>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
