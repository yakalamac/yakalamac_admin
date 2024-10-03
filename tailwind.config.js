/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      // Add the paths to all of your template files in your tailwind.config.js file.
      "./assets/**/*.js",
      "./templates/**/*.html.twig",
      "./assets/**/*.vue"
      // Add the @tailwind directives for each of Tailwind’s layers to your ./assets/styles/app.css file.
  ],
  theme: {
    extend: {

    },
  },
  plugins: [],
}

