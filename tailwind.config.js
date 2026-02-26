/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#FFFFFF",
                dark: "#1E293B",
                primary: "#0F172A",
                accent: "#3B82F6",
                ivory: "#F1F5F9", // Repurposing ivory semantic for a light slate grey
                'accent-dark': '#2563EB', // for hover states if needed
            },
            fontFamily: {
                heading: ['Space Mono', 'monospace'],
                drama: ['Space Mono', 'monospace'],
                body: ['Roboto', 'sans-serif'],
                data: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
