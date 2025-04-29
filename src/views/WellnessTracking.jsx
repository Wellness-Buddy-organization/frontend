import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// KPI Dashboard: mood, stress, sleep, work, hydration, breaks, reminders
const moodMap = [
  { value: 1, label: "angry", emoji: "😠" },
  { value: 2, label: "sad", emoji: "😢" },
  { value: 3, label: "anxious", emoji: "😰" },
  { value: 4, label: "neutral", emoji: "😐" },
  { value: 5, label: "happy", emoji: "😊" },
];

// --- Animated, Draggable Modal ---
function DraggableModal({ open, onClose, children, ariaLabel }) {
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
            drag
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            dragElastic={0.2}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative cursor-move"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
            aria-label={ariaLabel}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Manage Reminders Modal ---
function ManageRemindersModal({ open, onClose, reminders, setReminders }) {
  const [form, setForm] = useState({ type: "water", time: "", enabled: true });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: "/api",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const res = await api.put(`/reminder/${editingId}`, form);
      setReminders(reminders.map((r) => (r._id === editingId ? res.data : r)));
    } else {
      const res = await api.post("/reminder", form);
      setReminders([...reminders, res.data]);
    }
    setForm({ type: "water", time: "", enabled: true });
    setEditingId(null);
  };

  const handleEdit = (reminder) => {
    setForm({
      type: reminder.type,
      time: reminder.time,
      enabled: reminder.enabled,
    });
    setEditingId(reminder._id);
  };

  const handleDelete = async (id) => {
    await api.delete(`/reminder/${id}`);
    setReminders(reminders.filter((r) => r._id !== id));
    if (editingId === id) setEditingId(null);
  };

  return (
    <DraggableModal open={open} onClose={onClose} ariaLabel="Manage Reminders">
      <h2 className="text-xl font-bold mb-4">
        {editingId ? "Edit Reminder" : "Add Reminder"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-gray-600 mb-1">Type</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            required
          >
            <option value="water">💧 Water</option>
            <option value="meal">🍽️ Meal</option>
            <option value="eye_rest">👀 Eye Rest</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">
            Time (24h, e.g. 14:00)
          </label>
          <input
            type="time"
            className="w-full border rounded px-2 py-1"
            value={form.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) =>
              setForm((f) => ({ ...f, enabled: e.target.checked }))
            }
            id="enabled"
          />
          <label htmlFor="enabled" className="text-gray-600">
            Enabled
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition"
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
              onClick={() => {
                setForm({ type: "water", time: "", enabled: true });
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <hr className="my-4" />
      <h3 className="font-semibold mb-2">Your Reminders</h3>
      <ul className="space-y-2 max-h-40 overflow-y-auto">
        {reminders.length === 0 && (
          <li className="text-gray-400">No reminders yet.</li>
        )}
        {reminders.map((reminder) => (
          <li
            key={reminder._id}
            className="flex items-center justify-between bg-emerald-50 rounded px-3 py-2"
          >
            <span>
              {reminder.type === "water" && "💧 "}
              {reminder.type === "meal" && "🍽️ "}
              {reminder.type === "eye_rest" && "👀 "}
              {reminder.type} at {reminder.time}
              {!reminder.enabled && (
                <span className="ml-2 text-xs text-gray-400">(disabled)</span>
              )}
            </span>
            <span className="flex gap-2">
              <button
                className="text-emerald-600 hover:underline"
                onClick={() => handleEdit(reminder)}
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleDelete(reminder._id)}
              >
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
    </DraggableModal>
  );
}

// --- Meditation Modal ---
function MeditationModal({ open, onClose }) {
  return (
    <DraggableModal open={open} onClose={onClose} ariaLabel="Guided Meditation">
      <h2 className="text-xl font-bold mb-4">Guided Meditation</h2>
      <p className="mb-4 text-gray-600">
        Sit comfortably, close your eyes, and follow this simple breathing
        meditation:
      </p>
      <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
        <li>Inhale deeply for 4 seconds</li>
        <li>Hold your breath for 4 seconds</li>
        <li>Exhale slowly for 6 seconds</li>
        <li>Repeat for 2-5 minutes</li>
      </ol>
      <p className="text-emerald-600 font-semibold">You are doing great. 💚</p>
    </DraggableModal>
  );
}

// --- Breathing Modal ---
function BreathingModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Inhale... 1 2 3 4",
    "Hold... 1 2 3 4",
    "Exhale... 1 2 3 4 5 6",
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="breathing-modal"
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
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
            aria-label="Breathing Exercise"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Breathing Exercise</h2>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="mb-6"
            >
              <div className="w-36 h-36 bg-emerald-100 rounded-full flex flex-col items-center justify-center text-emerald-600 font-bold text-center shadow-lg">
                <span className="text-2xl mb-1">
                  {steps[step].split("...")[0]}...
                </span>
                <span className="text-2xl">
                  {steps[step]
                    .replace(/.*\.\.\./, "")
                    .trim()
                    .split(" ")
                    .map((num, i) => (
                      <span key={i} className="inline-block mr-1">
                        {num}
                      </span>
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
            <p className="mt-4 text-gray-500 text-sm">
              Repeat several cycles for best results.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Main WellnessTracking Component ---
const WellnessTracking = () => {
  const [moodValue, setMoodValue] = useState(4);
  const [stressValue, setStressValue] = useState(4);
  const [sleepHours, setSleepHours] = useState("");
  const [workHours, setWorkHours] = useState("");
  const [breaks, setBreaks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [medOpen, setMedOpen] = useState(false);
  const [breathOpen, setBreathOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);

  // Axios instance with auth
  const api = axios.create({
    baseURL: "/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  // Real-time data update pattern (interval polling, ready for live data)[2]
  useEffect(() => {
    let interval;
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [dashboardRes, remindersRes, breaksRes] = await Promise.all([
          api.get("/dashboard/me"),
          api.get("/reminder"),
          api.get("/break"),
        ]);
        setDashboard(dashboardRes.data?.wellness);
        setReminders(remindersRes.data);
        setBreaks(breaksRes.data);
      } catch (err) {
        if (err.response?.status === 401)
          setError("Unauthorized. Please log in.");
        else if (err.response?.status === 404) setError("Some data not found.");
        else setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // Example: update every 2 minutes for near real-time dashboard[2]
    interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // --- KPI Dashboard UI ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 border-4 border-emerald-400 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 border-4 border-emerald-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-4"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Wellness Tracking
      </h1>

      {(error || success) && (
        <motion.div
          key={error ? "error" : "success"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mb-4 px-4 py-2 rounded shadow ${
            error
              ? "bg-red-100 text-red-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {error || success}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mood & Stress Tracker */}
        <section className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Daily Mood & Stress
          </h2>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-gray-600">How do you feel today?</span>
            <input
              type="range"
              min="1"
              max="5"
              value={moodValue}
              onChange={(e) => setMoodValue(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-2xl">
              {moodMap.find((m) => m.value === Number(moodValue)).emoji}
            </span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-gray-600">Stress Level:</span>
            <input
              type="range"
              min="1"
              max="5"
              value={stressValue}
              onChange={(e) => setStressValue(Number(e.target.value))}
              className="w-32"
            />
            <span>{stressValue}</span>
          </div>
          <button
            className="bg-emerald-500 text-white px-4 py-2 rounded"
            onClick={async () => {
              setError("");
              setSuccess("");
              try {
                const moodObj = moodMap.find(
                  (m) => m.value === Number(moodValue)
                );
                await api.post("/mood", {
                  mood: moodObj.label,
                  notes: `Stress: ${stressValue}`,
                });
                setSuccess("Mood saved!");
                setTimeout(() => setSuccess(""), 2000);
              } catch {
                setError("Failed to save mood.");
                setTimeout(() => setError(""), 3000);
              }
            }}
          >
            Save Mood
          </button>
        </section>

        {/* Sleep & Work Hours */}
        <section className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Sleep & Work Hours
          </h2>
          <div className="mb-2">
            <label className="block text-gray-600">
              Sleep Duration (hours):
            </label>
            <input
              type="number"
              min="0"
              max="24"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="border rounded px-2 py-1 w-24"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Work Hours Today:</label>
            <input
              type="number"
              min="0"
              max="24"
              value={workHours}
              onChange={(e) => setWorkHours(e.target.value)}
              className="border rounded px-2 py-1 w-24"
            />
          </div>
          <button
            className="bg-emerald-500 text-white px-4 py-2 rounded"
            onClick={async () => {
              setError("");
              setSuccess("");
              try {
                if (sleepHours) {
                  await api.post("/sleep", {
                    hours: sleepHours,
                    quality: "good",
                  });
                }
                if (workHours) {
                  await api.post("/work", {
                    hours: workHours,
                  });
                }
                setSuccess("Sleep/work hours saved!");
                setTimeout(() => setSuccess(""), 2000);
              } catch {
                setError("Failed to save sleep or work hours.");
                setTimeout(() => setError(""), 3000);
              }
            }}
          >
            Save Sleep & Work
          </button>
        </section>

        {/* Break Time Tracker */}
        <section className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Break Time Tracker
          </h2>
          <p className="text-gray-600 mb-2">
            Log your breaks to maintain productivity and well-being.
          </p>
          <button
            className="bg-emerald-500 text-white px-4 py-2 rounded"
            onClick={async () => {
              setError("");
              setSuccess("");
              try {
                const res = await api.post("/break", {
                  duration: 5,
                  type: "short",
                });
                setBreaks((prev) => [res.data, ...prev]);
                setSuccess("Break logged!");
                setTimeout(() => setSuccess(""), 2000);
              } catch {
                setError("Failed to log break.");
                setTimeout(() => setError(""), 3000);
              }
            }}
          >
            Log Break
          </button>
          <div className="mt-2 text-gray-500 text-sm">
            {breaks.length > 0 && (
              <div>
                Today's breaks:{" "}
                {
                  breaks.filter(
                    (b) =>
                      new Date(b.date).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
              </div>
            )}
          </div>
        </section>

        {/* Smart Reminders */}
        <section className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Smart Reminders
          </h2>
          <ul className="text-gray-600 space-y-1">
            {reminders.length > 0 ? (
              reminders.map((r, i) => (
                <li key={i}>
                  {r.type === "water" && "💧 "}
                  {r.type === "meal" && "🍽️ "}
                  {r.type === "eye_rest" && "👀 "}
                  {r.type} at {r.time}
                </li>
              ))
            ) : (
              <>
                <li>💧 Water Intake</li>
                <li>🍽️ Meal Times</li>
                <li>👀 Eye Rest</li>
              </>
            )}
          </ul>
          <button
            className="mt-2 bg-emerald-500 text-white px-4 py-2 rounded"
            onClick={() => setReminderModalOpen(true)}
          >
            Manage Reminders
          </button>
        </section>

        {/* Mental Health Support */}
        <section className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 col-span-1 md:col-span-2 flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Mental Health Support
          </h2>
          <div className="flex gap-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setMedOpen(true)}
            >
              Start Meditation
            </button>
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded"
              onClick={() => setBreathOpen(true)}
            >
              Breathing Exercise
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded">
              Get Help
            </button>
          </div>
        </section>

        {/* Analytics Overview */}
        <section className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Your Wellness Insights
          </h2>
          <p className="text-gray-600">
            Visualize your mood, stress, sleep, and productivity trends over
            time.
          </p>
          <div className="bg-gray-100 h-32 rounded mt-3 flex items-center justify-center text-gray-400">
            [Charts Coming Soon]
          </div>
        </section>
      </div>

      {/* --- MODALS: Always at the end, overlays everything --- */}
      <MeditationModal open={medOpen} onClose={() => setMedOpen(false)} />
      <BreathingModal open={breathOpen} onClose={() => setBreathOpen(false)} />
      <ManageRemindersModal
        open={reminderModalOpen}
        onClose={() => setReminderModalOpen(false)}
        reminders={reminders}
        setReminders={setReminders}
      />
    </motion.div>
  );
};

export default WellnessTracking;
