import { useState, useEffect } from "react";
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
  BellAlertIcon
} from "@heroicons/react/24/outline";
import { reminderController } from "../../controllers";
import { Reminder } from "../../models";
import ReminderForm from "./ReminderForm";
import TemplateGallery from "./TemplateGallery";
import CalendarView from "./CalenderView";
import ConfirmationModal from "../components/ConfirmationModal";
import TestNotificationModal from "./TestNotificationModal";

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

/**
 * Notification component for feedback
 */
const Notification = ({ message, type, onClose }) => {
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
};

/**
 * Main ReminderListView component
 */
const ReminderListView = () => {
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

  /**
   * Load reminders on component mount
   */
  useEffect(() => {
    reminderController.fetchReminders(
      // Success callback
      (data) => {
        setReminders(data);
        setError("");
      },
      // Error callback
      (message, errorType) => {
        if (errorType === 'auth') {
          navigate("/login");
        } else {
          setError(message || 'An error occurred. Please try again.');
        }
      },
      // Finally callback
      () => {
        setLoading(false);
      }
    );
  }, [navigate]);

  /**
   * Handle form submission
   * @param {Object} formData - Form data for reminder
   */
  const handleSubmit = async (formData) => {
    if (editingReminder) {
      // Update existing reminder
      reminderController.updateReminder(
        editingReminder._id,
        formData,
        // Success callback
        (updatedReminder) => {
          setReminders(reminders.map((r) => (r._id === editingReminder._id ? updatedReminder : r)));
          setSuccess("Reminder updated successfully!");
          setShowForm(false);
          setEditingReminder(null);
          
          // Clear success message after timeout
          setTimeout(() => setSuccess(""), 3000);
        },
        // Error callback
        (message) => {
          setError(message);
          setTimeout(() => setError(""), 5000);
        }
      );
    } else {
      // Add new reminder
      reminderController.addReminder(
        formData,
        // Success callback
        (newReminder) => {
          setReminders([...reminders, newReminder]);
          setSuccess("Reminder added successfully!");
          setShowForm(false);
          
          // Clear success message after timeout
          setTimeout(() => setSuccess(""), 3000);
        },
        // Error callback
        (message) => {
          setError(message);
          setTimeout(() => setError(""), 5000);
        }
      );
    }
  };

  /**
   * Handle delete confirmation
   * @param {string} id - Reminder ID
   */
  const handleDeleteConfirm = (id) => {
    reminderController.deleteReminder(
      id,
      // Success callback
      () => {
        setReminders(reminders.filter((r) => r._id !== id));
        setSuccess("Reminder deleted successfully!");
        setShowConfirmation(null);
        
        // Clear success message after timeout
        setTimeout(() => setSuccess(""), 3000);
      },
      // Error callback
      (message) => {
        setError(message);
        setTimeout(() => setError(""), 5000);
      }
    );
  };

  /**
   * Open the edit form
   * @param {Reminder} reminder - Reminder to edit
   */
  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  /**
   * Apply template pack
   * @param {Object} templatePack - Template pack object
   */
  const handleApplyTemplate = (templatePack) => {
    setShowTemplateGallery(false);
    setSuccess(`Adding ${templatePack.reminders.length} reminders from ${templatePack.name}...`);
    
    reminderController.applyTemplatePack(
      templatePack,
      // Per-reminder success callback
      (reminder, index, total) => {
        // Update progress message
        setSuccess(`Adding reminder ${index + 1} of ${total} from ${templatePack.name}...`);
      },
      // Complete callback
      (results) => {
        // Update reminders list
        setReminders(prev => [...prev, ...results]);
        setSuccess(`${templatePack.name} template applied successfully!`);
        setTimeout(() => setSuccess(""), 3000);
      },
      // Error callback
      (message) => {
        setError(message);
        setTimeout(() => setError(""), 5000);
      }
    );
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
            <svg className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
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
              <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
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
                        {reminder.getFormattedDays()}
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
                            {reminder.getFormattedDays()}
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
                reminderTypes={REMINDER_TYPES}
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
            reminderTypes={REMINDER_TYPES}
            onClose={() => setShowTestNotification(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReminderListView;