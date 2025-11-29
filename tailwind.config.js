/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
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
