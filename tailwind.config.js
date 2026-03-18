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
        phone: "14px",
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        xl: "10px",
        '2xl': '10px',
        '3xl': '12px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};
