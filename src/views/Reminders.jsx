import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  AdjustmentsHorizontalIcon,
  BellAlertIcon,
  BoltIcon,
  ArrowPathIcon,
  SpeakerWaveIcon
} from "@heroicons/react/24/outline";
import {
  fetchReminders,
  addReminder,
  updateReminder,
  deleteReminder,
} from "../services/reminderService";

// Reminder types with enhanced data structure
const REMINDER_TYPES = [
  { 
    value: "water", 
    label: "Water", 
    icon: "💧", 
    description: "Stay hydrated throughout the day",
    defaultFrequency: "every 2 hours",
    suggestedTimes: ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"],
    sound: "drop"
  },
  { 
    value: "meal", 
    label: "Meal", 
    icon: "🍽️", 
    description: "Regular, balanced nutrition",
    defaultFrequency: "3 times daily",
    suggestedTimes: ["08:00", "13:00", "19:00"],
    sound: "bell"
  },
  { 
    value: "eye_rest", 
    label: "Eye Rest", 
    icon: "👀", 
    description: "Take breaks from screen time",
    defaultFrequency: "hourly",
    suggestedTimes: ["09:30", "10:30", "11:30", "14:30", "15:30", "16:30"],
    sound: "chime"
  },
  { 
    value: "stretch", 
    label: "Stretch", 
    icon: "🧘", 
    description: "Move your body and stretch",
    defaultFrequency: "every 3 hours",
    suggestedTimes: ["10:00", "13:00", "16:00"],
    sound: "soft"
  },
  { 
    value: "posture", 
    label: "Posture", 
    icon: "🪑", 
    description: "Check and correct your posture",
    defaultFrequency: "hourly",
    suggestedTimes: ["09:15", "10:15", "11:15", "14:15", "15:15", "16:15"],
    sound: "ping"
  },
  { 
    value: "meditation", 
    label: "Meditation", 
    icon: "🧠", 
    description: "Mindfulness and mental clarity",
    defaultFrequency: "once daily",
    suggestedTimes: ["07:30", "17:30"],
    sound: "calm"
  },
];

// Days of week for recurring options
const DAYS_OF_WEEK = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
];

// Template packs for quick setup
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
  }
];

// Visual Time Picker Component
const TimePicker = ({ value, onChange }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ["00", "15", "30", "45"];
  
  // Parse the time value (format: "HH:MM")
  const [selectedHour, selectedMinute] = value 
    ? value.split(":").map(v => parseInt(v, 10))
    : [8, 0]; // Default to 8:00 AM
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-700">Select Time</h4>
        <div className="text-xl font-semibold text-emerald-600">
          {selectedHour.toString().padStart(2, '0')}:{minutes[selectedMinute / 15] || "00"}
        </div>
      </div>
      
      {/* Clock face visualization */}
      <div className="relative w-48 h-48 mx-auto mb-4 rounded-full bg-gray-100 border-2 border-emerald-100">
        {/* Hour markers */}
        {hours.filter(h => h % 2 === 0).map(hour => {
          const angle = (hour / 12) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * 80 + 96;
          const y = Math.sin(angle) * 80 + 96;
          
          return (
            <div 
              key={`hour-${hour}`}
              className={`absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center rounded-full
                ${selectedHour === hour ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
              style={{ left: `${x}px`, top: `${y}px` }}
              onClick={() => onChange(`${hour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`)}
            >
              {hour}
            </div>
          );
        })}
        
        {/* Center of clock */}
        <div className="absolute left-1/2 top-1/2 w-4 h-4 -ml-2 -mt-2 bg-emerald-500 rounded-full"></div>
        
        {/* Clock hand */}
        <div 
          className="absolute left-1/2 top-1/2 w-1 bg-emerald-500 rounded-full origin-bottom transform -translate-x-1/2" 
          style={{ 
            height: '40%', 
            transform: `rotate(${(selectedHour % 12) * 30 + (selectedMinute / 2)}deg) translateY(-50%)` 
          }}
        ></div>
      </div>
      
      {/* Minute selector */}
      <div className="flex justify-between mt-4">
        {minutes.map((minute, index) => (
          <button
            key={minute}
            className={`py-2 px-3 rounded ${
              selectedMinute === index * 15
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onChange(`${selectedHour.toString().padStart(2, '0')}:${minute}`)}
          >
            :{minute}
          </button>
        ))}
      </div>
    </div>
  );
};

// Notification component for feedback
function Notification({ message, type, onClose }) {
  if (!message) return null;
  
  const bgColor = type === "success" 
    ? "bg-green-50 text-green-800 border-green-200" 
    : type === "error" 
    ? "bg-red-50 text-red-800 border-red-200"
    : "bg-blue-50 text-blue-800 border-blue-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center p-4 mb-4 text-sm rounded-lg ${bgColor} border shadow-sm`}
      role="alert"
    >
      <span className="font-medium mr-2">{type === "success" ? "Success!" : type === "error" ? "Error!" : "Info"}</span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-4 text-lg font-bold leading-none hover:text-gray-500">
        &times;
      </button>
    </motion.div>
  );
}

// Reminder Form Component
const ReminderForm = ({ initialData, onSubmit, onCancel }) => {
  const isEditing = !!initialData?._id;
  
  const [form, setForm] = useState({
    type: initialData?.type || "water",
    time: initialData?.time || "09:00",
    days: initialData?.days || ["mon", "tue", "wed", "thu", "fri"],
    enabled: initialData?.enabled ?? true,
    message: initialData?.message || "",
    sound: initialData?.sound || REMINDER_TYPES.find(t => t.value === (initialData?.type || "water"))?.sound || "chime"
  });
  
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Update default message when type changes
  useEffect(() => {
    if (!initialData?.message) {
      const reminderType = REMINDER_TYPES.find(t => t.value === form.type);
      setForm(prev => ({
        ...prev,
        message: `Time for ${reminderType?.label || "your reminder"}!`,
        sound: reminderType?.sound || prev.sound
      }));
    }
  }, [form.type, initialData?.message]);
  
  // Toggle selection for days of week
  const toggleDay = (day) => {
    setForm(prev => {
      if (prev.days.includes(day)) {
        return { ...prev, days: prev.days.filter(d => d !== day) };
      } else {
        return { ...prev, days: [...prev.days, day] };
      }
    });
  };
  
  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };
  
  // Get color for current reminder type
  const getTypeColor = () => {
    switch(form.type) {
      case "water": return "bg-blue-50 border-blue-200 text-blue-800";
      case "meal": return "bg-amber-50 border-amber-200 text-amber-800";
      case "eye_rest": return "bg-purple-50 border-purple-200 text-purple-800";
      case "stretch": return "bg-green-50 border-green-200 text-green-800";
      case "posture": return "bg-teal-50 border-teal-200 text-teal-800";
      case "meditation": return "bg-indigo-50 border-indigo-200 text-indigo-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Reminder Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reminder Type
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {REMINDER_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center ${
                form.type === type.value
                  ? "ring-2 ring-emerald-500 bg-emerald-50 border-emerald-200"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setForm(prev => ({ ...prev, type: type.value }))}
            >
              <span className="text-2xl mb-1">{type.icon}</span>
              <span className="text-xs font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Time Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Scheduled Time
        </label>
        <div className="relative">
          <button
            type="button"
            className="w-full p-3 border rounded-lg flex items-center justify-between text-left focus:ring-2 focus:ring-emerald-500"
            onClick={() => setShowTimePicker(!showTimePicker)}
          >
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 text-gray-500 mr-2" />
              <span>{form.time}</span>
            </div>
            <span className="text-sm text-gray-500">
              {parseInt(form.time.split(':')[0]) >= 12 ? 'PM' : 'AM'}
            </span>
          </button>
          
          {/* Time picker dropdown */}
          <AnimatePresence>
            {showTimePicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-1 w-full"
              >
                <TimePicker 
                  value={form.time} 
                  onChange={(time) => {
                    setForm(prev => ({ ...prev, time }));
                    setShowTimePicker(false);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Suggested times */}
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Suggested Times:</div>
          <div className="flex flex-wrap gap-1">
            {REMINDER_TYPES.find(t => t.value === form.type)?.suggestedTimes.map(time => (
              <button
                key={time}
                type="button"
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => setForm(prev => ({ ...prev, time }))}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Days Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Repeat on Days
        </label>
        <div className="flex justify-between">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day.value}
              type="button"
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                form.days.includes(day.value)
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => toggleDay(day.value)}
            >
              {day.label.charAt(0)}
            </button>
          ))}
        </div>
        
        {/* Quick selection buttons */}
        <div className="flex mt-2 space-x-2 text-sm">
          <button
            type="button"
            className="text-emerald-600 hover:underline"
            onClick={() => setForm(prev => ({ ...prev, days: ["mon", "tue", "wed", "thu", "fri"] }))}
          >
            Weekdays
          </button>
          <button
            type="button"
            className="text-emerald-600 hover:underline"
            onClick={() => setForm(prev => ({ ...prev, days: ["sat", "sun"] }))}
          >
            Weekend
          </button>
          <button
            type="button"
            className="text-emerald-600 hover:underline"
            onClick={() => setForm(prev => ({ ...prev, days: DAYS_OF_WEEK.map(d => d.value) }))}
          >
            All Days
          </button>
        </div>
      </div>
      
      {/* Custom Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Custom Message (Optional)
        </label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          value={form.message}
          onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Reminder message..."
          maxLength={50}
        />
      </div>
      
      {/* Enable/Disable Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={form.enabled}
            onChange={() => setForm(prev => ({ ...prev, enabled: !prev.enabled }))}
            id="enabled-toggle"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
        </div>
        <label htmlFor="enabled-toggle" className="text-sm font-medium text-gray-700">
          {form.enabled ? "Enabled" : "Disabled"}
        </label>
      </div>
      
      {/* Sound Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notification Sound
        </label>
        <div className="flex items-center gap-2">
          <select
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            value={form.sound}
            onChange={(e) => setForm(prev => ({ ...prev, sound: e.target.value }))}
          >
            <option value="chime">Gentle Chime</option>
            <option value="bell">Bell</option>
            <option value="drop">Water Drop</option>
            <option value="ping">Ping</option>
            <option value="soft">Soft Tone</option>
            <option value="calm">Calm</option>
          </select>
          
          {/* Play sound button (for a real app, this would play the actual sound) */}
          <button 
            type="button"
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            aria-label="Test sound"
          >
            <SpeakerWaveIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Preview Card */}
      <div className={`p-4 rounded-lg border ${getTypeColor()} mb-4`}>
        <div className="font-medium mb-1">Preview:</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl mr-2">
              {REMINDER_TYPES.find(t => t.value === form.type)?.icon}
            </span>
            <div>
              <div className="font-medium">{form.message}</div>
              <div className="text-xs">
                {form.time} • {form.days.length === 7 
                  ? "Every day" 
                  : form.days.length === 5 && form.days.every(d => ["mon", "tue", "wed", "thu", "fri"].includes(d))
                  ? "Weekdays"
                  : form.days.map(d => d.charAt(0).toUpperCase()).join(", ")}
              </div>
            </div>
          </div>
          <div className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
            {form.enabled ? "Enabled" : "Disabled"}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow"
        >
          {isEditing ? "Update Reminder" : "Add Reminder"}
        </button>
        
        {onCancel && (
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

// Template Gallery Modal
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

// Calendar View Modal for Reminders
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
                      {groupedReminders[day.value]?.[hour]?.map((reminder, idx) => (
                        <div 
                          key={idx} 
                          className={`m-1 p-1 text-xs rounded flex items-center cursor-pointer hover:opacity-80 ${
                            reminder.type === "water" ? "bg-blue-100 text-blue-800" :
                            reminder.type === "meal" ? "bg-amber-100 text-amber-800" :
                            reminder.type === "eye_rest" ? "bg-purple-100 text-purple-800" :
                            reminder.type === "stretch" ? "bg-green-100 text-green-800" :
                            reminder.type === "posture" ? "bg-teal-100 text-teal-800" :
                            reminder.type === "meditation" ? "bg-indigo-100 text-indigo-800" :
                            "bg-gray-100 text-gray-800"
                          } ${!reminder.enabled ? "opacity-50" : ""}`}
                          onClick={() => onEdit(reminder)}
                        >
                          <span className="mr-1">
                            {REMINDER_TYPES.find(t => t.value === reminder.type)?.icon}
                          </span>
                          <span className="truncate flex-1">{reminder.time}</span>
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Confirmation Modal
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">{message}</h3>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Test Notification Modal
const TestNotificationModal = ({ reminder, onClose }) => {
  const reminderType = REMINDER_TYPES.find(t => t.value === reminder.type) || REMINDER_TYPES[0];
  
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

// Main Reminders Component
const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [showTestNotification, setShowTestNotification] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();

  // Load reminders on mount
  useEffect(() => {
    const loadReminders = async () => {
      try {
        setLoading(true);
        const data = await fetchReminders();
        setReminders(data);
        setError("");
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };
    loadReminders();
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      if (editingReminder) {
        // Update existing reminder
        const data = await updateReminder(editingReminder._id, formData);
        setReminders(reminders.map((r) => (r._id === editingReminder._id ? data : r)));
        setSuccess("Reminder updated successfully!");
      } else {
        // Add new reminder
        const data = await addReminder(formData);
        setReminders([...reminders, data]);
        setSuccess("Reminder added successfully!");
      }
      
      setShowForm(false);
      setEditingReminder(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      handleApiError(err);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async (id) => {
    try {
      await deleteReminder(id);
      setReminders(reminders.filter((r) => r._id !== id));
      setSuccess("Reminder deleted successfully!");
      setShowConfirmation(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      handleApiError(err);
    }
  };

  // Handle API errors
  const handleApiError = (err) => {
    if (err.response?.status === 401) {
      navigate("/login");
    } else {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      setTimeout(() => setError(""), 5000);
    }
  };

  // Open the edit form
  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  // Apply template pack
  const handleApplyTemplate = (templatePack) => {
    // In a real app, this would call the API to add multiple reminders at once
    // For this demo, we'll simulate adding them one by one
    setShowTemplateGallery(false);
    
    // Show a success message
    setSuccess(`Adding ${templatePack.reminders.length} reminders from ${templatePack.name}...`);
    
    // Simulate API calls with a delay
    templatePack.reminders.forEach((reminder, index) => {
      setTimeout(async () => {
        try {
          const data = await addReminder({
            type: reminder.type,
            time: reminder.time,
            days: reminder.days,
            enabled: true,
            message: "",
            sound: REMINDER_TYPES.find(t => t.value === reminder.type)?.sound || "chime"
          });
          
          setReminders(prev => [...prev, data]);
          
          // Update success message when done
          if (index === templatePack.reminders.length - 1) {
            setSuccess(`${templatePack.name} template applied successfully!`);
            setTimeout(() => setSuccess(""), 3000);
          }
        } catch (err) {
          handleApiError(err);
        }
      }, index * 300); // Stagger the requests
    });
  };

  // Filter reminders based on selected type
  const filteredReminders = filterType === "all" 
    ? reminders 
    : reminders.filter(r => r.type === filterType);

  // Group reminders by type for grid view
  const groupedReminders = filteredReminders.reduce((groups, reminder) => {
    const type = reminder.type;
    if (!groups[type]) groups[type] = [];
    groups[type].push(reminder);
    return groups;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Wellness Reminders</h1>
          <p className="text-gray-600">
            Create and manage reminders for staying healthy and balanced
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            onClick={() => {
              setEditingReminder(null);
              setShowForm(true);
            }}
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            New Reminder
          </button>
          
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => setShowTemplateGallery(true)}
          >
            <BoltIcon className="w-5 h-5 mr-1" />
            Templates
          </button>
          
          <button
            className="flex items-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            onClick={() => setShowCalendarView(true)}
            aria-label="Calendar view"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {(error || success) && (
          <Notification
            message={error || success}
            type={error ? "error" : "success"}
            onClose={() => (error ? setError("") : setSuccess(""))}
          />
        )}
      </AnimatePresence>

      {/* Filters and View toggle */}
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-md border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Filter by Type:</label>
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  filterType === "all"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterType("all")}
              >
                All Types
              </button>
              
              {REMINDER_TYPES.map(type => (
                <button
                  key={type.value}
                  className={`flex items-center px-3 py-1 rounded-full text-sm ${
                    filterType === type.value
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setFilterType(type.value)}
                >
                  <span className="mr-1">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <button
              className={`p-2 rounded ${viewMode === "grid" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            
            <button
              className={`p-2 rounded ${viewMode === "list" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 border-4 border-emerald-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 border-4 border-emerald-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      ) : filteredReminders.length === 0 ? (
        // Empty state
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-md border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <BellAlertIcon className="w-16 h-16 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No Reminders Yet</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Create your first reminder to get started with your wellness journey, or use a template pack for quick setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              onClick={() => {
                setEditingReminder(null);
                setShowForm(true);
              }}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Reminder
            </button>
            
            <button
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => setShowTemplateGallery(true)}
            >
              <BoltIcon className="w-5 h-5 mr-2" />
              Use Template
            </button>
          </div>
        </div>
      ) : (
        // Reminders Display (Grid or List view)
        <div className={`space-y-8`}>
          {viewMode === "grid" ? (
            // Grid view - grouped by type
            Object.entries(groupedReminders).map(([type, typeReminders]) => (
              <div key={type} className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-md border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">
                    {REMINDER_TYPES.find(t => t.value === type)?.icon}
                  </span>
                  <h2 className="text-xl font-bold text-gray-800">
                    {REMINDER_TYPES.find(t => t.value === type)?.label} Reminders
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeReminders.map((reminder) => (
                    <motion.div
                      key={reminder._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${
                        reminder.enabled ? "border-emerald-200" : "border-gray-200 opacity-70"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-lg font-semibold">{reminder.time}</div>
                        <div className="flex space-x-1">
                          <button
                            className="p-1 rounded-full hover:bg-gray-100"
                            onClick={() => setShowTestNotification(reminder)}
                            aria-label="Test notification"
                          >
                            <BellIcon className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            className="p-1 rounded-full hover:bg-gray-100"
                            onClick={() => handleEdit(reminder)}
                            aria-label="Edit"
                          >
                            <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            className="p-1 rounded-full hover:bg-gray-100"
                            onClick={() => setShowConfirmation(reminder._id)}
                            aria-label="Delete"
                          >
                            <XCircleIcon className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        {reminder.days.length === 7 
                          ? "Every day" 
                          : reminder.days.length === 5 && reminder.days.every(d => ["mon", "tue", "wed", "thu", "fri"].includes(d))
                          ? "Weekdays"
                          : reminder.days.map(d => d.charAt(0).toUpperCase()).join(", ")}
                      </div>
                      
                      {reminder.message && (
                        <div className="text-sm italic mt-2 text-gray-600">
                          "{reminder.message}"
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // List view
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">All Reminders</h2>
              
              <div className="divide-y">
                {filteredReminders.map((reminder) => (
                  <motion.div
                    key={reminder._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`py-4 ${!reminder.enabled ? "opacity-70" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {REMINDER_TYPES.find(t => t.value === reminder.type)?.icon}
                        </span>
                        <div>
                          <div className="font-medium">
                            {REMINDER_TYPES.find(t => t.value === reminder.type)?.label} at {reminder.time}
                          </div>
                          <div className="text-sm text-gray-600">
                            {reminder.days.length === 7 
                              ? "Every day" 
                              : reminder.days.length === 5 && reminder.days.every(d => ["mon", "tue", "wed", "thu", "fri"].includes(d))
                              ? "Weekdays"
                              : reminder.days.map(d => d.charAt(0).toUpperCase()).join(", ")}
                            {reminder.message && ` • "${reminder.message}"`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {reminder.enabled ? (
                          <div className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                            Active
                          </div>
                        ) : (
                          <div className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            Disabled
                          </div>
                        )}
                        
                        <button
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() => setShowTestNotification(reminder)}
                          aria-label="Test notification"
                        >
                          <BellIcon className="w-5 h-5 text-gray-500" />
                        </button>
                        <button
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() => handleEdit(reminder)}
                          aria-label="Edit"
                        >
                          <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500" />
                        </button>
                        <button
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() => setShowConfirmation(reminder._id)}
                          aria-label="Delete"
                        >
                          <XCircleIcon className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {/* Add/Edit Reminder Form */}
        {showForm && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {editingReminder ? "Edit Reminder" : "New Reminder"}
              </h2>
              
              <ReminderForm
                initialData={editingReminder}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingReminder(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
        
        {/* Template Gallery */}
        {showTemplateGallery && (
          <TemplateGallery
            onSelect={handleApplyTemplate}
            onClose={() => setShowTemplateGallery(false)}
          />
        )}
        
        {/* Calendar View */}
        {showCalendarView && (
          <CalendarView
            reminders={reminders}
            onEdit={handleEdit}
            onClose={() => setShowCalendarView(false)}
          />
        )}
        
        {/* Delete Confirmation */}
        {showConfirmation && (
          <ConfirmationModal
            message="Are you sure you want to delete this reminder?"
            onConfirm={() => handleDeleteConfirm(showConfirmation)}
            onCancel={() => setShowConfirmation(null)}
          />
        )}
        
        {/* Test Notification */}
        {showTestNotification && (
          <TestNotificationModal
            reminder={showTestNotification}
            onClose={() => setShowTestNotification(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Reminders;