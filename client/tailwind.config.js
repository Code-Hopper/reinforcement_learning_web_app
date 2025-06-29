/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: "#09122c",      // rgb(9, 18, 44)
        secondaryColor: "#872341",    // rgb(135, 35, 65)
        accentColor: "#be3144",       // rgb(190, 49, 68)
        highlightColor: "#e17564",    // rgb(225, 117, 100)
        backgroundLight: "#e1e1e1",   // rgb(225, 225, 225)
        backgroundDark: "#191919",    // rgb(25, 25, 25)
      },
    },
  },
  plugins: [],
}
