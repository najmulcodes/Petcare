/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fff4f1",
          100: "#ffe4dc",
          200: "#ffc5b3",
          300: "#ff9e85",
          400: "#ff7a5c",
          500: "#ff5a35",
          600: "#e83d1a",
          700: "#c42e10",
          800: "#9e2610",
          900: "#7a1f0e",
        },
        warm: {
          50:  "#f6eee9",
          100: "#eeddd3",
          200: "#dfc2b0",
          300: "#cba08a",
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 16px rgba(0,0,0,0.06)",
        card: "0 4px 24px rgba(0,0,0,0.07)",
      },
    },
  },
  plugins: [],
};
