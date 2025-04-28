Wellness App Frontend
Overview
This is the frontend for the Wellness App, built with React.js and styled with Tailwind CSS, following the MVC architecture pattern (Components as Views).
Setup Instructions

Install dependencies:npm install


Ensure the backend is running on http://localhost:5000.
Start the development server:npm start



Tailwind CSS Setup

Tailwind CSS is included via CDN in public/index.html for simplicity.
For production, consider installing Tailwind CSS as a dependency:npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


Update tailwind.config.js:module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


Create src/styles/tailwind.css:@tailwind base;
@tailwind components;
@tailwind utilities;


Import in src/App.js.



Project Structure

components/: Reusable UI components
views/: Page-level components
styles/: Tailwind CSS styles
App.js: Main app component with routing

Available Routes

/: Landing page
/dashboard: Dashboard view

