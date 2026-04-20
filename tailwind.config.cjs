/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                theater: '#0f172a',
                dark: '#0f172a',
                light: '#f8fafc',
                lightGray: '#f8f9fa',
                smokyGray: '#6c757d',
                mediumGray: '#6c757d',
                primary: '#007590',
                secondary: '#17304F',
                success: {
                    DEFAULT: '#22c55e',
                    bg: '#dcfce7',
                },
                info: {
                    DEFAULT: '#06b6d4',
                    bg: '#cffafe',
                },
                warning: {
                    DEFAULT: '#facc15',
                    bg: '#fef9c3',
                },
                error: {
                    DEFAULT: '#ef4444',
                    bg: '#fee2e2',
                },
                deepTeal: '#007590',
                deepBlue: '#17304F',
            }
        },
    },
    plugins: [],
}