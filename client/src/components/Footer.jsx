import React from "react";
import { Link } from "react-router-dom";
import {
    Briefcase,
    Mail,
    Phone,
    MapPin,
    Github,
    Linkedin,
    Twitter,
    Heart,
    ArrowUp,
} from "lucide-react";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="relative bg-linear-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full -translate-x-48 -translate-y-48"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500 rounded-full translate-x-40 translate-y-40"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <motion.div
                        className="col-span-1 md:col-span-2"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <motion.div
                                className="p-3 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl"
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Briefcase className="h-8 w-8 text-white" />
                            </motion.div>
                            <span className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                JobOrbit
                            </span>
                        </div>
                        <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                            Your smart job board platform with AI-powered resume
                            parsing, intelligent matching, and comprehensive
                            application tracking. Connect with opportunities
                            that matter.
                        </p>
                        <div className="flex space-x-4">
                            {[
                                { Icon: Github, href: "#", label: "GitHub" },
                                {
                                    Icon: Linkedin,
                                    href: "#",
                                    label: "LinkedIn",
                                },
                                { Icon: Twitter, href: "#", label: "Twitter" },
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    className="p-3 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={social.label}
                                >
                                    <social.Icon className="h-6 w-6 text-gray-300 hover:text-white transition-colors" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-xl font-bold mb-6 text-blue-300">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { to: "/", label: "Home" },
                                { to: "/about", label: "About Us" },
                                { to: "/candidate/jobs", label: "Browse Jobs" },
                                {
                                    to: "/candidate/signup",
                                    label: "Job Seekers",
                                },
                                {
                                    to: "/recruiter/signup",
                                    label: "Recruiters",
                                },
                            ].map((link, index) => (
                                <motion.li key={index} whileHover={{ x: 5 }}>
                                    <Link
                                        to={link.to}
                                        className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:underline"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-xl font-bold mb-6 text-purple-300">
                            Get in Touch
                        </h3>
                        <div className="space-y-4">
                            {[
                                {
                                    Icon: Mail,
                                    text: "contact@joborbit.in",
                                    href: "mailto:contact@joborbit.in",
                                },
                                {
                                    Icon: Phone,
                                    text: "+91-9876543210",
                                    href: "tel:+919876543210",
                                },
                                {
                                    Icon: MapPin,
                                    text: "Solan, Himachal Pradesh, India",
                                    href: "#",
                                },
                            ].map((contact, index) => (
                                <motion.a
                                    key={index}
                                    href={contact.href}
                                    className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-all duration-300 group"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                        <contact.Icon className="h-4 w-4" />
                                    </div>
                                    <span>{contact.text}</span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <motion.div
                    className="border-t border-white/20 mt-12 pt-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400 flex items-center gap-2">
                            &copy; 2025 JobOrbit. Made with
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <Heart className="h-4 w-4 text-red-500 fill-current" />
                            </motion.span>
                            for job seekers and recruiters
                        </p>

                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <a
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                Support
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll to Top Button */}
            <motion.button
                onClick={scrollToTop}
                className="fixed bottom-8 left-8 p-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-glow-hover transition-all duration-300 z-50"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1 }}
            >
                <ArrowUp className="h-6 w-6" />
            </motion.button>
        </footer>
    );
};

export default Footer;
