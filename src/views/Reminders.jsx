import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchReminders,
  addReminder,
  updateReminder,
  deleteReminder,
} from "../services/reminderService";

const REMINDER_TYPES = [
  { value: "water", label: "💧 Water" },
  { value: "meal", label: "🍽️ Meal" },
  { value: "eye_rest", label: "👀 Eye Rest" },
];

function Notification({ message, type, onClose }) {
  if (!message) return null;
  const color =
    type === "success"
      ? "bg-green-50 text-green-800"
      : type === "error"
      ? "bg-red-50 text-red-800"
      : "bg-blue-50 text-blue-800";
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center p-4 mb-4 text-sm rounded-lg ${color} shadow`}
      role="alert"
    >
      <span className="font-medium mr-2">
        {type === "success" ? "Success!" : "Error!"}
      </span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-4 text-lg font-bold leading-none">
        &times;
      </button>
    </motion.div>
  );
}

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ type: "water", time: "", enabled: true });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const loadReminders = async () => {
      try {
        setLoading(true);
        const data = await fetchReminders();
        setReminders(data);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };
    loadReminders();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const data = await updateReminder(editingId, form);
        setReminders(reminders.map((r) => (r._id === editingId ? data : r)));
        setNotif({ message: "Reminder updated", type: "success" });
      } else {
        const data = await addReminder(form);
        setReminders([...reminders, data]);
        setNotif({ message: "Reminder added", type: "success" });
      }
      resetForm();
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReminder(id);
      setReminders(reminders.filter((r) => r._id !== id));
      setNotif({ message: "Reminder deleted", type: "success" });
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleEdit = (reminder) => {
    setForm({
      type: reminder.type,
      time: reminder.time,
      enabled: reminder.enabled,
    });
    setEditingId(reminder._id);
  };

  const resetForm = () => {
    setForm({ type: "water", time: "", enabled: true });
    setEditingId(null);
  };

  const handleApiError = (err) => {
    if (err.response?.status === 401) {
      navigate("/login");
    } else {
      setNotif({
        message: err.response?.data?.message || "Operation failed",
        type: "error",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Wellness Reminders
      </h1>

      <AnimatePresence>
        {notif.message && (
          <Notification
            message={notif.message}
            type={notif.type}
            onClose={() => setNotif({ message: "", type: "" })}
          />
        )}
      </AnimatePresence>

      {/* Reminder Form */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-md border border-emerald-100 p-6 mb-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Reminder Type
            </label>
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              required
            >
              {REMINDER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Scheduled Time
            </label>
            <input
              type="time"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enabled"
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              checked={form.enabled}
              onChange={(e) =>
                setForm((f) => ({ ...f, enabled: e.target.checked }))
              }
            />
            <label htmlFor="enabled" className="text-sm text-gray-600">
              Enabled
            </label>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {editingId ? "Update" : "Add Reminder"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Reminders List */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-md border border-emerald-100 p-6">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No active reminders. Start by adding one above!
          </div>
        ) : (
          <ul className="divide-y divide-emerald-100">
            {reminders.map((reminder) => (
              <motion.li
                key={reminder._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {
                      REMINDER_TYPES.find((t) => t.value === reminder.type)
                        ?.label
                    }
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{reminder.time}</p>
                    {!reminder.enabled && (
                      <span className="text-sm text-gray-400">
                        (Currently paused)
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(reminder)}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reminder._id)}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default Reminders;
