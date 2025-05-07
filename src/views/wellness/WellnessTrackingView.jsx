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

// Wellness Dashboard Main Component
const WellnessDashboard = () => {
  const navigate = useNavigate();
  const [showCheckin, setShowCheckin] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load user wellness data
    const loadStats = async () => {
      try {
        const data = await wellnessController.getWellnessStats();
        setStats(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load wellness stats:", error);
        setNotification({
          message: "Failed to load wellness data. Please try again.",
          type: "error"
        });
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, []);
  
  // Handle daily check-in submission
  const handleCheckinSubmit = async (formData) => {
    try {
      setIsLoading(true);
      await wellnessController.submitDailyCheckin(formData);
      
      // Reload stats
      const updatedStats = await wellnessController.getWellnessStats();
      setStats(updatedStats);
      
      setNotification({
        message: "Daily check-in saved successfully!",
        type: "success"
      });
      setShowCheckin(false);
    } catch (error) {
      console.error("Failed to submit daily check-in:", error);
      setNotification({
        message: "Failed to save check-in. Please try again.",
        type: "error"
      });
    } finally {
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
    return stats.dailyCheckins.some(checkin => 
      new Date(checkin.date).toISOString().split('T')[0] === today
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
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
            <p className="mt-4 text-gray-700">Loading your wellness data...</p>
          </div>
        </div>
      )}
      
      {/* Dashboard header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Wellness Dashboard</h1>
            <p className="text-gray-600 mt-1">{getTodayDate()}</p>
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
          {stats ? (
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
          ) : (
            <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-center h-full">
              <p className="text-gray-500">No wellness data available</p>
            </div>
          )}
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
              onAction={() => navigate('/exercises/breathing')}
            />
            
            <WellnessCard
              title="Stretching Reminder"
              description="Been sitting for a while? Take a 2-minute stretch break to relieve tension."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>}
              color="bg-emerald-50 text-emerald-700"
              actionText="View Stretches"
              onAction={() => navigate('/exercises/stretching')}
            />
            
            <WellnessCard
              title="Hydration Check"
              description="Staying hydrated improves mood and cognitive function. Had water recently?"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>}
              color="bg-cyan-50 text-cyan-700"
              actionText="Log Water"
              onAction={() => navigate('/tracking/hydration')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessDashboard;