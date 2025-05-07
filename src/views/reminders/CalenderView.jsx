import { motion } from 'framer-motion';

// Days of week constants
const DAYS_OF_WEEK = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
];

// Reminder types with icons
const REMINDER_TYPES = [
  { value: "water", label: "Water", icon: "💧", color: "bg-blue-100 text-blue-800" },
  { value: "meal", label: "Meal", icon: "🍽️", color: "bg-amber-100 text-amber-800" },
  { value: "eye_rest", label: "Eye Rest", icon: "👀", color: "bg-purple-100 text-purple-800" },
  { value: "stretch", label: "Stretch", icon: "🧘", color: "bg-green-100 text-green-800" },
  { value: "posture", label: "Posture", icon: "🪑", color: "bg-teal-100 text-teal-800" },
  { value: "meditation", label: "Meditation", icon: "🧠", color: "bg-indigo-100 text-indigo-800" },
];

/**
 * Calendar view modal for weekly reminder schedule visualization
 * 
 * @param {Object} props
 * @param {Array} props.reminders - Array of reminder objects
 * @param {Function} props.onEdit - Function called when editing a reminder
 * @param {Function} props.onClose - Function called when closing the modal
 */
const CalendarView = ({ reminders, onEdit, onClose }) => {
  // Group reminders by day and hour
  const groupedReminders = reminders.reduce((acc, reminder) => {
    const hour = parseInt(reminder.time.split(':')[0]);
    
    reminder.days.forEach(day => {
      if (!acc[day]) acc[day] = {};
      if (!acc[day][hour]) acc[day][hour] = [];
      acc[day][hour].push(reminder);
    });
    
    return acc;
  }, {});
  
  // Hours to display (6am to 10pm)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);
  
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-6xl h-[80vh] overflow-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 p-2">
          <h2 className="text-xl font-bold text-gray-800">Weekly Reminder Schedule</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-24 p-2 border text-left">Time</th>
                {DAYS_OF_WEEK.map(day => (
                  <th key={day.value} className="p-2 border text-center">{day.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map(hour => (
                <tr key={hour} className={hour % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-2 border font-medium">
                    {hour === 12 ? "12 PM" : hour > 12 ? `${hour-12} PM` : `${hour} AM`}
                  </td>
                  
                  {DAYS_OF_WEEK.map(day => (
                    <td key={day.value} className="p-1 border relative min-h-12">
                      {groupedReminders[day.value]?.[hour]?.map((reminder, idx) => {
                        // Find reminder type info
                        const typeInfo = REMINDER_TYPES.find(t => t.value === reminder.type) || {
                          icon: "⏰", 
                          color: "bg-gray-100 text-gray-800"
                        };
                        
                        return (
                          <div 
                            key={idx} 
                            className={`m-1 p-1 text-xs rounded flex items-center cursor-pointer hover:opacity-80 ${
                              typeInfo.color
                            } ${!reminder.enabled ? "opacity-50" : ""}`}
                            onClick={() => onEdit(reminder)}
                          >
                            <span className="mr-1">
                              {typeInfo.icon}
                            </span>
                            <span className="truncate flex-1">{reminder.time}</span>
                          </div>
                        );
                      })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Legend */}
        <div className="mt-4 p-2 border-t">
          <h3 className="text-sm font-medium mb-2">Legend:</h3>
          <div className="flex flex-wrap gap-2">
            {REMINDER_TYPES.map(type => (
              <div key={type.value} className={`flex items-center px-2 py-1 rounded-lg text-xs ${type.color}`}>
                <span className="mr-1">{type.icon}</span>
                <span>{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CalendarView;