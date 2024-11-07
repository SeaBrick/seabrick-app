import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "seabrick-blue": "#2069a0",
        "seabrick-green": "#52b09f",
        "text-gray":"#333;"
      },
      boxShadow:{
        '2md':'0px 4px 5px 0px rgba(0, 0, 0, 0.05);'        
      },
      borderRadius: {
        'banner': '0px 0px 50px 50px',
      },
      width: {
        'banner': '1920px',
      },
      height: {
        'banner': '414px',
      }
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('not-first-last', '&:not(:last-child):not(:first-child)')
      addVariant('first-last', ['&:first-child', '&:last-child'])
      addVariant('direct-children', '&>*')
      addVariant("not-first", '&:not(:first-child)')
      addVariant("not-last", '&:not(:last-child)')
    }),
  ],
}

