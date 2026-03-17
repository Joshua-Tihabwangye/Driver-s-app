/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        evzone: {
          green: "var(--evz-brand-green)",
          orange: "var(--evz-brand-orange)",
          navy: "var(--evz-navy)",
        },
        brand: {
          primary: "var(--evz-brand-green)",
          secondary: "var(--evz-brand-orange)",
          active: "var(--evz-active)",
          inactive: "var(--evz-inactive)",
          highlight: "var(--evz-highlight)",
          success: "var(--evz-success)",
          warning: "var(--evz-warning)",
        }
      },
      borderRadius: {
        phone: "24px",
      },
    },
  },
  plugins: [],
};
