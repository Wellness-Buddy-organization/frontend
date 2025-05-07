import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRightIcon,
  PlusIcon,
  ArrowPathIcon,
  MicrophoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  ChartBarIcon,
  ArrowsRightLeftIcon
} from "@heroicons/react/24/outline";
import {
  saveMood,
  saveSleep,
  saveWork,
  logBreak,
  fetchDashboard
} from "../services/wellnessService";

// Mood options with visual representations
const MOOD_OPTIONS = [
  { value: 1, label: "Angry", emoji: "😠", color: "bg-red-100 border-red-300 text-red-700" },
  { value: 2, label: "Sad", emoji: "😢", color: "bg-blue-100 border-blue-300 text-blue-700" },
  { value: 3, label: "Anxious", emoji: "😰", color: "bg-yellow-100 border-yellow-300 text-yellow-700" },
  { value: 4, label: "Neutral", emoji: "😐", color: "bg-gray-100 border-gray-300 text-gray-700" },
  { value: 5, label: "Happy", emoji: "😊", color: "bg-green-100 border-green-300 text-green-700" },
];

// Stress level descriptions
const STRESS_LEVELS = [
  { value: 1, label: "Very Low", description: "Completely relaxed, no stress" },
  { value: 2, label: "Low", description: "Minimal stress, easily manageable" },
  { value: 3, label: "Moderate", description: "Noticeable stress, but coping" },
  { value: 4, label: "High", description: "Significant stress affecting focus" },
  { value: 5, label: "Very High", description: "Overwhelming stress, difficulty functioning" },
];

// Notification Component
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

// Daily Check-in Form
const DailyCheckinForm = ({ onSubmit, initialData = {} }) => {
  const [step, setStep] = useState(1); // 1-mood, 2-sleep, 3-work, 4-summary
  const [formData, setFormData] = useState({
    mood: initialData.mood || 4,
    stress: initialData.stress || 3,
    sleepHours: initialData.sleepHours || "",
    sleepQuality: initialData.sleepQuality || "good",
    workHours: initialData.workHours || "",
    breaksTaken: initialData.breaksTaken || 0,
    notes: initialData.notes || "",
    weather: initialData.weather || "sunny",
  });
  const [isRecording, setIsRecording] = useState(false);
  
  const prevStep = () => setStep(Math.max(1, step - 1));
  const nextStep = () => setStep(Math.min(4, step + 1));
  
  // Handle voice input (simulated)
  const handleVoiceInput = () => {
    setIsRecording(true);
    
    // In a real app, this would process actual voice input
    setTimeout(() => {
      setIsRecording(false);
      
      // Simulate recognized voice command with appropriate data for current step
      if (step === 1) {
        setFormData(prev => ({ ...prev, mood: 5, stress: 2 }));
      } else if (step === 2) {
        setFormData(prev => ({ ...prev, sleepHours: "7", sleepQuality: "good" }));
      } else if (step === 3) {
        setFormData(prev => ({ ...prev, workHours: "8", breaksTaken: 3 }));
      } else {
        setFormData(prev => ({ ...prev, notes: "Had a productive day with good energy levels." }));
      }
    }, 2000);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  // Progress bar calculation
  const progress = ((step - 1) / 3) * 100;
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Mood</span>
          <span>Sleep</span>
          <span>Work</span>
          <span>Notes</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Mood & Stress */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">How are you feeling today?</h2>
            
            {/* Mood selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mood
              </label>
              <div className="grid grid-cols-5 gap-2">
                {MOOD_OPTIONS.map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 ${
                      formData.mood === option.value
                        ? `ring-2 ring-emerald-500 ${option.color}`
                        : "border-transparent hover:bg-gray-50"
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, mood: option.value }))}
                  >
                    <span className="text-2xl mb-1">{option.emoji}</span>
                    <span className="text-xs font-medium">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Stress slider */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Stress Level
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.stress}
                onChange={e => setFormData(prev => ({ ...prev, stress: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Very Low</span>
                <span>Very High</span>
              </div>
              <div className="text-center text-sm mt-2">
                <span className="font-medium">{STRESS_LEVELS[formData.stress - 1].label}</span>: {STRESS_LEVELS[formData.stress - 1].description}
              </div>
            </div>
            
            {/* Weather selection - for environmental context */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Today's Weather (Optional)
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-lg border ${
                    formData.weather === "sunny" ? "bg-amber-100 border-amber-300 text-amber-700" : "bg-gray-100"
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, weather: "sunny" }))}
                >
                  <SunIcon className="w-5 h-5 mx-auto" />
                  <span className="text-xs">Sunny</span>
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-lg border ${
                    formData.weather === "cloudy" ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-gray-100"
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, weather: "cloudy" }))}
                >
                  <CloudIcon className="w-5 h-5 mx-auto" />
                  <span className="text-xs">Cloudy</span>
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-lg border ${
                    formData.weather === "rainy" ? "bg-indigo-100 border-indigo-300 text-indigo-700" : "bg-gray-100"
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, weather: "rainy" }))}
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14.5a3.5 3.5 0 00-.5-7A5.5 5.5 0 003 15a4 4 0 006 4" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 18l-2 3m-3-3l-2 3m-3-3l-2 3" />
                  </svg>
                  <span className="text-xs">Rainy</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Step 2: Sleep */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">How did you sleep?</h2>
            
            {/* Sleep duration */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Hours of Sleep
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  className="w-24 p-2 border rounded-lg"
                  value={formData.sleepHours}
                  onChange={e => setFormData(prev => ({ ...prev, sleepHours: e.target.value }))}
                  placeholder="7.5"
                />
                <span className="text-gray-500">hours</span>
                
                {/* Quick selection buttons */}
                <div className="flex gap-1 ml-4">
                  {[6, 7, 8, 9].map(hours => (
                    <button
                      key={hours}
                      type="button"
                      className={`px-2 py-1 text-xs rounded ${
                        formData.sleepHours === hours.toString() ? "bg-emerald-500 text-white" : "bg-gray-100"
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, sleepHours: hours.toString() }))}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sleep quality feedback based on hours */}
              {formData.sleepHours && (
                <div className={`text-sm mt-2 ${
                  parseInt(formData.sleepHours) >= 7 && parseInt(formData.sleepHours) <= 9
                    ? "text-green-600"
                    : parseInt(formData.sleepHours) < 6 || parseInt(formData.sleepHours) > 10
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}>
                  {parseInt(formData.sleepHours) >= 7 && parseInt(formData.sleepHours) <= 9
                    ? "Great job! You're in the optimal sleep range."
                    : parseInt(formData.sleepHours) < 6
                    ? "That's on the low side. Adults typically need 7-9 hours."
                    : parseInt(formData.sleepHours) > 10
                    ? "That's more than average. Feeling extra tired?"
                    : "You're close to the recommended range of 7-9 hours."}
                </div>
              )}
            </div>
            
            {/* Sleep quality */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sleep Quality
              </label>
              <div className="flex space-x-2">
                {["poor", "fair", "good", "excellent"].map(quality => (
                  <button
                    key={quality}
                    type="button"
                    className={`flex-1 py-2 rounded-lg ${
                      formData.sleepQuality === quality
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, sleepQuality: quality }))}
                  >
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Time to bed & wake up (simplified visual) */}
            <div className="border rounded-lg p-4 bg-indigo-50">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <MoonIcon className="w-6 h-6 mx-auto text-indigo-600" />
                  <div className="text-sm mt-1">Bedtime</div>
                  <div className="font-medium">11:00 PM</div>
                </div>
                
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-indigo-200 rounded-full relative">
                    <div className="absolute inset-y-0 left-0 bg-indigo-600 rounded-full" style={{ width: `${(formData.sleepHours / 12) * 100}%` }}></div>
                  </div>
                  <div className="text-center text-sm mt-1">
                    {formData.sleepHours ? `${formData.sleepHours} hours` : "Sleep duration"}
                  </div>
                </div>
                
                <div className="text-center">
                  <SunIcon className="w-6 h-6 mx-auto text-amber-500" />
                  <div className="text-sm mt-1">Wake up</div>
                  <div className="font-medium">7:00 AM</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Step 3: Work & Breaks */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Work & Break Balance</h2>
            
            {/* Work hours */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Work Hours Today
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  className="w-24 p-2 border rounded-lg"
                  value={formData.workHours}
                  onChange={e => setFormData(prev => ({ ...prev, workHours: e.target.value }))}
                  placeholder="8"
                />
                <span className="text-gray-500">hours</span>
                
                {/* Quick selection buttons */}
                <div className="flex gap-1 ml-4">
                  {[4, 6, 8, 10].map(hours => (
                    <button
                      key={hours}
                      type="button"
                      className={`px-2 py-1 text-xs rounded ${
                        formData.workHours === hours.toString() ? "bg-emerald-500 text-white" : "bg-gray-100"
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, workHours: hours.toString() }))}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Work hours feedback */}
              {formData.workHours && (
                <div className={`text-sm mt-2 ${
                  parseInt(formData.workHours) <= 8
                    ? "text-green-600"
                    : parseInt(formData.workHours) > 10
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}>
                  {parseInt(formData.workHours) <= 8
                    ? "Great job maintaining healthy work hours!"
                    : parseInt(formData.workHours) > 10
                    ? "That's a long workday. Make sure to take breaks and rest."
                    : "A bit longer than ideal. Try to balance work and rest."}
                </div>
              )}
            </div>
            
            {/* Breaks taken */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Breaks Taken
              </label>
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  {[0, 1, 2, 3, 4, 5].map(count => (
                    <button
                      key={count}
                      type="button"
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.breaksTaken === count
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, breaksTaken: count }))}
                    >
                      {count}
                    </button>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="p-2 rounded-lg bg-gray-100"
                    onClick={() => setFormData(prev => ({ ...prev, breaksTaken: Math.max(0, prev.breaksTaken - 1) }))}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg bg-gray-100"
                    onClick={() => setFormData(prev => ({ ...prev, breaksTaken: prev.breaksTaken + 1 }))}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Break recommendation */}
              {formData.workHours && formData.breaksTaken !== undefined && (
                <div className="text-sm mt-2">
                  {formData.workHours > 0 && formData.breaksTaken / parseInt(formData.workHours) < 0.5
                    ? "Consider taking more breaks for better productivity."
                    : "Good job taking regular breaks!"}
                </div>
              )}
            </div>
            
            {/* Work-break balance visualization */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Work-Break Balance</h3>
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                {formData.workHours && formData.breaksTaken !== undefined && (
                  <>
                    <div 
                      className="h-full bg-emerald-500 flex items-center justify-end pr-2 text-xs text-white font-medium"
                      style={{ width: `${(formData.breaksTaken * 15 / (parseInt(formData.workHours) * 60)) * 100}%` }}
                    >
                      {formData.breaksTaken > 0 ? 'Breaks' : ''}
                    </div>
                    <div className="text-center text-xs mt-1">
                      {formData.breaksTaken * 15} minutes of breaks during {formData.workHours} hours of work
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Step 4: Notes & Summary */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Notes</h2>
            
            {/* Notes textarea */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Any additional notes about your day? (Optional)
              </label>
              <div className="relative">
                <textarea
                  className="w-full p-3 border rounded-lg min-h-[100px]"
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter any notes about your day, factors affecting your wellness, etc."
                ></textarea>
                
                {/* Voice input button */}
                <button
                  type="button"
                  className={`absolute bottom-2 right-2 p-2 rounded-full ${
                    isRecording ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                  onClick={handleVoiceInput}
                >
                  <MicrophoneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Summary card */}
            <div className="border rounded-lg p-4 bg-emerald-50">
              <h3 className="font-medium text-gray-700 mb-3">Daily Wellness Summary</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">{MOOD_OPTIONS.find(m => m.value === formData.mood)?.emoji}</span>
                  <span>Feeling <strong>{MOOD_OPTIONS.find(m => m.value === formData.mood)?.label}</strong> with <strong>{STRESS_LEVELS[formData.stress - 1].label}</strong> stress</span>
                </li>
                <li className="flex items-center">
                  <MoonIcon className="w-5 h-5 mr-2 text-indigo-600" />
                  <span><strong>{formData.sleepHours || "0"}</strong> hours of <strong>{formData.sleepQuality}</strong> sleep</span>
                </li>
                <li className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-blue-600" />
                  <span><strong>{formData.workHours || "0"}</strong> hours of work with <strong>{formData.breaksTaken || "0"}</strong> breaks</span>
                </li>
                {formData.weather && (
                  <li className="flex items-center">
                    {formData.weather === "sunny" && <SunIcon className="w-5 h-5 mr-2 text-amber-500" />}
                    {formData.weather === "cloudy" && <CloudIcon className="w-5 h-5 mr-2 text-blue-500" />}
                    {formData.weather === "rainy" && (
                      <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 18l3 3m0-3l-3 3" />
                      </svg>
                    )}
                    <span><strong>{formData.weather.charAt(0).toUpperCase() + formData.weather.slice(1)}</strong> weather today</span>
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center"
              onClick={prevStep}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          
          {step < 4 ? (
            <button
              type="button"
              className="ml-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center"
              onClick={nextStep}
            >
              Next
              <ChevronRightIcon className="w-5 h-5 ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Save Daily Check-in
            </button>
          )}
        </div>
        
        {/* Voice input indicator */}
        {isRecording && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <MicrophoneIcon className="w-8 h-8 text-red-600 animate-pulse" />
              </div>
              <p className="text-lg font-medium">Listening...</p>
              <p className="text-gray-500 text-sm mt-1">Speak clearly about your wellness data</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

// Work Session Timer Component
const WorkSessionTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState("work"); // work or break
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [cycles, setCycles] = useState(0);
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    cyclesBeforeLongBreak: 4
  });
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef(null);
  
  // Start/stop timer
  const toggleTimer = () => {
    if (isActive) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed, switch modes
            clearInterval(intervalRef.current);
            
            if (sessionType === "work") {
              // Work session complete
              const newCycleCount = cycles + 1;
              setCycles(newCycleCount);
              
              // Determine if it should be a short or long break
              if (newCycleCount % pomodoroSettings.cyclesBeforeLongBreak === 0) {
                setTimeLeft(pomodoroSettings.longBreakDuration * 60);
                setSessionType("longBreak");
              } else {
                setTimeLeft(pomodoroSettings.shortBreakDuration * 60);
                setSessionType("break");
              }
            } else {
              // Break session complete, back to work
              setTimeLeft(pomodoroSettings.workDuration * 60);
              setSessionType("work");
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    setIsActive(prev => !prev);
  };
  
  // Reset timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setSessionType("work");
    setTimeLeft(pomodoroSettings.workDuration * 60);
    setCycles(0);
  };
  
  // Skip to next session
  const skipToNext = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    
    if (sessionType === "work") {
      // Skip to break
      const newCycleCount = cycles + 1;
      setCycles(newCycleCount);
      
      if (newCycleCount % pomodoroSettings.cyclesBeforeLongBreak === 0) {
        setTimeLeft(pomodoroSettings.longBreakDuration * 60);
        setSessionType("longBreak");
      } else {
        setTimeLeft(pomodoroSettings.shortBreakDuration * 60);
        setSessionType("break");
      }
    } else {
      // Skip to work
      setTimeLeft(pomodoroSettings.workDuration * 60);
      setSessionType("work");
    }
  };
  
  // Update settings
  const updateSettings = (key, value) => {
    setPomodoroSettings(prev => ({
      ...prev,
      [key]: parseInt(value)
    }));
  };
  
  // Apply settings changes
  const applySettings = () => {
    resetTimer();
    setShowSettings(false);
  };
  
  // Format time as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const totalTime = sessionType === "work" 
      ? pomodoroSettings.workDuration * 60 
      : sessionType === "longBreak"
      ? pomodoroSettings.longBreakDuration * 60
      : pomodoroSettings.shortBreakDuration * 60;
    
    return ((totalTime - timeLeft) / totalTime) * 100;
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg border border-emerald-100 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Pomodoro Timer</h3>
      
      {/* Timer display */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full bg-gray-100"></div>
          
          {/* Progress circle */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={sessionType === "work" ? "#059669" : "#8b5cf6"}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * calculateProgress()) / 100}
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          {/* Time and status display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {sessionType === "work" ? "Working" : sessionType === "longBreak" ? "Long Break" : "Short Break"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center space-x-3 mb-4">
        <button
          className={`px-6 py-2 rounded-lg ${
            isActive 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }`}
          onClick={toggleTimer}
        >
          {isActive ? "Pause" : "Start"}
        </button>
        
        <button
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          onClick={resetTimer}
        >
          Reset
        </button>
        
        <button
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          onClick={skipToNext}
        >
          Skip
        </button>
      </div>
      
      {/* Session info */}
      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <div>Completed: {cycles} cycles</div>
        <button 
          className="text-emerald-600 hover:underline"
          onClick={() => setShowSettings(!showSettings)}
        >
          Settings
        </button>
      </div>
      
      {/* Settings panel */}
      {showSettings && (
        <div className="border rounded-lg p-4 mb-4">
          <h4 className="font-medium mb-3">Timer Settings</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Work Duration:</label>
              <input
                type="number"
                min="1"
                max="60"
                className="w-16 border rounded p-1 text-center"
                value={pomodoroSettings.workDuration}
                onChange={(e) => updateSettings("workDuration", e.target.value)}
              /> <span className="text-sm text-gray-500">min</span>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Short Break:</label>
              <input
                type="number"
                min="1"
                max="30"
                className="w-16 border rounded p-1 text-center"
                value={pomodoroSettings.shortBreakDuration}
                onChange={(e) => updateSettings("shortBreakDuration", e.target.value)}
              /> <span className="text-sm text-gray-500">min</span>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Long Break:</label>
              <input
                type="number"
                min="1"
                max="60"
                className="w-16 border rounded p-1 text-center"
                value={pomodoroSettings.longBreakDuration}
                onChange={(e) => updateSettings("longBreakDuration", e.target.value)}
              /> <span className="text-sm text-gray-500">min</span>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Cycles before long break:</label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-16 border rounded p-1 text-center"
                value={pomodoroSettings.cyclesBeforeLongBreak}
                onChange={(e) => updateSettings("cyclesBeforeLongBreak", e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-3">
            <button
              className="px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
              onClick={applySettings}
            >
              Apply
            </button>
          </div>
        </div>
      )}
      
      {/* Focus tips */}
      <div className="bg-gray-50 rounded-lg p-3 text-sm">
        <div className="font-medium mb-1">Focus Tip:</div>
        <p className="text-gray-600">
          {sessionType === "work"
            ? "Remove distractions. Close unnecessary apps and put your phone away."
            : "Take a real break! Stand up, stretch, and rest your eyes from the screen."}
        </p>
      </div>
    </div>
  );
};

// Habit Streak Component
const HabitStreakTracker = ({ streaks }) => {
  // Example streak data
  const trackingStreaks = streaks || [
    { name: "Mood Tracking", currentStreak: 5, longestStreak: 12 },
    { name: "Sleep Logging", currentStreak: 3, longestStreak: 7 },
    { name: "Work Balance", currentStreak: 0, longestStreak: 5 },
  ];
  
  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg border border-emerald-100 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Tracking Streaks</h3>
      
      <div className="space-y-4">
        {trackingStreaks.map((streak, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex justify-between mb-2">
              <div className="font-medium">{streak.name}</div>
              <div className={`text-sm px-2 py-0.5 rounded-full ${
                streak.currentStreak > 0
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {streak.currentStreak} day{streak.currentStreak !== 1 ? "s" : ""}
              </div>
            </div>
            
            {/* Streak visualization */}
            <div className="flex items-center space-x-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-xs ${
                    i < streak.currentStreak
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i < streak.currentStreak ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    (i + 1)
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              Longest streak: {streak.longestStreak} day{streak.longestStreak !== 1 ? "s" : ""}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <button className="text-emerald-600 text-sm hover:underline inline-flex items-center">
          <ArrowPathIcon className="w-4 h-4 mr-1" />
          Update Streaks
        </button>
      </div>
    </div>
  );
};

// Correlation Insights Component
const CorrelationInsights = ({ data }) => {
  // Examples of potential correlations found in user data
  const insights = [
    { 
      id: 1,
      title: "Sleep affects your mood",
      description: "Days with 7+ hours of sleep show 30% higher mood ratings",
      factors: ["Sleep", "Mood"],
      strength: 0.8,
      recommendation: "Aim for 7-8 hours of sleep consistently"
    },
    { 
      id: 2,
      title: "Regular breaks improve productivity",
      description: "Taking 3+ breaks correlates with lower reported stress",
      factors: ["Breaks", "Stress"],
      strength: 0.6,
      recommendation: "Schedule regular short breaks during work hours"
    },
    { 
      id: 3,
      title: "Weather affects your energy",
      description: "Sunny days correlate with higher energy levels",
      factors: ["Weather", "Energy"],
      strength: 0.5,
      recommendation: "On rainy days, use bright lights and stay active"
    }
  ];
  
  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg border border-emerald-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Wellness Insights</h3>
        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          AI-Powered
        </div>
      </div>
      
      <div className="space-y-4">
        {insights.map(insight => (
          <motion.div
            key={insight.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center mb-2">
              <ChartBarIcon className="w-5 h-5 text-emerald-600 mr-2" />
              <h4 className="font-medium">{insight.title}</h4>
            </div>
            <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
            
            {/* Correlation strength visualization */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Correlation Strength</span>
                <span>{Math.round(insight.strength * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-emerald-500 rounded-full"
                  style={{ width: `${insight.strength * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Related factors */}
            <div className="flex mb-3 space-x-1">
              {insight.factors.map((factor, idx) => (
                <span 
                  key={idx}
                  className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full"
                >
                  {factor}
                </span>
              ))}
            </div>
            
            {/* Recommendation */}
            <div className="text-sm border-t pt-2 mt-2 text-emerald-700">
              <span className="font-medium">Recommendation: </span>
              {insight.recommendation}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Main Wellness Tracking Component
const WellnessTracking = () => {
  const [showCheckin, setShowCheckin] = useState(false);
  const [wellnessData, setWellnessData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("insights");
  const navigate = useNavigate();

  // Tabs for mobile view
  const tabs = [
    { id: "insights", label: "Insights" },
    { id: "timer", label: "Pomodoro" },
    { id: "streaks", label: "Streaks" },
    { id: "checkin", label: "Check-in" },
  ];

  // Load wellness data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboard();
        setWellnessData(data.wellness);
        setError("");
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load wellness data. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);

  // Handle daily check-in submission
  const handleCheckinSubmit = async (formData) => {
    try {
      // Process form data and save via APIs
      if (formData.mood) {
        await saveMood(
          MOOD_OPTIONS.find(m => m.value === formData.mood)?.label.toLowerCase() || "neutral", 
          formData.stress
        );
      }
      
      if (formData.sleepHours) {
        await saveSleep(formData.sleepHours, formData.sleepQuality);
      }
      
      if (formData.workHours) {
        await saveWork(formData.workHours);
        
        // Log breaks if taken
        if (formData.breaksTaken > 0) {
          for (let i = 0; i < formData.breaksTaken; i++) {
            await logBreak();
          }
        }
      }
      
      // Success message and reload data
      setSuccess("Daily check-in data saved successfully!");
      setShowCheckin(false);
      
      // Refresh data after short delay
      setTimeout(async () => {
        try {
          const data = await fetchDashboard();
          setWellnessData(data.wellness);
        } catch (error) {
          // Silent fail on refresh
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      }, 1000);
      
    } catch (err) {
      setError("Failed to save check-in data. Please try again.");
      setTimeout(() => setError(""), 5000);
    }
  };

  // Handle logging a break
  const handleLogBreak = async () => {
    try {
      await logBreak();
      setSuccess("Break logged successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to log break. Please try again.");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Wellness Tracking</h1>
          <p className="text-gray-600">Track and analyze your wellness metrics</p>
        </div>
        
        <div className="flex gap-2">
          <button
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            onClick={() => {
              setShowCheckin(true);
              setActiveTab("checkin");
            }}
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            Daily Check-in
          </button>
          
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={handleLogBreak}
          >
            <ClockIcon className="w-5 h-5 mr-1" />
            Log Break
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

      {/* Mobile Tab Navigation */}
      <div className="md:hidden mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-2 rounded-full ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "checkin") setShowCheckin(true);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 border-4 border-emerald-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 border-4 border-emerald-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Always visible on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Insights Section - Conditionally visible based on tab */}
            {(activeTab === "insights" || window.innerWidth >= 768) && (
              <CorrelationInsights data={wellnessData} />
            )}
            
            {/* Streaks Section - Conditionally visible based on tab */}
            {(activeTab === "streaks" || window.innerWidth >= 768) && (
              <HabitStreakTracker />
            )}
            
            {/* Daily Check-in Form - Conditionally visible */}
            {showCheckin && (activeTab === "checkin" || window.innerWidth >= 768) && (
              <DailyCheckinForm onSubmit={handleCheckinSubmit} />
            )}
          </div>
          
          {/* Right Column - Pomodoro Timer */}
          {(activeTab === "timer" || window.innerWidth >= 768) && (
            <div className="space-y-6">
              <WorkSessionTimer />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default WellnessTracking;