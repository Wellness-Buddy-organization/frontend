import { motion } from 'framer-motion';

const WellnessTracking = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-4"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Wellness Tracking</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Mood & Stress Tracker */}
        <section className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Daily Mood & Stress</h2>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-gray-600">How do you feel today?</span>
            {/* Replace with mood emoji/rating component */}
            <input type="range" min="1" max="5" className="w-32" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Stress Level:</span>
            {/* Replace with stress level slider */}
            <input type="range" min="1" max="5" className="w-32" />
          </div>
        </section>

        {/* Sleep & Work Hours */}
        <section className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Sleep & Work Hours</h2>
          <div className="mb-2">
            <label className="block text-gray-600">Sleep Duration (hours):</label>
            <input type="number" min="0" max="24" className="border rounded px-2 py-1 w-24" />
          </div>
          <div>
            <label className="block text-gray-600">Work Hours Today:</label>
            <input type="number" min="0" max="24" className="border rounded px-2 py-1 w-24" />
          </div>
        </section>

        {/* Break Time Tracker */}
        <section className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Break Time Tracker</h2>
          <p className="text-gray-600 mb-2">Log your breaks to maintain productivity and well-being.</p>
          <button className="bg-emerald-500 text-white px-4 py-2 rounded">Log Break</button>
        </section>

        {/* Smart Reminders */}
        <section className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Smart Reminders</h2>
          <ul className="text-gray-600 space-y-1">
            <li>💧 Water Intake</li>
            <li>🍽️ Meal Times</li>
            <li>👀 Eye Rest</li>
          </ul>
          <button className="mt-2 bg-emerald-500 text-white px-4 py-2 rounded">Manage Reminders</button>
        </section>

        {/* Mental Health Support */}
        <section className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Mental Health Support</h2>
          <div className="flex gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Start Meditation</button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded">Breathing Exercise</button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded">Get Help</button>
          </div>
        </section>

        {/* Analytics Overview */}
        <section className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Your Wellness Insights</h2>
          <p className="text-gray-600">Visualize your mood, stress, sleep, and productivity trends over time.</p>
          {/* Placeholder for charts/graphs */}
          <div className="bg-gray-100 h-32 rounded mt-3 flex items-center justify-center text-gray-400">[Charts Coming Soon]</div>
        </section>
      </div>
    </motion.div>
  );
};

export default WellnessTracking;
