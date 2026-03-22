/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        evzone: {
          green: "#03CD8C",
          orange: "#F77F00",
          navy: "#0f172a",
        },
      },
      borderRadius: {
        phone: "32px",
      },
    },
  },
  plugins: [],
};
