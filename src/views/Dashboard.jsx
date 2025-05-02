import { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchDashboardData } from "../services/dashboardService";

// Lazy load widgets for performance
const CalendarWidget = lazy(() => import("../components/CalendarWidget"));
const MoodTracker = lazy(() => import("../features/wellness/components/MoodTracker"));
const SleepTracker = lazy(() => import("../features/wellness/components/SleepTracker"));
const HydrationTracker = lazy(() => import("../features/wellness/components/HydrationTracker"));
const WorkTracker = lazy(() => import("../features/wellness/components/WorkTracker"));

// Skeleton loader for suspense fallback
const SkeletonLoader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-gray-100 rounded-2xl p-6 h-64 animate-pulse"
  >
    <div className="bg-gray-200 h-4 w-1/2 mb-4 rounded" />
    <div className="bg-gray-200 h-4 w-3/4 mb-6 rounded" />
    <div className="bg-gray-200 h-32 w-full rounded" />
  </motion.div>
);

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
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        const data = await fetchDashboardData(controller.signal);
        setUserName(data.user.fullName);
        setWellnessData(data.wellness);
        setIsLoading(false);
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
          setIsLoading(false);
        }
      }
    };
    getData();
    return () => controller.abort();
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 border-4 border-emerald-400 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 border-4 border-emerald-600 rounded-full animate-pulse"></div>
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto p-4"
    >
      <motion.div
        variants={itemVariants}
        className="mb-8 text-center md:text-left"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Good Morning {userName}!
        </h1>
        <p className="text-xl text-gray-600">
          Here's Your Weekly Wellness Summary
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense fallback={<SkeletonLoader />}>
              <motion.div variants={itemVariants}>
                <MoodTracker data={wellnessData.mood} />
              </motion.div>
            </Suspense>
            <Suspense fallback={<SkeletonLoader />}>
              <motion.div variants={itemVariants}>
                <SleepTracker data={wellnessData.sleep} />
              </motion.div>
            </Suspense>
            <Suspense fallback={<SkeletonLoader />}>
              <motion.div variants={itemVariants}>
                <HydrationTracker data={wellnessData.hydration} />
              </motion.div>
            </Suspense>
            <Suspense fallback={<SkeletonLoader />}>
              <motion.div variants={itemVariants}>
                <WorkTracker data={wellnessData.work} />
              </motion.div>
            </Suspense>
          </div>
        </motion.div>
        <Suspense fallback={<SkeletonLoader />}>
          <motion.div variants={itemVariants}>
            <CalendarWidget />
          </motion.div>
        </Suspense>
      </div>
    </motion.div>
  );
};

export default Dashboard;
