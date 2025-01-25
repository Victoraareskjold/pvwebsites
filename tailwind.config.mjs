/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        regularOrange: "#FFC069",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },
      height: {
        1380: "1080px",
        820: "1220px",
        800: "680px",
        900: "600px",
      },
    },
  },
  plugins: [],
};
