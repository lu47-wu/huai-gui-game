/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        detective: {
          paper: '#f5f1e6',
          paperDark: '#e8e3d8',
          ink: '#1a1a1a',
          accent: '#991b1b', // 暗宝石红 - 主强调色
          secondary: '#d2b48c',
          dark: '#2c1e1e',
          darkTexture: '#251a1a',
          light: '#f9f6f0',
          highlight: '#b8860b',
          red: '#a0522d',
          green: '#556b2f',
        },
        semantic: {
          ai: '#556b2f',
          user: '#991b1b', // 暗宝石红 - 主强调色
          incorrect: '#a0522d',
          neutral: '#6b5a48',
        },
        hint: '#991b1b', // 暗宝石红 - 用于汤的浓度图标
      },
      fontFamily: {
        typewriter: ['Courier Prime', 'monospace'],
        serif: ['Crimson Text', 'Playfair Display', 'serif'],
        sans: ['Noto Sans', 'sans-serif'],
      },
      boxShadow: {
        'vintage': '3px 3px 0px rgba(0, 0, 0, 0.2)',
        'vintage-hover': '5px 5px 0px rgba(0, 0, 0, 0.3)',
        'inner-vintage': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'paper-texture': "url('https://www.transparenttextures.com/patterns/old-paper.png')",
        'dark-texture': "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
        'marble-texture': "url('https://www.transparenttextures.com/patterns/marble.png')",
        'detective-bg': "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
      },
    },
  },
  plugins: [],
}