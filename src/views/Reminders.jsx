import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Reminder types for dropdown
const REMINDER_TYPES = [
  { value: 'water', label: '💧 Water' },
  { value: 'meal', label: '🍽️ Meal' },
  { value: 'eye_rest', label: '👀 Eye Rest' },
  { value: 'medication', label: '💊 Medication' },
  { value: 'exercise', label: '🏃 Exercise' },
];

// Animated notification (success/error)
function Notification({ message, type, onClose }) {
  if (!message) return null;
  const color = type === 'success'
    ? 'bg-green-50 text-green-800'
    : type === 'error'
    ? 'bg-red-50 text-red-800'
    : 'bg-blue-50 text-blue-800';
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center p-4 mb-4 text-sm rounded-lg ${color} shadow`}
      role="alert"
    >
      <span className="font-medium mr-2">{type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : 'Info'}</span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-4 text-lg font-bold leading-none">&times;</button>
    </motion.div>
  );
}

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ type: 'water', time: '', enabled: true });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState({ message: '', type: '' });

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: '/api',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  });

  // Fetch reminders on mount
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/reminder');
        setReminders(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/unauthorized');
        } else {
          setNotif({ message: 'Failed to load reminders.', type: 'error' });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
    // eslint-disable-next-line
  }, [navigate]);

  // Add or update reminder
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/reminder/${editingId}`, form);
        setReminders(reminders.map(r => (r._id === editingId ? res.data : r)));
        setNotif({ message: 'Reminder updated.', type: 'success' });
      } else {
        const res = await api.post('/reminder', form);
        setReminders([...reminders, res.data]);
        setNotif({ message: 'Reminder added.', type: 'success' });
      }
      setForm({ type: 'water', time: '', enabled: true });
      setEditingId(null);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/unauthorized');
      } else {
        setNotif({ message: 'Failed to save reminder.', type: 'error' });
      }
    }
  };

  // Delete reminder
  const handleDelete = async (id) => {
    try {
      await api.delete(`/reminder/${id}`);
      setReminders(reminders.filter(r => r._id !== id));
      setNotif({ message: 'Reminder deleted.', type: 'success' });
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/unauthorized');
      } else {
        setNotif({ message: 'Failed to delete reminder.', type: 'error' });
      }
    }
  };

  // Edit reminder
  const handleEdit = (reminder) => {
    setForm({ type: reminder.type, time: reminder.time, enabled: reminder.enabled });
    setEditingId(reminder._id);
  };

  // Reset form
  const resetForm = () => {
    setForm({ type: 'water', time: '', enabled: true });
    setEditingId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reminders</h1>

      <AnimatePresence>
        {notif.message && (
          <Notification
            message={notif.message}
            type={notif.type}
            onClose={() => setNotif({ message: '', type: '' })}
          />
        )}
      </AnimatePresence>

      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-8 mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
            <label className="block text-gray-600 mb-1">Time</label>
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
      </div>

      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-8">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 border-4 border-emerald-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 border-4 border-emerald-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No reminders set. Add one above!</div>
        ) : (
          <ul className="divide-y divide-emerald-100">
            {reminders.map(reminder => (
              <motion.li
                key={reminder._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between py-4"
              >
                <span className="flex items-center gap-2">
                  {REMINDER_TYPES.find(t => t.value === reminder.type)?.label || reminder.type}
                  <span className="text-gray-700 font-medium">{reminder.time}</span>
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
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default Reminders;
