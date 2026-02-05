/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    black: '#050505',
                    dark: '#121212',
                    red: '#D90429', // A slightly deeper red for better contrast, or #FF1E1E from plan
                    redHover: '#EF233C',
                    gray: '#2B2D42',
                    text: '#EDF2F4'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Assuming Inter or similar
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'pulse-glow': 'pulseGlow 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 10px #D90429' },
                    '50%': { boxShadow: '0 0 20px #EF233C' },
                }
            }
        },
    },
    plugins: [],
}
