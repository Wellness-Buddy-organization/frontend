import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import CalendarWidget from '../components/CalendarWidget';
import MoodTracker from '../components/MoodTracker';
import SleepTracker from '../components/SleepTracker';
import HydrationTracker from '../components/HydrationTracker';
import WorkTracker from '../components/WorkTracker';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [wellnessData, setWellnessData] = useState({
    mood: [],
    sleep: [],
    hydration: [],
    work: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:5000/api/dashboard/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserName(response.data.user.fullName);
        setWellnessData(response.data.wellness);
        console.log(response.data.wellness);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        type: 'spring', 
        stiffness: 300, 
        damping: 24,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 border-4 border-emerald-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 border-4 border-emerald-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800">Good Morning {userName}!</h1>
            <p className="text-xl text-gray-600">Here's Your Weekly Wellness Summary</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <MoodTracker data={wellnessData.mood} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <SleepTracker data={wellnessData.sleep} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <HydrationTracker data={wellnessData.hydration} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <WorkTracker data={wellnessData.work} />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CalendarWidget />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;