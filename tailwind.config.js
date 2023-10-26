/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'primary': '#FAFBFF',
        'secondary': '#F0F1F7',
        'tertiary': '#C4C6CB',
        
      },
      textColor: {
        'primary': '#27282C',
        'secondary': '#494A4E',
        'tertiary': '#68696E',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'md': '0.375rem',
        DEFAULT: '0.5rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}
