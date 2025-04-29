import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Motivational quotes
const quotes = [
  "You are stronger than you think.",
  "Every day is a new beginning.",
  "Breathe in courage, breathe out fear.",
  "Progress, not perfection.",
  "You’re not alone-support is here.",
];

// Mood options
const moods = [
  { value: 1, label: "😠 Angry" },
  { value: 2, label: "😢 Sad" },
  { value: 3, label: "😰 Anxious" },
  { value: 4, label: "😐 Neutral" },
  { value: 5, label: "😊 Happy" },
];

// Helplines
const helplines = [
  { country: "Sri Lanka", text: "CCCline", phone: "1333" },
  { country: "USA", text: "988 Suicide & Crisis Lifeline", phone: "988" },
  { country: "India", text: "Kiran Helpline", phone: "1800-599-0019" },
  { country: "UK", text: "Samaritans", phone: "116 123" },
];

// --- Modals ---
function MeditationModal({ open, onClose }) {
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
            aria-label="Guided Meditation"
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
  // Split step into title and numbers for better centering
  const [title, ...numbers] = steps[step].split('...');
  const numbersArr = numbers.join('').trim().split(' ');
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
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative flex flex-col items-center"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
            aria-label="Breathing Exercise"
          >
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose} aria-label="Close">&times;</button>
            <h2 className="text-xl font-bold mb-4">Breathing Exercise</h2>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="mb-6"
            >
              <div className="w-36 h-36 bg-emerald-100 rounded-full flex flex-col items-center justify-center text-emerald-600 font-bold text-center shadow-lg">
                <span className="text-2xl mb-1">{title}...</span>
                <span className="text-2xl">
                  {numbersArr.map((num, i) => (
                    <span key={i} className="inline-block mr-1">{num}</span>
                  ))}
                </span>
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
            aria-label="Crisis Support"
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

const MentalHealth = () => {
  const [medOpen, setMedOpen] = useState(false);
  const [breathOpen, setBreathOpen] = useState(false);
  const [crisisOpen, setCrisisOpen] = useState(false);
  const [mood, setMood] = useState(3);
  const [journal, setJournal] = useState('');
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);
  const [journalEntries, setJournalEntries] = useState([]);

  // Save mood/journal entry
  const handleJournalSubmit = (e) => {
    e.preventDefault();
    if (journal.trim()) {
      setJournalEntries([
        { mood, journal, date: new Date().toLocaleString() },
        ...journalEntries,
      ]);
      setJournal('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mental Health Support</h1>

      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Guided Tools */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Guided Tools</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                onClick={() => setMedOpen(true)}
              >
                Guided Meditation
              </button>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded shadow hover:bg-purple-600 transition"
                onClick={() => setBreathOpen(true)}
              >
                Breathing Exercise
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
                onClick={() => setCrisisOpen(true)}
              >
                Crisis Support
              </button>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 text-emerald-700 text-lg italic shadow mb-4">
              “{quote}”
              <button
                className="ml-4 text-emerald-500 underline text-sm"
                onClick={() =>
                  setQuote(quotes[Math.floor(Math.random() * quotes.length)])
                }
                aria-label="New quote"
              >
                New Quote
              </button>
            </div>
          </div>

          {/* Mood and Journal */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Mood & Journal</h2>
            <form onSubmit={handleJournalSubmit} className="space-y-3">
              <div>
                <label className="block text-gray-600 mb-1">How do you feel today?</label>
                <div className="flex gap-2">
                  {moods.map(m => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMood(m.value)}
                      className={`px-3 py-1 rounded text-2xl border-2 ${
                        mood === m.value
                          ? 'border-emerald-500 bg-emerald-100'
                          : 'border-transparent hover:bg-emerald-50'
                      }`}
                      aria-label={m.label}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Journal</label>
                <textarea
                  className="w-full border rounded px-2 py-1"
                  rows={3}
                  placeholder="Write your thoughts..."
                  value={journal}
                  onChange={e => setJournal(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition"
              >
                Save Entry
              </button>
            </form>
            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-700 mb-2">Your Journal Entries</h3>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {journalEntries.length === 0 && (
                  <li className="text-gray-400">No entries yet.</li>
                )}
                {journalEntries.map((entry, i) => (
                  <li key={i} className="bg-gray-50 rounded p-2 text-sm flex items-center gap-2">
                    <span className="text-xl">{moods.find(m => m.value === entry.mood)?.label.split(' ')[0]}</span>
                    <span className="flex-1">{entry.journal}</span>
                    <span className="text-xs text-gray-400">{entry.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MeditationModal open={medOpen} onClose={() => setMedOpen(false)} />
      <BreathingModal open={breathOpen} onClose={() => setBreathOpen(false)} />
      <CrisisModal open={crisisOpen} onClose={() => setCrisisOpen(false)} />
    </motion.div>
  );
};

export default MentalHealth;
