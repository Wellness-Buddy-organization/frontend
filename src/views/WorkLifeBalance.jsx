import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Demo productivity insights (in a real app, fetch from backend)
const productivityData = [
  { label: 'Work Hours Today', value: 7, goal: 8, color: 'emerald' },
  { label: 'Breaks Taken', value: 2, goal: 3, color: 'blue' },
  { label: 'Screen Time (hrs)', value: 6, goal: 5, color: 'red' },
];

// Motivational quotes for balance
const quotes = [
  "Balance is not better time management, but better boundary management.",
  "You don’t have to make yourself miserable to be successful.",
  "Rest is not idleness.",
  "A healthy outside starts from the inside.",
  "You will never feel truly satisfied by work until you are satisfied by life.",
];

// Loader
function Loader() {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-pulse"></div>
        <div className="absolute inset-2 border-4 border-emerald-400 rounded-full animate-pulse"></div>
        <div className="absolute inset-4 border-4 border-emerald-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

// Break reminder modal
function BreakReminderModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
            aria-label="Break Reminder"
          >
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose} aria-label="Close">&times;</button>
            <h2 className="text-xl font-bold mb-4">Time for a Break!</h2>
            <p className="mb-4 text-gray-600">Step away from your screen, stretch, hydrate, or take a short walk. Your well-being matters.</p>
            <button
              className="bg-emerald-500 text-white px-4 py-2 rounded shadow"
              onClick={onClose}
            >
              Got it!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const WorkLifeBalance = () => {
  // If you add backend integration, use loading/unauthorized state
  const [loading] = useState(false); // set to true when fetching async data
  const navigate = useNavigate(); // For unauthorized navigation if needed

  const [workHours, setWorkHours] = useState('');
  const [breaks, setBreaks] = useState(0);
  const [screenTime, setScreenTime] = useState('');
  const [reminderOpen, setReminderOpen] = useState(false);
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  // Simulate logging work hours and breaks
  const handleLogWork = (e) => {
    e.preventDefault();
    if (workHours) setWorkHours('');
  };
  const handleLogBreak = () => {
    setBreaks(breaks + 1);
    setReminderOpen(true);
  };

  // Example: If you add backend, handle 401 like this
  // useEffect(() => {
  //   if (/* unauthorized condition */) navigate('/unauthorized');
  // }, [navigate]);

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Work-Life Balance</h1>

      {/* Productivity Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {productivityData.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-${item.color}-50 rounded-2xl shadow p-6 flex flex-col items-center`}
          >
            <span className={`text-3xl font-bold text-${item.color}-600`}>
              {item.value}
              <span className="text-lg text-gray-400">/{item.goal}</span>
            </span>
            <span className="text-gray-700 mt-2">{item.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Work Hour Tracking & Break Logging */}
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-8 mb-8">
        <form onSubmit={handleLogWork} className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <div>
            <label className="block text-gray-600 mb-1">Log Work Hours</label>
            <input
              type="number"
              min="0"
              max="24"
              value={workHours}
              onChange={e => setWorkHours(e.target.value)}
              className="border rounded px-2 py-1 w-24"
              placeholder="e.g. 8"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-500 text-white px-4 py-2 rounded mt-2 md:mt-6"
          >
            Save Work Hours
          </button>
        </form>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-gray-600">Breaks Taken Today:</span>
          <span className="text-emerald-600 font-semibold">{breaks}</span>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleLogBreak}
          >
            Log Break
          </button>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Screen Time (hours)</label>
          <input
            type="number"
            min="0"
            max="24"
            value={screenTime}
            onChange={e => setScreenTime(e.target.value)}
            className="border rounded px-2 py-1 w-24"
            placeholder="e.g. 6"
          />
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-emerald-50 rounded-2xl shadow p-6 flex flex-col items-center mb-8">
        <span className="italic text-lg text-emerald-700 text-center">“{quote}”</span>
        <button
          className="mt-2 text-emerald-500 underline"
          onClick={() => setQuote(quotes[Math.floor(Math.random() * quotes.length)])}
        >
          New Quote
        </button>
      </div>

      {/* Tips for Work-Life Balance */}
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-blue-100 p-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Tips for a Healthy Work-Life Balance</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Set clear boundaries between work and personal time.</li>
          <li>Take regular breaks-move, stretch, hydrate.</li>
          <li>Track your work hours and screen time to avoid burnout.</li>
          <li>Prioritize quality sleep and healthy meals.</li>
          <li>Practice mindfulness or meditation daily.</li>
          <li>Celebrate achievements, big or small.</li>
          <li>Connect with friends, family, and your community.</li>
        </ul>
      </div>

      {/* Break Reminder Modal */}
      <BreakReminderModal open={reminderOpen} onClose={() => setReminderOpen(false)} />
    </motion.div>
  );
};

export default WorkLifeBalance;
