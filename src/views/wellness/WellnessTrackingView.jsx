import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowPathIcon,
  PlusIcon,
  CheckCircleIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { wellnessController } from '../../controllers';

// Notification component for feedback
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

// Wellness Card Component
const WellnessCard = ({ title, description, icon, color, actionText, onAction }) => {
  return (
    <motion.div
      className={`p-4 rounded-lg border ${color} hover:shadow-md transition-shadow`}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white p-2">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          {actionText && (
            <button
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              onClick={onAction}
            >
              {actionText} →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Daily Check-in Form
const DailyCheckinForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    mood: initialData.mood || 4,
    stress: initialData.stress || 3,
    sleepHours: initialData.sleepHours || 7,
    sleepQuality: initialData.sleepQuality || 'good',
    workHours: initialData.workHours || 8,
    breaksTaken: initialData.breaksTaken || 2,
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const moodOptions = [
    { value: 1, label: "Angry 😠" },
    { value: 2, label: "Sad 😢" },
    { value: 3, label: "Anxious 😰" },
    { value: 4, label: "Neutral 😐" },
    { value: 5, label: "Happy 😊" },
  ];
  
  return (
    <motion.div
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Check-in</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mood section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How are you feeling today?
          </label>
          <div className="grid grid-cols-5 gap-2">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`p-3 rounded-lg border flex flex-col items-center justify-center ${
                  parseInt(formData.mood) === option.value
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setFormData(prev => ({ ...prev, mood: option.value }))}
              >
                <span className="text-2xl">{option.label.split(' ')[1]}</span>
                <span className="text-xs mt-1">{option.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Stress Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stress Level (1-5)
          </label>
          <input
            type="range"
            min="1"
            max="5"
            name="stress"
            value={formData.stress}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low Stress</span>
            <span>High Stress</span>
          </div>
        </div>
        
        {/* Sleep */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hours of Sleep
            </label>
            <select
              name="sleepHours"
              value={formData.sleepHours}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 4).map(hours => (
                <option key={hours} value={hours}>{hours} hours</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sleep Quality
            </label>
            <select
              name="sleepQuality"
              value={formData.sleepQuality}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="poor">Poor</option>
              <option value="fair">Fair</option>
              <option value="good">Good</option>
              <option value="excellent">Excellent</option>
            </select>
          </div>
        </div>
        
        {/* Work */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Hours Today
            </label>
            <select
              name="workHours"
              value={formData.workHours}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {Array.from({ length: 13 }, (_, i) => i + 2).map(hours => (
                <option key={hours} value={hours}>{hours} hours</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breaks Taken
            </label>
            <select
              name="breaksTaken"
              value={formData.breaksTaken}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {Array.from({ length: 11 }, (_, i) => i).map(breaks => (
                <option key={breaks} value={breaks}>{breaks} breaks</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow"
          >
            Submit Check-in
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Work Session Timer Component
const WorkSessionTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState("work"); // work or break
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [cycles, setCycles] = useState(0);
  const [notification, setNotification] = useState({ message: "", type: "" });
  
  const intervalRef = useRef(null);
  
  // Timer presets in seconds
  const TIMER_PRESETS = {
    work: 25 * 60, // 25 minutes
    shortBreak: 5 * 60, // 5 minutes
    longBreak: 15 * 60 // 15 minutes
  };
  
  // Effect to handle timer countdown
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            handleSessionComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isActive, sessionType]);
  
  // Handle session completion
  const handleSessionComplete = () => {
    // Play notification sound (in a real app)
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
    
    if (sessionType === "work") {
      setCycles(prev => prev + 1);
      
      // After 4 work sessions, take a long break
      if ((cycles + 1) % 4 === 0) {
        setNotification({
          message: "Great job! Time for a longer break.",
          type: "success"
        });
        setSessionType("longBreak");
        setTimeLeft(TIMER_PRESETS.longBreak);
      } else {
        setNotification({
          message: "Work session complete! Take a short break.",
          type: "success"
        });
        setSessionType("shortBreak");
        setTimeLeft(TIMER_PRESETS.shortBreak);
      }
    } else {
      setNotification({
        message: "Break time is over. Ready to focus?",
        type: "info"
      });
      setSessionType("work");
      setTimeLeft(TIMER_PRESETS.work);
    }
    
    setIsActive(false);
  };
  
  // Start or pause the timer
  const toggleTimer = () => {
    setIsActive(prev => !prev);
    
    if (!isActive) {
      setNotification({
        message: sessionType === "work" 
          ? "Focus time started. You can do this!" 
          : "Break time started. Take it easy.",
        type: "info"
      });
    }
  };
  
  // Reset the timer to default work session
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setSessionType("work");
    setTimeLeft(TIMER_PRESETS.work);
    setNotification({ message: "Timer reset", type: "info" });
  };
  
  // Switch between session types manually
  const changeSessionType = (type) => {
    if (isActive) {
      // Confirm before changing active session
      if (!window.confirm("Timer is running. Are you sure you want to change?")) {
        return;
      }
      clearInterval(intervalRef.current);
    }
    
    setSessionType(type);
    setTimeLeft(TIMER_PRESETS[type]);
    setIsActive(false);
  };
  
  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const total = TIMER_PRESETS[sessionType];
    return ((total - timeLeft) / total) * 100;
  };
  
  // Close notification
  const closeNotification = () => {
    setNotification({ message: "", type: "" });
  };
  
  // Background and text colors based on session type
  const bgColor = 
    sessionType === "work" ? "bg-indigo-100 border-indigo-300" :
    sessionType === "shortBreak" ? "bg-emerald-100 border-emerald-300" :
    "bg-blue-100 border-blue-300";
    
  const textColor = 
    sessionType === "work" ? "text-indigo-700" :
    sessionType === "shortBreak" ? "text-emerald-700" :
    "text-blue-700";
    
  const progressColor = 
    sessionType === "work" ? "bg-indigo-600" :
    sessionType === "shortBreak" ? "bg-emerald-600" :
    "bg-blue-600";
  
  return (
    <div className={`${bgColor} rounded-2xl shadow-lg p-6 max-w-md mx-auto border-2`}>
      {/* Notification */}
      <AnimatePresence>
        {notification.message && (
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={closeNotification} 
          />
        )}
      </AnimatePresence>
      
      {/* Session type tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`flex-1 py-2 text-center ${sessionType === "work" ? `${textColor} border-b-2 border-current font-medium` : "text-gray-500"}`}
          onClick={() => changeSessionType("work")}
        >
          Work Session
        </button>
        <button
          className={`flex-1 py-2 text-center ${sessionType === "shortBreak" ? `${textColor} border-b-2 border-current font-medium` : "text-gray-500"}`}
          onClick={() => changeSessionType("shortBreak")}
        >
          Short Break
        </button>
        <button
          className={`flex-1 py-2 text-center ${sessionType === "longBreak" ? `${textColor} border-b-2 border-current font-medium` : "text-gray-500"}`}
          onClick={() => changeSessionType("longBreak")}
        >
          Long Break
        </button>
      </div>
      
      {/* Timer display */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <svg className="w-48 h-48">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="70"
              cx="96"
              cy="96"
            />
            <circle
              className={progressColor}
              strokeWidth="8"
              strokeDasharray="440"
              strokeDashoffset={440 - (440 * calculateProgress()) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="70"
              cx="96"
              cy="96"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
            <p className="text-sm mt-1 capitalize">
              {sessionType === "shortBreak" ? "Short Break" : 
               sessionType === "longBreak" ? "Long Break" : "Work"}
            </p>
          </div>
        </div>
      </div>
      
      {/* Control buttons */}
      <div className="flex justify-center space-x-4">
        <button
          className={`px-6 py-2 rounded-lg flex items-center ${
            isActive
              ? "bg-red-500 text-white hover:bg-red-600"
              : `bg-emerald-500 text-white hover:bg-emerald-600`
          }`}
          onClick={toggleTimer}
        >
          {isActive ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start
            </>
          )}
        </button>
        
        <button
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center"
          onClick={resetTimer}
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          Reset
        </button>
      </div>
      
      {/* Session counter */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Completed Sessions: <span className="font-medium">{cycles}</span>
        </p>
        <div className="flex justify-center mt-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 mx-1 rounded-full ${
                i < (cycles % 4) ? "bg-indigo-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {4 - (cycles % 4)} more until long break
        </p>
      </div>
    </div>
  );
};

// Water Log Tracker Component
const WaterLogTracker = () => {
  const [glassesCount, setGlassesCount] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [waterLogs, setWaterLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Add water glass
  const addWaterGlass = async () => {
    setIsLoading(true);
    
    try {
      // Simulating API call to save water glass
      // In a real app, this would call wellnessController.saveHydration(1)
      const newCount = glassesCount + 1;
      setGlassesCount(newCount);
      
      // Add log entry
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amount: 1
      };
      
      setWaterLogs([newLog, ...waterLogs]);
    } catch (error) {
      console.error("Failed to log water:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate percentage of daily goal
  const calculatePercentage = () => {
    return Math.min(100, (glassesCount / dailyGoal) * 100);
  };
  
  // Get text based on progress
  const getProgressText = () => {
    const percentage = calculatePercentage();
    if (percentage < 25) return "Just getting started!";
    if (percentage < 50) return "Keep it up!";
    if (percentage < 75) return "Halfway there!";
    if (percentage < 100) return "Almost there!";
    return "Goal achieved!";
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Today's Hydration</h3>
        
        {/* Progress visualization */}
        <div className="relative h-40 w-40 mx-auto mb-4">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="10"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * calculatePercentage()) / 100}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-cyan-600">{glassesCount}</span>
            <span className="text-sm text-gray-500">of {dailyGoal} glasses</span>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-gray-600">{getProgressText()}</p>
        </div>
        
        {/* Add water button */}
        <button
          onClick={addWaterGlass}
          disabled={isLoading}
          className="w-full py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition flex items-center justify-center"
        >
          {isLoading ? (
            <span className="animate-pulse">Logging...</span>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4.75L19.25 9L19.25 18.25L12 22.25L4.75 18.25V9L12 4.75Z" />
                <path d="M12 13.25C14.3472 13.25 16.25 11.3472 16.25 9C16.25 6.65279 14.3472 4.75 12 4.75C9.65279 4.75 7.75 6.65279 7.75 9C7.75 11.3472 9.65279 13.25 12 13.25Z" />
              </svg>
              Add Glass of Water
            </>
          )}
        </button>
        
        {/* Daily goal settings */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Daily Goal (glasses)
          </label>
          <div className="flex space-x-2">
            {[6, 8, 10, 12].map(goal => (
              <button
                key={goal}
                className={`flex-1 py-2 rounded-lg text-sm ${
                  dailyGoal === goal
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setDailyGoal(goal)}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Water log history */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Water Log History</h3>
        
        {waterLogs.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500">No water logged yet today. Add your first glass!</p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {waterLogs.map(log => (
                <li key={log.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-cyan-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span className="font-medium">{log.amount} glass</span>
                  </div>
                  <span className="text-sm text-gray-500">{log.time}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Hydration insights */}
        <div className="mt-4 bg-cyan-50 p-4 rounded-lg">
          <h4 className="font-medium text-cyan-800 mb-2">Hydration Insights</h4>
          <p className="text-sm text-cyan-700">
            {glassesCount < (dailyGoal / 2) 
              ? "You're falling behind on your hydration goal. Try setting reminders!"
              : glassesCount >= dailyGoal
              ? "Great job reaching your hydration goal today!"
              : "You're making good progress toward your daily goal!"}
          </p>
          <p className="text-sm text-cyan-700 mt-2">
            Staying hydrated helps improve energy levels, cognitive function, and skin health.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main WellnessTrackingView Component
const WellnessTrackingView = () => {
  const navigate = useNavigate();
  const [showCheckin, setShowCheckin] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [stats, setStats] = useState({
    averageMood: 3.7,
    averageSleepHours: 7.2,
    workBreakRatio: 5.2,
    currentStreak: 3,
    weeklyMoods: [
      { day: "Mon", mood: 4 },
      { day: "Tue", mood: 3 },
      { day: "Wed", mood: 3 },
      { day: "Thu", mood: 4 },
      { day: "Fri", mood: 5 },
      { day: "Sat", mood: 4 },
      { day: "Sun", mood: 3 },
    ],
    dailyCheckins: []
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle daily check-in submission
  const handleCheckinSubmit = async (formData) => {
    try {
      setIsLoading(true);
      await wellnessController.submitDailyCheckin(
        formData,
        // Success callback
        (results) => {
          console.log("Check-in saved:", results);
          setNotification({
            message: "Daily check-in saved successfully!",
            type: "success"
          });
          setShowCheckin(false);
          
          // Update stats (in a real app, this would come from the API)
          // For demo, we'll just add the new check-in to the array
          setStats(prev => ({
            ...prev,
            dailyCheckins: [formData, ...prev.dailyCheckins]
          }));
        },
        // Error callback
        (error) => {
          setNotification({
            message: error || "Failed to save check-in. Please try again.",
            type: "error"
          });
        },
        // Finally callback
        () => {
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Failed to submit daily check-in:", error);
      setNotification({
        message: "Failed to save check-in. Please try again.",
        type: "error"
      });
      setIsLoading(false);
    }
  };
  
  // Close notification
  const closeNotification = () => {
    setNotification({ message: "", type: "" });
  };
  
  // Get today's date in readable format
  const getTodayDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };
  
  // Check if user has completed daily check-in
  const hasCompletedCheckin = () => {
    if (!stats || !stats.dailyCheckins || stats.dailyCheckins.length === 0) {
      return false;
    }
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Check if any check-in has a valid date matching today
    return stats.dailyCheckins.some(checkin => {
      // Handle cases where checkin.date might not exist
      if (!checkin.date) {
        // If no date, check if it was added today (assuming first item is most recent)
        return stats.dailyCheckins.indexOf(checkin) === 0;
      }
      
      try {
        // Make sure the date is valid before trying to convert it
        const checkinDate = new Date(checkin.date);
        // Check if the date is valid
        if (isNaN(checkinDate.getTime())) {
          return false;
        }
        return checkinDate.toISOString().split('T')[0] === today;
      } catch (error) {
        // If any error occurs during date conversion, assume it's not today
        console.error("Error processing date:", error);
        return false;
      }
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-4"
    >
      {/* Notification */}
      <AnimatePresence>
        {notification.message && (
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={closeNotification} 
          />
        )}
      </AnimatePresence>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="text-center">
            <ArrowPathIcon className="w-12 h-12 mx-auto text-emerald-500 animate-spin" />
            <p className="mt-4 text-gray-700">Saving your wellness data...</p>
          </div>
        </div>
      )}
      
      {/* Dashboard header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Wellness Tracking</h1>
            <p className="text-gray-600">{getTodayDate()}</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                hasCompletedCheckin()
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
              onClick={() => setShowCheckin(true)}
            >
              {hasCompletedCheckin() ? (
                <>
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Daily Check-in Completed
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Daily Check-in
                </>
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Daily checkin form */}
      <AnimatePresence>
        {showCheckin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-8"
          >
            <DailyCheckinForm 
              onSubmit={handleCheckinSubmit}
              initialData={stats?.dailyCheckins?.[0] || {}}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Work Session Timer */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pomodoro Timer</h2>
          <WorkSessionTimer />
        </div>
        
        {/* Wellness Stats */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Wellness Overview</h2>
          <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-blue-700">Avg. Mood</p>
                    <p className="text-2xl font-bold text-blue-800">{stats.averageMood.toFixed(1)}</p>
                  </div>
                  <span className="text-2xl">
                    {stats.averageMood >= 4 ? "😊" : stats.averageMood >= 3 ? "😐" : "😔"}
                  </span>
                </div>
              </div>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-indigo-700">Avg. Sleep</p>
                    <p className="text-2xl font-bold text-indigo-800">{stats.averageSleepHours.toFixed(1)}h</p>
                  </div>
                  <MoonIcon className="w-6 h-6 text-indigo-700" />
                </div>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-emerald-700">Work/Break Ratio</p>
                    <p className="text-2xl font-bold text-emerald-800">{stats.workBreakRatio.toFixed(1)}:1</p>
                  </div>
                  <ArrowsRightLeftIcon className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-amber-700">Streak</p>
                    <p className="text-2xl font-bold text-amber-800">{stats.currentStreak} days</p>
                  </div>
                  <ChartBarIcon className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </div>
            
            {/* Weekly trends */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Weekly Mood Trend</h3>
              <div className="flex items-end h-32 space-x-1">
                {stats.weeklyMoods.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t-sm ${
                        day.mood >= 4 ? "bg-green-500" : 
                        day.mood >= 3 ? "bg-yellow-500" : 
                        "bg-red-500"
                      }`}
                      style={{ height: `${(day.mood / 5) * 100}%` }}
                    ></div>
                    <p className="text-xs mt-1">{day.day}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Tips */}
        <div className="md:col-span-1 lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Wellness Cards</h2>
          <div className="space-y-4">
            <WellnessCard
              title="Breathing Exercise"
              description="Take 5 minutes to practice 4-7-8 breathing to reduce stress and improve focus."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 15.75l-7.5-7.5-7.5 7.5" />
              </svg>}
              color="bg-blue-50 text-blue-700"
              actionText="Start Exercise"
              onAction={() => navigate('/dashboard/mental-health')}
            />
            
            <WellnessCard
              title="Stretching Reminder"
              description="Been sitting for a while? Take a 2-minute stretch break to relieve tension."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>}
              color="bg-emerald-50 text-emerald-700"
              actionText="View Stretches"
              onAction={() => navigate('/dashboard/reminders')}
            />
            
            <WellnessCard
              title="Hydration Check"
              description="Staying hydrated improves mood and cognitive function. Had water recently?"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>}
              color="bg-cyan-50 text-cyan-700"
              actionText="Log Water"
              onAction={() => navigate('/dashboard/reminders')}
            />
          </div>
        </div>
      </div>
      
      {/* Water Log Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Hydration Tracking</h2>
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6">
          <WaterLogTracker />
        </div>
      </div>
    </motion.div>
  );
};

export default WellnessTrackingView;