import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChartBarIcon, HeartIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import { dashboardController } from "../../controllers";
import WellnessCard from "../components/WellnessCard";

// Lazy load components for performance
const MoodTracker = lazy(() => import("./MoodTracker"));
const SleepTracker = lazy(() => import("./SleepTracker"));
const HydrationTracker = lazy(() => import("./HydrationTracker"));
const WorkTracker = lazy(() => import("./WorkTracker"));
const CalendarWidget = lazy(() => import("../components/CalenderWidget"));

// Skeleton loader for Suspense fallback
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

// Wellness Score Component
const WellnessScore = ({ score, wellnessData }) => {
  // Color based on score
  const getScoreColor = () => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };
  
  return (
    <WellnessCard 
      title="Wellness Score" 
      tooltip="Your overall wellness score based on sleep, mood, hydration, and work balance."
    >
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
    </WellnessCard>
  );
};

// Personalized Insights Component
const InsightsPanel = ({ wellnessData }) => {
  // Generate insights based on data patterns
  const getInsight = () => {
    if (!wellnessData) return { title: "Loading insights...", description: "" };
    
    const insights = [];
    
    // Sleep patterns
    if (wellnessData.sleep && wellnessData.sleep.length > 1) {
      const avgSleep = wellnessData.getAverageSleep();
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
    if (wellnessData.hydration && wellnessData.hydration.length > 0) {
      const avgHydration = wellnessData.getAverageHydration() * 0.25; // Convert to liters
      if (avgHydration < 2) {
        insights.push({
          title: "Hydration Alert",
          description: "Your recent water intake is below the recommended 2 liters. Set reminders to drink more water.",
          icon: <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.172a2 2 0 00-1.022.547m5.422-2.998a6 6 0 00-3.86-.517l-1.22.243M14 12h2M15 8a7.002 7.002 0 00-5-5M15 16a7.002 7.002 0 01-5 5" />
          </svg>,
          priority: 2
        });
      }
    }
    
    // Work-life balance
    if (wellnessData.work && wellnessData.work.length > 1) {
      const avgWork = wellnessData.getAverageWorkHours();
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
    if (wellnessData.mood && wellnessData.mood.length > 1) {
      const avgMood = wellnessData.getAverageMood();
      
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
    <WellnessCard title="Today's Focus">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-emerald-100 p-3">
          {insight.icon || <HeartIcon className="w-6 h-6 text-emerald-500" />}
        </div>
        <div>
          <h3 className="font-medium text-lg text-gray-800">{insight.title}</h3>
          <p className="text-gray-600">{insight.description}</p>
        </div>
      </div>
    </WellnessCard>
  );
};

/**
 * Main Dashboard View component
 */
const DashboardView = () => {
  const [userName, setUserName] = useState("");
  const [wellnessData, setWellnessData] = useState(null);
  const [wellnessScore, setWellnessScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // For mobile navigation
  const navigate = useNavigate();

  // Fetch dashboard data on component mount
  useEffect(() => {
    // Create abort controller for cleanup
    const controller = new AbortController();
    
    // Fetch dashboard data
    dashboardController.fetchDashboardData(
      controller.signal,
      // Success callback
      (data) => {
        // Process data for UI
        const processedData = dashboardController.processDashboardData(data);
        setUserName(processedData.userName);
        setWellnessData(data.wellness); // Using the model instance
        setWellnessScore(processedData.wellnessScore);
        setError(null);
      },
      // Error callback
      (message, errorType) => {
        if (errorType === 'auth') {
          navigate("/unauthorized");
        } else if (errorType === 'timeout') {
          navigate("/timeout");
        } else {
          setError(message || "Failed to load dashboard data");
        }
      },
      // Finally callback
      () => {
        setIsLoading(false);
      }
    );
    
    // Cleanup on unmount
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

  // Loading state
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

  // Error state
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
            <WellnessScore score={wellnessScore} wellnessData={wellnessData} />
            <InsightsPanel wellnessData={wellnessData} />
          </div>
        </>
      )}

      {/* Detailed Metrics - Shown based on active tab on mobile, always visible on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(activeTab === "overview" || activeTab === "mood" || window.innerWidth >= 768) && (
              <Suspense fallback={<SkeletonLoader />}>
                <MoodTracker data={wellnessData?.mood || []} />
              </Suspense>
            )}
            
            {(activeTab === "overview" || activeTab === "sleep" || window.innerWidth >= 768) && (
              <Suspense fallback={<SkeletonLoader />}>
                <SleepTracker data={wellnessData?.sleep || []} />
              </Suspense>
            )}
            
            {(activeTab === "overview" || activeTab === "hydration" || window.innerWidth >= 768) && (
              <Suspense fallback={<SkeletonLoader />}>
                <HydrationTracker data={wellnessData?.hydration || []} />
              </Suspense>
            )}
            
            {(activeTab === "overview" || activeTab === "work" || window.innerWidth >= 768) && (
              <Suspense fallback={<SkeletonLoader />}>
                <WorkTracker data={wellnessData?.work || []} />
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

export default DashboardView;