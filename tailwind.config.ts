import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brown: {
          50: '#fdf8f6',
          100: '#f7eae5',
          200: '#e9cfc7',
          300: '#d4a898',
          400: '#b67a5e',
          500: '#9c5a3c',
          600: '#87462d',
          700: '#6b3524',
          800: '#572b20',
          900: '#48241c',
        },
      },
      fontFamily: {
        poppins: "var(--font-poppins)", // Usa la variable CSS
      },
    },
  },
  plugins: [],
} satisfies Config;
