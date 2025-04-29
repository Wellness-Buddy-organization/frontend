import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Motivational quotes array
const quotes = [
  "You are stronger than you think.",
  "Every day is a new beginning.",
  "Breathe in courage, breathe out fear.",
  "Progress, not perfection.",
  "You’re not alone-support is here.",
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

const modalVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 18 } },
  exit: { opacity: 0, y: 40, transition: { duration: 0.2 } }
};

function MeditationModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose} aria-label="Close">&times;</button>
            <h2 className="text-xl font-bold mb-4">Guided Meditation</h2>
            <p className="mb-4 text-gray-600">Sit comfortably, close your eyes, and follow this simple breathing meditation:</p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
              <li>Inhale deeply for 4 seconds</li>
              <li>Hold your breath for 4 seconds</li>
              <li>Exhale slowly for 6 seconds</li>
              <li>Repeat for 2-5 minutes</li>
            </ol>
            <p className="text-emerald-600 font-semibold">You are doing great. 💚</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BreathingModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Inhale... 1 2 3 4",
    "Hold... 1 2 3 4",
    "Exhale... 1 2 3 4 5 6",
  ];
  // Simple breathing animation
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative flex flex-col items-center"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose} aria-label="Close">&times;</button>
            <h2 className="text-xl font-bold mb-4">Breathing Exercise</h2>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-2xl text-emerald-600 font-bold">
                {steps[step]}
              </div>
            </motion.div>
            <button
              className="bg-emerald-500 text-white px-4 py-2 rounded shadow"
              onClick={() => setStep((step + 1) % steps.length)}
            >
              Next
            </button>
            <p className="mt-4 text-gray-500 text-sm">Repeat several cycles for best results.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CrisisModal({ open, onClose }) {
  // Example: US and India helplines; customize as needed
  const helplines = [
    { country: "USA", text: "988 Suicide & Crisis Lifeline", phone: "988" },
    { country: "India", text: "Kiran Mental Health Helpline", phone: "1800-599-0019" },
    { country: "UK", text: "Samaritans", phone: "116 123" },
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose} aria-label="Close">&times;</button>
            <h2 className="text-xl font-bold mb-4 text-red-600">Crisis Support</h2>
            <p className="mb-4 text-gray-600">If you or someone you know is in crisis, please reach out immediately:</p>
            <ul className="space-y-2">
              {helplines.map(h => (
                <li key={h.phone} className="flex items-center gap-2">
                  <span className="font-bold">{h.country}:</span>
                  <span>{h.text}</span>
                  <a href={`tel:${h.phone}`} className="text-blue-600 underline">{h.phone}</a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-gray-500 text-sm">
              Your safety matters. All calls are confidential and free.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function MentalHealthSupport() {
  const [medOpen, setMedOpen] = useState(false);
  const [breathOpen, setBreathOpen] = useState(false);
  const [crisisOpen, setCrisisOpen] = useState(false);
  const [quote, setQuote] = useState(getRandomQuote());

  return (
    <section className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 col-span-1 md:col-span-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Mental Health Support</h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4 mb-4"
      >
        <motion.button
          whileHover={{ scale: 1.07, backgroundColor: "#2563eb" }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow transition-colors"
          onClick={() => setMedOpen(true)}
        >
          Start Meditation
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.07, backgroundColor: "#7c3aed" }}
          whileTap={{ scale: 0.95 }}
          className="bg-purple-500 text-white px-4 py-2 rounded shadow transition-colors"
          onClick={() => setBreathOpen(true)}
        >
          Breathing Exercise
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.07, backgroundColor: "#dc2626" }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-500 text-white px-4 py-2 rounded shadow transition-colors"
          onClick={() => setCrisisOpen(true)}
        >
          Get Help
        </motion.button>
      </motion.div>
      <div className="mt-2 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="bg-emerald-50 rounded-lg p-4 text-emerald-700 text-lg italic shadow">
            “{quote}”
          </div>
        </div>
        <button
          className="ml-0 md:ml-4 text-emerald-500 hover:underline"
          onClick={() => setQuote(getRandomQuote())}
        >
          New Quote
        </button>
      </div>
      <MeditationModal open={medOpen} onClose={() => setMedOpen(false)} />
      <BreathingModal open={breathOpen} onClose={() => setBreathOpen(false)} />
      <CrisisModal open={crisisOpen} onClose={() => setCrisisOpen(false)} />
    </section>
  );
}
