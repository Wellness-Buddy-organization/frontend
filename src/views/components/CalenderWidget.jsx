import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * Calendar widget component for displaying upcoming events and activities
 * 
 * @returns {JSX.Element} CalendarWidget component
 */
const CalendarWidget = () => {
  const [currentWeek, setCurrentWeek] = useState({
    start: 24,
    end: 28,
    month: 'July',
    year: 2025
  });
  
  const [selectedDay, setSelectedDay] = useState(26);
  
  // Days of the current week
  const days = [
    { day: 'Wed', date: 24 },
    { day: 'Thu', date: 25 },
    { day: 'Fri', date: 26 },
    { day: 'Sat', date: 27 },
    { day: 'Sun', date: 28 }
  ];

  /**
   * Handle navigation to previous week
   */
  const handlePrevWeek = () => {
    setCurrentWeek(prev => ({
      ...prev,
      start: prev.start - 7,
      end: prev.end - 7
    }));
  };

  /**
   * Handle navigation to next week
   */
  const handleNextWeek = () => {
    setCurrentWeek(prev => ({
      ...prev,
      start: prev.start + 7,
      end: prev.end + 7
    }));
  };

  return (
    <motion.div 
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-lg p-6 h-full"
      whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Calendar</h2>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-600">Working activity</h3>
        
        <div className="flex items-center space-x-2 text-sm">
          <button 
            onClick={handlePrevWeek}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Previous week"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <span className="text-gray-600">
            {currentWeek.month} {currentWeek.start} - {currentWeek.end}
          </span>
          
          <button 
            onClick={handleNextWeek}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Next week"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Days of week navigation */}
      <div className="grid grid-cols-5 gap-2">
        {days.map((day) => (
          <motion.button
            key={day.date}
            className={`relative py-4 rounded-full flex flex-col items-center justify-center ${
              selectedDay === day.date 
                ? 'bg-fuchsia-100 text-fuchsia-700' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedDay(day.date)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xs font-medium mb-1">{day.day}</span>
            <span className="text-lg font-semibold">{day.date}</span>
            {selectedDay === day.date && (
              <motion.div
                className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-fuchsia-500"
                layoutId="dayIndicator"
              />
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Events list */}
      <div className="mt-6 space-y-3">
        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
          <div className="flex items-center">
            <div className="w-2 h-8 bg-emerald-400 rounded-full mr-3"></div>
            <div>
              <h4 className="font-medium">Team meeting</h4>
              <p className="text-sm text-gray-500">10:30 AM - 11:30 AM</p>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <div className="w-2 h-8 bg-blue-400 rounded-full mr-3"></div>
            <div>
              <h4 className="font-medium">Workout session</h4>
              <p className="text-sm text-gray-500">5:30 PM - 6:30 PM</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarWidget;