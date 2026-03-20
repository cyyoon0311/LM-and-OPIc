/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      spacing: {
        1: '8px',
        2: '16px',
        3: '24px',
        4: '32px',
        5: '40px',
        6: '48px',
        7: '56px',
        8: '64px',
      },
      colors: {
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        white: '#ffffff',
        black: '#171717',
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px', letterSpacing: '-0.5px' }],
        sm: ['14px', { lineHeight: '20px', letterSpacing: '-0.5px' }],
        base: ['16px', { lineHeight: '24px', letterSpacing: '-0.5px' }],
        lg: ['18px', { lineHeight: '28px', letterSpacing: '-0.5px' }],
        xl: ['20px', { lineHeight: '28px', letterSpacing: '-0.5px' }],
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.5px' }],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        lg: '12px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
