/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00a8f0',
          light: '#33beff',
          dark: '#0086c0',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable to avoid conflicts with Ant Design
  },
};
