import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const WorkTracker = ({ data }) => {
  const [showInfo, setShowInfo] = useState(false);
  
  // Define the days of the week (Mon-Sun)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Process the backend data into a 7-day array
  const workData = useMemo(() => {
    console.log("Original data:", data);
    
    // Get the current date (April 28, 2025)
    const today = new Date();
    
    // Calculate the start date (7 days ago)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6); // Get 6 days before today to make a 7-day window
    startDate.setHours(0, 0, 0, 0);
    
    console.log("Start date for 7-day window:", startDate);
    
    // Initialize the 7-day array with dates and 0 hours
    const weeklyData = Array(7).fill(null).map((_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      
      // Get the day name (Mon, Tue, etc.)
      const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayName = daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1]; // Adjust for our Mon-Sun array
      
      return { 
        day: dayName, 
        hours: 0, 
        date: date,
        formattedDate: date.toISOString().split('T')[0] // For debugging
      };
    });
    
    // Map backend data to the correct day
    if (data && data.length > 0) {
      data.forEach((entry) => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0); // Normalize time part
        
        // Find matching day in our weekly data
        for (let i = 0; i < weeklyData.length; i++) {
          const dayData = weeklyData[i];
          if (dayData.date.getTime() === entryDate.getTime()) {
            weeklyData[i].hours = entry.hours;
            weeklyData[i].entryId = entry._id; // Store ID for reference
            break;
          }
        }
      });
    }
    
    console.log("Processed weekly data:", weeklyData);
    return weeklyData;
  }, [data]);

  // Calculate the average daily work hours for the tooltip
  const averageHours = useMemo(() => {
    const totalHours = workData.reduce((sum, entry) => sum + entry.hours, 0);
    const daysWithWork = workData.filter((entry) => entry.hours > 0).length || 1; // Avoid division by 0
    return (totalHours / daysWithWork).toFixed(1);
  }, [workData]);

  const maxHours = 10; // For scaling the chart

  return (
    <motion.div 
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-lg p-6 h-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Work Hours</h2>
        <button 
          className="text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setShowInfo(!showInfo)}
        >
          <InformationCircleIcon className="w-5 h-5" />
        </button>
      </div>
      
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            className="absolute right-6 top-14 bg-white p-3 rounded-lg shadow-lg z-10 text-sm max-w-xs border border-gray-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <p>
              You worked an average of {averageHours} hours daily this week.{' '}
              {averageHours > 8 ? 'Consider reducing hours for better balance.' : 'Balance seems good!'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!data || data.length === 0 ? (
        <p className="text-gray-600 text-center">No work data for this week.</p>
      ) : (
        <>
          <div className="relative h-40">
            <div className="absolute inset-0 bg-navy-800 rounded-xl overflow-hidden">
              <div className="p-3 pt-6 h-full">
                <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                  {/* Y-axis lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#3b4861" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="300" y2="40" stroke="#3b4861" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="#3b4861" strokeWidth="0.5" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="#3b4861" strokeWidth="0.5" />
                  
                  {/* Work hours bars */}
                  {workData.map((data, index) => (
                    <motion.rect
                      key={index}
                      x={(300 / 7) * index + (300 / 7) * 0.2}
                      y={100 - (data.hours / maxHours) * 100}
                      width={(300 / 7) * 0.6}
                      height={(data.hours / maxHours) * 100}
                      rx="4"
                      fill="url(#workGradient)"
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.7 }}
                      style={{ transformOrigin: 'bottom' }}
                    />
                  ))}
                  
                  <defs>
                    <linearGradient id="workGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-7 gap-2">
            {workData.map((data, index) => (
              <div key={index} className="text-center">
                <span className="text-xs text-gray-500">{data.day}</span>
                <div className="text-xs font-medium">{data.hours > 0 ? `${data.hours}h` : "-"}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default WorkTracker;
