import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchDashboardData } from "../services/dashboardService";
import { ChartBarIcon, HeartIcon, BriefcaseIcon,  } from "@heroicons/react/24/outline";

// Lazy load components for performance
const MoodTracker = lazy(() => import("../features/wellness/components/MoodTracker"));
const SleepTracker = lazy(() => import("../features/wellness/components/SleepTracker"));
const HydrationTracker = lazy(() => import("../features/wellness/components/HydrationTracker"));
const WorkTracker = lazy(() => import("../features/wellness/components/WorkTracker"));
const CalendarWidget = lazy(() => import("../components/CalendarWidget"));

// Skeleton component for suspense fallback
const SkeletonLoader = ({ height = "h-64" }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`bg-gray-100 rounded-2xl p-6 ${height} animate-pulse`}
  >
    <div className="bg-gray-200 h-4 w-1/2 mb-4 rounded" />
    <div className="bg-gray-200 h-4 w-3/4 mb-6 rounded" />
    <div className="bg-gray-200 h-32 w-full rounded" />
  </motion.div>
);

// Wellness Score Component
const WellnessScore = ({ dashboard }) => {
  // Calculate overall wellness score (0-100) based on all metrics
  const calculateScore = () => {
    if (!dashboard) return 0;
    
    let score = 0;
    let factors = 0;
    
    // Add mood score (1-5 scale to 0-20 scale)
    if (dashboard.mood && dashboard.mood.length > 0) {
      const recentMood = dashboard.mood[0];
      // Convert mood string to number value
      const moodMap = { happy: 5, neutral: 4, anxious: 3, sad: 2, angry: 1 };
      const moodValue = moodMap[recentMood.mood] || 3;
      score += moodValue * 4; // Scale to 0-20
      factors++;
    }
    
    // Add sleep score (compare to ideal 7-9 hours)
    if (dashboard.sleep && dashboard.sleep.length > 0) {
      const recentSleep = dashboard.sleep[0];
      // 8 hours is optimal (20 points), less than 6 or more than 10 is poor (5 points)
      const sleepScore = recentSleep.hours >= 7 && recentSleep.hours <= 9 
        ? 20 
        : (recentSleep.hours >= 6 && recentSleep.hours <= 10 ? 15 : 5);
      score += sleepScore;
      factors++;
    }
    
    // Add hydration score (ideal is 2-3L)
    if (dashboard.hydration && dashboard.hydration.length > 0) {
      const recentHydration = dashboard.hydration[0];
      // Convert glasses to liters (1 glass = 0.25L)
      const liters = recentHydration.glasses * 0.25;
      const hydrationScore = liters >= 2 ? 20 : (liters >= 1 ? 15 : 5);
      score += hydrationScore;
      factors++;
    }
    
    // Add work balance score (ideal is 7-8 hours)
    if (dashboard.work && dashboard.work.length > 0) {
      const recentWork = dashboard.work[0];
      // Work balance: 7-8 hours is optimal, >10 or <4 is poor
      const workScore = (recentWork.hours >= 7 && recentWork.hours <= 8) 
        ? 20 
        : (recentWork.hours > 10 || recentWork.hours < 4) ? 5 : 15;
      score += workScore;
      factors++;
    }
    
    // Calculate average and round to nearest whole number
    return Math.round(factors > 0 ? score / factors : 0);
  };
  
  const score = calculateScore();
  
  // Color based on score
  const getScoreColor = () => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };
  
  return (
    <motion.div
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Wellness Score</h2>
      <div className="flex flex-col items-center">
        <div className={`text-5xl font-bold ${getScoreColor()}`}>
          {score}
        </div>
        <div className="text-sm text-gray-500 mt-2">out of 100</div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6">
          <motion.div 
            className={`h-2.5 rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        
        <div className="flex justify-between w-full mt-2 text-xs text-gray-500">
          <span>Needs Attention</span>
          <span>Excellent</span>
        </div>
      </div>
    </motion.div>
  );
};

// Personalized Insights Component
const InsightsPanel = ({ dashboard }) => {
  const getInsight = () => {
    if (!dashboard) return { title: "Loading insights...", description: "" };
    
    // Generate insights based on data patterns
    const insights = [];
    
    // Sleep patterns
    if (dashboard.sleep && dashboard.sleep.length > 1) {
      const avgSleep = dashboard.sleep.reduce((sum, entry) => sum + entry.hours, 0) / dashboard.sleep.length;
      if (avgSleep < 7) {
        insights.push({
          title: "Sleep Focus",
          description: "You're averaging less than 7 hours of sleep. Try going to bed 30 minutes earlier this week.",
          icon: <HeartIcon className="w-6 h-6 text-purple-500" />,
          priority: 3
        });
      }
    }
    
    // Hydration patterns
    if (dashboard.hydration && dashboard.hydration.length > 0) {
      const recentHydration = dashboard.hydration[0].glasses * 0.25; // Convert to liters
      if (recentHydration < 2) {
        insights.push({
          title: "Hydration Alert",
          description: "Your recent water intake is below the recommended 2 liters. Set reminders to drink more water.",
          icon: <DropletIcon className="w-6 h-6 text-blue-500" />,
          priority: 2
        });
      }
    }
    
    // Work-life balance
    if (dashboard.work && dashboard.work.length > 1) {
      const avgWork = dashboard.work.reduce((sum, entry) => sum + entry.hours, 0) / dashboard.work.length;
      if (avgWork > 9) {
        insights.push({
          title: "Work-Life Balance",
          description: "You're working more than 9 hours on average. Consider scheduling more breaks.",
          icon: <BriefcaseIcon className="w-6 h-6 text-amber-500" />,
          priority: 1
        });
      }
    }
    
    // Mood patterns
    if (dashboard.mood && dashboard.mood.length > 1) {
      const moodMap = { happy: 5, neutral: 4, anxious: 3, sad: 2, angry: 1 };
      const recentMoods = dashboard.mood.slice(0, 3);
      const avgMood = recentMoods.reduce((sum, entry) => sum + (moodMap[entry.mood] || 3), 0) / recentMoods.length;
      
      if (avgMood <= 3) {
        insights.push({
          title: "Mood Support",
          description: "Your recent mood entries indicate stress. Try a meditation session in the Mental Health section.",
          icon: <ChartBarIcon className="w-6 h-6 text-red-500" />,
          priority: 4
        });
      }
    }
    
    // Sort by priority and return the highest
    insights.sort((a, b) => b.priority - a.priority);
    
    return insights.length > 0 
      ? insights[0] 
      : { 
          title: "On Track!", 
          description: "Your wellness metrics look good. Keep up the great work!",
          icon: <HeartIcon className="w-6 h-6 text-emerald-500" />,
        };
  };
  
  const insight = getInsight();
  
  return (
    <motion.div
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-100 p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Focus</h2>
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-emerald-100 p-3">
          {insight.icon || <HeartIcon className="w-6 h-6 text-emerald-500" />}
        </div>
        <div>
          <h3 className="font-medium text-lg text-gray-800">{insight.title}</h3>
          <p className="text-gray-600">{insight.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [wellnessData, setWellnessData] = useState({
    mood: [],
    sleep: [],
    hydration: [],
    work: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // For mobile tab navigation
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData(controller.signal);
        setUserName(data.user.fullName);
        setWellnessData(data.wellness);
        setError(null);
      } catch (err) {
        if (err.message === "Unauthorized") {
          navigate("/unauthorized");
        } else if (
          err.response?.status === 419 ||
          err.response?.status === 440
        ) {
          navigate("/timeout");
        } else if (err.response?.status === 401) {
          navigate("/unauthorized");
        } else if (err.message === "canceled") {
          return;
        } else {
          setError(err.message || "Failed to load dashboard data");
        }
      } finally {
        setIsLoading(false);
      }
    };
    getData();
    return () => controller.abort();
  }, [navigate]);

  // Mobile tab navigation options
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "mood", label: "Mood" },
    { id: "sleep", label: "Sleep" },
    { id: "hydration", label: "Hydration" },
    { id: "work", label: "Work" },
  ];

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-screen p-4"
      >
        <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Data
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Good Morning, {userName}!
        </h1>
        <p className="text-xl text-gray-600">
          Here's Your Weekly Wellness Summary
        </p>
      </motion.div>

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

      {/* Overview Section - Always visible on desktop, conditionally on mobile */}
      {(activeTab === "overview" || window.innerWidth >= 768) && (
        <>
          {/* Top Row: Wellness Score and Insights Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <WellnessScore dashboard={wellnessData} />
            <InsightsPanel dashboard={wellnessData} />
          </div>
        </>
      )}

      {/* Detailed Metrics - Shown based on active tab on mobile, always visible on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(activeTab === "overview" || activeTab === "mood" || window.innerWidth >= 768) && (
              <Suspense fallback={<SkeletonLoader />}>
                <MoodTracker data={wellnessData.mood} />
              </Suspense>
            )}
            
            {(activeTab === "overview" || activeTab === "sleep" || window.innerWidth >= 768) && (
              <Suspense fallback={<SkeletonLoader />}>
                <SleepTracker data={wellnessData.sleep} />
              </Suspense>
            )}
            
            {(activeTab === "overview" || activeTab === "hydration" || window.innerWidth >= 768) && (
              <Suspense fallback={<SkeletonLoader />}>
                <HydrationTracker data={wellnessData.hydration} />
              </Suspense>
            )}
            
            {(activeTab === "overview" || activeTab === "work" || window.innerWidth >= 768) && (
              <Suspense fallback={<SkeletonLoader />}>
                <WorkTracker data={wellnessData.work} />
              </Suspense>
            )}
          </div>
        </div>
        
        {(activeTab === "overview" || window.innerWidth >= 768) && (
          <Suspense fallback={<SkeletonLoader />}>
            <CalendarWidget />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Dashboard;