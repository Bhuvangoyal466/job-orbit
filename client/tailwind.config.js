/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6",
                    600: "#2563eb",
                    700: "#1d4ed8",
                    800: "#1e40af",
                    900: "#1e3a8a",
                },
                secondary: {
                    50: "#f0f9ff",
                    100: "#e0f2fe",
                    200: "#bae6fd",
                    300: "#7dd3fc",
                    400: "#38bdf8",
                    500: "#0ea5e9",
                    600: "#0284c7",
                    700: "#0369a1",
                    800: "#075985",
                    900: "#0c4a6e",
                },
                accent: {
                    50: "#fef7ff",
                    100: "#fdf2ff",
                    200: "#fae8ff",
                    300: "#f5d0fe",
                    400: "#f0abfc",
                    500: "#e879f9",
                    600: "#d946ef",
                    700: "#c026d3",
                    800: "#a21caf",
                    900: "#86198f",
                },
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out",
                "slide-up": "slideUp 0.5s ease-out",
                "slide-down": "slideDown 0.5s ease-out",
                "slide-left": "slideLeft 0.5s ease-out",
                "slide-right": "slideRight 0.5s ease-out",
                "bounce-slow": "bounce 2s infinite",
                "pulse-slow": "pulse 3s infinite",
                float: "float 3s ease-in-out infinite",
                glow: "glow 2s ease-in-out infinite alternate",
                gradient: "gradient 3s ease infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                slideDown: {
                    "0%": { transform: "translateY(-20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                slideLeft: {
                    "0%": { transform: "translateX(20px)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                slideRight: {
                    "0%": { transform: "translateX(-20px)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                glow: {
                    "0%": {
                        boxShadow:
                            "0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 15px #3b82f6",
                    },
                    "100%": {
                        boxShadow:
                            "0 0 10px #3b82f6, 0 0 20px #3b82f6, 0 0 30px #3b82f6",
                    },
                },
                gradient: {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                },
            },
            backdropBlur: {
                xs: "2px",
            },
            backgroundSize: {
                "200%": "200%",
                "300%": "300%",
            },
        },
    },
    plugins: [],
};
