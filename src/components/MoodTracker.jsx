import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const moodMapping = {
  angry:   { value: 1, emoji: '😠' },
  sad:     { value: 2, emoji: '😔' },
  anxious: { value: 3, emoji: '😰' },
  neutral: { value: 4, emoji: '😐' },
  happy:   { value: 5, emoji: '😁' },
};

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getMoodValue(mood) {
  return moodMapping[mood]?.value ?? moodMapping.neutral.value;
}
function getMoodEmoji(mood) {
  return moodMapping[mood]?.emoji ?? moodMapping.neutral.emoji;
}

const MoodTracker = ({ data }) => {
  const [showInfo, setShowInfo] = useState(false);

  // Prepare a 7-day window ending today, normalized to midnight
  const moodData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);

    // Create a 7-day array with default neutral mood
    const weeklyData = Array(7).fill().map((_, idx) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + idx);
      const dayIdx = date.getDay();
      const dayName = daysOfWeek[dayIdx === 0 ? 6 : dayIdx - 1];
      return {
        day: dayName,
        mood: 'neutral',
        moodValue: moodMapping.neutral.value,
        emoji: moodMapping.neutral.emoji,
        date,
      };
    });

    // Map backend data to the correct day
    if (Array.isArray(data)) {
      data.forEach(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        for (let i = 0; i < weeklyData.length; i++) {
          if (weeklyData[i].date.getTime() === entryDate.getTime()) {
            weeklyData[i].mood = entry.mood;
            weeklyData[i].moodValue = getMoodValue(entry.mood);
            weeklyData[i].emoji = getMoodEmoji(entry.mood);
            weeklyData[i].notes = entry.notes;
            break;
          }
        }
      });
    }

    return weeklyData;
  }, [data]);

  // Tooltip insights
  const moodInsights = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        mostFrequentMood: 'Neutral',
        averageMoodValue: moodMapping.neutral.value.toFixed(1),
        isFluctuating: false,
      };
    }
    const moodCounts = data.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});
    const mostFrequentMood = Object.keys(moodCounts).reduce((a, b) =>
      moodCounts[a] > moodCounts[b] ? a : b,
      'neutral'
    );
    const averageMoodValue = data.reduce(
      (sum, entry) => sum + getMoodValue(entry.mood), 0
    ) / data.length;
    const values = data.map(entry => getMoodValue(entry.mood));
    const isFluctuating = values.length > 1 &&
      Math.max(...values) - Math.min(...values) >= 3;
    return {
      mostFrequentMood: mostFrequentMood.charAt(0).toUpperCase() + mostFrequentMood.slice(1),
      averageMoodValue: averageMoodValue.toFixed(1),
      isFluctuating,
    };
  }, [data]);

  // For the SVG chart: y = 100 - moodValue * 20 (since value 1-5)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  return (
    <motion.div 
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-lg p-6 h-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Mood Tracker</h2>
        <button 
          className="text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setShowInfo(!showInfo)}
        >
          <InformationCircleIcon className="w-5 h-5" />
        </button>
      </div>
      
      {showInfo && (
        <motion.div 
          className="absolute right-6 top-14 bg-white p-3 rounded-lg shadow-lg z-10 text-sm max-w-xs border border-gray-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <p>
            Your most frequent mood this week was <b>{moodInsights.mostFrequentMood}</b> with an average mood score of <b>{moodInsights.averageMoodValue}</b>.<br />
            {moodInsights.isFluctuating
              ? 'Your mood has been fluctuating; consider mindfulness practices.'
              : 'Your mood has been stable this week!'}
          </p>
        </motion.div>
      )}
      
      {(!Array.isArray(data) || data.length === 0) ? (
        <p className="text-gray-600 text-center">No mood data for this week.</p>
      ) : (
        <>
          <div className="relative h-40">
            <div className="absolute inset-0 bg-navy-800 rounded-xl overflow-hidden">
              <div className="p-3 pt-6 h-full">
                <motion.svg 
                  viewBox="0 0 300 100" 
                  className="w-full h-full" 
                  preserveAspectRatio="none"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Y-axis lines */}
                  {[20, 40, 60, 80].map(y => (
                    <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#3b4861" strokeWidth="0.5" />
                  ))}
                  {/* Mood line chart */}
                  <motion.path
                    d={moodData
                      .map((d, idx) => {
                        const x = (300 / 7) * (idx + 0.5);
                        const y = 100 - d.moodValue * 20;
                        return `${idx === 0 ? 'M' : 'L'} ${x},${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="url(#moodGradient)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                  {/* Emoji points */}
                  {moodData.map((d, idx) => (
                    <motion.g
                      key={idx}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1 + idx * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <foreignObject
                        x={(300 / 7) * (idx + 0.5) - 10}
                        y={100 - d.moodValue * 20 - 10}
                        width="20"
                        height="20"
                      >
                        <div className="w-full h-full flex items-center justify-center text-lg">
                          {d.emoji}
                        </div>
                      </foreignObject>
                    </motion.g>
                  ))}
                </motion.svg>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {moodData.map((d, idx) => (
              <div key={idx} className="text-center">
                <span className="text-xs text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default MoodTracker;
