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
        "seabrick-blue": "#005493",
        "seabrick-green": "#52b09f"
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

