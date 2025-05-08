import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const HydrationTracker = ({ data }) => {
  const [showInfo, setShowInfo] = useState(false);

  // Define the days of the week (Mon-Sun)
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Conversion factor: 1 glass = 0.25 liters
  const GLASS_TO_LITERS = 0.25;

  // Process the backend data into a 7-day array
  const hydrationData = useMemo(() => {
    // Get the current date
    const today = new Date();

    // Calculate the start date (7 days ago)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6); // Get 6 days before today to make a 7-day window
    startDate.setHours(0, 0, 0, 0);

    // Initialize the 7-day array with dates and 0 amount
    const weeklyData = Array(7)
      .fill(null)
      .map((_, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);

        // Get the day name (Mon, Tue, etc.)
        const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const dayName = daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1]; // Adjust for our Mon-Sun array

        return {
          day: dayName,
          amount: 0,
          date: date,
          formattedDate: date.toISOString().split("T")[0], // For debugging
        };
      });

    // Map backend data to the correct day, converting glasses to liters
    if (data && data.length > 0) {
      data.forEach((entry) => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0); // Normalize time part

        // Find matching day in our weekly data
        for (let i = 0; i < weeklyData.length; i++) {
          const dayData = weeklyData[i];
          if (dayData.date.getTime() === entryDate.getTime()) {
            weeklyData[i].amount = entry.glasses * GLASS_TO_LITERS;
            weeklyData[i].entryId = entry._id; // Store ID for reference
            break;
          }
        }
      });
    }

    return weeklyData;
  }, [data]);

  // Calculate the average daily water intake for the tooltip
  const averageIntake = useMemo(() => {
    const totalLiters = hydrationData.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );
    const daysWithIntake =
      hydrationData.filter((entry) => entry.amount > 0).length || 1; // Avoid division by 0
    return (totalLiters / daysWithIntake).toFixed(1);
  }, [hydrationData]);

  const maxAmount = 3.5; // For scaling the chart

  return (
    <motion.div
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-lg p-6 h-64 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Hydration</h2>
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
              Average daily water intake: {averageIntake}L.{" "}
              {averageIntake >= 2.5
                ? "Great job staying hydrated!"
                : "Try to reach 2.5L daily for optimal hydration."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!data || data.length === 0 ? (
        <p className="text-gray-600 text-center">
          No hydration data for this week.
        </p>
      ) : (
        <>
          <div className="relative h-32">
            <div className="absolute inset-0 bg-navy-800 rounded-xl overflow-hidden">
              <div className="p-3 pt-6 h-full">
                <svg
                  viewBox="0 0 300 100"
                  className="w-full h-full"
                  preserveAspectRatio="none"
                >
                  {/* Y-axis lines */}
                  <line
                    x1="0"
                    y1="20"
                    x2="300"
                    y2="20"
                    stroke="#3b4861"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="0"
                    y1="40"
                    x2="300"
                    y2="40"
                    stroke="#3b4861"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="0"
                    y1="60"
                    x2="300"
                    y2="60"
                    stroke="#3b4861"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="0"
                    y1="80"
                    x2="300"
                    y2="80"
                    stroke="#3b4861"
                    strokeWidth="0.5"
                  />

                  {/* Hydration area chart */}
                  <motion.path
                    d={
                      hydrationData
                        .map((data, index) => {
                          const x = (300 / 7) * (index + 0.5);
                          const y = 100 - (data.amount / maxAmount) * 100;
                          return `${index === 0 ? "M" : "L"} ${x},${y}`;
                        })
                        .join(" ") +
                      ` L ${(300 / 7) * 6.5},100 L ${(300 / 7) * 0.5},100 Z`
                    }
                    fill="url(#hydrationGradient)"
                    fillOpacity="0.3"
                    stroke="url(#hydrationStroke)"
                    strokeWidth="2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  />

                  {/* Hydration line */}
                  <motion.path
                    d={hydrationData
                      .map((data, index) => {
                        const x = (300 / 7) * (index + 0.5);
                        const y = 100 - (data.amount / maxAmount) * 100;
                        return `${index === 0 ? "M" : "L"} ${x},${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="url(#hydrationStroke)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />

                  {/* Data points with drop effect */}
                  {hydrationData.map((data, index) => (
                    <motion.circle
                      key={index}
                      cx={(300 / 7) * (index + 0.5)}
                      cy={100 - (data.amount / maxAmount) * 100}
                      r="4"
                      fill="#06b6d4"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    />
                  ))}

                  <defs>
                    <linearGradient
                      id="hydrationGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                      <stop
                        offset="100%"
                        stopColor="#06b6d4"
                        stopOpacity="0.1"
                      />
                    </linearGradient>
                    <linearGradient
                      id="hydrationStroke"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2">
            {hydrationData.map((data, index) => (
              <div key={index} className="text-center">
                <span className="text-xs text-gray-500">{data.day}</span>
                <div className="text-xs font-medium">
                  {data.amount > 0 ? `${data.amount}L` : "-"}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default HydrationTracker;
