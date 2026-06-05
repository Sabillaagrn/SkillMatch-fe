/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette derived from the SkillMatch Figma design.
        brand: {
          50: "#eff5ff",
          100: "#dbe7fe",
          200: "#bfd3fe",
          300: "#93b4fd",
          400: "#608cfa",
          500: "#3b6bf6",
          600: "#1d4ed8", // primary buttons / active nav
          700: "#1a44bd",
          800: "#1b3a99",
          900: "#1b3479",
        },
        emerald: {
          500: "#10b981",
          600: "#059669",
        },
        ink: "#0f172a",
        muted: "#64748b",
        canvas: "#f6f8fc",
        line: "#e8edf5",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.04), 0 4px 16px rgba(16,24,40,.05)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
