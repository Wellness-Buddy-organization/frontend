import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';

/**
 * Time picker component for selecting reminder time
 * 
 * @param {Object} props
 * @param {string} props.value - Currently selected time (format: "HH:MM")
 * @param {Function} props.onChange - Function called when time changes
 */
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

/**
 * ReminderForm component for creating and editing reminders
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Initial data for form (when editing)
 * @param {Array} props.reminderTypes - Available reminder types
 * @param {Function} props.onSubmit - Form submit handler
 * @param {Function} props.onCancel - Form cancel handler
 */
const ReminderForm = ({ initialData, reminderTypes, onSubmit, onCancel }) => {
  const isEditing = !!initialData?._id;
  
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
  
  // Initialize form state
  const [form, setForm] = useState({
    type: initialData?.type || "water",
    time: initialData?.time || "09:00",
    days: initialData?.days || ["mon", "tue", "wed", "thu", "fri"],
    enabled: initialData?.enabled ?? true,
    message: initialData?.message || "",
    sound: initialData?.sound || reminderTypes.find(t => t.value === (initialData?.type || "water"))?.sound || "chime"
  });
  
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Update default message when type changes
  useEffect(() => {
    if (!initialData?.message) {
      const reminderType = reminderTypes.find(t => t.value === form.type);
      setForm(prev => ({
        ...prev,
        message: `Time for ${reminderType?.label || "your reminder"}!`,
        sound: reminderType?.sound || prev.sound
      }));
    }
  }, [form.type, initialData?.message, reminderTypes]);
  
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
          {reminderTypes.map((type) => (
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
        </div>
        
        {/* Suggested times */}
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Suggested Times:</div>
          <div className="flex flex-wrap gap-1">
            {reminderTypes.find(t => t.value === form.type)?.suggestedTimes.map(time => (
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
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Preview Card */}
      <div className={`p-4 rounded-lg border ${getTypeColor()} mb-4`}>
        <div className="font-medium mb-1">Preview:</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl mr-2">
              {reminderTypes.find(t => t.value === form.type)?.icon}
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

export default ReminderForm;