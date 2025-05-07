import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CheckCircleIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  ClockIcon,
  PauseIcon,
  PlayIcon,
  BookOpenIcon,
  BriefcaseIcon,
  HomeIcon,
  HeartIcon,
  AcademicCapIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

// Time allocation categories
const TIME_CATEGORIES = [
  { id: "work", label: "Work", icon: BriefcaseIcon, color: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: "family", label: "Family", icon: HomeIcon, color: "bg-purple-100 text-purple-800 border-purple-200" },
  { id: "personal", label: "Personal Care", icon: HeartIcon, color: "bg-rose-100 text-rose-800 border-rose-200" },
  { id: "learning", label: "Learning", icon: AcademicCapIcon, color: "bg-amber-100 text-amber-800 border-amber-200" },
  { id: "social", label: "Social", icon: UserGroupIcon, color: "bg-green-100 text-green-800 border-green-200" },
  { id: "rest", label: "Rest", icon: ClockIcon, color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
];

// Balance Score Component
const BalanceScoreCard = ({ score = 72 }) => {
  // Score ranges:
  // 0-33: Poor balance
  // 34-66: Moderate balance
  // 67-100: Good balance
  
  const getColor = () => {
    if (score >= 67) return "text-emerald-500";
    if (score >= 34) return "text-amber-500";
    return "text-red-500";
  };
  
  const getMessage = () => {
    if (score >= 67) return "Good balance";
    if (score >= 34) return "Moderate balance";
    return "Poor balance";
  };
  
  return (
    <motion.div
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Work-Life Balance Score</h2>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
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
              stroke={score >= 67 ? "#10b981" : score >= 34 ? "#f59e0b" : "#ef4444"}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * score) / 100}
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          {/* Score display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-3xl font-bold ${getColor()}`}>
              {score}
            </div>
            <div className="text-xs text-gray-500">out of 100</div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className={`text-lg font-semibold ${getColor()}`}>
            {getMessage()}
          </div>
          <p className="text-gray-600 text-sm mt-1">
            {score >= 67
              ? "You're maintaining a healthy balance between work and personal life."
              : score >= 34
              ? "Your balance could use some improvement in certain areas."
              : "Your work-life balance needs attention. Consider setting boundaries."}
          </p>
          <div className="flex mt-2">
            {score > 50 ? (
              <div className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs flex items-center">
                <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                Improving
              </div>
            ) : (
              <div className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs flex items-center">
                <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
                Declining
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Time Allocation Chart
const TimeAllocationChart = ({ timeData }) => {
  // Default data if none provided
  const defaultTimeData = [
    { category: "work", hours: 45, target: 40 },
    { category: "family", hours: 25, target: 35 },
    { category: "personal", hours: 15, target: 20 },
    { category: "learning", hours: 5, target: 7 },
    { category: "social", hours: 10, target: 12 },
    { category: "rest", hours: 68, target: 56 },
  ];
  
  // Use provided data or default
  const data = timeData || defaultTimeData;
  
  // Total weekly hours (168 = 24 * 7)
  const totalHours = 168;
  
  // Calculate percentages for each category
  const withPercentages = data.map(item => ({
    ...item,
    percent: Math.round((item.hours / totalHours) * 100),
    targetPercent: Math.round((item.target / totalHours) * 100),
    category: TIME_CATEGORIES.find(c => c.id === item.category) || TIME_CATEGORIES[0]
  }));
  
  return (
    <motion.div
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Weekly Time Allocation</h2>
      
      <div className="space-y-4">
        {withPercentages.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <item.category.icon className="w-5 h-5 mr-2 text-gray-700" />
                <span className="font-medium">{item.category.label}</span>
              </div>
              <div className="flex items-center text-sm space-x-3">
                <span className="text-gray-500">{item.hours}h</span>
                <span className="text-gray-400">/</span>
                <span className={item.hours >= item.target ? "text-emerald-600" : "text-amber-600"}>
                  {item.target}h target
                </span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-6 bg-gray-100 rounded-full overflow-hidden relative">
              {/* Current hours bar */}
              <div 
                className={`h-full rounded-l-full flex items-center justify-end ${
                  item.category.color.split(' ')[0] // Get just the background color
                }`}
                style={{ width: `${(item.hours / totalHours) * 100}%` }}
              >
                <span className="text-xs px-2 truncate">
                  {item.percent}%
                </span>
              </div>
              
              {/* Target marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-gray-800"
                style={{ left: `${(item.target / totalHours) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 border-t pt-4">
        <h3 className="font-medium text-gray-700 mb-2">Balance Analysis</h3>
        <p className="text-sm text-gray-600">
          {withPercentages.find(i => i.category.id === "work").hours > withPercentages.find(i => i.category.id === "work").target 
            ? "Your work hours are above target. Consider setting stricter boundaries."
            : "You're maintaining good work hour boundaries."}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {withPercentages.find(i => i.category.id === "rest").hours < withPercentages.find(i => i.category.id === "rest").target
            ? "You need more rest time for a healthy balance."
            : "Your rest time is adequate for recovery."}
        </p>
      </div>
    </motion.div>
  );
};

// Balance Challenge Component
const BalanceChallenge = () => {
  // Active challenges (displayed as in progress)
  const activeChallenges = [
    { 
      id: 1, 
      title: "Screen-Free Evening", 
      description: "No screens after 8pm for a week", 
      progress: 5, 
      total: 7,
      category: "rest",
      reward: "Improved sleep quality"
    },
    { 
      id: 2, 
      title: "Family First Weekends", 
      description: "Dedicate 4 hours each weekend day to family activities", 
      progress: 3, 
      total: 8,
      category: "family",
      reward: "Stronger family connections"
    }
  ];
  
  // Challenge suggestions
  const suggestedChallenges = [
    { 
      id: 3, 
      title: "Lunch Break Walk", 
      description: "Take a 15-minute walk during lunch break", 
      duration: "10 workdays",
      category: "personal",
      reward: "Improved energy and focus"
    },
    { 
      id: 4, 
      title: "Work Boundaries", 
      description: "No checking work emails after 6pm", 
      duration: "5 workdays",
      category: "work",
      reward: "Reduced work-related stress"
    },
    { 
      id: 5, 
      title: "Learning Time", 
      description: "Dedicate 30 minutes to learning a new skill", 
      duration: "14 days",
      category: "learning",
      reward: "Personal growth and satisfaction"
    }
  ];
  
  return (
    <motion.div
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Balance Challenges</h2>
        <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
          2 Active
        </div>
      </div>
      
      {/* Active challenges */}
      <div className="space-y-4 mb-6">
        <h3 className="text-md font-medium text-gray-700 flex items-center">
          <FireIcon className="w-5 h-5 mr-1 text-amber-500" />
          Current Challenges
        </h3>
        
        {activeChallenges.map(challenge => (
          <motion.div 
            key={challenge.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{challenge.title}</h4>
              <div className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Day {challenge.progress} of {challenge.total}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
            
            {/* Progress bar */}
            <div className="h-2 bg-gray-100 rounded-full mb-2">
              <div 
                className="h-2 bg-emerald-500 rounded-full"
                style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center text-xs mt-2">
              <div className="text-gray-500">
                {TIME_CATEGORIES.find(c => c.id === challenge.category)?.label || "Personal"} Category
              </div>
              <div className="flex items-center text-purple-700">
                <TrophyIcon className="w-4 h-4 mr-1" />
                {challenge.reward}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Suggested challenges */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-700 flex items-center">
          <BoltIcon className="w-5 h-5 mr-1 text-blue-500" />
          Suggested Challenges
        </h3>
        
        {suggestedChallenges.map(challenge => (
          <motion.div 
            key={challenge.id}
            className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{challenge.title}</h4>
              <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {challenge.duration}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
            
            <div className="flex justify-between items-center text-xs mt-2">
              <div className="text-gray-500">
                {TIME_CATEGORIES.find(c => c.id === challenge.category)?.label || "Personal"} Category
              </div>
              <div className="flex items-center text-purple-700">
                <TrophyIcon className="w-4 h-4 mr-1" />
                {challenge.reward}
              </div>
            </div>
            
            <button className="w-full mt-3 py-1.5 bg-white border border-emerald-500 text-emerald-600 rounded-lg text-sm hover:bg-emerald-50 transition-colors">
              Accept Challenge
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Achievement Recognition Component
const AchievementRecognition = () => {
  // Recent achievements
  const recentAchievements = [
    { 
      id: 1, 
      title: "Work Boundary Master", 
      description: "Maintained consistent work hours for 2 weeks", 
      date: "3 days ago",
      icon: BriefcaseIcon
    },
    { 
      id: 2, 
      title: "Break Champion", 
      description: "Took regular breaks during work hours", 
      date: "1 week ago",
      icon: ClockIcon
    },
    { 
      id: 3, 
      title: "Family Time Hero", 
      description: "Dedicated 10+ hours to family activities this week", 
      date: "2 weeks ago",
      icon: HomeIcon
    }
  ];
  
  return (
    <motion.div
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Achievements</h2>
      
      <div className="space-y-4">
        {recentAchievements.map(achievement => (
          <motion.div 
            key={achievement.id}
            className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
          >
            <div className="rounded-full bg-purple-100 p-3 h-fit">
              <achievement.icon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="flex justify-between">
                <h4 className="font-medium">{achievement.title}</h4>
                <span className="text-xs text-gray-500">{achievement.date}</span>
              </div>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center justify-center">
        <BookOpenIcon className="w-4 h-4 mr-1" />
        View All Achievements
      </button>
    </motion.div>
  );
};

// Work Focus Timer Component
const WorkFocusTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [targetHours, setTargetHours] = useState(8);
  const intervalRef = useRef(null);
  
  // Toggle timer
  const toggleTimer = () => {
    if (isActive) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    setIsActive(!isActive);
  };
  
  // Reset timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setTimeElapsed(0);
  };
  
  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    return Math.min(100, (timeElapsed / (targetHours * 3600)) * 100);
  };
  
  // Calculate hours worked
  const hoursWorked = (timeElapsed / 3600).toFixed(1);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <motion.div
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Work Hour Tracker</h2>
      
      {/* Timer display */}
      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40">
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
              stroke={hoursWorked > targetHours ? "#ef4444" : "#3b82f6"}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * calculateProgress()) / 100}
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-xs text-gray-500">
              {hoursWorked}h / {targetHours}h target
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center space-x-3 mb-6">
        <button
          className={`px-6 py-2 rounded-lg flex items-center ${
            isActive 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={toggleTimer}
        >
          {isActive ? (
            <>
              <PauseIcon className="w-5 h-5 mr-1" />
              Pause
            </>
          ) : (
            <>
              <PlayIcon className="w-5 h-5 mr-1" />
              Start
            </>
          )}
        </button>
        
        <button
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
      
      {/* Target Hours */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Work Hours
        </label>
        <div className="flex space-x-2">
          {[6, 7, 8, 9].map(hours => (
            <button
              key={hours}
              className={`flex-1 py-2 rounded-lg text-sm ${
                targetHours === hours
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setTargetHours(hours)}
            >
              {hours}h
            </button>
          ))}
        </div>
      </div>
      
      {/* Insights */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-700 mb-2">Insights</h3>
        {hoursWorked > targetHours ? (
          <p className="text-sm text-red-600">
            You've exceeded your target work hours. Consider wrapping up and taking time for yourself.
          </p>
        ) : hoursWorked > targetHours * 0.9 ? (
          <p className="text-sm text-amber-600">
            You're approaching your target work hours. Start planning to conclude your day.
          </p>
        ) : (
          <p className="text-sm text-blue-600">
            You have {(targetHours - hoursWorked).toFixed(1)} hours remaining in your workday.
          </p>
        )}
      </div>
    </motion.div>
  );
};

// Balance Tips Component
const BalanceTips = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Tips organized by category
  const tips = [
    {
      id: 1,
      category: "work",
      title: "Set work boundaries",
      description: "Define clear start and end times for your workday to prevent work from expanding into personal time.",
      actionable: true,
      action: "Set a daily work end time reminder"
    },
    {
      id: 2,
      category: "rest",
      title: "Digital detox",
      description: "Designate device-free times each day to disconnect and be present in the moment.",
      actionable: true,
      action: "Schedule 1 hour of screen-free time daily"
    },
    {
      id: 3,
      category: "family",
      title: "Quality over quantity",
      description: "When spending time with family, be fully present and engaged rather than distracted.",
      actionable: true,
      action: "Plan a dedicated family activity this weekend"
    },
    {
      id: 4,
      category: "work",
      title: "Regular breaks",
      description: "Use the Pomodoro technique to work in focused intervals with short breaks in between.",
      actionable: true,
      action: "Try a 25/5 minute work/break pattern"
    },
    {
      id: 5,
      category: "personal",
      title: "Prioritize self-care",
      description: "Schedule self-care activities in your calendar like any other important appointment.",
      actionable: true,
      action: "Block 30 minutes for yourself tomorrow"
    },
  ];
  
  // Filter tips based on selected category
  const filteredTips = selectedCategory === "all" 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);
  
  return (
    <motion.div
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Balance Tips</h2>
      
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
        <button
          className={`px-3 py-1 rounded-full text-sm ${
            selectedCategory === "all"
              ? "bg-emerald-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedCategory("all")}
        >
          All Tips
        </button>
        
        {TIME_CATEGORIES.map(category => (
          <button
            key={category.id}
            className={`px-3 py-1 rounded-full text-sm flex items-center ${
              selectedCategory === category.id
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <category.icon className="w-4 h-4 mr-1" />
            {category.label}
          </button>
        ))}
      </div>
      
      {/* Tips list */}
      <div className="space-y-4">
        {filteredTips.map(tip => (
          <motion.div
            key={tip.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{tip.title}</h3>
              <div className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {TIME_CATEGORIES.find(c => c.id === tip.category)?.label || "General"}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
            
            {tip.actionable && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Actionable</span>
                <button className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  {tip.action}
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Main Work-Life Balance Component
const WorkLifeBalanceView = () => {
  const [mockData, setMockData] = useState({
    balanceScore: 72,
    timeAllocation: [
      { category: "work", hours: 45, target: 40 },
      { category: "family", hours: 25, target: 35 },
      { category: "personal", hours: 15, target: 20 },
      { category: "learning", hours: 5, target: 7 },
      { category: "social", hours: 10, target: 12 },
      { category: "rest", hours: 68, target: 56 },
    ],
  });
  
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  // Tabs for mobile view
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "timer", label: "Timer" },
    { id: "tips", label: "Tips" },
    { id: "challenges", label: "Challenges" },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-4"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Work-Life Balance</h1>
      
      {/* Mobile Tab Navigation */}
      <div className="md:hidden mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-full ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview - Always visible on desktop, conditionally on mobile */}
          {(activeTab === "overview" || window.innerWidth >= 768) && (
            <>
              <BalanceScoreCard score={mockData.balanceScore} />
              <TimeAllocationChart timeData={mockData.timeAllocation} />
              {/* Show achievements on desktop, or mobile overview tab */}
              <AchievementRecognition />
            </>
          )}
          
          {/* Tips - Conditionally visible based on tab */}
          {(activeTab === "tips" || window.innerWidth >= 768) && (
            <BalanceTips />
          )}
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Timer - Conditionally visible based on tab */}
          {(activeTab === "timer" || window.innerWidth >= 768) && (
            <WorkFocusTimer />
          )}
          
          {/* Challenges - Conditionally visible based on tab */}
          {(activeTab === "challenges" || window.innerWidth >= 768) && (
            <BalanceChallenge />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WorkLifeBalanceView;