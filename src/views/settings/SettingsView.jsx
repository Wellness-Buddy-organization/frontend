import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animated notification for feedback
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

const SettingsView = () => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // disabled for now

  // Account fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Feedback
  const [notif, setNotif] = useState({ message: '', type: '' });

  // Handlers
  const toggleAnimations = () => setAnimationsEnabled((prev) => !prev);
  const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);
  // Dark mode toggle is disabled for now

  const handleAccountSave = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setNotif({ message: 'Please enter a valid email address.', type: 'error' });
      return;
    }
    if (!password || password.length < 6) {
      setNotif({ message: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }
    // Simulate save (replace with real API call)
    setNotif({ message: 'Account settingsViewSettingsView saved!', type: 'success' });
    setTimeout(() => setNotif({ message: '', type: '' }), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">SettingsView</h1>

      <AnimatePresence>
        {notif.message && (
          <Notification
            message={notif.message}
            type={notif.type}
            onClose={() => setNotif({ message: '', type: '' })}
          />
        )}
      </AnimatePresence>

      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Application SettingsView
          </h2>

          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium">Animations</h3>
              <p className="text-sm text-gray-500">Enable or disable UI animations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={animationsEnabled}
                onChange={toggleAnimations}
                aria-label="Enable animations"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium">Notifications</h3>
              <p className="text-sm text-gray-500">Receive app notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationsEnabled}
                onChange={toggleNotifications}
                aria-label="Enable notifications"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-gray-500">Switch to dark theme (coming soon)</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                disabled
                aria-label="Enable dark mode"
              />
              <div className="w-11 h-6 bg-gray-200 opacity-50 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-2 mt-8">
            Account SettingsView
          </h2>

          <form className="space-y-4" onSubmit={handleAccountSave} autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="example@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors mt-2"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsView;
