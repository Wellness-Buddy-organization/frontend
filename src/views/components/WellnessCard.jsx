import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

/**
 * Reusable card component for displaying wellness metrics
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {ReactNode} props.children - Card content
 * @param {string} props.tooltip - Optional tooltip text
 * @param {string} props.className - Additional CSS classes
 */
const WellnessCard = ({ title, children, tooltip, className = '' }) => {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <motion.div 
      className={`bg-white bg-opacity-80 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-lg p-6 h-full relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {tooltip && (
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowInfo(!showInfo)}
            aria-label="Show information"
          >
            <InformationCircleIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {showInfo && tooltip && (
          <motion.div 
            className="absolute right-6 top-14 bg-white p-3 rounded-lg shadow-lg z-10 text-sm max-w-xs border border-gray-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <p>{tooltip}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {children}
    </motion.div>
  );
};

export default WellnessCard;