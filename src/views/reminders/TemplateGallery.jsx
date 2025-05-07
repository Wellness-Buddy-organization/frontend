import { motion } from 'framer-motion';

// Template packs for quick reminder setup
const TEMPLATE_PACKS = [
  {
    id: "desk_worker",
    name: "Desk Worker",
    description: "Eye rest, hydration, and posture reminders for office work",
    reminders: [
      { type: "eye_rest", time: "10:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "eye_rest", time: "12:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "eye_rest", time: "14:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "eye_rest", time: "16:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "water", time: "09:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "water", time: "11:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "water", time: "13:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "water", time: "15:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "water", time: "17:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "posture", time: "09:30", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "posture", time: "13:30", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "posture", time: "15:30", days: ["mon", "tue", "wed", "thu", "fri"] },
    ]
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    description: "Meditation and periodic check-ins for mental wellness",
    reminders: [
      { type: "meditation", time: "07:30", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
      { type: "meditation", time: "18:00", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
    ]
  },
  {
    id: "hydration",
    name: "Hydration",
    description: "Regular water reminders throughout the day",
    reminders: [
      { type: "water", time: "08:00", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
      { type: "water", time: "10:00", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
      { type: "water", time: "12:00", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
      { type: "water", time: "14:00", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
      { type: "water", time: "16:00", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
      { type: "water", time: "18:00", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
      { type: "water", time: "20:00", days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
    ]
  },
  {
    id: "work_breaks",
    name: "Work Breaks",
    description: "Structured breaks to reduce strain and increase productivity",
    reminders: [
      { type: "stretch", time: "10:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "stretch", time: "13:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "stretch", time: "15:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "stretch", time: "17:00", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "eye_rest", time: "11:30", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "eye_rest", time: "14:30", days: ["mon", "tue", "wed", "thu", "fri"] },
      { type: "eye_rest", time: "16:30", days: ["mon", "tue", "wed", "thu", "fri"] },
    ]
  }
];

// Reminder types data for icons and labels
const REMINDER_TYPES = [
  { value: "water", label: "Water", icon: "💧" },
  { value: "meal", label: "Meal", icon: "🍽️" },
  { value: "eye_rest", label: "Eye Rest", icon: "👀" },
  { value: "stretch", label: "Stretch", icon: "🧘" },
  { value: "posture", label: "Posture", icon: "🪑" },
  { value: "meditation", label: "Meditation", icon: "🧠" },
];

/**
 * Template Gallery modal for applying pre-configured reminder packs
 * 
 * @param {Object} props
 * @param {Function} props.onSelect - Function called when a template pack is selected
 * @param {Function} props.onClose - Function called when the modal is closed
 */
const TemplateGallery = ({ onSelect, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Reminder Templates</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Choose a template pack to quickly set up multiple reminders tailored to specific needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {TEMPLATE_PACKS.map((pack) => (
            <motion.div
              key={pack.id}
              className="border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md cursor-pointer transition"
              whileHover={{ y: -2 }}
              onClick={() => onSelect(pack)}
            >
              <h3 className="font-bold text-lg mb-1">{pack.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{pack.description}</p>
              <div className="flex flex-wrap gap-1">
                {Array.from(new Set(pack.reminders.map(r => r.type))).map(type => (
                  <span 
                    key={type} 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
                  >
                    {REMINDER_TYPES.find(t => t.value === type)?.icon} {REMINDER_TYPES.find(t => t.value === type)?.label}
                  </span>
                ))}
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {pack.reminders.length} reminders
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TemplateGallery;