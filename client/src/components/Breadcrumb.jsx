import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    // Define custom breadcrumb names for better UX
    const breadcrumbNameMap = {
        "": "Home",
        candidate: "Candidate",
        recruiter: "Recruiter",
        dashboard: "Dashboard",
        jobs: "Jobs",
        applications: "Applications",
        interviews: "Interviews",
        "upload-resume": "Upload PDF Resume",
        "post-job": "Post Job",
        applicants: "Manage Applicants",
        about: "About Us",
        login: "Login",
        signup: "Sign Up",
    };

    // Don't show breadcrumb on certain pages
    const hideBreadcrumbPages = [
        "/",
        "/candidate/login",
        "/candidate/signup",
        "/recruiter/login",
        "/recruiter/signup",
    ];

    if (hideBreadcrumbPages.includes(location.pathname)) {
        return null;
    }

    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-b border-gray-200 px-4 py-3"
        >
            <div className="max-w-7xl mx-auto">
                <ol className="flex items-center space-x-2 text-sm">
                    <li>
                        <Link
                            to="/"
                            className="flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-200"
                        >
                            <Home className="h-4 w-4" />
                        </Link>
                    </li>

                    {pathnames.map((name, index) => {
                        const routeTo = `/${pathnames
                            .slice(0, index + 1)
                            .join("/")}`;
                        const isLast = index === pathnames.length - 1;
                        const displayName =
                            breadcrumbNameMap[name] ||
                            name.charAt(0).toUpperCase() + name.slice(1);

                        return (
                            <React.Fragment key={routeTo}>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                <li>
                                    {isLast ? (
                                        <span className="text-gray-900 font-medium">
                                            {displayName}
                                        </span>
                                    ) : (
                                        <Link
                                            to={routeTo}
                                            className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            {displayName}
                                        </Link>
                                    )}
                                </li>
                            </React.Fragment>
                        );
                    })}
                </ol>
            </div>
        </motion.nav>
    );
};

export default Breadcrumb;
