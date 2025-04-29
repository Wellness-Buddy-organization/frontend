import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const REMINDER_TYPES = [
  { value: 'water', label: '💧 Water' },
  { value: 'meal', label: '🍽️ Meal' },
  { value: 'eye_rest', label: '👀 Eye Rest' },
];

const modalVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 18 } },
  exit: { opacity: 0, y: 40, transition: { duration: 0.2 } }
};

export default function ManageReminders({ open, onClose, reminders, setReminders, setError, setSuccess }) {
  const [form, setForm] = useState({ type: 'water', time: '', enabled: true });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const resetForm = () => {
    setForm({ type: 'water', time: '', enabled: true });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        // Update
        const res = await api.put(`/reminder/${editingId}`, form);
        setReminders(reminders.map(r => (r._id === editingId ? res.data : r)));
        setSuccess('Reminder updated!');
      } else {
        // Add
        const res = await api.post('/reminder', form);
        setReminders([...reminders, res.data]);
        setSuccess('Reminder added!');
      }
      resetForm();
    } catch {
      setError('Failed to save reminder.');
    }
  };

  const handleEdit = (reminder) => {
    setForm({ type: reminder.type, time: reminder.time, enabled: reminder.enabled });
    setEditingId(reminder._id);
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      await api.delete(`/reminder/${id}`);
      setReminders(reminders.filter(r => r._id !== id));
      setSuccess('Reminder deleted!');
      if (editingId === id) resetForm();
    } catch {
      setError('Failed to delete reminder.');
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          onClick={e => e.stopPropagation()}
        >
          <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={onClose} aria-label="Close">&times;</button>
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Reminder' : 'Add Reminder'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-gray-600 mb-1">Type</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                required
              >
                {REMINDER_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Time (24h, e.g. 14:00)</label>
              <input
                type="time"
                className="w-full border rounded px-2 py-1"
                value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))}
                id="enabled"
              />
              <label htmlFor="enabled" className="text-gray-600">Enabled</label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <hr className="my-4" />
          <h3 className="font-semibold mb-2">Your Reminders</h3>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {reminders.length === 0 && <li className="text-gray-400">No reminders yet.</li>}
            {reminders.map(reminder => (
              <li key={reminder._id} className="flex items-center justify-between bg-emerald-50 rounded px-3 py-2">
                <span>
                  {REMINDER_TYPES.find(t => t.value === reminder.type)?.label || reminder.type} at {reminder.time}
                  {!reminder.enabled && <span className="ml-2 text-xs text-gray-400">(disabled)</span>}
                </span>
                <span className="flex gap-2">
                  <button
                    className="text-emerald-600 hover:underline"
                    onClick={() => handleEdit(reminder)}
                  >Edit</button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(reminder._id)}
                  >Delete</button>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
