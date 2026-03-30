/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        theater: '#0f172a',   // dark background 🌙

        // Prisma-style Status Colors
        success: '#22c55e',
        info: '#06b6d4',
        warning: '#facc15',
        error: '#ef4444',

        // 🎨 Background Variants
        'success-bg': '#dcfce7',
        'info-bg': '#cffafe',
        'warning-bg': '#fef9c3',
        'error-bg': '#fee2e2',

        // 🧠 Neutral
        dark: '#0f172a',
        light: '#f8fafc',

        // Custom colors from your app
        deepTeal: '#007590',
        deepBlue: '#17304F',
        smokyGray: '#6c757d',
        lightGray: '#f8f9fa',
        mediumGray: '#6c757d',
        // skyTeal removed as requested
      }
    },
  },
  plugins: [],
}