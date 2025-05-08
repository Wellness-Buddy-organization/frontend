// Upcoming Reminders Component
const UpcomingRemindersComponent = ({ reminders }) => {
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case "water":
        return <span className="text-lg">💧</span>;
      case "posture":
        return <span className="text-lg">🪑</span>;
      case "stretch":
        return <span className="text-lg">🧘</span>;
      case "eye_rest":
        return <span className="text-lg">👀</span>;
      case "meal":
        return <span className="text-lg">🍽️</span>;
      case "meditation":
        return <span className="text-lg">🧠</span>;
      default:
        return <BellIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCardColor = (type) => {
    switch (type) {
      case "water":
        return "border-blue-200 bg-blue-50";
      case "posture":
        return "border-teal-200 bg-teal-50";
      case "stretch":
        return "border-green-200 bg-green-50";
      case "eye_rest":
        return "border-purple-200 bg-purple-50";
      case "meal":
        return "border-amber-200 bg-amber-50";
      case "meditation":
        return "border-indigo-200 bg-indigo-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  // No reminders scenario
  if (!reminders || reminders.length === 0) {
    return (
      <CardWrapper
        title="Upcoming Reminders"
        icon={<BellIcon className="w-5 h-5 text-blue-500" />}
        badge="0 Today"
        badgeColor="bg-gray-100 text-gray-600"
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-300">---</p>
            <p className="text-gray-500 mt-2">No reminders scheduled</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              onClick={() => navigate("/dashboard/reminders")}
            >
              Add Reminders
            </button>
          </div>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      title="Upcoming Reminders"
      icon={<BellIcon className="w-5 h-5 text-blue-500" />}
      badge={`${reminders.length} Today`}
      badgeColor="bg-blue-100 text-blue-700"
      action={
        <button
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => navigate("/dashboard/reminders")}
        >
          View All
        </button>
      }
    >
      <div className="space-y-3">
        {reminders.map((reminder, index) => (
          <motion.div
            key={reminder.id}
            className={`flex items-center p-3 rounded-lg border ${getCardColor(
              reminder.type
            )}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
              {getIcon(reminder.type)}
            </div>
            <div className="flex-1">
              <p className="font-medium">{reminder.message}</p>
              <p className="text-sm text-gray-500">{reminder.time}</p>
            </div>
          </motion.div>
        ))}

        <motion.button
          onClick={() => navigate("/dashboard/reminders")}
          className="w-full mt-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Manage Reminders
        </motion.button>
      </div>
    </CardWrapper>
  );
};

/**
 * Main Dashboard View component
 */
const DashboardView = () => {
  const [userName, setUserName] = useState("");
  const [wellnessData, setWellnessData] = useState(null);
  const [wellnessScore, setWellnessScore] = useState(0);
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    // Create abort controller for cleanup
    const controller = new AbortController();

    // Set loading state
    setIsLoading(true);

    // Fetch dashboard data
    dashboardController.fetchDashboardData(
      controller.signal,
      // Success callback
      (data) => {
        // Update state with fetched data
        setUserName(data.user.fullName);
        setWellnessData(data.wellness);
        setWellnessScore(data.wellness.score);
        setReminders(data.reminders || []);
        setError(null);
      },
      // Error callback
      (message, errorType) => {
        if (errorType === "auth") {
          navigate("/login");
        } else if (errorType === "timeout") {
          navigate("/timeout");
        } else {
          setError(message || "Failed to load dashboard data");
          setNotification({
            message:
              message || "Failed to load dashboard data. Please try again.",
            type: "error",
          });
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
    { id: "overview", label: "Overview", icon: ChartBarIcon },
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
    { id: "wellness", label: "Wellness", icon: HeartIcon },
    { id: "activity", label: "Activity", icon: BriefcaseIcon },
    { id: "settings", label: "Settings", icon: CogIcon },
  ];

  // Clear notification
  const clearNotification = () => {
    setNotification({ message: "", type: "" });
  };

  // Loading state with skeleton screens
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-48"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-4 animate-pulse border border-gray-100"
            >
              <div className="flex justify-between">
                <div className="w-full">
                  <div className="h-4 bg-gray-200 rounded-md w-24 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded-md w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonLoader />
              <SkeletonLoader />
            </div>
            <SkeletonLoader height="h-80" />
          </div>
          <div className="space-y-6">
            <SkeletonLoader />
            <SkeletonLoader height="h-96" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !notification.message) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-red-100">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-4 rounded-full mb-6">
              <XMarkIcon className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Failed to Load Dashboard
            </h2>
            <p className="text-gray-600 mb-6">
              {error ||
                "We're having trouble fetching your wellness data. Please try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Notification */}
      <AnimatePresence>
        {notification.message && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={clearNotification}
          />
        )}
      </AnimatePresence>

      {/* Welcome Header with Time-based Greeting */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {(() => {
                const hour = new Date().getHours();
                if (hour < 12) return "Good Morning";
                if (hour < 18) return "Good Afternoon";
                return "Good Evening";
              })()}
              , {userName}!
            </h1>
            <p className="text-gray-600">
              Here's your wellness overview for today
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => navigate("/dashboard/tracking")}
              className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors px-4 py-2 rounded-lg flex items-center text-sm font-medium shadow-sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Daily Check-in
            </button>
            <button
              onClick={() => navigate("/dashboard/reminders")}
              className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors px-4 py-2 rounded-lg flex items-center text-sm font-medium shadow-sm"
            >
              <BellIcon className="w-4 h-4 mr-1" />
              Reminders
            </button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="mb-6">
        <QuickStats data={wellnessData || {}} />
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden mb-6 bg-white rounded-full shadow-sm p-1.5 flex justify-between border border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-full ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-xs mt-0.5">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content - Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* First row - Wellness Score and Insights */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {(activeTab === "overview" ||
            activeTab === "wellness" ||
            window.innerWidth >= 768) && (
            <WellnessScore score={wellnessScore} wellnessData={wellnessData} />
          )}

          {(activeTab === "overview" ||
            activeTab === "wellness" ||
            window.innerWidth >= 768) && (
            <InsightsPanel wellnessData={wellnessData} />
          )}
        </div>

        {/* Right column - Reminders Only */}
        <div>
          {/* Reminders */}
          <UpcomingRemindersComponent reminders={reminders} />
        </div>
      </div>

      {/* Full-width Calendar Section */}
      {(activeTab === "overview" ||
        activeTab === "calendar" ||
        window.innerWidth >= 768) && (
        <div className="mb-8">
          <Suspense fallback={<SkeletonLoader height="h-96" />}>
            <EnhancedCalendar />
          </Suspense>
        </div>
      )}

      {/* Trackers Section - Separated from main content */}
      {(activeTab === "overview" ||
        activeTab === "wellness" ||
        activeTab === "activity" ||
        window.innerWidth >= 768) && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-2 text-indigo-500" />
            Wellness Trackers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Suspense fallback={<SkeletonLoader />}>
              <MoodTracker data={wellnessData?.mood || []} />
            </Suspense>

            <Suspense fallback={<SkeletonLoader />}>
              <SleepTracker data={wellnessData?.sleep || []} />
            </Suspense>

            <Suspense fallback={<SkeletonLoader />}>
              <HydrationTracker data={wellnessData?.hydration || []} />
            </Suspense>

            <Suspense fallback={<SkeletonLoader />}>
              <WorkTracker data={wellnessData?.work || []} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

import { useState, useEffect, lazy, Suspense, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  HeartIcon,
  BriefcaseIcon,
  CogIcon,
  ArrowPathIcon,
  CalendarIcon,
  FireIcon,
  BellIcon,
  PlusIcon,
  XMarkIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { dashboardController } from "../../controllers";

// Lazy load components for performance
const MoodTracker = lazy(() => import("./MoodTracker"));
const SleepTracker = lazy(() => import("./SleepTracker"));
const HydrationTracker = lazy(() => import("./HydrationTracker"));
const WorkTracker = lazy(() => import("./WorkTracker"));

// Skeleton loader for Suspense fallback
const SkeletonLoader = ({ height = "h-64" }) => (
  <div
    className={`bg-white rounded-xl p-6 ${height} animate-pulse border border-gray-100 shadow-sm`}
  >
    <div className="bg-gray-200 h-4 w-1/2 mb-4 rounded" />
    <div className="bg-gray-200 h-4 w-3/4 mb-6 rounded" />
    <div className="bg-gray-200 h-32 w-full rounded" />
  </div>
);

// Notification component for feedback
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor =
    type === "success"
      ? "bg-green-50 text-green-800 border-green-200"
      : type === "error"
      ? "bg-red-50 text-red-800 border-red-200"
      : "bg-blue-50 text-blue-800 border-blue-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-5 right-5 z-50 flex items-center p-4 text-sm rounded-lg ${bgColor} border shadow-md max-w-md`}
      role="alert"
    >
      <span className="font-medium mr-2">
        {type === "success" ? "Success!" : type === "error" ? "Error!" : "Info"}
      </span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 p-1 hover:bg-white/50 rounded-full"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Card Wrapper Component
const CardWrapper = ({
  title,
  icon,
  children,
  action,
  badge,
  badgeColor = "bg-blue-100 text-blue-800",
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
      whileHover={{ y: -5, boxShadow: "0 12px 20px -10px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h2>
        <div className="flex items-center space-x-2">
          {badge && (
            <div className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
              {badge}
            </div>
          )}
          {action}
        </div>
      </div>
      {children}
    </motion.div>
  );
};

// Quick Stats Component
const QuickStats = ({ data }) => {
  const stats = [
    {
      id: "wellness",
      name: "Wellness Score",
      value: data.wellnessScore || "---",
      suffix: data.wellnessScore ? "/100" : "",
      icon: <HeartIcon className="w-5 h-5 text-rose-600" />,
      color: "bg-rose-50",
    },
    {
      id: "sleep",
      name: "Avg Sleep",
      value:
        data.sleep && data.sleep.length > 0
          ? (
              data.sleep.reduce((acc, entry) => acc + entry.hours, 0) /
              data.sleep.length
            ).toFixed(1)
          : "---",
      suffix: data.sleep && data.sleep.length > 0 ? "hrs" : "",
      icon: <MoonIcon className="w-5 h-5 text-indigo-600" />,
      color: "bg-indigo-50",
    },
    {
      id: "mood",
      name: "Mood",
      value:
        data.mood?.length > 0
          ? ["😠", "😔", "😰", "😐", "😊"][
              Math.round(data.getAverageMood ? data.getAverageMood() : 3) - 1
            ] || "😐"
          : "---",
      suffix: "",
      icon: <SunIcon className="w-5 h-5 text-amber-600" />,
      color: "bg-amber-50",
    },
    {
      id: "activity",
      name: "Hydration",
      value:
        data.hydration?.length > 0
          ? (data.getAverageHydration ? data.getAverageHydration() : 0).toFixed(
              1
            )
          : "---",
      suffix: data.hydration?.length > 0 ? "L" : "",
      icon: <FireIcon className="w-5 h-5 text-emerald-600" />,
      color: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <motion.div
          key={stat.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{
            y: -4,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div>
            <div className="text-sm text-gray-500 mb-1">{stat.name}</div>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="ml-1 text-sm text-gray-500">{stat.suffix}</div>
            </div>
          </div>
          <div className={`rounded-full ${stat.color} p-3`}>{stat.icon}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Personalized Insights Component
const InsightsPanel = ({ wellnessData }) => {
  // No data scenario
  if (
    !wellnessData ||
    (!wellnessData.sleep?.length &&
      !wellnessData.mood?.length &&
      !wellnessData.hydration?.length &&
      !wellnessData.work?.length)
  ) {
    return (
      <CardWrapper
        title="Today's Focus"
        icon={<FireIcon className="w-5 h-5 text-amber-500" />}
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-300">---</p>
            <p className="text-gray-500 mt-2">No data to generate insights</p>
          </div>
        </div>
      </CardWrapper>
    );
  }

  // Generate insights based on data patterns
  const getInsight = () => {
    const insights = [];

    // Sleep patterns
    if (wellnessData.sleep && wellnessData.sleep.length > 1) {
      const avgSleep = wellnessData.getAverageSleep();
      if (avgSleep < 7) {
        insights.push({
          title: "Sleep Focus",
          description:
            "You're averaging less than 7 hours of sleep. Try going to bed 30 minutes earlier this week.",
          icon: <HeartIcon className="w-6 h-6 text-purple-500" />,
          priority: 3,
          action: "View Sleep Tips",
          actionPath: "/dashboard/mental-health",
          color: "bg-purple-50 border-purple-200",
        });
      }
    }

    // Hydration patterns
    if (wellnessData.hydration && wellnessData.hydration.length > 0) {
      const avgHydration = wellnessData.getAverageHydration() * 0.25; // Convert to liters
      if (avgHydration < 2) {
        insights.push({
          title: "Hydration Alert",
          description:
            "Your recent water intake is below the recommended 2 liters. Set reminders to drink more water.",
          icon: (
            <svg
              className="w-6 h-6 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.172a2 2 0 00-1.022.547m5.422-2.998a6 6 0 00-3.86-.517l-1.22.243M14 12h2M15 8a7.002 7.002 0 00-5-5M15 16a7.002 7.002 0 01-5 5"
              />
            </svg>
          ),
          priority: 2,
          action: "Add Reminder",
          actionPath: "/dashboard/reminders",
          color: "bg-blue-50 border-blue-200",
        });
      }
    }

    // Work-life balance
    if (wellnessData.work && wellnessData.work.length > 1) {
      const avgWork = wellnessData.getAverageWorkHours();
      if (avgWork > 9) {
        insights.push({
          title: "Work-Life Balance",
          description:
            "You're working more than 9 hours on average. Consider scheduling more breaks.",
          icon: <BriefcaseIcon className="w-6 h-6 text-amber-500" />,
          priority: 1,
          action: "View Balance",
          actionPath: "/dashboard/work-life",
          color: "bg-amber-50 border-amber-200",
        });
      }
    }

    // Mood patterns
    if (wellnessData.mood && wellnessData.mood.length > 1) {
      const avgMood = wellnessData.getAverageMood();

      if (avgMood <= 3) {
        insights.push({
          title: "Mood Support",
          description:
            "Your recent mood entries indicate stress. Try a meditation session in the Mental Health section.",
          icon: <ChartBarIcon className="w-6 h-6 text-red-500" />,
          priority: 4,
          action: "Try Meditation",
          actionPath: "/dashboard/mental-health",
          color: "bg-red-50 border-red-200",
        });
      }
    }

    // Sort by priority and return the highest
    insights.sort((a, b) => b.priority - a.priority);

    return insights.length > 0
      ? insights[0]
      : {
          title: "On Track!",
          description:
            "Your wellness metrics look good. Keep up the great work!",
          icon: <HeartIcon className="w-6 h-6 text-emerald-500" />,
          action: "View Details",
          actionPath: "/dashboard/tracking",
          color: "bg-emerald-50 border-emerald-200",
        };
  };

  const insight = getInsight();
  const navigate = useNavigate();

  return (
    <CardWrapper
      title="Today's Focus"
      icon={<FireIcon className="w-5 h-5 text-amber-500" />}
    >
      <div className={`p-4 rounded-lg ${insight.color} flex items-start gap-4`}>
        <div className="rounded-full bg-white p-3 shadow-sm">
          {insight.icon || <HeartIcon className="w-6 h-6 text-emerald-500" />}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg text-gray-800">{insight.title}</h3>
          <p className="text-gray-600 mb-4">{insight.description}</p>
          {insight.action && (
            <motion.button
              onClick={() => navigate(insight.actionPath)}
              className="text-sm font-medium bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {insight.action} →
            </motion.button>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};

// Wellness Score Component
const WellnessScore = ({ score, wellnessData }) => {
  // No data scenario
  if (!score || score === 0) {
    return (
      <CardWrapper
        title="Wellness Score"
        badge="Daily"
        badgeColor="bg-gray-100 text-gray-600"
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-300">---</p>
            <p className="text-gray-500 mt-2">No wellness data available</p>
            <button
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              onClick={() => (window.location.href = "/dashboard/tracking")}
            >
              Complete Daily Check-in
            </button>
          </div>
        </div>
      </CardWrapper>
    );
  }

  // Color based on score
  const getScoreColor = () => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = () => {
    if (score >= 80) return "bg-emerald-100";
    if (score >= 60) return "bg-blue-100";
    if (score >= 40) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getMessage = () => {
    if (score >= 80) return "Excellent wellness!";
    if (score >= 60) return "Good wellness level";
    if (score >= 40) return "Room for improvement";
    return "Needs attention";
  };

  const navigate = useNavigate();

  return (
    <CardWrapper
      title="Wellness Score"
      badge="Daily"
      badgeColor="bg-gray-100 text-gray-600"
    >
      <div className="flex items-center">
        <div
          className={`relative w-28 h-28 mr-5 ${getScoreBgColor()} rounded-full flex items-center justify-center`}
        >
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-white opacity-50"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <motion.circle
                className={
                  score >= 80
                    ? "text-emerald-500"
                    : score >= 60
                    ? "text-blue-500"
                    : score >= 40
                    ? "text-yellow-500"
                    : "text-red-500"
                }
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * score) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (264 * score) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
          </div>
          <div className="z-10 flex flex-col items-center">
            <span className={`text-3xl font-bold ${getScoreColor()}`}>
              {score}
            </span>
            <span className="text-xs text-gray-600">out of 100</span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className={`text-xl font-semibold ${getScoreColor()}`}>
            {getMessage()}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {score >= 80
              ? "You're taking great care of your wellbeing!"
              : score >= 60
              ? "You're maintaining a healthy balance."
              : score >= 40
              ? "Focus on improving your sleep and stress levels."
              : "Your wellness needs immediate attention."}
          </p>

          <button
            onClick={() => navigate("/dashboard/tracking")}
            className={`text-sm px-4 py-2 rounded-lg text-white ${
              score >= 60
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-blue-500 hover:bg-blue-600"
            } transition-colors`}
          >
            View Details
          </button>
        </div>
      </div>
    </CardWrapper>
  );
};

import { calendarController } from "../../controllers";
import { createPortal } from "react-dom";

// Calendar with Full CRUD Functionality
const EnhancedCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    startOfWeek.setDate(diff);

    return {
      start: startOfWeek.getDate(),
      end: new Date(startOfWeek.setDate(startOfWeek.getDate() + 6)).getDate(),
      month: today.toLocaleString("default", { month: "long" }),
      year: today.getFullYear(),
      date: new Date(today.setDate(diff)), // Store the actual date object
    };
  });

  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Event Modal States
  const [showEventModal, setShowEventModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add', 'edit', 'view', 'delete'
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    endTime: "",
    category: "personal",
    description: "",
  });

  // Create a reusable Modal component using createPortal
  const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;
    
    return createPortal(
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
        onClick={onClose}
      >
        {children}
      </div>,
      document.body
    );
  };

  // Fetch events for the current week
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const weekEvents = await calendarController.fetchWeekEvents(
          currentWeek.date
        );
        setEvents(weekEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load calendar events. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentWeek.date]);

  // Generate days of the current week
  const getDaysOfWeek = () => {
    const monday = new Date(currentWeek.date);

    return Array(7)
      .fill()
      .map((_, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        return {
          day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
          date: date.getDate(),
          full: date,
          isToday: new Date().toDateString() === date.toDateString(),
        };
      });
  };

  const days = getDaysOfWeek();

  // Navigate to previous week
  const handlePrevWeek = () => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev.date);
      newDate.setDate(newDate.getDate() - 7);

      return {
        start: newDate.getDate(),
        end: new Date(
          new Date(newDate).setDate(newDate.getDate() + 6)
        ).getDate(),
        month: newDate.toLocaleString("default", { month: "long" }),
        year: newDate.getFullYear(),
        date: newDate,
      };
    });
  };

  // Navigate to next week
  const handleNextWeek = () => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev.date);
      newDate.setDate(newDate.getDate() + 7);

      return {
        start: newDate.getDate(),
        end: new Date(
          new Date(newDate).setDate(newDate.getDate() + 6)
        ).getDate(),
        month: newDate.toLocaleString("default", { month: "long" }),
        year: newDate.getFullYear(),
        date: newDate,
      };
    });
  };

  // Close modal and reset state
  const closeModal = () => {
    setShowEventModal(false);
    setCurrentEvent(null);
  };

  // Get events for the selected day
  const getDayEvents = () => {
    // Create date object for the selected day
    const selectedDate =
      days.find((d) => d.date === selectedDay)?.full || new Date();

    // Filter events for the selected day
    return events
      .filter((event) => {
        const eventDate = new Date(event.startDate);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      })
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  };

  // Get background color for event category
  const getCategoryColor = (category) => {
    return calendarController.getCategoryColor(category);
  };

  // Open modal to add new event
  const openAddEventModal = () => {
    // Get selected date
    const selectedDate =
      days.find((d) => d.date === selectedDay)?.full || new Date();

    // Set default values
    setEventForm({
      title: "",
      date: calendarController.formatDateForInput(selectedDate),
      time: "09:00",
      endTime: "10:00",
      category: "personal",
      description: "",
    });

    setModalMode("add");
    setShowEventModal(true);
  };

  // Open event details modal
  const openEventDetailsModal = (event) => {
    setCurrentEvent(event);

    // Set form data in case user wants to edit
    setEventForm({
      title: event.title,
      date: calendarController.formatDateForInput(new Date(event.startDate)),
      time: calendarController.formatTimeForInput(new Date(event.startDate)),
      endTime: calendarController.formatTimeForInput(new Date(event.endDate)),
      category: event.category,
      description: event.description || "",
    });

    setModalMode("view");
    setShowEventModal(true);
  };

  // Open edit event modal
  const switchToEditMode = () => {
    setModalMode("edit");
  };

  // Open delete confirmation
  const switchToDeleteMode = () => {
    setModalMode("delete");
  };

  // Handle form changes
  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Create date objects from form data
      const eventDate = new Date(eventForm.date);
      const [hours, minutes] = eventForm.time.split(":").map(Number);
      const [endHours, endMinutes] = eventForm.endTime.split(":").map(Number);

      eventDate.setHours(hours, minutes);
      const eventEndDate = new Date(eventDate);
      eventEndDate.setHours(endHours, endMinutes);

      // Create event data object
      const eventData = {
        title: eventForm.title,
        startDate: eventDate,
        endDate: eventEndDate,
        category: eventForm.category,
        description: eventForm.description,
      };

      if (modalMode === "add") {
        // Add new event via API
        const newEvent = await calendarController.createEvent(eventData);
        setEvents((prevEvents) => [...prevEvents, newEvent]);
      } else if (modalMode === "edit" && currentEvent) {
        // Update existing event via API
        const updatedEvent = await calendarController.updateEvent(
          currentEvent.id,
          eventData
        );
        setEvents((prevEvents) =>
          prevEvents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        );
      }

      // Close modal
      closeModal();
    } catch (error) {
      console.error("Error saving event:", error);
      // Show error message (could be improved with a notification)
      alert("Failed to save event. Please try again.");
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async () => {
    if (currentEvent) {
      try {
        await calendarController.deleteEvent(currentEvent.id);
        setEvents((prevEvents) =>
          prevEvents.filter((e) => e.id !== currentEvent.id)
        );
        closeModal();
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  // Get number of events for a day
  const getEventCountForDay = (day) => {
    const dayDate = day.full;
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === dayDate.getDate() &&
        eventDate.getMonth() === dayDate.getMonth() &&
        eventDate.getFullYear() === dayDate.getFullYear()
      );
    }).length;
  };

  // Get today's events
  const todayEvents = getDayEvents();

  return (
    <CardWrapper
      title="Calendar"
      icon={<CalendarIcon className="w-5 h-5 text-indigo-500" />}
      action={
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={handlePrevWeek}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Previous week"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <span className="text-gray-600 whitespace-nowrap">
            {currentWeek.month} {currentWeek.start} - {currentWeek.end}
          </span>

          <button
            onClick={handleNextWeek}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Next week"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      }
    >
      {isLoading ? (
        // Loading state
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-1 animate-pulse">
            {Array(7)
              .fill()
              .map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
          </div>
          <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      ) : error ? (
        // Error state
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={() =>
              calendarController
                .fetchWeekEvents(currentWeek.date)
                .then((data) => setEvents(data))
            }
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Days of week navigation */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {days.map((day) => (
              <motion.button
                key={day.day}
                className={`relative py-4 rounded-lg flex flex-col items-center justify-center ${
                  day.isToday
                    ? "bg-indigo-50 border border-indigo-200"
                    : selectedDay === day.date
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedDay(day.date)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className={`text-xs font-medium mb-1 ${
                    day.isToday ? "text-indigo-700" : "text-gray-500"
                  }`}
                >
                  {day.day}
                </span>
                <span
                  className={`text-lg ${
                    day.isToday
                      ? "font-bold text-indigo-700"
                      : "font-medium text-gray-700"
                  }`}
                >
                  {day.date}
                </span>
                {/* Event indicator dots - Enhanced */}
                <div className="flex flex-col items-center mt-2">
                  {(() => {
                    const count = getEventCountForDay(day);
                    if (count === 0)
                      return (
                        <div className="text-xs text-gray-400 mt-1">
                          No events
                        </div>
                      );

                    if (count <= 3) {
                      // Get the actual events for this day
                      const dayEvents = events
                        .filter((event) => {
                          const eventDate = new Date(event.startDate);
                          return (
                            eventDate.getDate() === day.full.getDate() &&
                            eventDate.getMonth() === day.full.getMonth() &&
                            eventDate.getFullYear() === day.full.getFullYear()
                          );
                        })
                        .slice(0, 3); // Only show up to 3

                      return (
                        <div className="flex flex-col w-full px-1 mt-1">
                          {dayEvents.map((event, i) => (
                            <div
                              key={i}
                              className={`text-xs truncate w-full text-center rounded-full px-2 py-0.5 my-0.5 ${getCategoryColor(
                                event.category
                              )}`}
                            >
                              {event.title.length > 10
                                ? `${event.title.substring(0, 8)}...`
                                : event.title}
                            </div>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <div className="text-xs bg-indigo-500 text-white rounded-full px-2 py-1 mt-1">
                        {count} events
                      </div>
                    );
                  })()}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Events for selected day */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">
                Events for{" "}
                {days.find((d) => d.date === selectedDay)?.day || "Today"},{" "}
                {selectedDay}
              </h3>
              <button
                onClick={openAddEventModal}
                className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-200 transition-colors flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Event
              </button>
            </div>

            {todayEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {todayEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className="p-3 border rounded-lg flex items-center cursor-pointer hover:border-indigo-300 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openEventDetailsModal(event)}
                  >
                    <div
                      className={`rounded-full w-2 h-16 ${
                        getCategoryColor(event.category).split(" ")[0]
                      } mr-3`}
                    ></div>
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {calendarController.formatDisplayTime(event.startDate)}{" "}
                        - {calendarController.formatDisplayTime(event.endDate)}
                      </p>
                      {event.description && (
                        <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                          {event.description.length > 60
                            ? `${event.description.substring(0, 57)}...`
                            : event.description}
                        </p>
                      )}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                        event.category
                      )}`}
                    >
                      {event.category}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <p className="mb-2">No events scheduled for this day</p>
                <button
                  onClick={openAddEventModal}
                  className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium inline-flex items-center"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add an event
                </button>
              </div>
            )}
          </div>

          {/* Event Modal - Using Portal */}
          <Modal isOpen={showEventModal} onClose={closeModal}>
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-lg font-semibold">
                  {modalMode === "add"
                    ? "Add New Event"
                    : modalMode === "edit"
                    ? "Edit Event"
                    : modalMode === "delete"
                    ? "Delete Event"
                    : "Event Details"}
                </h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeModal();
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4">
                {modalMode === "delete" ? (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Are you sure you want to delete this event?
                    </p>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{currentEvent?.title}</p>
                      <p className="text-sm text-gray-500">
                        {calendarController.formatDisplayTime(
                          currentEvent?.startDate
                        )}{" "}
                        -{" "}
                        {calendarController.formatDisplayTime(
                          currentEvent?.endDate
                        )}
                      </p>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalMode("view");
                        }}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent();
                        }}
                        className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : modalMode === "view" ? (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div
                        className={`rounded-full w-2 h-10 ${
                          getCategoryColor(
                            currentEvent?.category || "personal"
                          ).split(" ")[0]
                        } mr-3`}
                      ></div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {currentEvent?.title}
                        </h3>
                        <p className="text-gray-500 flex items-center mt-1">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {calendarController.formatDisplayTime(
                            currentEvent?.startDate
                          )}{" "}
                          -{" "}
                          {calendarController.formatDisplayTime(
                            currentEvent?.endDate
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <div
                        className={`inline-block px-2 py-1 rounded-full text-xs ${getCategoryColor(
                          currentEvent?.category || "personal"
                        )}`}
                      >
                        {currentEvent?.category || "personal"}
                      </div>
                    </div>

                    {currentEvent?.description && (
                      <div className="mt-3 border-t pt-3">
                        <p className="text-sm text-gray-700">
                          {currentEvent.description}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          switchToDeleteMode();
                        }}
                        className="px-3 py-1.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          switchToEditMode();
                        }}
                        className="px-3 py-1.5 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.stopPropagation();
                      handleEventFormSubmit(e);
                    }}
                    className="space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={eventForm.title}
                        onChange={handleEventFormChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter event title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={eventForm.date}
                        onChange={handleEventFormChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          name="time"
                          value={eventForm.time}
                          onChange={handleEventFormChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          name="endTime"
                          value={eventForm.endTime}
                          onChange={handleEventFormChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={eventForm.category}
                        onChange={handleEventFormChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="wellness">Wellness</option>
                        <option value="health">Health</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description (optional)
                      </label>
                      <textarea
                        name="description"
                        value={eventForm.description}
                        onChange={handleEventFormChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Add description or notes"
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (modalMode === "edit") {
                            setModalMode("view");
                          } else {
                            closeModal();
                          }
                        }}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
                      >
                        {modalMode === "add" ? "Add Event" : "Save Changes"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </Modal>
        </>
      )}
    </CardWrapper>
  );
};

export default DashboardView;
