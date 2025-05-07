import { motion } from 'framer-motion';

/**
 * Modal component for testing how reminder notifications will look
 * 
 * @param {Object} props
 * @param {Object} props.reminder - Reminder object to test
 * @param {Array} props.reminderTypes - Array of reminder type definitions
 * @param {Function} props.onClose - Function to call when closing the modal
 */
const TestNotificationModal = ({ reminder, reminderTypes, onClose }) => {
  // Get reminder type info
  const reminderType = reminderTypes.find(t => t.value === reminder.type) || reminderTypes[0];
  
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        initial={{ scale: 0.95, opacity: 0, y: -50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 text-center">
          <h3 className="text-lg font-medium text-gray-900">Preview Notification</h3>
          <p className="text-sm text-gray-500">This is how your reminder will appear</p>
        </div>
        
        {/* Mock notification */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6 shadow-inner">
          <div className="bg-white rounded-lg shadow-md p-4 flex items-start">
            <div className="text-3xl mr-3">{reminderType.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-lg">
                {reminder.message || `Time for your ${reminderType.label} reminder!`}
              </div>
              <div className="text-sm text-gray-600">
                Wellness Buddy • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Notification info */}
        <div className="mb-6 bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
          <h4 className="font-medium mb-1">Notification Details:</h4>
          <ul className="space-y-1">
            <li><span className="font-medium">Type:</span> {reminderType.label}</li>
            <li><span className="font-medium">Schedule:</span> {reminder.time} on {reminder.getFormattedDays()}</li>
            <li><span className="font-medium">Sound:</span> {reminder.sound || reminderType.sound}</li>
            <li><span className="font-medium">Status:</span> {reminder.enabled ? 'Enabled' : 'Disabled'}</li>
          </ul>
        </div>
        
        <div className="flex justify-center gap-3">
          <button
            className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestNotificationModal;